import { supabase } from "./supabaseData.js";
import { lagreSide, nesteSide } from "./logikk.js";
import { startNedtelling, stoppNedtelling } from "./nedtelling.js";
import { status } from "./hoved.js";
const blyatntBredde = 4;
const viskBredde = 20;
const blyantFarge = "black";
const bakgrunnFarge = "#fffff3";
const lerret = document.getElementById("tegneflate");
const ctx = lerret.getContext("2d");
export async function tegneOppsett() {
    document.getElementById("ferdigTegneKnapp")?.addEventListener("click", () => lagreTegning());
    let tegner = false;
    ctx.lineWidth = blyatntBredde;
    ctx.lineCap = "round";
    ctx.strokeStyle = blyantFarge;
    lerret.addEventListener("mousedown", (e) => startStrek(e));
    lerret.addEventListener("touchstart", (e) => startStrek(e.touches[0]));
    function startStrek(e) {
        tegner = true;
        const rect = lerret.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    lerret.addEventListener("mousemove", (e) => fortsettTegning(e));
    lerret.addEventListener("touchmove", (e) => fortsettTegning(e.touches[0]));
    function fortsettTegning(e) {
        if (!tegner)
            return;
        const rect = lerret.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    lerret.addEventListener("mouseup", () => stoppTegning());
    lerret.addEventListener("mouseleave", () => stoppTegning());
    lerret.addEventListener("touchend", () => stoppTegning());
    lerret.addEventListener("touchcancel", () => stoppTegning());
    function stoppTegning() {
        tegner = false;
    }
    //____blyant visk knapp___
    let tegnemodus = "blyant";
    document.getElementById("blyantViskKnapp")?.addEventListener("click", () => {
        if (tegnemodus === "blyant") {
            tegnemodus = "visk";
            ctx.strokeStyle = bakgrunnFarge;
            ctx.lineWidth = viskBredde;
            document.getElementById("blyantViskKnapp").innerText = "🧹";
        }
        else {
            tegnemodus = "blyant";
            ctx.strokeStyle = blyantFarge;
            ctx.lineWidth = blyatntBredde;
            document.getElementById("blyantViskKnapp").innerText = "✏️";
        }
    });
}
export function nullstillLerret() {
    const lerret = document.getElementById("tegneflate");
    lerret.width = lerret.getBoundingClientRect().width;
    lerret.height = lerret.getBoundingClientRect().height;
    ctx.fillStyle = bakgrunnFarge;
    ctx.beginPath();
    ctx.fillRect(0, 0, lerret.width, lerret.height);
}
//_________Start tegning______________________________________
export function startTegning() {
    nullstillLerret();
    startNedtelling('tegne');
}
//___lagreTegning____________________________________________________________________________---
export async function lagreTegning() {
    stoppNedtelling();
    const lerret = document.getElementById("tegneflate");
    //Lagre bildet til Supabase Storage
    const blob = await new Promise((resolve) => lerret.toBlob(resolve, "image/png"));
    const filnavn = `${crypto.randomUUID()}.png`;
    const { error } = await supabase.storage
        .from("Bilder")
        .upload(filnavn, blob, { contentType: "image/png", upsert: false });
    if (error) {
        console.error("Feil ved opplasting:", error.message);
    }
    //hente adressen til bildet
    const { data: urlData } = await supabase.storage
        .from("Bilder")
        .getPublicUrl(filnavn);
    const tegningUrl = urlData.publicUrl; //Lagre url i spelarTabell
    await lagreSide(null, tegningUrl);
    nullstillLerret();
    document.getElementById('tegneForfattar').innerText = '';
    status('ventFane');
    nesteSide();
}
