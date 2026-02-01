import { supabase } from "./supabaseData.js";
import { miGruppeId } from "./hoved.js";
import { vent } from "./logikk.js";
export async function startFerdig() {
    await supabase
        .from('gruppeTabell')
        .update({ status: 'ferdig' })
        .eq('gruppeId', miGruppeId);
    await vent(3000);
    const { error } = await supabase
        .from('rundeTabell')
        .delete()
        .eq('gruppeId', miGruppeId);
    if (error) {
        console.error('Feil ved sletting av ferdige runder:', error);
    }
    const { error: error2 } = await supabase
        .from('gruppeTabell')
        .delete()
        .eq('gruppeId', miGruppeId);
    if (error2) {
        console.error('Feil ved sletting av ferdige gruppe:', error2);
    }
}
