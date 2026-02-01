import { stengGrupperOppdateringKanal } from './gruppe.js';
import { velgOrdOgNavn } from './velgOrdOgNavn.js';
import { velgGruppeOppsett } from './gruppe.js';
import { lagGruppeOppsett } from './lagGruppe.js';
import { startFaneOppsett } from './startFane.js';
import { tegneOppsett, startTegning } from './tegning.js';
import { startGjetting, gjetteOppsett } from './gjettOrd.js';
import { logikk, vent } from './logikk.js';
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
export async function status(nyStatus) {
    if (nyStatus === 'velgGruppe') {
        visDenneFana('gruppeFane');
        velgGruppeOppsett();
    }
    else if (nyStatus === 'lagGruppe') {
        visDenneFana('nyGruppeFane');
        lagGruppeOppsett();
    }
    else if (nyStatus === 'velgOrd') {
        visDenneFana('velgOrdFane');
        velgOrdOgNavn();
        stengGrupperOppdateringKanal();
    }
    else if (nyStatus === 'venteTilStart') {
        visDenneFana('startFane');
        startFaneOppsett();
        logikk();
        tegneOppsett();
        gjetteOppsett();
    }
    else if (nyStatus === 'tegneFane') {
        visDenneFana('tegneFane');
        startTegning();
    }
    else if (nyStatus === 'gjetteFane') {
        visDenneFana('gjetteFane');
        startGjetting();
    }
    else if (nyStatus === 'ventFane') {
        visDenneFana('ventFane');
    }
    else if (nyStatus === 'visFane') {
        visDenneFana('visFane');
        startVis();
    }
    else if (nyStatus === 'ferdig') {
        visDenneFana('ferdigFane');
        await vent(3000);
        status('velgGruppe');
    }
}
function visDenneFana(nyFane) {
    document.querySelectorAll('.fane').forEach(el => el.classList.add('usynlig'));
    document.getElementById(nyFane).classList.remove('usynlig');
}
