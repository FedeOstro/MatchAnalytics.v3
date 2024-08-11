import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Dimensions, Alert, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Header from '../components/Header';
import PlayerItem from '../components/Jugadores'; // Asegúrate de que este componente existe

const { width: screenWidth } = Dimensions.get('window');

const CrearEquipo = ({ navigation }) => {
  const [equipo, setEquipo] = useState('');
  const [deporte, setDeporte] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenNombre, setImagenNombre] = useState('');
  const [jugadores, setJugadores] = useState([
    { id: '1', name: 'Juan Gutierrez', number: 1, rol: 2, image: 'https://via.placeholder.com/50' },
    { id: '2', name: 'Dante Verdi', number: 2, rol: 4, image: 'https://via.placeholder.com/50' },
    { id: '3', name: 'Julian Huewman', number: 3, rol: 5, image: 'https://via.placeholder.com/50' },
  ]);

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

  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImagen(result.uri);
        const fileName = result.uri.split('/').pop();
        setImagenNombre(fileName);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen.');
    }
  };

  const handleButtonPress = () => {
    if (!equipo || !deporte) {
      Alert.alert('Advertencia', 'Por favor, completa todos los campos correctamente antes de continuar.');
      return;
    }

    Alert.alert(
      'Equipo creado',
      '¡Tu equipo ha sido creado exitosamente!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header></Header>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.flec}>
          <Image source={require('../images/flecha.png')} />
        </View>
      </TouchableOpacity>
      <ScrollView>
        <Image source={require('../images/barStats.png')} style={styles.bar} />
        <View style={styles.formWrapper}>
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
              <Picker.Item label="Football" value="Football" />
              <Picker.Item label="Básquet" value="Básquet" />
              <Picker.Item label="Hockey" value="Hockey" />
            </Picker>
            <View style={styles.buttonContainer}>
              <Button title="Aceptar" onPress={handleButtonPress} color="#007BFF" />
            </View>
          </View>

          <Text style={styles.jugadoresTitle}>Jugadores</Text>
          <View style={styles.playerListContainer}>
            {jugadores.map(player => (
              <PlayerItem key={player.id} player={player} />
            ))}
            <TouchableOpacity onPress={() => {/* Funcionalidad para añadir nuevo jugador */}} style={styles.addPlayerButtonContainer}>
              <Text style={styles.addPlayerButtonText}>Añadir Nuevo</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginTop: 5,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  formContainer: {
    width: screenWidth * 0.8,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    resizeMode: 'contain',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  jugadoresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start',
    marginLeft: 15
  },
  playerListContainer: {
    marginTop: 10,
  },
  addPlayerButtonContainer: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  addPlayerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CrearEquipo;
