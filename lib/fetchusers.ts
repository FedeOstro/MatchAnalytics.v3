import { supabase } from "./supabase";

export const fetchUser = async (name, contra) => {
    const { data, error } = await supabase.from('Usuario').select('*').eq('username', name).eq('contrasena', contra)
    if(error){
        console.log(error)
    }else{
        return data
    }
} 