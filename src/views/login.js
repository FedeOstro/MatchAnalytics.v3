import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { fetchUser } from '../../lib/fetchusers';

function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        const userExists = await fetchUser(username, password);
        if (userExists) {
            try {
                await AsyncStorage.setItem('user', JSON.stringify({ username }));
                navigation.replace('Home');
            } catch (e) {
                console.log(e);
            }
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    };
    return (
        <View style={styles.container}>
            <Header></Header>
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
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
        </View>
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
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        resizeMode: 'contain', // Ajustar la imagen sin distorsión
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginBottom: 30,
        marginTop: 40
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
        backgroundColor: '#4CAF50', // Color azul
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginBottom: 20,
    },
});

export default LoginScreen;
