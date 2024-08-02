import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Equipo = ({ nombre, press, deporte }) => {
  let imageSource;

  if (deporte === 'football') {
    imageSource = require('../images/football.png');
  } else if (deporte === 'basquet') {
    imageSource = require('../images/basque.png');
  } else if (deporte === 'cestoball') {
    imageSource = require('../images/cesto.png');
  }
  
  return (
    <View style={styles.equipoContainer}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.nombre}>{nombre}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Ver más"
          onPress={press}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  equipoContainer: {
    alignItems: 'center',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    width: 120,
    margin:3
  },
  image: {
    width: 50,
    height: 50,
  },
  nombre: {
    fontSize: 16,
    marginVertical: 4,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default Equipo;
