import { ord } from './ord.js';
import { status, navnSetter } from './hoved.js';
import { lagreSide } from './logikk.js';
export function velgOrdOgNavn() {
    for (let i = 0; i < 4; i++) {
        let nyKnapp = document.createElement('button');
        const valgtOrd = ord[Math.floor(Math.random() * ord.length)];
        nyKnapp.innerText = valgtOrd;
        nyKnapp.classList.add('ordKnapp');
        nyKnapp.disabled = true;
        nyKnapp.addEventListener('click', (knapp) => {
            document.getElementById('tegneOrd').innerText = knapp.target.innerText;
            lagreSide(valgtOrd, null, 99); //lagre side 99 for å markere Uferdig
            status('venteTilStart');
        });
        document.getElementById('velgeOrd')?.appendChild(nyKnapp);
    }
    document.getElementById('spelarNavn').addEventListener('input', () => {
        navnSetter(document.getElementById('spelarNavn').value.trim());
        document.querySelectorAll('.ordKnapp').forEach((knapp) => {
            knapp.disabled = false;
        });
    });
}
