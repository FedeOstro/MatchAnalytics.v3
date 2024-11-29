import * as React from "react";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import PlayerItem from "../components/Jugadores";
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Dimensions, FlatList } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { getAllPlayers } from '../../lib/fetchplayers'
import { fetchPartidoById } from '../../lib/fetchmatch'
import { fetchEquipoById } from '../../lib/fetchteams'
import { fetchNotesXMatch } from '../../lib/fetchstats'
import { notesXMatch } from '../../lib/fetchnotes'
const { width: widthScreen } = Dimensions.get('window');
const { height: heightScreen } = Dimensions.get('window');

const App = ({ route, navigation }) => {
    const [showAllPlayers, setShowAllPlayers] = useState(false);
    const [players, setJugadores] = useState([])
    const [match, setPartido] = useState([])
    const [equipo1, setEquipo1] = useState([])
    const [equipo2, setEquipo2] = useState([])
    const { idequipo1, idequipo2, id_partido } = route.params 
    const [stat, setStats] = useState({});


    const fillImage = (players) => {
        players.forEach(player => {
            if(player.foto == null){
                player.foto = '../images/perfilDefault.png'
            }
        });
        return players
    }

    const getImageSource = (foto) => {
        switch (foto) {
          case '../images/football.png':
            return require('../images/football.png');
          case '../images/cesto.png':
            return require('../images/cesto.png');
          case '../images/basque.png':
            return require('../images/basque.png');
          default:
            return require('../images/log.png');
        }
    };

    useEffect(() =>{
        const fetchData = async () => {
            try{
                const jugadores = await getAllPlayers(idequipo1)
                const plays = fillImage(jugadores)
                setJugadores(plays)
                const partido = await fetchPartidoById(id_partido)
                setPartido(partido)
                const equipo1 = await fetchEquipoById(idequipo1)
                setEquipo1(equipo1)
                const equipo2 = await fetchEquipoById(idequipo2)
                setEquipo1(equipo2)
                const notes = await notesXMatch(partido[0].id_deporte);
                const statsResults = {};
                for (const note of notes) {
                const count = await fetchNotesXMatch(partido[0].id_partido, note.id_accion);
                statsResults[note.id_accion] = {
                    count,
                    description: note.descripcion, // Guardamos la descripción de la acción.
                };
                }
                setStats(statsResults);
                }catch(error){
                    console.log(error)
                }
        }
        fetchData()
    })


    const chartConfig = {
        backgroundGradientFrom: "#FAD77F",
        backgroundGradientTo: "#FAD77F",   
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        barPercentage: 0.6,
        useShadowColorFromDataset: false,
        decimalPlaces: 0,
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
        },
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        }
    };

    const initialPlayerCount = 4;
    const playersToShow = showAllPlayers ? players : players.slice(0, initialPlayerCount);

    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Header />
                <View style={styles.topBar}>
                    {match[0] && typeof match[0].duracion !== null && typeof match[0].puntosEqLocal !== null && typeof match[0].puntosEqOf !== null? (
                <>
                    <Text style={styles.time}> {match[0].duracion} mins {'\n'} Tiempos 2</Text>
                    <Text style={styles.period}>  {match[0].puntosEqLocal} / {match[0].puntosEqOf}</Text>
                    <Text style={styles.match}>{match[0].name}</Text>
                </>
                ) : (
                    <Text style={styles.message}>Todavía no se han cargado los datos del partido.</Text>
                )}
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
                        <Image source={getImageSource(equipo1.foto)} style={styles.log} />
                        <Text style={styles.vs}>VS</Text>
                        <Image source={getImageSource(equipo2.foto)} style={styles.log} />
                    </View>
                    <View style={styles.chartContainer}>
                    {Object.entries(stat).map(([idAccion, data]) => (
                    <View key={idAccion} style={styles.chartItem}>
                        <Text style={styles.chartLabel}>Acción: {data.description}</Text>
                        <BarChart
                            data={{
                                labels: ['Equipo 1', 'Equipo 2'],
                                datasets: [
                                 {
                                    data: [data.count, 0], // Mostramos el conteo como un único valor.
                                },
                                ],
                            }}
                            width={widthScreen * 0.4}
                            height={180}
                            chartConfig={chartConfig}
                            style={styles.charts}
                            fromZero={true}
                            withVerticalLines={false}
                            withHorizontalLines={false}
                            withInnerLines={false}
                            withOuterLines={false}
                            />
                        </View>
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
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    chartItem: {
        marginVertical: 10,
        alignItems: 'center',
    },
    chartLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    charts: {
        borderRadius: 10,
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
    message: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginVertical: 10,
        marginTop: 20
    },
      
});

export default App;