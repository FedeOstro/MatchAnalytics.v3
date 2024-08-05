import * as React from "react";
import Header from "../components/Header";
import PlayerItem from "../components/Jugadores"
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Dimensions, ProgressBarAndroidBase } from "react-native";
const {width: widthScreen} = Dimensions.get('window');
const {height: heightScreen} = Dimensions.get('window')

const App = ({ navigation }) => {
    const players = [
        { id: '1', name: 'Juan Gutierrez', number: 1, value: 41, image: 'https://via.placeholder.com/50' },
        { id: '2', name: 'Dante Verdi', number: 2, value: 25, image: 'https://via.placeholder.com/50' },
        { id: '3', name: 'Julian Huewman', number: 3, value: 30, image: 'https://via.placeholder.com/50' },
        { id: '4', name: 'Player 4', number: 4, value: 28, image: 'https://via.placeholder.com/50' },
        { id: '5', name: 'Player 5', number: 5, value: 33, image: 'https://via.placeholder.com/50' },
        { id: '6', name: 'Player 6', number: 6, value: 29, image: 'https://via.placeholder.com/50' },
    ];
    const stats = [
        { label: 'Puntos', value: 34, total: 45 },
        { label: 'Tiros', value: 25, total: 45 },
        { label: 'Faltas', value: 15, total: 25 },
        { label: 'Tapones', value: 6, total: 12 },
        { label: 'Recuperos', value: 14, total: 25 },
        { label: 'Robadas', value: 10, total: 15 },
    ];
    
    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.time}>20:00 mins {'\n'} Tiempos 2</Text>
                <Text style={styles.period}>28 / 4</Text>
                <Text style={styles.match}>Equipo 1 vs Sacachispas</Text>
            </View>
            <Header/>
            <ScrollView style={styles.stats}>
                <Image source={require('../images/barStats.png')} style={styles.bar}/>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.flec}>
                        <Image source={require('../images/flecha.png')}/>
                    </View>
                </TouchableOpacity>
                <View style={styles.cuadros}>
                    <Image source={require('../images/log.png')} style={styles.log}/>
                    <Text style={styles.vs}>VS</Text>
                    <Image source={require('../images/log.png')} style={styles.log}/>
                </View>
                {stats.map((stat, index) => (
                <View key={index} style={styles.statRow}>
                    <Text style={styles.label}>{stat.label}</Text>
                    <View style={styles.progressContainer}>
                        <ProgressBarAndroidBase progress={stat.value / stat.total} width={200} color="orange" />
                        <Text style={styles.value}>{stat.value}</Text>
                    </View>
                </View>
                 ))}
            </ScrollView>
            <Text style={styles.textitle}>Jugadores</Text>
            <View style={styles.playerListContainer}>
                <ScrollView>
                    {players.map(player => (
                      <PlayerItem key={player.id} player={player} />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffcc66',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FAD77F',
        width: '100%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        position: 'absolute',
        top: 0,
        zIndex: 0,
        marginTop: 10,
    },
    time: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'left',
        marginTop: 20,
    },
      period: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginTop: 50,
      },
      match: {
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'right',
        marginTop: 15,
        marginRight: 10
    },
    stats: {
        marginTop:63
    },
    bar: {
        width: widthScreen
    },
    cuadros: {
        flexDirection: 'row',
        justifyContent: 'center',    
        alignItems: 'center',
    },
    log:{
        height: 150,
        width: 150
    },
    vs: {
        margin: 25,
        fontSize: 18,
        fontWeight: 'bold',
    },
    playerListContainer: {
        maxHeight: heightScreen * 0.4,
        marginBottom: 10,
    },
    textitle:{
        margin: 10,
        fontSize: 15,
        fontWeight: 'bold'
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      label: {
        fontSize: 16,
        width: 100,
      },
      progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      value: {
        marginLeft: 10,
        fontSize: 16,
      },
});

export default App;
