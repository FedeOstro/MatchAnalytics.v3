import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import PlayerItem from '../components/Jugadores';
import Partido from '../components/Partido';
import Header from '../components/Header';
const { height: screenHeight } = Dimensions.get('window');
const { width: screenWidth } = Dimensions.get('window');

const TeamScreen = ({ navigation }) => {
    const players = [
        { id: '1', name: 'Juan Gutierrez', number: 1, value: 41, image: 'https://via.placeholder.com/50' },
        { id: '2', name: 'Dante Verdi', number: 2, value: 25, image: 'https://via.placeholder.com/50' },
        { id: '3', name: 'Julian Huewman', number: 3, value: 30, image: 'https://via.placeholder.com/50' },
        { id: '4', name: 'Player 4', number: 4, value: 28, image: 'https://via.placeholder.com/50' },
        { id: '5', name: 'Player 5', number: 5, value: 33, image: 'https://via.placeholder.com/50' },
        { id: '6', name: 'Player 6', number: 6, value: 29, image: 'https://via.placeholder.com/50' },
    ];

    return (
        <View style={styles.container}>
            <Header/>
            <TouchableOpacity onPress={() => navigation.goBack()}>
             <View style={styles.flec}>
                <Image source={require('../images/flecha.png')}/>
             </View>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.header}>
                    <Image source={require('../images/football.png')} style={styles.logo} />
                    <View>
                        <Text style={styles.teamName}>Equipo 2</Text>
                        <Text style={styles.sportType}>Deporte: Basquet</Text>
                    </View>
                </View>
                <View style={styles.partidosContainer}>
                    <Partido numero="1" fecha="24/4" puntos="34-12" equipos="Equipo 3 vs As.Ingenieros" />
                    <Partido numero="2" fecha="20/3" puntos="3-1" equipos="Equipo 1 vs Dep.Tortugas" />
                    <Partido numero="3" fecha="12/2" puntos="92-80" equipos="Equipo 2 vs Dep.Puerrreydon" />
                </View>
                <Text style={styles.sectionTitle}>Jugadores</Text>
                <View style={styles.playerListContainer}>
                    <ScrollView>
                        {players.map(player => (
                            <PlayerItem key={player.id} player={player} />
                        ))}
                    </ScrollView>
                </View>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Añadir Nuevo</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffcc66',
    },
    flec: {
        marginTop: 5
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft:10
    },
    headerApp:{
        alignItems: 'center',
        height: 70
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
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        marginLeft: 10
    },
    playerListContainer: {
        maxHeight: screenHeight * 0.4,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: screenWidth * 0.95,
        marginLeft: 10,
        marginBottom: 10
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TeamScreen;
