import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, FlatList } from 'react-native';
import PlayerItem from '../components/Jugadores';
import Partido from '../components/Partido';
import Header from '../components/Header';

const { height: screenHeight } = Dimensions.get('window');
const { width: screenWidth } = Dimensions.get('window');

const TeamScreen = ({ navigation }) => {
    const [showAllPartidos, setShowAllPartidos] = useState(false);
    const [showAllPlayers, setShowAllPlayers] = useState(false);

    const players = [
        { id: '1', name: 'Juan Gutierrez', number: 1, value: 41, image: 'https://via.placeholder.com/50' },
        { id: '2', name: 'Dante Verdi', number: 2, value: 25, image: 'https://via.placeholder.com/50' },
        { id: '3', name: 'Julian Huewman', number: 3, value: 30, image: 'https://via.placeholder.com/50' },
        { id: '4', name: 'Player 4', number: 4, value: 28, image: 'https://via.placeholder.com/50' },
        { id: '5', name: 'Player 5', number: 5, value: 33, image: 'https://via.placeholder.com/50' },
        { id: '6', name: 'Player 6', number: 6, value: 29, image: 'https://via.placeholder.com/50' },
    ];

    const partidos = [
        { numero: "1", fecha: "24/4", puntos: "34-12", equipos: "Equipo 3 vs As.Ingenieros" },
        { numero: "2", fecha: "20/3", puntos: "3-1", equipos: "Equipo 1 vs Dep.Tortugas" },
        { numero: "3", fecha: "12/2", puntos: "92-80", equipos: "Equipo 2 vs Dep.Puerrreydon" },
        { numero: "4", fecha: "15/1", puntos: "70-65", equipos: "Equipo 4 vs Dep. Olavarría" },
        { numero: "5", fecha: "05/12", puntos: "50-49", equipos: "Equipo 5 vs Racing Club" },
    ];

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
                                numero={item.numero}
                                fecha={item.fecha}
                                puntos={item.puntos}
                                equipos={item.equipos}
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
