import { supabase } from './supabaseData.js';
import { miGruppeId, minSpelarId, naboSpelar, tmpSide, tmpBlokk } from './hoved.js';
export async function lagreSide(ord, tegning) {
    const { data, error } = await supabase
        .from('rundeTabell')
        .insert({ 'gruppeId': miGruppeId, 'gjettaOrd': ord, 'tegning': tegning, 'fra': minSpelarId, 'til': naboSpelar, 'side': tmpSide, 'blokk': tmpBlokk });
    if (error)
        console.error('feil ved lagre side, feil: ' + error);
    else
        return true;
}
