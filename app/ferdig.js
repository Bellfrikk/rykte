import { supabase } from "./supabaseData.js";
import { miGruppeId } from "./hoved.js";
export async function startFerdig() {
    await supabase
        .from('gruppeTabell')
        .update({ status: 'ferdig' })
        .eq('gruppeId', miGruppeId);
    const { error } = await supabase
        .from('rundeTabell')
        .delete()
        .eq('gruppeId', miGruppeId)
        .eq('vis', 'ferdig');
    if (error) {
        console.error('Feil ved sletting av ferdige runder:', error);
    }
}
