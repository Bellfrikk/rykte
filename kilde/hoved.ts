import { stengGrupperOppdateringKanal } from './gruppe.js';
import { velgOrdOgNavn } from './velgOrdOgNavn.js';
import { velgGruppeOppsett } from './gruppe.js';
import { lagGruppeOppsett } from './lagGruppe.js';
import { startFaneOppsett } from './startFane.js';
import { tegneOppsett, startTegning } from './tegning.js';
import { startGjetting, gjetteOppsett } from './gjettOrd.js';
import { logikk, nesteSide, sideSetter, vent } from './logikk.js';
import { startVis } from './vis.js';
import { oppdaterFarger } from './styling.js';
import { stylingOppsett } from './styling.js';
import { supabase } from './supabaseData.js';

export let miGruppeId:number;
export function gruppeIdSetter(nyId:number){ miGruppeId = nyId; console.log('min gruppeId er satt til '+ miGruppeId);   }
export let minSpelarId:number = 1;
export function spelarIdSetter(nyId:number){ minSpelarId = nyId; console.log('min spelarId er satt til '+ minSpelarId); }
export let navn:string;
export function navnSetter(nyttNavn:string){ navn = nyttNavn; console.log('min navn er satt til '+ navn); }
export let naboSpelar:number;
export function naboSpelarSetter(nyId:number){ naboSpelar = nyId; console.log('min naboSpelar er satt til '+ naboSpelar); }
export let tegneTid:number|null;
export function tegneTidSetter(nyTid:number|null){ tegneTid = nyTid; console.log('min tegneTid er satt til '+ tegneTid); }
export let gjetteTid:number|null;
export function gjetteTidSetter(nyTid:number|null){ gjetteTid = nyTid;console.log('min gjetteTid er satt til '+ gjetteTid);  }
export let antalSider:number;
export function antalSiderSetter(nyNr:number){ antalSider = nyNr; console.log('min antalSider er satt til '+ antalSider); }
export let blokkNr:number;
export function blokkNrSetter(nyNr:number){ blokkNr = nyNr; oppdaterFarger(blokkNr); console.log('min blokkNr er satt til '+ blokkNr); }
let gruppeStatus:string = ''; 

stylingOppsett();
sjekkOmMidtIspel();

async function sjekkOmMidtIspel(){
  //sjekk om du er midt i eit spel
  const lagra = localStorage.getItem('ryktegår');
  console.log('lagradata: '+ lagra)

  if (lagra) {
    //lagre data som var lagra
    const data = JSON.parse(lagra);
      console.log(data)

    navnSetter(data.navn);
    gruppeIdSetter(data.miGruppeId);
    spelarIdSetter(data.minSpelarId);
    naboSpelarSetter(data.naboSpelar);
    await hentGruppeInfo();//henter info om gruppa ikludert gruppestatus
    console.log('henta status er: '+ gruppeStatus);

    //gå tilbake til venterom om statusen er ny
    if(gruppeStatus === 'ny') {
      status('venteTilStart')

    // gå til tegne eller gjettefase om statusen er aktiv
    }else if(gruppeStatus === 'aktiv') {
    status('venteTilStart')// for å aktivere gruppestatus kanal osv

    const { data: runde } = await supabase
    .from('rundeTabell')
    .select('side')
    .eq('gruppeId', miGruppeId)
    .eq('blokk', minSpelarId)
    .order('side', { ascending: false })
    .limit(1)
    .maybeSingle();

    if(runde) {
      sideSetter(runde.side);
      nesteSide();
    }
    //gå tilferdigfane om du kom tilbake når gruppa er ferdig|
    }else if(gruppeStatus === 'ferdig') {
      status('ferdig');
    }else {
      status('visFane');
    }
    //om det ikkje er lagra data så start på nytt
  }else {
    status('velgGruppe');
  }
}

export async function status(nyStatus:'velgGruppe' | 'velgOrd'| 'lagGruppe'|'venteTilStart'|'tegneFane'|'gjetteFane'|'ventFane'|'visFane'|'ferdig'){
   
  if(nyStatus === 'velgGruppe'){
    visDenneFana('gruppeFane');
    velgGruppeOppsett();

   }else if(nyStatus === 'lagGruppe'){
    visDenneFana('nyGruppeFane');
    lagGruppeOppsett();
 
  }else if(nyStatus === 'velgOrd'){
    visDenneFana('velgOrdFane');
    velgOrdOgNavn();
    stengGrupperOppdateringKanal();

  }else if(nyStatus === 'venteTilStart'){
    visDenneFana('startFane');
    lagreSpelarData();
    startFaneOppsett();
    logikk()
    tegneOppsett();
    gjetteOppsett();
  
  }else if(nyStatus === 'tegneFane'){
    visDenneFana('tegneFane');
    startTegning();

  }else if(nyStatus === 'gjetteFane'){
    visDenneFana('gjetteFane');
    startGjetting();

  }else if(nyStatus === 'ventFane'){
    visDenneFana('ventFane');

  }else if(nyStatus === 'visFane'){
    visDenneFana('visFane');
    startVis();

  }else if(nyStatus === 'ferdig'){
    visDenneFana('ferdigFane');
    await vent(3000);
    status('velgGruppe');
  }
}

function visDenneFana( nyFane:string ) {
  document.querySelectorAll('.fane').forEach(el => el.classList.add('usynlig'));
  document.getElementById(nyFane)!.classList.remove('usynlig');
}

export async function hentGruppeInfo() {
    //hent gruppeinfo
  const { data, error } = await supabase
    .from('gruppeTabell')
    .select('tegneTid, gjetteTid, antalSider, status')
    .eq('gruppeId', miGruppeId)
    .single();
  
  if( error ) { 
    console.error('Feil ved henting av gruppeinfo ', error) 
  }else if( data ) {
    console.log('Gruppeinfo hentet for logikk: ', data);
    tegneTidSetter( data.tegneTid );
    gjetteTidSetter( data.gjetteTid );
    antalSiderSetter( data.antalSider );
    gruppeStatus = data.status;
    lagreSpelarData();
  }
}

function lagreSpelarData() {
  localStorage.setItem('ryktegår', JSON.stringify({
  miGruppeId: miGruppeId,
  minSpelarId: minSpelarId,
  naboSpelar: naboSpelar,
  navn: navn,
}));
console.log('lagra spelar data i localstorage');
}