import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import Header from '../components/Header'; 

const GameScreen = ({route, navigation}) => {
  const  {partido, duracion, entretiempo, tiempos} = route.params
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setPlayerNumber('');
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'Punto':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Punto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese N° de jugador"
              value={playerNumber}
              onChangeText={setPlayerNumber}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <Button title="Simple" onPress={() => console.log('Punto Simple')} />
              <Button title="Doble" onPress={() => console.log('Punto Doble')} />
            </View>
            <View style={styles.modalActions}>
              <Button title="Confirmar" onPress={closeModal} color="green" />
              <Button title="Cancelar" onPress={closeModal} color="orange" />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.time}>{JSON.stringify(duracion)}</Text>
        <Text style={styles.period}>{JSON.stringify(tiempos)}</Text>
        <Text style={styles.match}>{JSON.stringify(partido.equipo1 + 'vs' + partido.equipo2)}</Text>
      </View>
      <Header />
      <View style={styles.contentContainer}>
        <View style={styles.buttonsContainer}>
          {['Punto', 'Asistencia', 'Bloqueo', 'Robo', 'Falta', 'Perdida', 'Rebote/Of', 'Rebote/Def'].map((type) => (
            <TouchableOpacity key={type} style={styles.button} onPress={() => openModal(type)}>
              <Text style={styles.buttonText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.timeButton}>
            <Text style={styles.timeButtonText}>Pedir tiempo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endButton}>
            <Text style={styles.endButtonText}>Finalizar Partido</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {renderModalContent()}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAD77F',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAD77F',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    position: 'absolute',
    top: 0,
    zIndex: 0,
    marginTop: 10,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
  },
  period: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginTop: 50,
  },
  match: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
    marginTop: 10,
    marginRight: 10
  },
  contentContainer: {
    flex: 1,
    marginTop: 60, 
    zIndex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FFF',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  timeButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
  },
  timeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  endButton: {
    backgroundColor: '#E74C3C',
    padding: 10,
    borderRadius: 5,
  },
  endButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 5,
    borderRadius: 5,
    width: '80%',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default GameScreen;
