import { supabase } from './supabase'

export const notesXMatch = async(id_deporte) => {
    const {data, error} = await supabase.from('acciones').select('*').eq('id_deporte', id_deporte)
    if(error){
        console.log(error)
    }else{
        return data
    }
}