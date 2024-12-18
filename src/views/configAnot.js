import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Dimensions, Alert, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../components/Header';
import { fetchAllpartidos } from '../../lib/fetchmatch';

const { width: screenWidth } = Dimensions.get('window');

const ConfigAnot = ({ navigation }) => {
  const [selectedPartidoIndex, setPartidoIndex] = useState(null);
  const [duracion, setDuracion] = useState('');
  const [entretiempo, setEntretiempo] = useState('');
  const [tiempos, setTiempos] = useState('');
  const [Partidos, setPartidos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllpartidos();
        setPartidos(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []); // Solo se ejecuta una vez

  const handleButtonPress = () => {
    if (
      selectedPartidoIndex !== null &&
      entretiempo !== '' &&
      tiempos !== '' &&
      duracion !== '' &&
      Number(duracion) > 1 &&
      Number(entretiempo) >= 0 &&
      Number(tiempos) > 0
    ) {
      const partido = Partidos.find((p) => p.id_partido === Number(selectedPartidoIndex));

      if (partido) {
        navigation.navigate('anotarPartido', {
          partido: partido,
          duracion: duracion,
          entretiempo: entretiempo,
          tiempos: tiempos,
        });
      } else {
        Alert.alert('Error', 'No se pudo encontrar el partido seleccionado.');
      }
    } else {
      Alert.alert(
        'Advertencia',
        'Por favor, completa todos los campos correctamente antes de continuar. Asegúrate de que ningún campo tenga un valor de 1 o menor a 0.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.flec}>
          <Image source={require('../images/flecha.png')} />
        </View>
      </TouchableOpacity>
      <Image source={require('../images/barraConfig.png')} style={styles.barEquip} />
      <View style={styles.formWrapper}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Picker
              selectedValue={selectedPartidoIndex}
              onValueChange={(itemValue) => {
                setPartidoIndex(itemValue);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona equipo" value={null} />
              {Partidos.map((partido) => (
                <Picker.Item key={partido.id_partido} label={partido.name} value={partido.id_partido.toString()} />
              ))}
            </Picker>
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={duracion}
              onChangeText={setDuracion}
              placeholder="Duracion"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={entretiempo}
              onChangeText={setEntretiempo}
              placeholder="Entretiempo"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={tiempos}
              onChangeText={setTiempos}
              placeholder="Cantidad de tiempos"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="EMPEZAR" onPress={handleButtonPress} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barEquip: {
    width: screenWidth,
  },
  flec: {
    marginTop: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffcc66',
  },
  formWrapper: {
    marginTop: 30,
    flex: 1,
    alignItems: 'center',
  },
  formContainer: {
    width: screenWidth * 0.8,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
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
  buttonContainer: {
    marginTop: 20,
  },
});

export default ConfigAnot;
