import { startNedtelling, stoppNedtelling } from "./nedtelling.js";
import { lagreSide, nesteSide } from "./logikk.js";
import { status } from "./hoved.js";
export function gjetteOppsett() {
    document.getElementById('ferdigGjettaKnapp')?.addEventListener('click', () => lagreGjettaOrd());
}
//_________Start gjetting
export function startGjetting() {
    startNedtelling('gjetting');
}
export async function lagreGjettaOrd() {
    const gjettaOrdInput = document.getElementById('gjettaOrdFelt');
    const gjettaOrd = gjettaOrdInput.value.trim();
    stoppNedtelling();
    await lagreSide(gjettaOrd, null);
    gjettaOrdInput.value = '';
    document.getElementById('gjetteForfattar').innerText = '';
    status('ventFane');
    nesteSide();
}
