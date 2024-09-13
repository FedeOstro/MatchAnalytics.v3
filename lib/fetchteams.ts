import { supabase } from './supabase'

export const fetchAllEquipos = async () => {
    const { data: equiposData, error } = await supabase.from('equipo').select('*');
    if (error) {
      console.log(error);
    } else {
      return equiposData
    }
}

export const fetchEquipoById = async (id: Int8Array) => {
  const {data, error} = await supabase.from('equipo').select('*').eq('id_equipo', id)
  if(error){
    console.log(error)
  }else{
    return data
  }
}