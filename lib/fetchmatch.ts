import { eq } from 'drizzle-orm';
import { supabase } from './supabase'
import Equipo from '../src/components/Equipo';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const fetch3partidos = async () => {
  const storedUser = await AsyncStorage.getItem('user');
  const parsedUser = JSON.parse(storedUser);
    const { data: equiposData, error } = await supabase.from('partido').select('*').eq('id_usuario', parsedUser.id).limit(3);
    if (error) {
      console.log(error);
    } else {
      return equiposData
    }
}

export const fetchAllpartidos = async () => {
  const storedUser = await AsyncStorage.getItem('user');
  const parsedUser = JSON.parse(storedUser); 
  const {data, error } = await supabase.from('partido').select('*').eq('id_usuario', parsedUser.id)
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

export const fetchPartodoByTeam = async (Equipo) => {
  const { data, error } = await supabase.from('partido').select('*').eq('idequipo1', Equipo)
  if(error){
    console.log(error)
  }else{
    return data
  }
}

export const updateMatch = async (id_partido: Int8Array, duration: Int8Array, pEqLocal: Int8Array, pEqOf: Int8Array) => {
  console.log("Hola papa")
  await supabase.from('partido').update({duracion: duration, puntosEqLocal: pEqLocal, puntosEqOf: pEqOf}).eq('id_partido', id_partido)
  return
}

export const insertMatch = async (equipo, oponente, fecha, nombre, deporte) => {
  const storedUser = await AsyncStorage.getItem('user');
  const parsedUser = JSON.parse(storedUser); 
  await supabase.from('partido').insert({
    fecha: fecha,
    idequipo1: equipo,
    idequipo2: oponente,
    name: nombre,
    id_deporte: deporte,
    id_usuario: parsedUser.id
  })
  console.log("q onda bro")
  return
}