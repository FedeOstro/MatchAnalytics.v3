import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, FlatList } from 'react-native';
import PlayerItem from '../components/Jugadores';
import Partido from '../components/Partido';
import Header from '../components/Header';
import { supabase } from '../../lib/supabase'
import { fetchAllpartidos } from '../../lib/fetchmatch'
import { getAllPlayers } from '../../lib/fetchplayers'
const { height: screenHeight } = Dimensions.get('window');
const { width: screenWidth } = Dimensions.get('window');

const TeamScreen = ({ route, navigation }) => {
    const { idEquipo } = route.params || {};
    console.log(idEquipo);
    const [partidos, setPartidos] = useState([])
    const [players, setPlayers] = useState([])
    const [showAllPartidos, setShowAllPartidos] = useState(false);
    const [showAllPlayers, setShowAllPlayers] = useState(false);

    const fillImage = (players) => {
        players.forEach(player => {
            if(player.foto == null){
                player.foto = '../images/perfilDefault.png'
            }
        });
        console.log(players)
        return players
    }

    useEffect(() => {
        const fetchData = async () => {
          try{
            const data2 = await fetchAllpartidos()
            setPartidos(data2)
            const play = await getAllPlayers(idEquipo)
            const players = fillImage(play)
            setPlayers(players)
          }catch(error){
            console.log(error)
          }
        }
        fetchData()
      }, []);


    const initialPartidosCount = 3;
    const initialPlayerCount = 4;
    const partidosToShow = showAllPartidos ? partidos : partidos.slice(0, initialPartidosCount);
    const playersToShow = showAllPlayers ? players : players.slice(0, initialPlayerCount);
      
    return (
        <ScrollView style={styles.container}>
            <Header />
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={styles.flec}>
                    <Image source={require('../images/flecha.png')} />
                </View>
            </TouchableOpacity>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Image source={require('../images/football.png')} style={styles.logo} />
                    <View>
                        <Text style={styles.teamName}>Equipo 2</Text>
                        <Text style={styles.sportType}>Deporte: Basquet</Text>
                    </View>
                </View>
                <View style={styles.scrollData}>
                    <Text style={styles.sectionTitle}>Partidos</Text>
                    <FlatList
                        data={partidosToShow}
                        keyExtractor={(item) => item.numero}
                        renderItem={({ item }) => (
                            <Partido
                                numero={item.id_partido}
                                fecha={item.fecha}
                                puntos={item.puntosEqLocal + '/' + item.puntosEqOf}
                                equipos={item.name}
                            />
                        )}
                        ListFooterComponent={
                            !showAllPartidos && (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => setShowAllPartidos(true)}
                                >
                                    <Text style={styles.buttonText}>Ver más partidos</Text>
                                </TouchableOpacity>
                            )
                        }
                    />
                </View>

                <View style={styles.scrollData}>
                    <Text style={styles.sectionTitle}>Jugadores</Text>
                    <FlatList
                        data={playersToShow}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <PlayerItem key={item.id} player={item} />}
                        ListFooterComponent={
                            !showAllPlayers && (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => setShowAllPlayers(true)}
                                >
                                    <Text style={styles.buttonText}>Ver más jugadores</Text>
                                </TouchableOpacity>
                            )
                        }
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffcc66',
    },
    flec: {
        marginTop: 5,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    scrollData: {
        flex: 1,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 60,
        height: 60,
        marginRight: 10,
    },
    teamName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    sportType: {
        fontSize: 16,
        color: '#666',
    },
    partidosContainer: {
        flex: 1,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    playerListContainer: {
        flex: 2,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: screenWidth * 0.9,
        marginBottom: 10,
        marginLeft: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    teamItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    teamImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
});

export default TeamScreen;
