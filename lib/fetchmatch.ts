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

export const fetchPartidoById = async (id: Int8Array) => {
  const {data, error } = await supabase.from('partido').select('*').eq('id_partido', id)
  if(error){
    console.log(error)
  }else{
    return data
  }
}

export const updateMatch = async (id_partido: Int8Array, duration: Int8Array, pEqLocal: Int8Array, pEqOf: Int8Array) => {
  await supabase.from('partido').update({duracion: duration, puntosEqLocal: pEqLocal, puntosEqOf: pEqOf}).eq('id_partido', id_partido)
}

export const insertMatch = async (equipo, oponente, fecha, name, deporte) => {
  await supabase.from('partido').insert({
    fecha: fecha,
    idequipo1: equipo,
    idequipo2: oponente,
    name: name,
    id_deporte: deporte,
  })
}