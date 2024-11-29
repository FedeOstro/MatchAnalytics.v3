import { supabase } from './supabase'

export const fetchNotesXMatch = async (id, id_note) => {
    const { count, error } = await supabase
      .from('accionesXpartido')
      .select('*', { count: 'exact', head: true }) // head:true trae solo el count
      .eq('id_Partido', id)
      .eq('id_Accion', id_note);
  
    if (error) {
      console.log(error);
      return 0; // Si hay error, devolvemos 0 como conteo.
    } else {
      return count; // Retornamos solo el count.
    }
  };
  