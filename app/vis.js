"use strict";
/*import { supabase } from './supabaseData.js';
import { tmpSide, tmpBlokk, miGruppeId, miBlokk, antalSider } from "./hoved.js";

let visKanal:any;

export function startVis() {

  document.getElementById('nesteVisKnapp')?.addEventListener('click', ()=> visNeste(),true )
 
  //Start kanal for vising av tegning og gjetta ord
  visKanal = supabase.channel('visKanal')
  .on('postgres_changes' ,
      { event: 'UPDATE', schema: 'public', table: 'rundeTabell', filter: `gruppeId=eq.${miGruppeId}` },
      (data: any) => {
        if (data.new.erVist === true) {
          if(data.new.tegning !== null) (document.getElementById('visTegning') as HTMLImageElement).src = data.new.tegning;
          if(data.new.gjettaOrd !== null) document.getElementById('visOrd')!.innerText = data.new.gjettaOrd;
          tmpSide = data.new.side + 1;
          visNesteSpelar (data.new.side, data.new.blokk);
        }
      }
    )
    .subscribe();
  //aktiver første visning visst du har blokk 1
  if(miBlokk === 1) {
    document.getElementById('nesteVisKnapp')?.classList.remove('usynlig')
    visNeste();
  }
}

async function visNesteSpelar (side:number, blokk:number) {
  if(side >= antalSider){
    if( blokk === (miBlokk - 1) ){
    document.getElementById('nesteVisKnapp')?.classList.remove('usynlig')
    tmpSide = 1;
    }else {
      document.getElementById('nesteVisKnapp')?.classList.add('usynlig')
    }
  }
}
async function visNeste () {
  //__lagre  runde og blokk
  const { data, error } = await supabase
    .from( 'rundeTabell' )
    .update( { erVist: true } )
    .eq( 'gruppeId', miGruppeId )
    .eq( 'side', tmpSide )
    .eq( 'blokk', tmpBlokk );

    if( error ) console.error('Feil ved lagring av vis runde, feil: ' + error);
  }

*/ 
