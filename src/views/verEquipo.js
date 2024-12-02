import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, FlatList, TextInput, Modal, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import PlayerItem from '../components/Jugadores';
import Partido from '../components/Partido';
import Header from '../components/Header';
import { fetchEquipoById, fetchNameSport } from '../../lib/fetchteams'
import { fetchPartodoByTeam } from '../../lib/fetchmatch'
import { getAllPlayers, insertPlayers } from '../../lib/fetchplayers'

const { height: screenHeight } = Dimensions.get('window');
const { width: screenWidth } = Dimensions.get('window');

const TeamScreen = ({ route, navigation }) => {
    const { idEquipo } = route.params || {};
    const [partidos, setPartidos] = useState([])
    const [players, setPlayers] = useState([])
    const [showAllPartidos, setShowAllPartidos] = useState(false);
    const [equipo, setEquipo] = useState([])
    const [deporte, setDeporte] = useState('')
    const [showAllPlayers, setShowAllPlayers] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [nombre, setNombre] = useState('');
    const [numero, setNumero] = useState('');
    const [posicion, setPosicion] = useState('');
    const [ftJugador, setFotoJugador] = useState(null);
    const [fotoNombreJugador, setFotoNombreJugador] = useState('');

    const fillImage = (players) => {
        players.forEach(player => {
            if(player.foto == null){
                player.foto = '../images/perfilDefault.png'
            }
        });
        return players
    }

    useEffect(() => {
        const fetchData = async () => {
          try{
            const data2 = await fetchPartodoByTeam(idEquipo)
            setPartidos(data2)
            const play = await getAllPlayers(idEquipo)
            const players = await fillImage(play)
            setPlayers(players)
            // const team = await fetchEquipoById(idEquipo)
            // console.log(team)
            // setEquipo(team)
            // const depor = await fetchNameSport(team[0].id_deporte)
            // console.log(depor)
            // setDeporte(depor)
          }catch(error){
            console.log(error)
          }
        }
        fetchData()
    }, []);

    const handlePlayerImagePick = async () => {
        try {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFotoJugador(result.uri);
            const fileName = result.uri.split('/').pop();
            setFotoNombreJugador(fileName);
        }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen.');
        }
    };

    const handleAddPlayer = async () => { 
        try {
            let playerFoto = ftJugador;
            if (!playerFoto) {
                playerFoto = "../images/perfilDefault.png";
            }

            const newPlayer = {
                nombre: nombre,
                numero: numero,
                rol: posicion,
                foto: playerFoto
            };

            // Insert player to database
            await insertPlayers(idEquipo, [newPlayer]);

            // Refresh players list
            const play = await getAllPlayers(idEquipo);
            const updatedPlayers = fillImage(play);
            setPlayers(updatedPlayers);

            // Reset modal state
            setModalVisible(false);
            setNombre('');
            setNumero('');
            setPosicion('');
            setFotoJugador(null);
            setFotoNombreJugador('');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'No se pudo añadir el jugador');
        }
    };
      
    const handleAceptar = () => {
       const nombreValido = /^[a-zA-Z\s]+$/.test(nombre);
       const numeroValido = /^[0-9]+$/.test(numero);
       const rolValido = /^[a-zA-Z\s]+$/.test(posicion);
       if (!nombreValido || !numeroValido || !rolValido) {
        let errorMessage = 'Por favor completa todos los campos correctamente:\n';
    
        if (!nombreValido) {
           errorMessage += '- El nombre solo puede contener letras y espacios.\n';
        }
        if (!numeroValido) {
          errorMessage += '- El número debe ser numérico.\n';
        }
        if (!rolValido) {
          errorMessage += '- El rol solo puede contener letras y espacios.';
        }
        Alert.alert('Error de validación', errorMessage);
        return;
        }
        handleAddPlayer();
    };
    
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
                        <Text style={styles.teamName}></Text>
                        <Text style={styles.sportType}></Text>
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
                            <>
                                {!showAllPlayers && (
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => setShowAllPlayers(true)}
                                    >
                                        <Text style={styles.buttonText}>Ver más jugadores</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity 
                                    style={styles.addPlayerButton}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Text style={styles.addPlayerButtonText}>Añadir Jugador</Text>
                                </TouchableOpacity>
                            </>
                        }
                    />
                </View>
            </View>

            {/* Modal for adding player */}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Image
                            source={require('../images/barJugadorNew.png')}
                            style={styles.bar2}
                            resizeMode="stretch"
                        />
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={handlePlayerImagePick} style={styles.imagePickerContainer}>
                                <Image
                                    source={ftJugador ? { uri: ftJugador } : require('../images/perfilDefault.png')}
                                    style={styles.imagePlaceholder}
                                />
                                <Text style={styles.imagePickerText}>
                                    {fotoNombreJugador ? fotoNombreJugador : 'Añade foto..'}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.formjugador}>
                                <TextInput
                                    style={styles.input}
                                    value={nombre}
                                    onChangeText={setNombre}
                                    placeholder="Nombre"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={numero}
                                    onChangeText={setNumero}
                                    placeholder="Número"
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    value={posicion}
                                    onChangeText={setPosicion}
                                    placeholder="Posición / Rol"
                                />
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.acceptButton,
                                            !nombre || !numero || !posicion ? styles.disabledButton : null,
                                        ]}
                                        onPress={handleAceptar}
                                        disabled={!nombre || !numero || !posicion}
                                    >
                                        <Text style={styles.acceptButtonText}>Aceptar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Cerrar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
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
    addPlayerButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    addPlayerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: screenWidth * 0.8,
        height: screenHeight * 0.6,
        backgroundColor: '#ffcc66',
        borderRadius: 10,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    bar2: {
        width: '100%',
        height: 50,
    },
    imagePickerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    imagePickerText: {
        color: 'gray',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 10,
    },
    closeButton: {
        flex: 1,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    formjugador: {
        flex: 1,
    }
});

export default TeamScreen;
