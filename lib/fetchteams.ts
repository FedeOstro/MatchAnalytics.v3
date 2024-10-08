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

export const insertTeam = async (nombre, foto, id_equipo, id_usuario) => {
  const { data , error } = await supabase.from('equipo').insert({
    nombre: nombre,
    foto: foto,
    id_deporte: id_equipo,
    id_usuario: id_usuario
  }).select('id_equipo')
  if(error){
    console.log(error)
  }else{
    return(data[0].id_equipo)
  }
}