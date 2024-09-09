import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');


const getImageSource = (foto) => {
  switch (foto) {
    case '../images/perfilDefault.png':
      return require('../images/perfilDefault.png');
    default:
      return require('../images/perfilDefault.png');
    }
};

const PlayerItem = ({ player }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={getImageSource(player.foto)} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{player.nombre}</Text>
        <Text style={styles.number}>Número: {player.numero}</Text>
        <Text style={styles.value}>Val: {player.rol}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 4,
    marginTop: 4,
    borderRadius: 10,
    width: screenWidth * 0.90
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 25,
    marginTop: 5
  },
  info: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
});

export default PlayerItem;
