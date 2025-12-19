import { status } from "./hoved.js";
import { startNedtelling, stoppNedtelling } from "./nedtelling.js";
import { lagreSide, nesteSide } from "./logikk.js";

export function gjetteOppsett() {
  document.getElementById('ferdigGjettaKnapp')?.addEventListener('click',  () => lagreGjettaOrd());
}

export async function lagreGjettaOrd() {
  const gjettaOrdInput = document.getElementById('gjettaOrdFelt') as HTMLInputElement;
  const gjettaOrd:string = gjettaOrdInput.value.trim();
  lagreSide(gjettaOrd,null);



  //stoppnedtellingTimer
  stoppNedtelling();
  gjettaOrdInput.value = '⏳';
  nesteSide();
}
