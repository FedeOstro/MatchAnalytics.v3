import * as React from 'react';
import 'react-native-gesture-handler'
import 'react-native-url-polyfill/auto'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import homeScreen from './src/views/homeScreen';
import verEquipo from './src/views/verEquipo'
import allEquipos from './src/views/allEquipos'
import anotPartido from './src/views/anotPartido'
import AllPartidos from './src/views/allPartidos';
import crearEquipo from './src/views/crearEquipo'
import crearPartido from './src/views/crearPartido.'
import login from './src/views/login'
import statsJugador from './src/views/statsJugador'
import startJugadorxPartido from './src/views/statsJugadorxPartido'
import statsPartido from './src/views/statsPartido'
import ConfigAnot from './src/views/configAnot';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="Home">
        <Stack.Screen 
         name="Home"
         component={homeScreen}
        />
        <Stack.Screen 
          name="verEquipo" 
          component={verEquipo}
        />
        <Stack.Screen
          name="allEquipo"
          component={allEquipos}
        />
        <Stack.Screen
          name="anotarPartido"
          component={anotPartido}
        />
        <Stack.Screen
          name="AllPartidos"
          component={AllPartidos}
        />
        <Stack.Screen
          name="crearEquipo"
          component={crearEquipo}
        />
        <Stack.Screen
          name="crearPartido"
          component={crearPartido}
        />
        <Stack.Screen
          name="login"
          component={login}
        />
        <Stack.Screen
          name="statsJugador"
          component={statsJugador}
        />
        <Stack.Screen
          name="startJugadorxPartido"
          component={startJugadorxPartido}
        />
        <Stack.Screen
          name="statsPartido"
          component={statsPartido}
        />
        <Stack.Screen
          name="ConfigAnot"
          component={ConfigAnot}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack
// {matches.map(match => (
    //     <TouchableOpacity key={match.id} style={styles.matchItem}>
    //       <Text>{match.opponent}</Text>
    //       <Text>Fecha: {match.date}</Text>
    //       <Text>Puntos: {match.score}</Text>
    //       <Text>Val: {match.value}</Text>
    //     </TouchableOpacity>
    //   ))}