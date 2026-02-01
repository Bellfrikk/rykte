import { supabase } from './supabaseData.js';
import { status, miGruppeId, minSpelarId } from "./hoved.js";
import { startFerdig } from './ferdig.js';
import { settTilAktivFarge } from './styling.js';
let visKanal;
let visSide = 0;
let visNesteSperra = false;
export function visOppsett() {
    document.getElementById('nesteVisKnapp')?.addEventListener('click', visNeste);
    //Start kanal for vising av tegning og gjetta ord
    visKanal = supabase.channel('visKanal')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rundeTabell', filter: `gruppeId=eq.${miGruppeId}` }, (data) => {
        if (data.new.vis === 'aktiv') {
            if (data.new.tegning !== null) {
                document.getElementById('visTegning').classList.remove('usynlig');
                document.getElementById('visKvenTegna').innerText = `${data.new.spelarNavn}`;
                document.getElementById('visTegning').src = data.new.tegning;
                settTilAktivFarge('tegning');
            }
            else if (data.new.gjettaOrd !== null) {
                document.getElementById('visKvenGjetta').innerText = `${data.new.spelarNavn}`;
                document.getElementById('visOrd').innerText = data.new.gjettaOrd;
                settTilAktivFarge('ord');
            }
        }
    })
        .subscribe();
}
export async function aktiverVisKnapp(aktivSpelar) {
    //aktiver neste bilde knapp visst det er di blokk som er aktiv
    if (aktivSpelar === minSpelarId) {
        document.getElementById('nesteVisKnapp')?.classList.remove('usynlig');
        //aktivere side 0 for visning
        const { error } = await supabase
            .from('rundeTabell')
            .update({ vis: 'aktiv' })
            .eq('gruppeId', miGruppeId)
            .eq('side', 0)
            .eq('blokk', minSpelarId);
        if (error)
            console.error('Feil ved lagring av vis runde 0, feil: ' + error);
    }
    else {
        document.getElementById('nesteVisKnapp')?.classList.add('usynlig');
    }
}
export function startVis() {
    document.getElementById('visTegning').classList.add('usynlig');
    document.getElementById('visOrd').innerText = '';
    document.getElementById('visKvenGjetta').innerText = '';
    document.getElementById('visKvenTegna').innerText = '';
}
async function visNeste() {
    if (visNesteSperra)
        return;
    visNesteSperra = true;
    //Hent id til den aktive runder
    const { data: aktivRunde } = await supabase
        .from('rundeTabell')
        .select('rundeId, side, blokk')
        .eq('gruppeId', miGruppeId)
        .eq('vis', 'aktiv')
        .maybeSingle();
    if (!aktivRunde) {
        visNesteSperra = false;
        console.log('Ingen aktiv runde');
        return;
    }
    //endre status til ferdig for den aktive runden
    await supabase
        .from('rundeTabell')
        .update({ vis: 'ferdig' })
        .eq('rundeId', aktivRunde.rundeId);
    //hent id til neste runde
    const { data: nesteRunde } = await supabase
        .from('rundeTabell')
        .select('rundeId')
        .eq('gruppeId', miGruppeId)
        .eq('side', aktivRunde.side + 1)
        .eq('blokk', aktivRunde.blokk)
        .maybeSingle();
    //om det ikkje finnst fleire runder, gå til neste spelar
    if (!nesteRunde) {
        console.log('Visning ferdig for denne blokka');
        endreVisSpelar(minSpelarId + 1);
        visNesteSperra = false;
        return;
    }
    //endre status til aktiv for neste runde
    const { error } = await supabase
        .from('rundeTabell')
        .update({ vis: 'aktiv' })
        .eq('rundeId', nesteRunde.rundeId);
    if (error) {
        console.error('Feil ved oppdatering av vis status til aktiv for neste runde:', error);
        return;
    }
    else {
        visNesteSperra = false;
    }
}
export async function endreVisSpelar(spelarNr) {
    //sjekk om det finnst fleire spelarar å vise
    const { data, error: feil } = await supabase
        .from('rundeTabell')
        .select('vis')
        .eq('gruppeId', miGruppeId)
        .eq('spelarNr', spelarNr)
        .eq('side', 0);
    if (feil) {
        console.error('Feil ved sjekk om neste spelar finnst:', feil);
    }
    else if (data.length === 0) {
        status('ferdig');
        startFerdig();
        console.log('Visning ferdig for alle spelarar');
        return;
    }
    //endre gruppe status til neste spelarNr
    const { error } = await supabase
        .from('gruppeTabell')
        .update({ status: spelarNr })
        .eq('gruppeId', miGruppeId);
    if (error)
        console.error('Feil ved oppdatering av gruppestatus', error);
    else {
        console.log('endra gruppestatus til' + spelarNr);
    }
}
