import { supabase } from './supabaseData.js';
import { miGruppeId, minSpelarId } from "./hoved.js";
import { endreVisSpelar } from './logikk.js';
let visKanal;
let visSide = 0;
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
    document.getElementById('nesteVisKnapp')?.addEventListener('click', () => visNeste(), true);
    //Start kanal for vising av tegning og gjetta ord
    visKanal = supabase.channel('visKanal')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rundeTabell', filter: `gruppeId=eq.${miGruppeId}` }, (data) => {
        if (data.new.vis === 'aktiv') {
            if (data.new.tegning !== null)
                document.getElementById('visTegning').src = data.new.tegning;
            if (data.new.gjettaOrd !== null)
                document.getElementById('visOrd').innerText = data.new.gjettaOrd;
        }
    })
        .subscribe();
}
async function visNeste() {
    const { data: aktivRunde } = await supabase
        .from('rundeTabell')
        .select('rundeId, side, blokk')
        .eq('gruppeId', miGruppeId)
        .eq('vis', 'aktiv')
        .maybeSingle();
    if (!aktivRunde) {
        console.log('Ingen aktiv runde');
        return;
    }
    await supabase
        .from('rundeTabell')
        .update({ vis: 'ferdig' })
        .eq('rundeId', aktivRunde.rundeId);
    const { data: nesteRunde } = await supabase
        .from('rundeTabell')
        .select('rundeId')
        .eq('gruppeId', miGruppeId)
        .eq('side', aktivRunde.side + 1)
        .eq('blokk', aktivRunde.blokk)
        .maybeSingle();
    if (!nesteRunde) {
        console.log('Visning ferdig for denne blokka');
        endreVisSpelar(minSpelarId + 1);
        return;
    }
    await supabase
        .from('rundeTabell')
        .update({ vis: 'aktiv' })
        .eq('rundeId', nesteRunde.rundeId);
}
/*
async function visNeste () {
  // Finn aktiv runde
  const { data: aktivRunde, error:error1 } = await supabase
    .from('rundeTabell')
    .select('rundeId, side')
    .eq('gruppeId', miGruppeId)
    .eq('vis', 'aktiv')
    .single();

  if (error1) {
    console.error('Fant ingen aktiv runde', error1);
    return;
  }
console.log('Fant aktiv runde', aktivRunde);

  // Marker aktiv runde som ferdig
  const{ error:error2 } = await supabase
    .from('rundeTabell')
    .update({ vis: 'ferdig' })
    .eq('rundeId', aktivRunde.rundeId);
  if (error2) {
    console.error('Feil ved oppdatering av aktiv runde til ferdig', error2);
    return;
  }

  // Finn neste runde (side + 1)
  const { data: nesteRunde, error: error3 } = await supabase
    .from('rundeTabell')
    .select('rundeId')
    .eq('gruppeId', miGruppeId)
    .eq('side', aktivRunde.side + 1)
    .single();

  if (error3) {
    console.log('Ingen fleire runder → visning ferdig');
    console.log('neste spelar skal vise')
    // evt: update gruppeTabell.vis_status = 'ferdig'
    return;
  }

  // Aktiver neste runde
  const{ error: error4 } = await supabase
    .from('rundeTabell')
    .update({ vis: 'aktiv' })
    .eq('rundeId', nesteRunde.rundeId);
  if (error4) {
    console.error('Feil ved oppdatering av neste runde til aktiv', error4);
    return;
  }

  console.log('Neste runde aktivert for visning');
}*/ 
