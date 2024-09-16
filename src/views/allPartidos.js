import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import { View, Image, Dimensions, StyleSheet, ScrollView, Button, TouchableOpacity, Text } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');
import Partido from '../components/Partido';
import { fetchAllpartidos } from '../../lib/fetchmatch'
const AllEquipo = ({ navigation }) => {
  const [partidos, setPartidos] = useState([])

  const fillteams = async (data) => {
    try {
      const updatedPartidos = await Promise.all(data.map(async partido => {
        if (partido.foto === null) {
          switch (partido.id_deporte) {
            case 1:
              partido.foto = '../images/football.png';
              break;
            case 2:
              partido.foto = '../images/cesto.png';
              break;
            case 3:
              partido.foto = '../images/basque.png';
              break;
            default:
              console.log("Error setup foto");
              break;
          }
        } 
        return partido;
      }));
      setPartidos(updatedPartidos);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() =>{
    const fetchData = async () => {
      try{
        const data = await fetchAllpartidos()
        fillteams(data)
      }catch(error){
        console.log(error)
      }
    }
    fetchData()
  })



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
              <Partido numero={partidos.id_partido} fecha={partidos.fecha} puntos={partidos.puntosEqLocal + '/' + partidos.puntosEqOf} equipos={partidos.name} />
            </View>
          ))}
        </View>
        <TouchableOpacity  style={styles.addButton}
          onPress={() => navigation.navigate('crearPartido')}
        >
          <Text style={{color:'#FFFFFF', fontWeight: 'bold'}}>Añadir Partido</Text>
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
