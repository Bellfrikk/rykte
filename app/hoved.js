import { stengGrupperOppdateringKanal } from './gruppe.js';
import { velgOrdOgNavn } from './velgOrdOgNavn.js';
import { velgGruppeOppsett } from './gruppe.js';
import { lagGruppeOppsett } from './lagGruppe.js';
import { venteFaneOppsett } from './venteFane.js';
import { tegneOppsett, startTegning } from './tegning.js';
import { gjetteOppsett } from './gjettOrd.js';
import { logikk } from './logikk.js';
/*
lage gruppe
  lagre nye data*

velge gruppe*
  hent gruppenr og spelar nr, tid, sider*
  lagre nytt spelarnr*
  velge ord*
  lagre ord og navn på side 1*
  gå til venteside*

venteside
  vent på ny gruppestatus*
   start hent teining og ord kanal*
  spelar 1 starter gruppa*

teineside*
  start nedtelling*
  lagre tegning*
  gå til ord*

ord side
  start nedtelling
  lagre ord
  sjekk om rundar er ferdig
    gå til teining eller vis

visSide
  vis venteside
  spelar 1 kan starte
  vent på gruppe kanal status
    aktiver rett knapp
    endre status på tegning eller ord
    sjekk om ferdig og endre gruppestatus

*/
export let miGruppeId;
export function gruppeIdSetter(nyId) { miGruppeId = nyId; console.log('min gruppeId er satt til ' + miGruppeId); }
export let minSpelarId = 1;
export function spelarIdSetter(nyId) { minSpelarId = nyId; console.log('min spelarId er satt til ' + minSpelarId); }
export let navn;
export function navnSetter(nyttNavn) { navn = nyttNavn; console.log('min navn er satt til ' + navn); }
export let naboSpelar;
export function naboSpelarSetter(nyId) { naboSpelar = nyId; console.log('min naboSpelar er satt til ' + naboSpelar); }
export let tegneTid;
export function tegneTidSetter(nyTid) { tegneTid = nyTid; console.log('min tegneTid er satt til ' + tegneTid); }
export let gjetteTid;
export function gjetteTidSetter(nyTid) { gjetteTid = nyTid; console.log('min gjetteTid er satt til ' + gjetteTid); }
export let antalSider;
export function antalSiderSetter(nyNr) { antalSider = nyNr; console.log('min antalSider er satt til ' + antalSider); }
export let blokkNr;
export function blokkNrSetter(nyNr) { blokkNr = nyNr; console.log('min blokkNr er satt til ' + blokkNr); }
export let side = 0;
export function sideSetter(nyNr) { side = nyNr; console.log('min side er satt til ' + side); }
status('velgGruppe');
export function status(nyStatus) {
    if (nyStatus === 'velgGruppe') {
        document.getElementById('gruppeFane').classList.remove('usynlig');
        velgGruppeOppsett();
    }
    else if (nyStatus === 'lagGruppe') {
        lagGruppeOppsett();
        document.getElementById('gruppeFane').classList.add('usynlig');
        document.getElementById('nyGruppeFane').classList.remove('usynlig');
    }
    else if (nyStatus === 'velgOrd') {
        velgOrdOgNavn();
        document.getElementById('nyGruppeFane').classList.add('usynlig');
        document.getElementById('gruppeFane').classList.add('usynlig');
        document.getElementById('velgOrdFane').classList.remove('usynlig');
        stengGrupperOppdateringKanal(); //hh
    }
    else if (nyStatus === 'venteTilStart') {
        venteFaneOppsett();
        logikk();
        tegneOppsett();
        gjetteOppsett();
        document.getElementById('velgOrdFane').classList.add('usynlig');
        document.getElementById('venteFane').classList.remove('usynlig');
    }
    else if (nyStatus === 'tegneFane') {
        document.getElementById('venteFane').classList.add('usynlig');
        document.getElementById('gjetteFane').classList.add('usynlig');
        document.getElementById('tegneFane').classList.remove('usynlig');
        startTegning();
    }
    else if (nyStatus === 'gjetteFane') {
        document.getElementById('tegneFane').classList.add('usynlig');
        document.getElementById('gjetteFane').classList.remove('usynlig');
    }
    else if (nyStatus === 'visFane') {
        document.getElementById('gjetteFane').classList.add('usynlig');
        document.getElementById('visFane').classList.remove('usynlig');
        //startVis();
    }
}
