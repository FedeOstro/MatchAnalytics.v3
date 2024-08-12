import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, Button, Dimensions } from 'react-native';
import { supabase } from '../../lib/supabase'
import Equipo from '../components/Equipo';
import Partido from '../components/Partido';
import Header from '../components/Header';
import { RectButton } from 'react-native-gesture-handler';
const { width: screenWidth } = Dimensions.get('window');


const HomeScreen = ({navigation}) => {
  const [equipos, setEquipos] = useState([]);

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

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase.from('equipo').select('*');
      if (error) {
        console.log(error);
      } else {
        fillImage(data);
      }
    };
    fetchPost();
  }, []);

  console.log(equipos);
  
  return (
      <View style={styles.container}>
        <View style={styles.header1}>
          <Header></Header>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.flex}>
              <Text style={styles.welcome}>Bienvenido Federico!!</Text>
            </View>
          <View style={styles.bar}>
            <Image source={require('../images/BarraEquiposbarEquipo.png')} style={styles.barEquip}/>
          </View>
          <View style={styles.equiposContainer}>
            {equipos.map(equipo =>(
              <Equipo nombre={equipo.nombre} press={() => navigation.navigate('verEquipo')} deporte={equipo.deporte} imageSource={require('../images/football.png')} />
            ))}
          </View>
            <View style={styles.addButton}>
              <Button 
                title="Añadir Equipo"
                onPress={() => navigation.navigate('crearEquipo')}
              />
            </View>
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
            <Partido numero="1" fecha="24/4" puntos="34-12" equipos="Equipo 3 vs As.Ingenieros" />
            <Partido numero="2" fecha="20/3" puntos="3-1" equipos="Equipo 1 vs Dep.Tortugas" />
            <Partido numero="3" fecha="12/2" puntos="92-80" equipos="Equipo 2 vs Dep.Puerrreydon" />
          </View>
          <View style={styles.contButtons}>
            <View style={styles.buttons}>
              <View style={styles.addButton}>
                <Button 
                 title="Anotar"
                  onPress={() => navigation.navigate('ConfigAnot')}
                />
              </View>
              <View style={styles.addButton}>
                <Button
                  title="Crear"
                  onPress={() => navigation.navigate('crearPartido')}
                />
            </View>
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

