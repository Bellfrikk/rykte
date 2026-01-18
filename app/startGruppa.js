import { supabase } from './supabaseData.js';
import { miGruppeId, naboSpelarSetter } from './hoved.js';
export async function startGruppa() {
    console.log('startGruppa kalla');
    //Sett gruppestatus til aktiv og hent nabospelar til førstemann
    const { data, error } = await supabase
        .from('gruppeTabell')
        .update({ status: 'aktiv' })
        .select('nesteSpelarNr')
        .single()
        .eq('gruppeId', miGruppeId);
    if (error) {
        console.error('feil ved setting av  status til aktiv ');
        console.log(error);
    }
    else if (data)
        naboSpelarSetter(data.nesteSpelarNr - 1);
}
