export function oppdaterFarger(nr:number) {
  const hue = (nr * 137.508) % 360;
  const farge = `hsl(${hue}, 70%, 60%)`;
  document.documentElement.style.setProperty('--blokkFarge', farge);
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