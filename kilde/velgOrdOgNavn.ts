import { ord } from './ord.js';
import { status, navnSetter} from './hoved.js';
import { lagreSide, sideSetter } from './logikk.js';

export function velgOrdOgNavn() {
  document.getElementById('velgeOrd')!.innerHTML = '';//fjerne valg fra forrige runde
  const ordKopi = [...ord];
  for (let i = 0; i < 4; i++) {
    let nyKnapp = document.createElement('button');
    const index = Math.floor(Math.random() * ordKopi.length);
    const valgtOrd = ordKopi.splice(index, 1)[0];
    nyKnapp.innerText = valgtOrd;
    nyKnapp.classList.add('ordKnapp');
    nyKnapp.disabled = true;
    nyKnapp.addEventListener('click', (knapp) => {
      document.getElementById('tegneOrd')!.innerText = (knapp.target as HTMLButtonElement).innerText;
      lagreSide( valgtOrd,null,99 ); //lagre side 99 for å markere Uferdig
      status('venteTilStart');
    });
    document.getElementById('velgeOrd')?.appendChild(nyKnapp);
  }
  document.getElementById('spelarNavn')!.addEventListener('input', () => {
    navnSetter ( (document.getElementById('spelarNavn') as HTMLInputElement).value.trim() );
    document.querySelectorAll('.ordKnapp').forEach((knapp) => {
      (knapp as HTMLButtonElement).disabled = false;
    });
  });
}