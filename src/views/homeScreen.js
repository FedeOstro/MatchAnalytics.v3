import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, Button, Dimensions, TouchableOpacity} from 'react-native';
import { fetchAllEquipos } from '../../lib/fetchteams'
import { fetch3partidos } from '../../lib/fetchmatch'
import Equipo from '../components/Equipo';
import Partido from '../components/Partido';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RectButton } from 'react-native-gesture-handler';
const { width: screenWidth } = Dimensions.get('window');


const HomeScreen = ({navigation}) => {
  const [equipos, setEquipos] = useState([]);
  const [partido, setPartidos] = useState([])
  const [usuario, setUser] = useState([])
  const transparentColor = 'rgba(255, 0, 0, 0)'
  
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
        }
        return equipo; 
      });
      setEquipos(updatedEquipos); 
    } catch (error) {
      console.log(error);
    }
  };

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
        const storedUser = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(storedUser); 
        setUser(parsedUser)
        const data = await fetchAllEquipos()
        fillImage(data)
        const data2 = await fetch3partidos()
        fillteams(data2)
      }catch(error){
        console.log(error)
      }
    }
    fetchData()
  },[]);

  return (
      <View style={styles.container}>
        <View style={styles.header1}>
          <Header></Header>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.flex}>
              <Text style={styles.welcome}>Bienvenido {usuario.username}!!</Text>
            </View>
          <View style={styles.bar}>
            <Image source={require('../images/BarraEquiposbarEquipo.png')} style={styles.barEquip}/>
          </View>
          <View style={styles.equiposContainer}>
            {equipos.slice(0,3).map(equipo =>(
              <Equipo 
              nombre={equipo.nombre} 
              press={() => navigation.navigate('verEquipo', { idEquipo: equipo.id_equipo })} 
              deporte={equipo.deporte} 
              imageSource={getImageSource(equipo.foto)} 
            />
            ))}
          </View>
              <TouchableOpacity  style={styles.addButton}
                onPress={() => navigation.navigate('crearEquipo')}
              >
                <Text style={{color:'#FFFFFF', fontWeight: 'bold'}}>Añadir Equipo</Text>
              </TouchableOpacity>
            <View >
                <Button style={styles.vermas}
                  color={'#FF002E'}
                  title='Ver mas'
                  onPress={() => navigation.navigate('allEquipo')}
                />
            </View>
            <View style={styles.bar}>
              <Image source={require('../images/BarraPartidosbarPartido.png')} style={styles.barEquip}/>
            </View>
          <View style={styles.partidosContainer}>
            {partido.slice(0,3).map(partido =>(
              <Partido numero={partido.id_partido} fecha={partido.fecha} puntos={partido.puntosEqLocal + '/' + partido.puntosEqOf} equipos={partido.name} idequipo1={partido.idequipo1} idequipo2={partido.idequipo2} id_partido={partido.id_partido}/>
            ))}
          </View>
          <View style={styles.contButtons}>
            <View style={styles.buttons}>
              <TouchableOpacity  style={styles.addButton}
                onPress={() => navigation.navigate('ConfigAnot')}
              >
                <Text style={{color:'#FFFFFF', fontWeight: 'bold'}}>Anotar partido</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={styles.addButton}
                onPress={() => navigation.navigate('crearPartido')}
              >
                <Text style={{color:'#FFFFFF', fontWeight: 'bold'}}>Añadir Partido</Text>
              </TouchableOpacity>
          </View>
    </View>
          <View style={styles.vermas}>
                <Button style={styles.vermas}
                  color={'#FF002E'}
                  title='Ver mas'
                  onPress={() => navigation.navigate('AllPartidos')}
                />
            </View>
        </ScrollView>
      </View>
  );
}  



const styles = StyleSheet.create({
  flex: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    padding: 10,
    width: screenWidth
  },
  welcome: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  barEquip: {
    flex: 1, 
    backgroundColor: 'lightblue',
    padding: 10,
    width: screenWidth,
    height: 34,
    margin: 20
  },
  bar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth
  },
  container: {
    flex: 1,
    backgroundColor: '#ffcc66',
  },
  logo: {
    width: 60,
    height: 60,
  },
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  equiposContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  addButton: {
    backgroundColor: '#2E98FA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  contButtons: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addText: {
    color: 'white',
    fontWeight: 'bold',
  },
  partidosContainer: {
    width: '100%',
    marginTop: 10,
  },
  header1: {
    height: 70,
    
  }
});

export default HomeScreen

