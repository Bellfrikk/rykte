import { supabase } from './supabaseData.js';
import { miGruppeId } from './hoved.js';
let spelarOppdateringKanal;
export async function venteFaneOppsett() {
    //hent alle spelarane i gruppa og vis på venteskjermen
    const { data, error } = await supabase
        .from('rundeTabell')
        .select('spelarNavn')
        .eq('gruppeId', miGruppeId);
    if (error) {
        console.log('feil ved henting av spelarar i ventefane: ');
        console.error(error);
    }
    else if (data) {
        console.log(data);
        data.forEach(denne => {
            visSpelar(denne.spelarNavn);
        });
    }
    spelarOppdateringKanal = supabase
        .channel('spelarOppdateringKanalen')
        .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'rundeTabell',
        filter: `gruppeId=eq.${miGruppeId}`,
    }, (payload) => {
        visSpelar(payload.new.spelarNavn);
        console.log('oppdatert spelarar i venterom');
    })
        .subscribe();
}
export function stengspelarOppdateringKanal() {
    supabase.removeChannel(spelarOppdateringKanal);
}
function visSpelar(spelarNavn) {
    let nyDiv = document.createElement('div');
    nyDiv.innerText = spelarNavn;
    document.getElementById('venteSpelarar')?.appendChild(nyDiv);
}
