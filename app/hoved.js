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
export function blokkNrSetter(nyNr) { blokkNr = nyNr; oppdaterFarger(blokkNr); console.log('min blokkNr er satt til ' + blokkNr); }
stylingOppsett();
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
        startFaneOppsett();
        logikk();
        tegneOppsett();
        gjetteOppsett();
        document.getElementById('velgOrdFane').classList.add('usynlig');
        document.getElementById('startFane').classList.remove('usynlig');
    }
    else if (nyStatus === 'tegneFane') {
        document.getElementById('startFane').classList.add('usynlig');
        document.getElementById('ventFane').classList.add('usynlig');
        document.getElementById('tegneFane').classList.remove('usynlig');
        startTegning();
    }
    else if (nyStatus === 'gjetteFane') {
        document.getElementById('ventFane').classList.add('usynlig');
        document.getElementById('gjetteFane').classList.remove('usynlig');
        startGjetting();
    }
    else if (nyStatus === 'ventFane') {
        document.getElementById('tegneFane').classList.add('usynlig');
        document.getElementById('gjetteFane').classList.add('usynlig');
        document.getElementById('ventFane').classList.remove('usynlig');
    }
    else if (nyStatus === 'visFane') {
        document.getElementById('gjetteFane').classList.add('usynlig');
        document.getElementById('ventFane').classList.add('usynlig');
        document.getElementById('visFane').classList.remove('usynlig');
        startVis();
    }
    else if (nyStatus === 'ferdig') {
        document.getElementById('visFane').classList.add('usynlig');
        document.getElementById('ferdigFane').classList.remove('usynlig');
    }
}
