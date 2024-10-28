import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { fetchUser, addUser, cheqMail, cheqName } from '../../lib/fetchusers';

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async () => {
    const userExists = await fetchUser(username, password);
    if (userExists) {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(userExists[0]));
        navigation.navigate('Home');
      } catch (e) {
        console.log(e);
      }
    } else {
      Vibration.vibrate();
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  const handleAddUser = async () => {
    if (!newUsername || !newEmail || !newPassword) {
      Vibration.vibrate(); 
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    if (!newEmail.endsWith('@gmail.com')) {
      Vibration.vibrate();
      Alert.alert('Error', 'El correo debe terminar en "@gmail.com".');
      return;
    }
  
    let cheq = null;
    cheq = await cheqMail(newEmail);
    if (cheq === true) {
      Vibration.vibrate(); 
      Alert.alert('Error', 'Email ya registrado');
      setModalVisible(false);
      return;
    }
    
    cheq = await cheqName(newUsername);
    if (cheq === true) {
      Vibration.vibrate(); 
      Alert.alert('Error', 'Nombre de usuario ya registrado');
      setModalVisible(false);
      return;
    }
    
    try {
      await addUser(newUsername, newEmail, newPassword);
      Alert.alert('Éxito', 'Usuario agregado exitosamente');
      setModalVisible(false);
    } catch (e) {
      Vibration.vibrate(); 
      Alert.alert('Error', 'Hubo un problema al agregar el usuario');
    }
  };
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.cont}>
        <Text style={styles.welcomeText}>
          Bienvenido!!{'\n'}Ingrese su nombre{'\n'}y contraseña
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>

        {/* Botón para abrir el modal de añadir usuario */}
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Añadir usuario</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para añadir usuario */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar usuario</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              value={newUsername}
              onChangeText={setNewUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Gmail"
              value={newEmail}
              onChangeText={setNewEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            
            {/* Botón para Aceptar */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddUser}>
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>

              {/* Botón para Cerrar */}
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDD072', // Color amarillo claro
  },
  cont: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 30,
    marginTop: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50', // Color verde
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    width: '80%',
    backgroundColor: '#1E90FF', // Color azul para el botón "Añadir usuario"
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FDD072',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 50,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    width: '45%',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButton: {
    width: '45%',
    backgroundColor: '#FF6347', // Fondo rojo
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});

export default LoginScreen;
