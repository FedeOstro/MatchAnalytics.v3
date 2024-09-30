import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importa el contexto.
import { View, TextInput, Button, Text } from 'react-native';

function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();

    const handleLogin = async () => {
        const success = await login(username, password);
        if (!success) {
            setError('Usuario o contraseña incorrectos');
        } else {
            navigation.replace('Home'); // Redirige a la pantalla Home si el login es exitoso.
        }
    };

    return (
        <View>
            <TextInput 
                placeholder="Nombre de usuario"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput 
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            <Button title="Iniciar sesión" onPress={handleLogin} />
        </View>
    );
}

export default LoginScreen;
