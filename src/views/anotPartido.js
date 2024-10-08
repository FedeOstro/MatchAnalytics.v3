import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import Header from '../components/Header';
import { updateMatch } from '../../lib/fetchmatch'
import { notesXMatch } from '../../lib/fetchnotes';
import { addAnot, addOpAnot } from '../../lib/fetchAnots';

const GameScreen = ({ route, navigation }) => {
  const { partido, entretiempo, tiempos } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalId, setModalId] = useState('')
  const [modalTeamId, setModalTeam] = useState('')
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerNumber2, setPlayerNumber2] = useState('');
  const [selectedPoint, setSelectedPoint] = useState('');
  const [notes, setNotes] = useState([])
  const [timeLeft, setTimeLeft] = useState(partido.duracion * 60);
  const [isActive, setIsAc1tive] = useState(false);
  
  const openModal = (type, id) => {
    setModalType(type);
    setModalId(id)
    setModalVisible(true);
  };
 
  const closeModal = async () => {
    let special = false
    if(selectedPoint === 'Triple'){
      special = true
      
      addAnot(modalId, playerNumber, partido.id_partido, partido.idequipo1, special)
    }
    addAnot(modalId, playerNumber, partido.id_partido, partido.idequipo1, special)
    setModalVisible(false);
    setPlayerNumber('');
    setPlayerNumber2('');
    setSelectedPoint('');
  };

  const cancelModal = async () => {
    setModalVisible(false);
    setPlayerNumber('');
    setPlayerNumber2('');
    setSelectedPoint('');
  }

  const opModal = async () => {
    addAnot(modalId, partido.id_partido, partido.idequipo2)
    setModalVisible(false);
    setPlayerNumber('');
    setPlayerNumber2('');
    setSelectedPoint('');
  }

  const handlePointSelection = (pointType) => {
    setSelectedPoint(pointType);
  };

  useEffect(() => {
    const fetchData = async () => {
      try{
        const acciones = await notesXMatch(partido.id_deporte)
        setNotes(acciones)
      }catch(error){
        console.log(error)
      }
    }
    fetchData()
  }, [isActive, timeLeft]); 
  const renderModalContent = () => {
    const OpponentButton = () => (
      <TouchableOpacity style={styles.opponentButton} onPress={opModal}>
        <Text style={styles.opponentButtonText}>Equipo Oponente</Text>
      </TouchableOpacity>
    );
  
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
                  selectedPoint === 'Doble' && styles.selectedButton
                ]}
                onPress={() => handlePointSelection('Doble')}
              >
                <Text style={styles.buttonText}>Doble</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.doubleButton,
                  selectedPoint === 'Triple' && styles.selectedButton
                ]}
                onPress={() => handlePointSelection('Triple')}
              >
                <Text style={styles.buttonText}>Triple</Text>
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
              <TouchableOpacity style={styles.cancelButton} onPress={cancelModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            <OpponentButton />
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
                disabled={!(playerNumber && playerNumber2)}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            <OpponentButton />
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
              <TouchableOpacity style={styles.cancelButton} onPress={cancelModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            <OpponentButton />
          </View>
        );
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.time}>{partido.duracion + ' mins'}</Text>
        <Text style={styles.period}>{'1/' + tiempos}</Text>
        <Text style={styles.match}>
          {partido.name}
        </Text>
      </View>
      <Header />
      <View style={styles.contentContainer}>
      <View style={styles.buttonsContainer}>
        {notes && notes.map((note) => (
        <TouchableOpacity
          key={note.id_accion} 
          style={styles.button}
          onPress={() => openModal(note.descripcion, note.id_accion)} 
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
  opponentButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  opponentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen;
