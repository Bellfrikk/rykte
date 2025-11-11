import { supabase } from './supabaseData.js';

import { ord } from './ord.js';
let minSpelarId:any;
let miGruppeId:number;
let maksFolk:number;
let rundeNr:number = 1;
let grupperOppdateringKanal:any;
let gruppeStatusKanal:any;
let spelarOppdateringKanal:any;

function status(nyStatus:'harLagaSpelar' | 'harValgtGruppe'| 'skalLageNyGruppe'|'harLagaNyGruppe'|'ferdigMedVenting'|'startTeining'|'startGruppa'|'skalGjette'){
 
  if(nyStatus === 'harLagaSpelar'){
    document.getElementById('spelarFane')!.classList.add('usynlig');
    document.getElementById('gruppeFane')!.classList.remove('usynlig');
    hentGrupper();

 }else if(nyStatus === 'skalLageNyGruppe'){
    document.getElementById('gruppeFane')!.classList.add('usynlig');
    document.getElementById('nyGruppeFane')!.classList.remove('usynlig');

  }else if(nyStatus === 'harLagaNyGruppe'){
    document.getElementById('nyGruppeFane')!.classList.add('usynlig');
    document.getElementById('gruppeFane')!.classList.remove('usynlig');
  
  }else if(nyStatus === 'harValgtGruppe'){
    document.getElementById('gruppeFane')!.classList.add('usynlig');
    document.getElementById('venteFane')!.classList.remove('usynlig');
    supabase.removeChannel(grupperOppdateringKanal);
    hentSpelarar();
    hentGruppeStatus(); 

  }else if(nyStatus === 'ferdigMedVenting'){
    document.getElementById('venteFane')!.classList.add('usynlig');
    document.getElementById('velgOrdFane')!.classList.remove('usynlig');
    supabase.removeChannel(gruppeStatusKanal);
  
  }else if(nyStatus === 'startGruppa'){
    giBlokkNrTilSpelarar();
  
  }else if(nyStatus === 'startTeining'){
    document.getElementById('velgOrdFane')!.classList.add('usynlig');
    document.getElementById('teineFane')!.classList.remove('usynlig');
    startTeineFane();
    supabase.removeChannel(gruppeStatusKanal);

  }else if(nyStatus === 'skalGjette'){
    document.getElementById('teineFane')!.classList.add('usynlig');
    document.getElementById('gjetteFane')!.classList.remove('usynlig');
  }
}

//___spelar navn fane____________________________________________________________________________---
document.getElementById('lagNySpelarKnapp')?.addEventListener('click', lagNySpelar);

async function lagNySpelar(){
  const spelarNavnInput = document.getElementById('spelarNavn') as HTMLInputElement;
  const spelarNavn:string = spelarNavnInput.value.trim();

  if (spelarNavn) {
    const { data, error } = await supabase
      .from('spelarTabell')
      .insert([{ navn: spelarNavn }])
      .select()
      .single();

    if (error) {
      console.error('Feil ved lagring av spelar:', error);
    } else {
      console.log('Spelar lagra:', data);
      minSpelarId = data.spelarId;
      status('harLagaSpelar');
    }
  }
}

//___gruppe fane____________________________________________________________________________

async function hentGrupper (){
  console.log('Hentar grupper fra Supabase...');
  const { data, error } = await supabase.from('gruppeTabell').select('navn,gruppeId') as { data: { navn: string, gruppeId: any }[] | null, error: any };

  if (error) console.error(error)
  else if (data) {
    data.forEach(denne => {
      nyGruppeKnapp(denne.navn, denne.gruppeId);
    });
    console.log(data)
  }

grupperOppdateringKanal = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'gruppeTabell',
    },
    (payload:any) => {
      nyGruppeKnapp(payload.new.navn, payload.new.gruppeId);
    }
  )
  .subscribe()
}

function nyGruppeKnapp(navn:string, nyGruppeId:any){
  let nyKnapp = document.createElement('button');
  nyKnapp.innerText = navn;
  nyKnapp.addEventListener('click', async () => { 
    const { data, error } = await supabase.from('spelarTabell').update({ gruppe:nyGruppeId }).eq('spelarId', minSpelarId);
    if (error) console.error(error);  
    miGruppeId = nyGruppeId;
    document.getElementById('gruppeInfo')!.innerText = `Gruppeid: ${miGruppeId}`;
    status('harValgtGruppe');
   });
  document.getElementById('grupper')?.appendChild(nyKnapp);
}
document.getElementById('lagNyGruppeKnapp')?.addEventListener('click', () => status('skalLageNyGruppe'));


//___lag gruppe fane____________________________________________________________________________---


document.getElementById('lagreGruppeKnapp')?.addEventListener('click', lagreGruppeKnapp);

async function lagreGruppeKnapp() {
  const gruppeNavnInput = document.getElementById('gruppeNavn') as HTMLInputElement;
  const gruppeNavn:string = gruppeNavnInput.value.trim();
  const tegneTidInput = document.getElementById('tegneTid') as HTMLInputElement;
  const tegneTid:number = parseInt(tegneTidInput.value);
  const gjetteTidInput = document.getElementById('gjetteTid') as HTMLInputElement;
  const gjetteTid:number = parseInt(gjetteTidInput.value);
  
  const { data, error } = await supabase
    .from('gruppeTabell')
    .insert([{navn: gruppeNavn, lagaAv: minSpelarId, gjetteTid:gjetteTid, tegneTid:tegneTid, status:'ny'}])
    .select()
  if (error) console.error(error)
  else {
    status('harLagaNyGruppe');
  }
}
//___vente fane____________________________________________________________________________---

document.getElementById('startRundeKnapp')?.addEventListener('click', () => status('startGruppa'));

async function hentSpelarar (){
//sjekk om det er du som har laga gruppa og som kan starte gruppa
const { data, error } = await supabase.from('gruppeTabell').select('lagaAv').eq('gruppeId', miGruppeId).single() as { data: { lagaAv: any} | null, error: any };
  if (error) console.error(error)
  else if (data) { 
    if( data?.lagaAv === minSpelarId) document.getElementById('startRundeKnapp')!.classList.remove('usynlig');
    console.log(data.lagaAv + '===' + minSpelarId);
 }
//hent alle spelarane i gruppa og vis på venteskjermen
const { data:data2, error:error2 } = await supabase.from('spelarTabell').select('navn').eq('gruppe', miGruppeId) as { data: { navn: string}[] | null, error: any };
  if (error2) console.error(error2)
  else if (data2) {
    data2.forEach(denne => {
      visSpelar(denne.navn);
    });
  }

spelarOppdateringKanal = supabase
  .channel('spelarOppdateringKanalen')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'spelarTabell',
      filter: `gruppe=eq.${miGruppeId}`,
    },
    (payload:any) => {
      visSpelar(payload.new.navn);
    }
  )
  .subscribe()
}

function visSpelar (spelarNavn:string) {
  let nyDiv = document.createElement('div');
  nyDiv.innerText = spelarNavn;
  document.getElementById('venteSpelarar')?.appendChild(nyDiv);
}

async function hentGruppeStatus (){
 gruppeStatusKanal = supabase.channel('gruppeStatus')
  .on('postgres_changes' ,
      { event: 'update', schema: 'public', table: 'gruppeTabell', filter: `gruppeId=eq.${miGruppeId}` },
      (data: any) => {
        if (data.new.status === 'aktiv') {
          maksFolk = data.new.maksFolk;
          status('ferdigMedVenting');
        }
      }
    )
    .subscribe();
}


//___velg ord fane____________________________________________________________________________---

for (let i = 0; i < 4; i++) {
  let nyKnapp = document.createElement('button');
  const valgtOrd = ord[Math.floor(Math.random() * ord.length)];
  nyKnapp.innerText = valgtOrd;
  nyKnapp.addEventListener('click', () => {
    document.getElementById('teineOrd')!.innerText = valgtOrd;
    lagreValgtOrd(valgtOrd);
  });
  document.getElementById('velgeOrd')?.appendChild(nyKnapp);
}

async function lagreValgtOrd(valgtOrd:string) {

  const { data, error } = await supabase
    .from('spelarTabell')
    .update({ valgtOrd: valgtOrd })
    .eq('spelarId', minSpelarId)
    .select();

  if (error) {
    console.error('Feil ved lagring av ord:', error);
  } else {
    status('startTeining');
  }
}
//___gi blokknr til spelarar____________________________________________________________________________---

async function giBlokkNrTilSpelarar() { 
  let blokknr = 0;
  let maksFolk = 0;
  const { data, error } = await supabase.from('spelarTabell').select('spelarId').eq('gruppe', miGruppeId);
      if (error) console.error(error)
      else{
        data.forEach((spelar:any) => {
          // Gi blokk nummer til kvar spelar
          supabase.from('spelarTabell').update({ blokk: blokknr}).eq('spelarId', minSpelarId);
          blokknr++;
        });
      }

  const { data:data2,error:error2 } = await supabase.from('gruppeTabell').update({status: 'aktiv', maksFolk: maksFolk}).eq('gruppeId', miGruppeId);
    if (error2) console.error(error2) 
}

//___tegn____________________________________________________________________________---
function startTeineFane() {

  const blyatntBredde = 4;
  const viskBredde = 20;
  const blyantFarge = 'black';
  const bakgrunnFarge = '#fffff3';

  const lerret = document.getElementById('tegneflate') as HTMLCanvasElement;
  const ctx = lerret.getContext('2d') as CanvasRenderingContext2D;
  ctx.lineWidth = blyatntBredde;
  ctx.lineCap = 'round';
  ctx.strokeStyle = blyantFarge;
  let tegner = false;
  lerret.addEventListener('mousedown', (e) => startTegning(e));
  lerret.addEventListener('touchstart', (e) => startTegning(e.touches[0]));
  lerret.width = lerret.getBoundingClientRect().width;
  lerret.height = lerret.getBoundingClientRect().height;

  function startTegning(e: MouseEvent| Touch) {
    tegner = true;
    const rect = lerret.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  lerret.addEventListener('mousemove', (e) => fortsettTegning(e));
  lerret.addEventListener('touchmove', (e) => fortsettTegning(e.touches[0]));

  function fortsettTegning(e: MouseEvent| Touch) {
    if (!tegner) return;
    const rect = lerret.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  lerret.addEventListener('mouseup', () => stoppTegning());
  lerret.addEventListener('mouseleave', () => stoppTegning());
  lerret.addEventListener('touchend', () => stoppTegning());
  lerret.addEventListener('touchcancel', () => stoppTegning());
  function stoppTegning() {
    tegner = false;
  }
  //____blyant visk knapp___
  let tegnemodus:'blyant' | 'visk' = 'blyant';
  document.getElementById('blyantViskKnapp')?.addEventListener('click', () => {
   if(tegnemodus === 'blyant'){
    tegnemodus = 'visk';
    ctx.strokeStyle = bakgrunnFarge;
    ctx.lineWidth = viskBredde;
    document.getElementById('blyantViskKnapp')!.innerText = '🧹'; 
   } else{
    tegnemodus = 'blyant';
    ctx.strokeStyle = blyantFarge;
    ctx.lineWidth = blyatntBredde;
    document.getElementById('blyantViskKnapp')!.innerText = '✏️'; 
   }
  });

  //___ferdig knapp____________________________________________________________________________---
  document.getElementById('ferdigKnapp')?.addEventListener('click',  () => lagreTegning());

  async function lagreTegning() {
      // Hent bilde frå canvas som Blob
    const blob = await new Promise(resolve => lerret.toBlob(resolve, 'image/png'))
    const filnavn = `Spelar_${minSpelarId}_Runde${rundeNr}.png`
    const { data, error } = await supabase.storage
      .from('Bilder')
      .upload(filnavn, blob, {
        contentType: 'image/png',
        upsert: false
      })
    if (error) {
      console.error('Feil ved opplasting:', error.message)
      console.log('Feil ved opplasting!')
    } else {
      status('skalGjette')
    }
  }
}