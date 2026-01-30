import { supabase } from "./supabaseData.js";
import { miGruppeId, status } from "./hoved.js";
import { vent } from "./logikk.js";
export async function startFerdig() {
    await supabase
        .from('gruppeTabell')
        .update({ status: 'ferdig' })
        .eq('gruppeId', miGruppeId);
    const { error } = await supabase
        .from('rundeTabell')
        .delete()
        .eq('gruppeId', miGruppeId);
    if (error) {
        console.error('Feil ved sletting av ferdige runder:', error);
    }
    await vent(3000);
    status('velgGruppe');
}
