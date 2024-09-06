import { supabase } from './supabase'

export const fetch3partidos = async () => {
    const { data: equiposData, error } = await supabase.from('partido').select('*').limit(3);
    if (error) {
      console.log(error);
    } else {
      return equiposData
    }
}