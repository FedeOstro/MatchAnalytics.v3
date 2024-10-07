import { supabase } from "./supabase";

export const fetchUser = async (name, contra) => {
    const { data, error } = await supabase.from('Usuario').select('*').eq('username', name).eq('contrasena', contra)
    if(error){
        console.log(error)
    }else{
        if(data){
            return data
        }else{
            return false
        }
    }
} 

export const addUser = async (user, gmail, contra) => {
    const {data, error } = await supabase.from('Usuario').insert({
        username: user,
        mail: gmail,
        contrasena: contra
    })
    if(error){
        return error
    }else{
        return data
    }
}

export const cheqName = async (user) => {
    const { data, error} = await supabase.from('Usuario').select('*').eq('username',user)
    if(data[0]){
        return true
    }else{
        return false
    }
}

export const cheqMail = async (gmail) => {
    const { data, error} = await supabase.from('Usuario').select('*').eq('mail', gmail)
    if(data[0]){
        return true
    }else{
        return false
    }
}

