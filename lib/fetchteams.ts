import { supabase } from './supabase'
import AsyncStorage from '@react-native-async-storage/async-storage';


export const fetchAllEquipos = async () => {
  const storedUser = await AsyncStorage.getItem('user');
  const parsedUser = JSON.parse(storedUser);  
  const { data: equiposData, error } = await supabase.from('equipo').select('*').eq('id_usuario', parsedUser.id);
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

export const fetchSport = async (equipo) => {
  const { data, error } = await supabase.from('equipo').select('*').eq('nombre', equipo)
  if(error){
    console.log(error)
    return error
  } else{
    return data
  }
}