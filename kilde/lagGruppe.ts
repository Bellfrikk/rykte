import { status, gruppeIdSetter, antalSiderSetter, gjetteTidSetter, tegneTidSetter, spelarIdSetter, blokkNrSetter } from './hoved.js';
import { supabase } from './supabaseData.js';
import { startGruppa } from './startGruppa.js';

export function lagGruppeOppsett(){
  document.getElementById('lagreGruppeKnapp')?.addEventListener('click', () => lagGruppe());
}

async function lagGruppe() {
  //Aktiver start gruppeknapp for den som lager gruppa
  document.getElementById('startRundeKnapp')!.addEventListener('click', () => startGruppa());
  document.getElementById('startRundeKnapp')!.classList.remove('usynlig');
  //Lagre data om gruppa i databasen
  const gruppeNavnInput = document.getElementById('gruppeNavn') as HTMLInputElement;
  const gruppeNavn:string = gruppeNavnInput.value.trim();
  const tegneTid1 = document.getElementById('tegneTidSkyvebryter') as HTMLSelectElement;
  let tegneTid2:number = parseInt(tegneTid1.value);
  let tegneTid3:number|null = tegneTid2 === 120 ? null : tegneTid2;
  console.log('tegnetid: ' + tegneTid3);

  const gjetteTid1 = document.getElementById('gjetteTidSkyvebryter') as HTMLSelectElement;
  let gjetteTid2:number = parseInt(gjetteTid1.value);
  let gjetteTid3:number|null = gjetteTid2 === 120 ? null : gjetteTid2;
  console.log('gjettetid: ' + gjetteTid3);

  const antalSiderInput = document.getElementById('antalRundarSkyvebryter') as HTMLInputElement;
  let antalSider1:number = parseInt(antalSiderInput.value);
  let antalSider2:number = antalSider1 * 2 + 1;
  
  const { data, error } = await supabase
    .from('gruppeTabell')
    .insert([{navn: gruppeNavn, nesteSpelarNr: 2, gjetteTid:gjetteTid3, tegneTid:tegneTid3, antalSider:antalSider2, status:'ny'}])
    .select('gruppeId')
    .single();
    if (error) console.error('Gruppe lagre feil:', error);
    console.log(data);
    
    gruppeIdSetter( data.gruppeId)
    spelarIdSetter( 1);
    blokkNrSetter( 1);
    tegneTidSetter( tegneTid3 );
    gjetteTidSetter( gjetteTid3 );
    antalSiderSetter( antalSider2);
    status('velgOrd');
}