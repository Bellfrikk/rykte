import { supabase } from "./supabaseData.js";
import { gjetteTidSetter, miGruppeId, minSpelarId,navn, naboSpelar,blokkNr, status, tegneTidSetter, antalSider, antalSiderSetter, blokkNrSetter } from "./hoved.js";
import { stengspelarOppdateringKanal } from "./startFane.js";
import { aktiverVisKnapp } from "./vis.js";

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
        }else if(data.new.status === 'ny'){
        }else {
          status('visFane');
          console.log('visningsmodus: ' + data.new.status);
          aktiverVisKnapp(Number(data.new.status));
        }
      }
    )
  .subscribe();
}

export async function nesteSide() {
  if( side >= antalSider ) {
    endreStatusTilVis();
    return;
  }
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
    .insert({'gruppeId':miGruppeId, 'gjettaOrd': ord, 'tegning':tegning, 'spelarNr': minSpelarId, 'spelarNavn': navn ,'side': denneSide, 'blokk': blokkNr, 'vis':'ny'})
  if(error) {
    console.error('feil ved lagre side, feil: ' + error);
    return false;
  }else{ 
    console.log('lagra side ' + denneSide);
    ventePaNabo = true;
    return true;
  }
}

async function endreStatusTilVis() {
    console.log('gå til visnings modus');
    //endre side på min første runde frå 99 til 0 for å indikere at eg er ferdig
    const { error: errorOppdater } = await supabase
      .from('rundeTabell')
      .update({side: 0})
      .eq('gruppeId', miGruppeId)
      .eq('spelarNr', minSpelarId)
      .eq('side', 99);
    if( errorOppdater ) console.error('Feil ved oppdatering av min status til ferdig:', errorOppdater);
  console.log('edra side 9 til 0, spelar::' + minSpelarId);
    //hent alle spelarar som ennå har side 99/uferdige 
    const { data, error } = await supabase
      .from('rundeTabell')
      .select('spelarNavn')
      .eq('gruppeId', miGruppeId)
      .eq('side', 99);
    if( error ) console.error('Feil ved sjekk om alle er ferdig:', error);
    //endre gruppe status visst du er sist
    else if( data && data.length === 0 ) {
      console.log('Alle er ferdige');
      endreVisSpelar(1);
    }else{
      console.log('Følgande spelarar er ikkje ferdige ennå: ', data.map( (rad:any) => rad.spelarNavn ).join(', '));
    }
    status('visFane');
  }

  export async function endreVisSpelar(spelarNr:Number) {
    //sjekk om det finnst fleire spelarar å vise
    const {data, error:feil} = await supabase
      .from('rundeTabell')
      .select('vis')
      .eq('gruppeId', miGruppeId)
      .eq('spelarNr', spelarNr)
      .eq('side',0)

      if( feil ) {
      console.error('Feil ved sjekk om neste spelar finnst:', feil);
      alert('Spel er ferdig');
      return;
      
      }else if(data.length === 0){
        console.log('Ingen fleire spelarar å vise, spel er ferdig');
        alert('Spel er ferdig');
       return;
      }
    //endre gruppe status til neste spelarNr
    const { error } = await supabase
        .from('gruppeTabell')
        .update({status: spelarNr})
        .eq('gruppeId', miGruppeId);
      if( error ) console.error('Feil ved oppdatering av gruppestatus', error);
      else  console.log('endra gruppestatus til' + spelarNr);

  }