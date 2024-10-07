import { supabase } from './supabase'

export const addAnot = async (modalId, playerNumber, id_partido, idequipo1, special) => {
    const {data, error} = await supabase.from('accionesXpartido').insert({
        id_Jugador: playerNumber
    })
}

export const addOpAnot = async (modalId, id_game, id_op) => {

}
