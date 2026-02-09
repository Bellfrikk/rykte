export function oppdaterFarger(nr:number) {
  const hue = (nr * 137.508) % 360;
  const farge = `hsl(${hue}, 70%, 60%)`;
  document.documentElement.style.setProperty('--blokkFarge', farge);
}
export function tilbakestillFarger() {
  document.documentElement.style.setProperty('--blokkFarge', 'var(--tingAktiv)');
}
const tegneTidSkyvebryter = document.getElementById('tegneTidSkyvebryter') as HTMLInputElement;

function oppdaterTegneTidSkyvebryterTekst() {
  const nr = Number(tegneTidSkyvebryter.value);
  const tekst = (nr === 120) ? 'Evig' : nr + 's';
  document.getElementById('tegneTidSkyvebryterTekst')!.textContent = tekst;
}

const gjetteTidSkyvebryter = document.getElementById('gjetteTidSkyvebryter') as HTMLInputElement;

function oppdaterGjetteTidSkyvebryterTekst() {
  const nr = Number(gjetteTidSkyvebryter.value);
  const tekst = (nr === 120) ? 'Evig' : nr + 's';
  document.getElementById('gjetteTidSkyvebryterTekst')!.textContent = tekst;
}

const antalRundarSkyvebryter = document.getElementById('antalRundarSkyvebryter') as HTMLInputElement;
function oppdaterAntalRundarSkyvebryterTekst() {
  let nr = antalRundarSkyvebryter.value;
  document.getElementById('antalRundarSkyvebryterTekst')!.textContent = nr;
}

export function stylingOppsett(){
  tegneTidSkyvebryter.addEventListener('input', oppdaterTegneTidSkyvebryterTekst);
  gjetteTidSkyvebryter.addEventListener('input', oppdaterGjetteTidSkyvebryterTekst);
  antalRundarSkyvebryter.addEventListener('input', oppdaterAntalRundarSkyvebryterTekst);
}
export function settTilAktivFarge(type:'ord'|'tegning'){
  if(type === 'ord'){
  (document.getElementById('ytterboksOrd') as HTMLElement).classList.add('aktiv');
  (document.getElementById('ytterboksTegning') as HTMLElement).classList.remove('aktiv');
  }else if(type === 'tegning'){
  (document.getElementById('ytterboksTegning') as HTMLElement).classList.add('aktiv');
  (document.getElementById('ytterboksOrd') as HTMLElement).classList.remove('aktiv');
  }
}