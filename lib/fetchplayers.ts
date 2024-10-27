import { supabase } from './supabase'

export const getAllPlayers = async (id: Int16Array) => {
    const {data, error } = await supabase.from('jugadores').select('*').eq('id_equipo', id)
    if(error){
        console.log(error)
    }else{
        return data
    }
}

export const insertPlayers = async (id: Int16Array, jugadores) => {
    try{
        jugadores.forEach( async jugador => {
            const {data, error } = await supabase.from('jugadores').insert({
                nombre: jugador.nombre,
                numero: jugador.numero,
                rol: jugador.rol,
                id_equipo: id,
                foto: jugador.foto
            }) 
        });
    }catch(error){
        console.log(error)
        return(error)
    }
}

export const fetchPlayer = async () => {
    try{

    }catch{
        
    }
}