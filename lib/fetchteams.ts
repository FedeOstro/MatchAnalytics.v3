import { supabase } from './supabase'

export const fetchAllEquipos = async () => {
    const { data: equiposData, error } = await supabase.from('equipo').select('*');
    if (error) {
      console.log(error);
    } else {
      return equiposData
    }
}