import { supabase } from './supabase'

export const addAnot = async (modalId, playerNumber, id_partido, idequipo1, pecial) => {
    const {data, error} = await supabase.from('accionesXpartido').insert({
        id_Accion: modalId,
        id_Partido: id_partido,
        id_Jugador: playerNumber,
        id_Equipo: idequipo1,
        special: pecial
    })
    return
}

export const addOpAnot = async (modalId, id_op, id_game) => {
    const {data, error} = await supabase.from('accionesXpartido').insert({
        id_Accion: modalId,
        id_Partido: id_game,
        id_Equipo: id_op
    })
    return
}
