import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import Header from '../components/Header';
import { updateMatch } from '../../lib/fetchmatch'
import { notesXMatch } from '../../lib/fetchnotes';
import { addAnot, addOpAnot } from '../../lib/fetchAnots';

const GameScreen = ({ route, navigation }) => {
  const { partido, duracion, entretiempo, tiempos } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalId, setModalId] = useState('')
  const [modalTeamId, setModalTeam] = useState('')
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerNumber2, setPlayerNumber2] = useState('');
  const [selectedPoint, setSelectedPoint] = useState('');
  const [notes, setNotes] = useState([])
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(duracion/tiempos)
  const [sets, setSets] = useState(tiempos)
  const [setOn, setSetOn] = useState(1)
  const [modalEnd, setModalend] = useState(false)
  const [modalBreak, setModalBreak] = useState(false)
  const [secondsBreak, setSecondsBreak] = useState(0)
  const [minutesBreak, setMinutesBreak] = useState(entretiempo)
  const [secondsTime, setSecondsTime] = useState(0)
  const [minutesTime, setMinutesTime] = useState(0)
  const [timeModal, setTimeModal] = useState(false)
  const [puntosEq1, setpuntosEq1] = useState(0)
  const [puntosEq2, setpuntosEq2] = useState(0)
  const timerRef = useRef(null); 

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
    addOpAnot(modalId, partido.idequipo2, partido.id_partido)
    setModalVisible(false);
    setPlayerNumber('');
    setPlayerNumber2('');
    setSelectedPoint('');
  }

  const closeModalBreak = () => {
    setModalBreak(false);
    setMinutes(duracion / sets);
    setSeconds(0);
    startMainTimer(); // Reinicia el temporizador principal al cerrar el modal de descanso
  };

  const openEndModal = () => {
    setModalend(true)
  }

  const openTimeModal = () => {
    setSecondsTime(0)
    setMinutesTime(0)
    setTimeModal(true)
    startTimeCounter();
  }

  const handlePointSelection = (pointType) => {
    setSelectedPoint(pointType);
  };

  const startMainTimer = () => {
    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0 && minutes === 0) {
          console.log("Fin del tiempo");
          setSetOn((prevSetOn) => {
            const newSetOn = prevSetOn + 1;
            if (newSetOn > sets) {
              setModalend(true);
            } else {
              setModalBreak(true);
              clearInterval(timerRef.current); 
            }
            return newSetOn;
          });
          return 0;
        } else if (prevSeconds === 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          return 59;
        } else {
          return prevSeconds - 1;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const acciones = await notesXMatch(partido.id_deporte);
        setNotes(acciones);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();   
    startMainTimer();
    return () => clearInterval(timerRef.current);
  }, [minutes, sets, entretiempo]);

  useEffect(() => {
    let breakTimer;
    if (modalBreak) {
      breakTimer = setInterval(() => {
        setSecondsBreak((prevSeconds) => {
          if (prevSeconds === 0) {
            if (minutesBreak === 0) {
              clearInterval(breakTimer);
              closeModalBreak();
              return 0;
            } else {
              setMinutesBreak((prev) => prev - 1);
              return 59;
            }
          } else {
            return prevSeconds - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(breakTimer);
  }, [modalBreak, minutesBreak]);

const timerTimeRef = useRef(null);

const startTimeCounter = () => {
  timerTimeRef.current = setInterval(() => {
    setSecondsTime((prevSeconds) => {
      if (prevSeconds === 59) {
        setMinutesTime((prevMinutes) => prevMinutes + 1);
        return 0;
      } else {
        return prevSeconds + 1;
      }
    });
  }, 1000);
};

const closeTimeModal = () => {
  clearInterval(timerTimeRef.current);
  setTimeModal(false);
  setSecondsTime(0);
  setMinutesTime(0);
};

const renderTimeModal = () => {
  if (timeModal) {
    return (
      <Modal visible={timeModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contador de Tiempo</Text>
            <Text style={styles.modalText}>
              {`${minutesTime < 10 ? '0' : ''}${minutesTime}:${secondsTime < 10 ? '0' : ''}${secondsTime}`}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeTimeModal}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
};


  const renderBreakModal = () =>{
    if (modalBreak) {
      return (
        <Modal visible={modalBreak} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Entretiempo</Text>
              <Text style={styles.modalText}>{`${minutesBreak < 10 ? '0' : ''}${minutesBreak}:${secondsBreak < 10 ? '0' : ''}${secondsBreak}`}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModalBreak}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
  }

  const renderEndModal = () => {
    if (modalEnd) {
      return (
        <Modal visible={modalEnd} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>¡Partido finalizado!</Text>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => {
                  setModalend(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      );
    }
  }

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
                selectedPoint && playerNumber ? styles.activeConfirmButton : {}
              ]}
              onPress={closeModal}
              disabled={!(selectedPoint && playerNumber)} 
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
        <Text style={styles.time}>{minutes<10 ? "0"+minutes: minutes}:{seconds<10 ? "0"+seconds: seconds}</Text>
        <Text style={styles.period}>{setOn + "/" + tiempos}</Text>
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
          <TouchableOpacity 
            style={styles.timeButton}
            onPress={openTimeModal}
          >
            <Text style={styles.timeButtonText}>Pedir tiempo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
              style={styles.endButton}
              onPress={openEndModal}
          >
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalBreak}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>{renderBreakModal()}</View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEnd}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>{renderEndModal()}</View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={timeModal}
        onRequestClose={closeTimeModal}
      >
        <View style={styles.modalContainer}>{renderTimeModal()}</View>
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
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    marginLeft: 5
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
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default GameScreen;
