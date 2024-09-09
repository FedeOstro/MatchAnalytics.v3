import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import { View, Image, Dimensions, StyleSheet, ScrollView, Button, TouchableOpacity, Text } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');
import Equipo from '../components/Equipo';
import { fetchAllEquipos } from '../../lib/fetchteams'

const AllEquipo = ({ navigation }) => {
  const [equipos, setEquipos] = useState([])

  const fillImage = (data) => {
    try {
      const updatedEquipos = data.map(equipo => {
        if (equipo.foto === null) {
          switch (equipo.id_deporte) {
            case 1:
              equipo.foto = '../images/football.png';
              break;
            case 2:
              equipo.foto = '../images/cesto.png';
              break;
            case 3:
              equipo.foto = '../images/basque.png';
              break;
            default:
              console.log("Error setup foto");
              break;
          }
        } else {
          console.log("Foto puesta");
        }
        return equipo; 
      });
      setEquipos(updatedEquipos); 
    } catch (error) {
      console.log(error);
    }
  };

  const getImageSource = (foto) => {
    switch (foto) {
      case '../images/football.png':
        return require('../images/football.png');
      case '../images/cesto.png':
        return require('../images/cesto.png');
      case '../images/basque.png':
        return require('../images/basque.png');
      default:
        return require('../images/log.png');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try{
        const data = await fetchAllEquipos()
        fillImage(data)
      }catch(error){
        console.log(error)
      }
    }
    fetchData()
  }, []);

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
              <Equipo nombre={equipo.nombre} press={equipo.press} deporte={equipo.deporte} imageSource={getImageSource(equipo.foto)}/>
            </View>
          ))}
        </View>
        <TouchableOpacity  style={styles.addButton}
          onPress={() => navigation.navigate('crearEquipo')}
        >
          <Text style={{color:'#FFFFFF', fontWeight: 'bold'}}>Añadir Equipo</Text>
        </TouchableOpacity>
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
    marginHorizontal: 10,
    alignItems: 'center'
  },
});

export default AllEquipo;
