import { supabase } from './supabaseData.js';
import { status, gruppeIdSetter, spelarIdSetter, naboSpelarSetter, tegneTidSetter, gjetteTidSetter, antalSiderSetter, blokkNrSetter } from './hoved.js';
let grupperOppdateringKanal;
export async function velgGruppeOppsett() {
    document.getElementById('lagNyGruppeKnapp')?.addEventListener('click', () => status('lagGruppe'));
    const { data, error } = await supabase
        .from('gruppeTabell')
        .select('navn,gruppeId,status');
    if (error)
        console.error('feill ved henting av grupper: ' + error);
    else if (data) {
        data.forEach(gruppe => {
            if (gruppe.status === 'ny')
                nyGruppeKnapp(gruppe.navn, gruppe.gruppeId);
        });
    }
    grupperOppdateringKanal = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'gruppeTabell',
    }, (payload) => {
        //legg til knapp for grupper som blir oppretta mes du venter
        nyGruppeKnapp(payload.new.navn, payload.new.gruppeId);
    }).on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'gruppeTabell',
    }, (payload) => {
        //Slett knapp om gruppa har starta.
        if (payload.new.status !== 'ny') {
            const knapp = document.getElementById(payload.new.gruppeId);
            if (knapp)
                knapp.remove();
        }
    })
        .subscribe();
}
export function stengGrupperOppdateringKanal() {
    supabase.removeChannel(grupperOppdateringKanal);
}
function nyGruppeKnapp(navn, nyGruppeId) {
    let nyKnapp = document.createElement('button');
    nyKnapp.innerText = navn;
    nyKnapp.id = nyGruppeId;
    nyKnapp.addEventListener('click', async () => {
        hentGruppeInfo(nyGruppeId);
        status('velgOrd');
    });
    document.getElementById('grupper')?.appendChild(nyKnapp);
}
async function hentGruppeInfo(nyGruppeId) {
    gruppeIdSetter(nyGruppeId);
    //Hent info frå gruppe
    const { data: gruppeData, error: gruppeError } = await supabase
        .from('gruppeTabell')
        .select('nesteSpelarNr, tegneTid, gjetteTid, antalSider')
        .eq('gruppeId', nyGruppeId)
        .single();
    if (gruppeError) {
        console.error('feil ved henting av gruppeinfo: ' + gruppeError);
    }
    else {
        spelarIdSetter(gruppeData.nesteSpelarNr);
        blokkNrSetter(gruppeData.nesteSpelarNr);
        naboSpelarSetter(gruppeData.nesteSpelarNr - 1);
        tegneTidSetter(gruppeData.tegneTid);
        gjetteTidSetter(gruppeData.gjetteTid);
        antalSiderSetter(gruppeData.antalSider);
        oppdaterSpelarNr(nyGruppeId, gruppeData.nesteSpelarNr);
    }
}
async function oppdaterSpelarNr(gruppe, spelarNr) {
    //Oppdater info i gruppe
    const nesteSpelarNr = spelarNr + 1;
    const { error } = await supabase
        .from('gruppeTabell')
        .update({ nesteSpelarNr: nesteSpelarNr, })
        .eq('gruppeId', gruppe);
    if (error) {
        console.error('feil ved oppdatering av gruppeinfo: ' + error);
    }
}
