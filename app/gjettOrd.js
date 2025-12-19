import { stoppNedtelling } from "./nedtelling.js";
import { lagreSide, nesteSide } from "./logikk.js";
export function gjetteOppsett() {
    document.getElementById('ferdigGjettaKnapp')?.addEventListener('click', () => lagreGjettaOrd());
}
export async function lagreGjettaOrd() {
    const gjettaOrdInput = document.getElementById('gjettaOrdFelt');
    const gjettaOrd = gjettaOrdInput.value.trim();
    lagreSide(gjettaOrd, null);
    //stoppnedtellingTimer
    stoppNedtelling();
    gjettaOrdInput.value = '⏳';
    nesteSide();
}
