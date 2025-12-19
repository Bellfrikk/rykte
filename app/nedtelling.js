import { tegneTid, gjetteTid } from "./hoved.js";
import { lagreTegning } from "./tegning.js";
import { lagreGjettaOrd } from "./gjettOrd.js";
let tid;
let nedtellingTimer;
export function startNedtelling(type) {
    let telleTekst;
    if (type === 'tegne') {
        if (tegneTid === null) {
            document.getElementById('nedtellingTegning')?.classList.add('usynlig');
            return;
        }
        else {
            document.getElementById('nedtellingTegning')?.classList.remove('usynlig');
            telleTekst = document.getElementById('nedtellingTegning');
            tid = tegneTid;
            nedtellingTimer = setInterval(() => {
                telleTekst.innerText = tid.toString();
                tid--;
                if (tid <= 0)
                    lagreTegning();
            }, 1000);
        }
    }
    else if (type === 'gjetting') {
        if (gjetteTid === null) {
            document.getElementById('nedtellingGjetting')?.classList.add('usynlig');
            return;
        }
        else {
            document.getElementById('nedtellingGjetting')?.classList.remove('usynlig');
            telleTekst = document.getElementById('nedtellingGjetting');
            tid = gjetteTid;
            nedtellingTimer = setInterval(() => {
                telleTekst.innerText = tid.toString();
                tid--;
                if (tid <= 0) {
                    lagreGjettaOrd();
                }
            }, 1000);
        }
    }
}
export function stoppNedtelling() {
    if (nedtellingTimer)
        clearInterval(nedtellingTimer);
}
