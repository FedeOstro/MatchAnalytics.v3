import * as React from 'react';
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import homeScreen from './src/views/homeScreen';
import verEquipo from './src/views/verEquipo';
import allEquipos from './src/views/allEquipos';
import anotPartido from './src/views/anotPartido';
import AllPartidos from './src/views/allPartidos';
import crearEquipo from './src/views/crearEquipo';
import crearPartido from './src/views/crearPartido';
import login from './src/views/login';
import statsPartido from './src/views/statsPartido';
import ConfigAnot from './src/views/configAnot';

const Stack = createNativeStackNavigator();

function MyStack() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "login"}>
        {isAuthenticated ? (
          <>
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
              name="statsPartido"
              component={statsPartido}
            />
            <Stack.Screen
              name="ConfigAnot"
              component={ConfigAnot}
            />
          </>
        ) : (
          <>
          <Stack.Screen 
            name="login" 
            component={login}
          />
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
              name="statsPartido"
              component={statsPartido}
            />
            <Stack.Screen
              name="ConfigAnot"
              component={ConfigAnot}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <MyStack />
  );
}
