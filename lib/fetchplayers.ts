import { supabase } from './supabase'

export const getAllPlayers = async (id: Int16Array) => {
    const {data, error } = await supabase.from('jugadores').select('*').eq('id_equipo', id)
    if(error){
        console.log(error)
    }else{
        return data
    }
}

export const insertPlayers = async (name, num, pos, ideq) => {
    const {data, error } = await supabase.from('jugadores').insert({
        nombre: name,
        numero: num,
        rol: pos,
        id_equipo: ideq
    })
    if(error){
        console.log(error)
    }else{
        return data
    }
}