import { supabase } from './supabase'

export const fetch3partidos = async () => {
    const { data: equiposData, error } = await supabase.from('partido').select('*').limit(3);
    if (error) {
      console.log(error);
    } else {
      return equiposData
    }
}

export const fetchAllpartidos = async () => {
  const {data, error } = await supabase.from('partido').select('*')
  if(error){
    console.log(error)
  }else{
    return data
  }
} 

export const updateMatch = async (id_partido, duration, pEqLocal, pEqOf) => {
  await supabase.from('partidos').update({duracion: duration, puntosEqLocal: pEqLocal, puntosEqOf: pEqOf}).eq('id_partido', id_partido)
}