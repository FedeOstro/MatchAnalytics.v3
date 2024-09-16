import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import Header from '../components/Header';
import { updateMatch } from '../../lib/fetchmatch'
import { notesXMatch } from '../../lib/fetchnotes';

const GameScreen = ({ route, navigation }) => {
  const { partido, duracion, entretiempo, tiempos } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerNumber2, setPlayerNumber2] = useState('');
  const [selectedPoint, setSelectedPoint] = useState('');
  const [notes, setNotes] = useState([])

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setPlayerNumber('');
    setPlayerNumber2('');
    setSelectedPoint('');
  };

  const handlePointSelection = (pointType) => {
    setSelectedPoint(pointType);
  };

  useEffect(() => {
    const fetchData = async () => {
      try{
        const acciones = await notesXMatch(partido.id_deporte)
        console.log(acciones)
        setNotes(acciones)
      }catch(error){
        console.log(error)
      }
    }
    fetchData()
  }, []);

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
              <TouchableOpacity
                style={[
                  styles.simpleButton,
                  selectedPoint === 'Simple' && styles.selectedButton
                ]}
                onPress={() => handlePointSelection('Simple')}
              >
                <Text style={styles.buttonText}>Simple</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.doubleButton,
                  selectedPoint === 'Doble' && styles.selectedButton
                ]}
                onPress={() => handlePointSelection('Doble')}
              >
                <Text style={styles.buttonText}>Doble</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  selectedPoint ? styles.activeConfirmButton : {}
                ]}
                onPress={closeModal}
                disabled={!selectedPoint}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'Asistencia':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Asistencia</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese N° de jugador asistente"
              value={playerNumber}
              onChangeText={setPlayerNumber}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Ingrese N° de jugador asistido"
              value={playerNumber2}
              onChangeText={setPlayerNumber2}
              keyboardType="numeric"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  playerNumber && playerNumber2 ? styles.activeConfirmButton : {}
                ]}
                onPress={closeModal}
                disabled={!(playerNumber && playerNumber2)} // Disable button if both player numbers are not entered
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'Bloqueos':
      case 'Robos':
      case 'Faltas':
      case 'Perdidas':
      case 'Rebote/Of':
      case 'Rebote/Def':
      case 'Fouls':
      case 'Tiros':
      case 'Saltos ganado':
      case 'Recuperos':
      case 'Tiros fuera del arco':
      case 'Tiros bloqueados':
      case 'Tarjeta amarilla':
      case 'Tarjeta roja':
      case 'Fuera de juego':
      case 'Goles':
      case 'Atajos':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalType}</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese N° de jugador"
              value={playerNumber}
              onChangeText={setPlayerNumber}
              keyboardType="numeric"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  playerNumber ? styles.activeConfirmButton : {}
                ]}
                onPress={closeModal}
                disabled={!playerNumber} 
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
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
        <Text style={styles.time}>{duracion + ' mins'}</Text>
        <Text style={styles.period}>{'1/' + tiempos}</Text>
        <Text style={styles.match}>
          {partido.equipo1 + ' vs ' + partido.equipo2}
        </Text>
      </View>
      <Header />
      <View style={styles.contentContainer}>
      <View style={styles.buttonsContainer}>
        {notes && notes.map((note) => (
        <TouchableOpacity
          key={note.id_accion} 
          style={styles.button}
          onPress={() => openModal(note.descripcion)} 
        >
      <Text style={styles.buttonText}>{note.descripcion}</Text> 
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
        <View style={styles.modalContainer}>{renderModalContent()}</View>
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
    marginRight: 10,
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
    backgroundColor: '#ffcc00',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  simpleButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    marginRight: 5,
    borderRadius: 5,
  },
  doubleButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    marginLeft: 5,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#ADD8E6',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#CCCCCC',
    paddingVertical: 10,
    marginRight: 5,
    borderRadius: 20,
  },
  activeConfirmButton: {
    backgroundColor: '#8FC24E',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FF5733',
    paddingVertical: 10,
    marginLeft: 5,
    borderRadius: 20,
  },
  confirmButtonText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GameScreen;
