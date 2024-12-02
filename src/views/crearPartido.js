import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Dimensions, Alert, TouchableOpacity, Platform, Vibration } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Header from '../components/Header';
import { insertMatch } from '../../lib/fetchmatch';
import { eq } from 'drizzle-orm';
import { fetchAllEquipos, fetchSport, insertTeam, fetchEquipoById } from '../../lib/fetchteams';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: screenWidth } = Dimensions.get('window');

const ConfigPartido = ({ navigation }) => {
  const [equipo, setEquipo] = useState('');
  const [oponente, setOponente] = useState('');
  const [imagenOponente, setImagenOponente] = useState(null);
  const [imagenOponenteNombre, setImagenOponenteNombre] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [equipos, setEquipos] = useState([])

  useEffect(() => {
    const fetchdata = async () => {
      const teams = await fetchAllEquipos()
      setEquipos(teams)
    }
    fetchdata()
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
        if (result.uri) {
          setImagenOponente(result.uri);
          const fileName = result.uri.split('/').pop();
          setImagenOponenteNombre(fileName);
        } else {
          Alert.alert('Error', 'No se pudo obtener la URI de la imagen seleccionada.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al seleccionar la imagen.');
    }
  };

  const handleButtonPress = async () => {
    if (equipo && oponente && dia && mes && ano) {
      const diaNum = parseInt(dia, 10);
      const mesNum = parseInt(mes, 10);
      const anoNum = parseInt(ano, 10);

      if (isNaN(diaNum) || isNaN(mesNum) || isNaN(anoNum)) {
        Vibration.vibrate(500)
        Alert.alert('Advertencia', 'Día, mes y año deben ser números válidos.');
        return;
      }

      if (mesNum < 1 || mesNum > 12) {
        Vibration.vibrate(500)
        Alert.alert('Advertencia', 'El mes debe estar entre 1 y 12.');
        return;
      }

      if (diaNum < 1 || diaNum > 31) {
        Vibration.vibrate(500)
        Alert.alert('Advertencia', 'El día debe estar entre 1 y 31.');
        return;
      }

      if (anoNum < 1) {
        Vibration.vibrate(500)
        Alert.alert('Advertencia', 'El año debe ser mayor o igual a 1.');
        return;
      }

      const fecha = `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano.padStart(2, '0')}`;
      const deporte = await fetchSport(equipo)
      const name = equipo + " vs " + oponente
      console.log(name)
      console.log(deporte[0].id_deporte)
      const foto = fillImage(deporte[0].id_equipo)
      const user = await AsyncStorage.getItem('user')
      const userParsed = JSON.parse(user)
      const idusuario = userParsed.id;
      const idOp = await insertTeam(oponente, foto, deporte[0].id_deporte, idusuario)
      const data = await insertMatch(deporte[0].id_equipo, idOp, fecha, name, deporte[0].id_deporte)
      Vibration.vibrate(500)
      Alert.alert(
        'Partido configurado',
        '¡Tu partido ha sido configurado exitosamente!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } else {
      Vibration.vibrate(500)
      Alert.alert('Advertencia', 'Por favor, completa todos los campos correctamente antes de continuar.');
    }
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

  return (
    <View style={styles.container}>
      <Header></Header>
      <TouchableOpacity onPress={() => navigation.goBack()}>
       <View style={styles.flec}>
          <Image source={require('../images/flecha.png')}/>
        </View>
      </TouchableOpacity>
      <Image source={require('../images/barPartido.png')} style={styles.headerImage} />
      <View style={styles.formWrapper}>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Picker
              selectedValue={equipo}
              onValueChange={setEquipo}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona equipo" value="" />
               {equipos.map((equipo) => (
                  <Picker.Item key={equipo.id} label={equipo.nombre} value={equipo.nombre} />
              ))}
            </Picker>
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={oponente}
              onChangeText={setOponente}
              placeholder="Equipo oponente..."
            />
          </View>
          <View style={styles.inputGroup}>
            <TouchableOpacity onPress={handleImagePick}>
              <TextInput
                style={styles.input}
                value={imagenOponenteNombre ? imagenOponenteNombre : 'Imagen del oponente... (opcional)'}
                placeholder="Imagen del oponente... (opcional)"
                editable={false}
              />
            </TouchableOpacity>
            {imagenOponente && (
              <Image source={{ uri: imagenOponente }} style={styles.imagePreview} />
            )}
          </View>
          <View style={styles.inputGroup}>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.dateInput}
                value={dia}
                onChangeText={setDia}
                placeholder="dd"
                keyboardType="numeric"
                maxLength={2}
              />
              <Text>/</Text>
              <TextInput
                style={styles.dateInput}
                value={mes}
                onChangeText={setMes}
                placeholder="mm"
                keyboardType="numeric"
                maxLength={2}
              />
              <Text>/</Text>
              <TextInput
                style={styles.dateInput}
                value={ano}
                onChangeText={setAno}
                placeholder="yy"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="GUARDAR" onPress={handleButtonPress} color="#007BFF" />
          </View>
        </View>
      </View>
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
  headerImage: {
    width: screenWidth,
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
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInput: {
    height: 40,
    width: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    resizeMode: 'contain',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default ConfigPartido;
