import { supabase } from './supabase'

export const fetchNotesXMatch = async (id, id_note) => {
    console.log(id)
    const {data, error} = await supabase.from('accionesXpartido').select('*', {count:'exact'}).eq('id_Partido', id).eq('id_Accion', id_note)
    console.log("Hola papa " + data)
    if(error){
        console.log(error)
    }else{
        return data
    }
} 