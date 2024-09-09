import * as React from "react";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import PlayerItem from "../components/Jugadores";
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Dimensions, FlatList } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { getAllPlayers } from '../../lib/fetchplayers'

const { width: widthScreen } = Dimensions.get('window');
const { height: heightScreen } = Dimensions.get('window');

const App = ({ route, navigation }) => {
    const [showAllPlayers, setShowAllPlayers] = useState(false);
    const [players, setJugadores] = useState([])
    const { idequipo1, idequipo2, id_partido } = route.params 
     
    const fillImage = (players) => {
        players.forEach(player => {
            if(player.foto == null){
                player.foto = '../images/perfilDefault.png'
            }
        });
        console.log(players)
        return players
    }

    useEffect(() =>{
        const fetchData = async () => {
            try{
                const jugadores = await getAllPlayers(idequipo1)
                console.log("Papa")
                const plays = fillImage(jugadores)
                setJugadores(plays)
            }catch(error){
                console.log(error)
            }
        }
        fetchData()
    })

    const stats = [
        { labels: ["Jan", "Feb"], datasets: [{ data: [20, 15] }] },
        { labels: ["Mar", "Apr"], datasets: [{ data: [30, 25] }] },
        { labels: ["May", "Jun"], datasets: [{ data: [10, 5] }] },
        { labels: ["Jul", "Aug"], datasets: [{ data: [40, 35] }] },
    ];

    const chartConfig = {
        backgroundGradientFrom: "#ffffff00", // Fondo transparente
        backgroundGradientTo: "#ffffff00",   // Fondo transparente
        color: () => `rgba(234, 181, 25, 1)`,
        strokeWidth: 2,
        barPercentage: 0.4,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        propsForBackgroundLines: {
            stroke: 'black',
            strokeWidth: 1,
        },
        propsForLabels: {
            fontSize: 12,
            fontWeight: 'bold',
            fill: 'black',
        },
        showValuesOnTopOfBars: true, 
        horizontalLabelRotation: 0, 
    };

    const initialPlayerCount = 4;
    const playersToShow = showAllPlayers ? players : players.slice(0, initialPlayerCount);

    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Header />
                <View style={styles.topBar}>
                    <Text style={styles.time}>20:00 mins {'\n'} Tiempos 2</Text>
                    <Text style={styles.period}>28 / 4</Text>
                    <Text style={styles.match}>Equipo 1 vs Sacachispas</Text>
                </View>
                <View style={styles.header2}>
                    <Image source={require('../images/barStats.png')} style={styles.bar} />
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View style={styles.flec}>
                            <Image source={require('../images/flecha.png')} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.stats}>
                    <View style={styles.cuadros}>
                        <Image source={require('../images/log.png')} style={styles.log} />
                        <Text style={styles.vs}>VS</Text>
                        <Image source={require('../images/log.png')} style={styles.log} />
                    </View>
                    <View style={styles.chartContainer}>
                        {stats.map((stat, index) => (
                            <BarChart
                                key={index}
                                data={stat}
                                width={widthScreen / 2.2}
                                height={100}
                                chartConfig={chartConfig}
                                style={styles.charts}
                                withHorizontalLabels={false}
                                fromZero={true}
                                withVerticalLines={true} 
                                withHorizontalLines={true}
                            />
                        ))}
                    </View>
                </View>
                <View style={styles.playerListContainer}>
                    <Text style={styles.textitle}>Jugadores</Text>
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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    charts: {
        transform: [{ rotate: '90deg' }],
        marginLeft: 10,
        marginRight: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffcc66',
    },
    scrollView: {
        flex: 1,
        marginTop: -60, 
    },
    header2: {
        height: 'auto'
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
        zIndex: -1
    },
    head: {
        zIndex: 1, 
    },
    stats: {
        marginTop: 10,
        marginBottom: 40
    },
    time: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'left',
    },
    period: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginTop: 30,
    },
    match: {
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'right',
        marginRight: 10
    },
    bar: {
        width: widthScreen,
        height: 30
    },
    cuadros: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    log: {
        height: 150,
        width: 150
    },
    vs: {
        margin: 25,
        fontSize: 18,
        fontWeight: 'bold',
    },
    playerListContainer: {
        margin: 10
    },
    textitle: {
        margin: 10,
        fontSize: 15,
        fontWeight: 'bold'
    },
    chartContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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
});

export default App;
