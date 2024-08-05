import React from 'react';
import Header from '../components/Header';
import { View, Image, Dimensions, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');
import Partido from '../components/Partido';

const AllEquipo = ({ navigation }) => {
  const partidos = [
    { numero:"1", fecha:"24/4", puntos:"34-12", equipos:"Equipo 3 vs As.Ingenieros" },
    { numero:"2", fecha:"20/3", puntos:"3-1", equipos:"Equipo 1 vs Dep.Tortugas" },
    { numero:"3", fecha:"12/2", puntos:"92-80", equipos:"Equipo 2 vs Dep.Puerrreydon" },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity onPress={() => navigation.goBack()}>
       <View style={styles.flec}>
          <Image source={require('../images/flecha.png')}/>
        </View>
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.bar}>
          <Image source={require('../images/BarraPartidosbarPartido.png')} style={styles.barEquip} />
        </View>
        <View style={styles.equiposContainer}>
          {partidos.map((partidos, index) => (
            <View key={index} style={styles.equipoWrapper}>
              <Partido numero={partidos.nombre} fecha={partidos.fecha} puntos={partidos.puntos} equipos={partidos.equipos} />
            </View>
          ))}
        </View>
        <View style={styles.addButton}>
              <Button 
                title="Añadir Partido"
              />
            </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffcc66',
  },
  flec: {
    marginTop: 5
  },
  barEquip: {
    flex: 1,
    backgroundColor: 'lightblue',
    padding: 10,
    width: screenWidth,
    height: 33,
    margin: 10
  },
  bar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth,
  },
  equiposContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginLeft: 17,
  },
  equipoWrapper: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#2E98FA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
});

export default AllEquipo;
