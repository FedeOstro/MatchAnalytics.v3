import * as React from "react";
import Header from "../components/Header";
import { View, StyleSheet } from "react-native";

const App = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Header/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffcc66',
    },
});

export default App;
