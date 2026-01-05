import { stoppNedtelling } from "./nedtelling.js";
import { lagreSide, nesteSide } from "./logikk.js";
import { status } from "./hoved.js";

export function gjetteOppsett() {
  document.getElementById('ferdigGjettaKnapp')?.addEventListener('click',  () => lagreGjettaOrd());
}

export async function lagreGjettaOrd() {
  const gjettaOrdInput = document.getElementById('gjettaOrdFelt') as HTMLInputElement;
  const gjettaOrd:string = gjettaOrdInput.value.trim();
  stoppNedtelling();
  await lagreSide(gjettaOrd,null);
  gjettaOrdInput.value = '';
  status('ventFane');
  nesteSide();
}
