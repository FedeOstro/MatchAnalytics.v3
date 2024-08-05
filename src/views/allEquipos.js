import React from 'react';
import Header from '../components/Header';
import { View, Image, Dimensions, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');
import Equipo from '../components/Equipo';

const AllEquipo = ({ navigation }) => {
  const equipos = [
    { nombre: "Equipo 3", press: () => navigation.navigate('verEquipo'), deporte: "football" },
    { nombre: "Equipo 1", press: () => navigation.navigate('verEquipo'), deporte: "basquet" },
    { nombre: "Equipo 2", press: () => navigation.navigate('verEquipo'), deporte: "cestoball" },
    { nombre: "Equipo 4", press: () => navigation.navigate('verEquipo'), deporte: "football" }
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
          <Image source={require('../images/BarraEquiposbarEquipo.png')} style={styles.barEquip} />
        </View>
        <View style={styles.equiposContainer}>
          {equipos.map((equipo, index) => (
            <View key={index} style={styles.equipoWrapper}>
              <Equipo nombre={equipo.nombre} press={equipo.press} deporte={equipo.deporte} />
            </View>
          ))}
        </View>
        <View style={styles.addButton}>
              <Button 
                title="Añadir Equipo"
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
