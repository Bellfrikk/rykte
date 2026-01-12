import { stengGrupperOppdateringKanal } from './gruppe.js';
import { velgOrdOgNavn } from './velgOrdOgNavn.js';
import { velgGruppeOppsett } from './gruppe.js';
import { lagGruppeOppsett } from './lagGruppe.js';
import { startFaneOppsett } from './startFane.js';
import { tegneOppsett, startTegning } from './tegning.js';
import { startGjetting, gjetteOppsett } from './gjettOrd.js';
import { logikk } from './logikk.js';
import { startVis } from './vis.js';

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
export function blokkNrSetter(nyNr:number){ blokkNr = nyNr; console.log('min blokkNr er satt til '+ blokkNr); }

status('velgGruppe');

export function status(nyStatus:'velgGruppe' | 'velgOrd'| 'lagGruppe'|'venteTilStart'|'tegneFane'|'gjetteFane'|'ventFane'|'visFane'|'ferdig'){
   
  if(nyStatus === 'velgGruppe'){
    document.getElementById('gruppeFane')!.classList.remove('usynlig');
    velgGruppeOppsett();

   }else if(nyStatus === 'lagGruppe'){
    lagGruppeOppsett();
    document.getElementById('gruppeFane')!.classList.add('usynlig');
    document.getElementById('nyGruppeFane')!.classList.remove('usynlig');
 
  }else if(nyStatus === 'velgOrd'){
    velgOrdOgNavn();
    document.getElementById('nyGruppeFane')!.classList.add('usynlig');
    document.getElementById('gruppeFane')!.classList.add('usynlig');
    document.getElementById('velgOrdFane')!.classList.remove('usynlig');
    stengGrupperOppdateringKanal();//hh

  }else if(nyStatus === 'venteTilStart'){
    startFaneOppsett();
    logikk()
    tegneOppsett();
    gjetteOppsett();
    document.getElementById('velgOrdFane')!.classList.add('usynlig');
    document.getElementById('startFane')!.classList.remove('usynlig');
  
  }else if(nyStatus === 'tegneFane'){
    document.getElementById('startFane')!.classList.add('usynlig');
    document.getElementById('ventFane')!.classList.add('usynlig');
    document.getElementById('tegneFane')!.classList.remove('usynlig');
    startTegning();

  }else if(nyStatus === 'gjetteFane'){
    document.getElementById('ventFane')!.classList.add('usynlig');
    document.getElementById('gjetteFane')!.classList.remove('usynlig');
    startGjetting();

  }else if(nyStatus === 'ventFane'){
    document.getElementById('tegneFane')!.classList.add('usynlig');
    document.getElementById('gjetteFane')!.classList.add('usynlig');
    document.getElementById('ventFane')!.classList.remove('usynlig');

  }else if(nyStatus === 'visFane'){
    document.getElementById('gjetteFane')!.classList.add('usynlig');
    document.getElementById('ventFane')!.classList.add('usynlig');
    document.getElementById('visFane')!.classList.remove('usynlig');
    startVis();
  }else if(nyStatus === 'ferdig'){
    document.getElementById('visFane')!.classList.add('usynlig');
    document.getElementById('ferdigFane')!.classList.remove('usynlig');
  }
}
