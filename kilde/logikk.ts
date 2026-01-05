import { supabase } from "./supabaseData.js";
import { gjetteTidSetter, miGruppeId, minSpelarId,navn, naboSpelar,blokkNr, status, tegneTidSetter, antalSiderSetter, blokkNrSetter } from "./hoved.js";
import { stengspelarOppdateringKanal } from "./startFane.js";
let side:number = 1;
let ventePaNabo:boolean = false;
export function sideSetter(nr:number){ side = nr; }

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
        }
      }
    )
  .subscribe();
}

export async function nesteSide() {
  console.log('neste side kalla, side er no: ' + side); 
  if(ventePaNabo){
    let erNaboKlar = await hentNesteTegningEllerOrd();
    if( erNaboKlar ) {
      console.log('har henta ny side frå nabo');
      side++;
      ventePaNabo = false;
      return;
    }else{
      console.log('nabo ikkje klar for ny side, ventar 1 sekund');
      await vent(1000);
      nesteSide();
    }
  }
}
//funksjon som venter tid seksund før den gir eit svar som kan awaites på
function vent(tid: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, tid));
}

//hent det som nabo har lagra
async function hentNesteTegningEllerOrd() {
  const { data, error } = await supabase
    .from('rundeTabell')
    .select('gjettaOrd,tegning,blokk,side,spelarNr')
    .eq('gruppeId', miGruppeId)
    .eq('spelarNr', naboSpelar)
    .eq('side', side)
    .maybeSingle();
    console.log('hentNesteTegningEllerOrd data:', data, ' error:', error);
  if( error ) console.error('Feil ved henting av ord eller tegning:', error);
  else if( data ) {
    if(data.gjettaOrd !== null){
      aktiverTegning(data.gjettaOrd, data.blokk);
    }else if(data.tegning !== null){
      aktiverGjetting(data.tegning, data.blokk);
    }
    return true;
  }else{
    return false; 
  }
}

function aktiverTegning(ord:string, blokk:number) {
  document.getElementById('tegneOrd')!.innerText = ord;
  blokkNrSetter(blokk);
  status('tegneFane');
}

async function aktiverGjetting(teikningUrl:string, blokk:number) {
  (document.getElementById('gjetteBilde') as HTMLImageElement).src = teikningUrl;
  blokkNrSetter(blokk);
  console.log('Hentet tegning: ');
  status('gjetteFane');
}


export async function lagreSide(ord:string|null, tegning:string|null, denneSide:number = side) {
  const { error } = await supabase
    .from('rundeTabell')
    .insert({'gruppeId':miGruppeId, 'gjettaOrd': ord, 'tegning':tegning, 'spelarNr': minSpelarId, 'spelarNavn': navn ,'side': denneSide, 'blokk': blokkNr})
  if(error) {
    console.error('feil ved lagre side, feil: ' + error);
    return false;
  }else{ 
    console.log('lagra side ' + denneSide);
    ventePaNabo = true;
    return true;
  }
}

