import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Dimensions, Alert, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Header from '../components/Header';
import PlayerItem from '../components/Jugadores'; // Asegúrate de que este componente existe
import { supabase } from '../../lib/supabase';
import { date } from 'drizzle-orm/mysql-core';
import { insertTeam } from '../../lib/fetchteams';

const { width: screenWidth } = Dimensions.get('window');

const CrearEquipo = ({ navigation }) => {
  const [equipo, setEquipo] = useState('');
  const [deporte, setDeporte] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenNombre, setImagenNombre] = useState('');
  const [listDep, setlistDep] = useState([])
  const [jugadores, setJugadores] = useState([]);

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
    const { data, error } = await supabase.from('deportes').select('*')
    if(data){
      setlistDep(data)
    }else{
      console.log(error)
    }
  }

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

  const handleButtonPress = async () => {
    if (!equipo || !deporte) {
      Alert.alert('Advertencia', 'Por favor, completa todos los campos correctamente antes de continuar.');
      return;
    }
    const idusuario = 1
    insertTeam(equipo, foto, deporte, idusuario)
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
  handleSports();
  return (
    <View style={styles.container}>
      <Header></Header>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.flec}>
          <Image source={require('../images/flecha.png')} />
        </View>
      </TouchableOpacity>
      <ScrollView>
        <Image source={require('../images/barCrearEquipo.png')} style={styles.bar} />
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
              {listDep.map(dep => (
                <Picker.Item label={dep.nombre} value={dep.id_deporte} />
              ))}
              
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
            <View style={styles.buttonContainer2}>
              <Button title="Aceptar" onPress={handleButtonPress} color="#007BFF" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: screenWidth
  },
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
  buttonContainer2: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    width: screenWidth * 0.9
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
    width: screenWidth * 0.8,
    alignItems: 'center'
  },
});

export default CrearEquipo;
