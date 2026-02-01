import { stengGrupperOppdateringKanal } from './gruppe.js';
import { velgOrdOgNavn } from './velgOrdOgNavn.js';
import { velgGruppeOppsett } from './gruppe.js';
import { lagGruppeOppsett } from './lagGruppe.js';
import { startFaneOppsett } from './startFane.js';
import { tegneOppsett, startTegning } from './tegning.js';
import { startGjetting, gjetteOppsett } from './gjettOrd.js';
import { logikk } from './logikk.js';
import { startVis } from './vis.js';
import { oppdaterFarger } from './styling.js';
import { stylingOppsett } from './styling.js';

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

stylingOppsett();
status('velgGruppe');

export function status(nyStatus:'velgGruppe' | 'velgOrd'| 'lagGruppe'|'venteTilStart'|'tegneFane'|'gjetteFane'|'ventFane'|'visFane'|'ferdig'){
   
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
  }
}

function visDenneFana( nyFane:string ) {
  document.querySelectorAll('.fane').forEach(el => el.classList.add('usynlig'));
  document.getElementById(nyFane)!.classList.remove('usynlig');
}
