import { supabase } from './supabaseData.js';
import { miGruppeId } from './hoved.js';
let spelarOppdateringKanal;
export async function startFaneOppsett() {
    oppdaterSpelarar();
    spelarOppdateringKanal = supabase
        .channel('spelarOppdateringKanalen')
        .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'rundeTabell',
        filter: `gruppeId=eq.${miGruppeId}`,
    }, () => {
        oppdaterSpelarar();
    })
        .subscribe();
}
export function stengspelarOppdateringKanal() {
    supabase.removeChannel(spelarOppdateringKanal);
}
async function oppdaterSpelarar() {
    //hent alle spelarane i gruppa og vis på venteskjermen
    const { data, error } = await supabase
        .from('rundeTabell')
        .select('spelarNavn')
        .eq('gruppeId', miGruppeId);
    if (error) {
        console.log('feil ved henting av spelarar i startFane: ');
        console.error(error);
    }
    else if (data) {
        const venteSpelararDiv = document.getElementById('venteSpelarar');
        venteSpelararDiv.innerHTML = '';
        data.forEach(denne => {
            let nyDiv = document.createElement('div');
            nyDiv.innerText = denne.spelarNavn;
            venteSpelararDiv?.appendChild(nyDiv);
        });
    }
}
