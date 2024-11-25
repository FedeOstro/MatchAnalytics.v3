import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Dimensions, Alert, TouchableOpacity, Modal, ScrollView, Platform, Vibration } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Header from '../components/Header';
import PlayerItem from '../components/Jugadores'; 
import { supabase } from '../../lib/supabase';
import { insertTeam } from '../../lib/fetchteams';
import { insertPlayers } from '../../lib/fetchplayers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: screenHeight } = Dimensions.get('window');
const { width: screenWidth } = Dimensions.get('window');

const CrearEquipo = ({ navigation }) => {
  const [equipo, setEquipo] = useState('');
  const [deporte, setDeporte] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenNombre, setImagenNombre] = useState('');
  const [listDep, setlistDep] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [posicion, setPosicion] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [nombreJugador, setNombreJugador] = useState('');
  const [numeroJugador, setNumeroJugador] = useState('');
  const [rolJugador, setRolJugador] = useState('');
  const [ftJugador, setFotoJugador] = useState(null);
  const [fotoNombreJugador, setFotoNombreJugador] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (status !== 'granted') {
          alert('Se necesita permiso para acceder a las fotos.');
        }
      }
    })();
  }, []);

  const handleSports = async () => {
    const { data, error } = await supabase.from('deportes').select('*');
    if (data) {
      setlistDep(data);
    } else {
      console.log(error);
    }
  };

  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        setImagen(result.uri);
        const fileName = result.uri.split('/').pop();
        setImagenNombre(fileName);
      }
    } catch (error) {
      Vibration.vibrate(500)
      Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen.');
    }
  };

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
      Vibration.vibrate(500)
      Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen.');
    }
  };

  const handleButtonPress = async () => {
    if (!equipo || !deporte) {
      Vibration.vibrate(500)
      Alert.alert('Advertencia', 'Por favor, completa todos los campos correctamente antes de continuar.');
      return;
    }
    const user = await AsyncStorage.getItem('user')
    const userParsed = JSON.parse(user)
    const idusuario = userParsed.id;
    if (imagen === null) {
      const newimagen = await fillImage(deporte);
      console.log(newimagen)
      const id = await insertTeam(equipo, newimagen, deporte, idusuario);
      await insertPlayers(id, jugadores)
    } else {
      const id = await insertTeam(equipo, imagen, deporte, idusuario);
      await insertPlayers(id, jugadores)
    }
    Vibration.vibrate(500)
    Alert.alert('Equipo creado', '¡Tu equipo ha sido creado exitosamente!', [
      { text: 'OK', onPress: () => navigation.navigate('Home') }
    ]);
  };

  const fillImage = async (data) => {
    let foto = "" 
    try {
        switch (data) {
        case 1:
          foto = '../images/football.png';
          break;
        case 2:
          foto = '../images/cesto.png';
          break;
        case 3:
          foto = '../images/basque.png';
          break;
        default:
          console.log("Error setup foto");
          break;
        }
        return foto
    } catch (error) {
      console.log(error);
    }
  }



  const handleAddPlayer = () => { 
    if (!ftJugador){
      const ft = "../images/perfilDefault.png"
      const newPlayer = {
        nombre: nombre,
        numero: numero,
        rol: posicion,
        foto: ft
      };
      setJugadores([...jugadores, newPlayer]);
      setModalVisible(false);
      setNombreJugador('');
      setNumeroJugador('');
      setRolJugador('');
      setFotoJugador(null);
    }else{
      const newPlayer = {
        nombre: nombre,
        numero: numero,
        rol: posicion,
        foto: ftJugador
      };
      setJugadores([...jugadores, newPlayer]);
      setModalVisible(false);
      setNombreJugador('');
      setNumeroJugador('');
      setRolJugador('');
      setFotoJugador(null);
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
    setModalVisible(false);
  };

  handleSports();

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.flec}>
          <Image source={require('../images/flecha.png')} />
        </View>
      </TouchableOpacity>

      <Image source={require('../images/barCrearEquipo.png')} style={styles.bar} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            value={equipo}
            onChangeText={setEquipo}
            placeholder="Nombre del equipo"
          />
          <TouchableOpacity onPress={handleImagePick}>
            <TextInput
              style={styles.input}
              value={imagenNombre ? imagenNombre : 'Añadir foto...'}
              editable={false}
            />
          </TouchableOpacity>
          {imagen && <Image source={{ uri: imagen }} style={styles.imagePreview} />}
          <Picker
            selectedValue={deporte}
            onValueChange={setDeporte}
            style={styles.picker}
          >
            <Picker.Item label="Elige un deporte" value="" />
            {listDep.map(dep => (
              <Picker.Item label={dep.nombre} value={dep.id_deporte} key={dep.id_deporte} />
            ))}
          </Picker>
          <View style={styles.buttonContainer}>
            <Button title="Aceptar" onPress={handleButtonPress} color="#007BFF" />
          </View>

          <Text style={styles.jugadoresTitle}>Jugadores</Text>
          <View style={styles.playerListContainer}>
            {jugadores.map((player, index) => (
              <PlayerItem key={index} player={player} />
            ))}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addPlayerButtonContainer}>
              <Text style={styles.addPlayerButtonText}>Añadir Jugador</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Image
              source={require('../images/barJugadorNew.png')}
              style={styles.bar2}
              resizeMode="stretch"
            />
            <View contentContainerStyle={styles.modalContent}>
              {/* Modal contenido */}
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
                {/* Formulario jugador */}
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
                {/* Botones */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffcc66',
  },
  flec: {
    margin: 10,
    marginLeft: 20,
  },
  bar: {
    width: '100%',
    height: 50,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40, // Añade un padding inferior para permitir el scroll completo
  },
  formContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  jugadoresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  playerListContainer: {
    alignItems: 'center',
  },
  addPlayerButtonContainer: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addPlayerButtonText: {
    color: '#fff',
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
  bar2: {
    width: '100%',
    height: 50,
  },
  modalContent: {
    flexGrow: 1,
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
    margin: 20
  }
});


export default CrearEquipo;
