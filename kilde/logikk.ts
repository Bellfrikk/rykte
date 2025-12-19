import { supabase } from "./supabaseData.js";
import { gjetteTidSetter, miGruppeId, minSpelarId,navn, naboSpelar,blokkNr, status, tegneTidSetter, antalSiderSetter, side, blokkNrSetter, sideSetter} from "./hoved.js";
import { stengspelarOppdateringKanal } from "./venteFane.js";

export async function logikk() {


  //hent gruppeinfo
  const { data, error } = await supabase
    .from('gruppeTabell')
    .select('tegneTid, gjetteTid, antalSider')
    .eq('gruppeId', miGruppeId)
    .single();
  
  if( error ) { 
    console.error('Feil ved henting av gruppeinfo ') 
    console.error(error); 
  }else if( data ) {
    console.log('Gruppeinfo hentet for logikk: ', data);
    tegneTidSetter( data.tegneTid );
    gjetteTidSetter( data.gjetteTid );
    antalSiderSetter( data.antalSider );
  }

  //start lytting på gruppestatus
  const gruppeStatusKanal = supabase.channel('gruppeStatus')
  .on('postgres_changes' ,
      { event: 'UPDATE', schema: 'public', table: 'gruppeTabell', filter: `gruppeId=eq.${miGruppeId}` },
      (data: any) => {
        if (data.new.status === 'aktiv') {
          stengspelarOppdateringKanal();
          status('tegneFane');
          console.log('Gruppa har starta');
          //følger med på om nabospelar har laga noko nytt, om du har komt til samme side som han så blir det lasta

          const  hentTegningEllerOrd = supabase.channel('hentTegningEllerOrd')
             .on('postgres_changes' ,
               { event: 'INSERT', schema: 'public', table: 'rundeTabell', filter: `gruppeId=eq.${miGruppeId},spelarNr=eq.${naboSpelar}` },
               (data: any) => {
                 console.log('-------------------ny side tilgjengelig' + data.new);
                 hentNesteTegningEllerOrd(data.new.side);
               }
             )
           .subscribe();
        }

      }
    )
    .subscribe();


}
//hent det som nabo har lagra
async function hentNesteTegningEllerOrd(nySide:number) {
  console.log('======================ny tegning eller ord');
  if(side === nySide) {
    if(side % 2 === 0){//gjette ord runde
        console.log('ny ord');
    
      const { data, error } = await supabase
      .from('rundeTabell')
      .select('gjettaOrd,blokk,side,spelarNr')
      .eq('gruppeId', miGruppeId)
      .eq('spelarNr', naboSpelar)
      .eq('side', side)
      .maybeSingle();
      if( error ) console.error('Feil ved henting av ord:', error);
      else if( data ) {
        if(data.gjettaOrd !== null){
          document.getElementById('tegneOrd')!.innerText = data.gjettaOrd;
          console.log('Hentet ord: ' + data.gjettaOrd);
          blokkNrSetter(data.blokk);
          status('tegneFane');
          sideSetter(side + 1);
        }
      }
    }else{//tegne runde
        console.log('ny tegning');
    const { data, error } = await supabase
      .from('rundeTabell')
      .select('tegning,blokk,side,spelarNr')
      .eq('gruppeId', miGruppeId)
      .eq('spelarNr', naboSpelar)
      .eq('side', side)
      .maybeSingle();
      if( error ) console.error('Feil ved henting av tegning:', error);
      else if( data ) {
        if(data.tegning !== null){
          (document.getElementById('gjetteBilde') as HTMLImageElement).src = data.tegning;
          blokkNrSetter(data.blokk);
          console.log('Hentet tegning: ');
          status('gjetteFane');
          sideSetter(side + 1);
        }
      }
    }
  }
}


export async function lagreSide(ord:string|null, tegning:string|null) {
  const { error } = await supabase
    .from('rundeTabell')
    .insert({'gruppeId':miGruppeId, 'gjettaOrd': ord, 'tegning':tegning, 'spelarNr': minSpelarId, 'spelarNavn': navn ,'side': side, 'blokk': blokkNr})
    if(error) console.error('feil ved lagre side, feil: ' + error);
    else console.log('lagra side ' + side);
}

export function nesteSide() {

  hentNesteTegningEllerOrd(side);
}