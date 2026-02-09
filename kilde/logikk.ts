import { supabase } from "./supabaseData.js";
import { hentGruppeInfo, miGruppeId, minSpelarId, navn, naboSpelar, blokkNr, status, antalSider, blokkNrSetter, naboSpelarSetter } from "./hoved.js";
import { stengspelarOppdateringKanal } from "./startFane.js";
import { visOppsett, aktiverVisKnapp,endreVisSpelar } from "./vis.js";
import { oppdaterFarger } from "./styling.js";

let side:number = 2;
let ventePaNabo:boolean = false;
export function ventePaNaboSetter() { ventePaNabo = true; console.log('ventePaNabo er satt til true'); }

export function sideSetter(nr:number){ side = nr; console.log('side er satt til '+ side); }

export async function logikk() {
  hentGruppeInfo();
  ventePaNabo = false;
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
        }else if(data.new.status === 'ferdig'){
          status('ferdig');

        }else {
          if(Number(data.new.status) === 1) {
            visOppsett();
          }
          status('visFane');
          console.log('visningsmodus: ' + data.new.status);
          oppdaterFarger(Number(data.new.status));
          aktiverVisKnapp(Number(data.new.status));
        }
      }
    )
  .subscribe();

  document.getElementById('hoppOverNaboKnapp')!.addEventListener('click', async ()=>{ byttNabo() }, true );
}



let venteNaboTid = 0;
export async function nesteSide() {
  console.log('nesteSide funksjon kalla, side er: ' + side + ' av ' + antalSider);
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
      venteNaboTid++;
      if( venteNaboTid >= 20 ) {
        document.getElementById('hoppOverNaboKnapp')!.classList.remove('usynlig');
      }
      nesteSide();
    }
  }
}
//funksjon som venter tid mlliseksund før den gir eit svar som kan awaites på
export function vent(tid: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, tid));
}

//hent det som nabo har lagra
async function hentNesteTegningEllerOrd() {
  const { data, error } = await supabase
    .from('rundeTabell')
    .select('gjettaOrd,tegning,blokk,spelarNavn')
    .eq('gruppeId', miGruppeId)
    .eq('spelarNr', naboSpelar)
    .eq('side', side)
    .maybeSingle();
    console.log('hentNesteTegningEllerOrd data:', data, ' error:', error);
  if( error ) console.error('Feil ved henting av ord eller tegning:', error);
  else if( data ) {
    if(data.gjettaOrd !== null){
      aktiverTegning(data.gjettaOrd, data.blokk, data.spelarNavn);
    }else if(data.tegning !== null){
      aktiverGjetting(data.tegning, data.blokk, data.spelarNavn);
    }
    return true;
  }else{
    return false; 
  }
}

function aktiverTegning(ord:string, blokk:number, spelarNavn:string) {
  document.getElementById('tegneOrd')!.innerText = ord;
  document.getElementById('tegneForfattar')!.innerText = spelarNavn;
  blokkNrSetter(blokk);
  status('tegneFane');
}

function aktiverGjetting(teikningUrl:string, blokk:number, spelarNavn:string) {
  (document.getElementById('gjetteBilde') as HTMLImageElement).src = teikningUrl;
  document.getElementById('gjetteForfattar')!.innerText = spelarNavn;
  blokkNrSetter(blokk);
  console.log('Hentet tegning: ');
  status('gjetteFane');
}

//----- Lagre sider
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
//håndtering av folk som dett ut av spelet
  async function byttNabo() {
        console.log('hopp over nabo knapp trykka');
    if(naboSpelar !== 1){
      naboSpelarSetter( naboSpelar - 1 );
    }else{
      const { data, error } = await supabase
          .from('gruppeTabell')
          .select('nesteSpelarNr')
          .eq('gruppeId', miGruppeId)
          .single();
      if( error ) console.log('Feil ved henting av ny naboSpelarNr:', error);
      else if( data ) {
        console.log('Ny naboSpelarNr hentet:', data.nesteSpelarNr);
        naboSpelarSetter( data.nesteSpelarNr );
      }
    }
    document.getElementById('hoppOverNaboKnapp')!.classList.add('usynlig');
    nesteSide();
  }



//------- overgang til VIS


async function endreStatusTilVis() {
    console.log('gå til visnings modus');
    //endre side på min første runde frå 0 til 1 for å indikere at eg er ferdig
    const { error: errorOppdater } = await supabase
      .from('rundeTabell')
      .update({side: 1})
      .eq('gruppeId', miGruppeId)
      .eq('spelarNr', minSpelarId)
      .eq('side', 0);
    if( errorOppdater ) console.error('Feil ved oppdatering av min status til ferdig:', errorOppdater);
  console.log('edra side 0 til 1, spelar::' + minSpelarId);

    //hent alle spelarar som ennå har side /uferdige 
    const { data, error } = await supabase
      .from('rundeTabell')
      .select('spelarNavn')
      .eq('gruppeId', miGruppeId)
      .eq('side', 0);
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



