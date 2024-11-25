import { supabase } from './supabase'

export const fetchNotesXMatch = async (id, id_note) => {
    console.log("Idpartido" + id)
    console.log("idanotacion" + id_note)
    const {data, error} = await supabase.from('accionesXpartido').select('*', {count:'exact'}).eq('id_Partido', id).eq('id_Accion', id_note).limit(30)
    console.log("Data " + data)
    if(error){
        console.log(error)
    }else{
        return data
    }
} 