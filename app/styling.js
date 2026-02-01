export function oppdaterFarger(nr) {
    const hue = (nr * 137.508) % 360;
    const farge = `hsl(${hue}, 70%, 60%)`;
    document.documentElement.style.setProperty('--blokkFarge', farge);
}
const tegneTidSkyvebryter = document.getElementById('tegneTidSkyvebryter');
function oppdaterTegneTidSkyvebryterTekst() {
    const nr = Number(tegneTidSkyvebryter.value);
    const tekst = (nr === 120) ? 'Evig' : nr + 's';
    document.getElementById('tegneTidSkyvebryterTekst').textContent = tekst;
}
const gjetteTidSkyvebryter = document.getElementById('gjetteTidSkyvebryter');
function oppdaterGjetteTidSkyvebryterTekst() {
    const nr = Number(gjetteTidSkyvebryter.value);
    const tekst = (nr === 120) ? 'Evig' : nr + 's';
    document.getElementById('gjetteTidSkyvebryterTekst').textContent = tekst;
}
const antalRundarSkyvebryter = document.getElementById('antalRundarSkyvebryter');
function oppdaterAntalRundarSkyvebryterTekst() {
    let nr = antalRundarSkyvebryter.value;
    document.getElementById('antalRundarSkyvebryterTekst').textContent = nr;
}
export function stylingOppsett() {
    tegneTidSkyvebryter.addEventListener('input', oppdaterTegneTidSkyvebryterTekst);
    gjetteTidSkyvebryter.addEventListener('input', oppdaterGjetteTidSkyvebryterTekst);
    antalRundarSkyvebryter.addEventListener('input', oppdaterAntalRundarSkyvebryterTekst);
}
export function settTilAktivFarge(type) {
    if (type === 'ord') {
        document.getElementById('ytterboksOrd').classList.add('aktiv');
        document.getElementById('ytterboksTegning').classList.remove('aktiv');
    }
    else if (type === 'tegning') {
        document.getElementById('ytterboksTegning').classList.add('aktiv');
        document.getElementById('ytterboksOrd').classList.remove('aktiv');
    }
}
