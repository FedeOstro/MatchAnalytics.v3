import { supabase } from './supabase'

export const fetchNotesXMatch = async (id, id_note) => {
    const {data, error} = await supabase.from('accionesXpartido').select('*', {count:'exact'}).eq('id_Partido', id).eq('id_Accion', id_note)
    if(error){
        console.log(error)
    }else{
        return data
    }
} 