import React from 'react';
import { View, StyleSheet, Image, Dimensions} from 'react-native';
const { width: screenWidth } = Dimensions.get('window');

const Header = () => {
    return(
        <View style={styles.header1}>
            <Image source={require('../images/logohed.png')} style={styles.headerBar}/>
        </View> 
    );
}

const styles = StyleSheet.create({
    header1:{
        justifyContent: 'center',
        alignItems: 'center',
        width: screenWidth,
        backgroundColor: '#fff',
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        height:40
      },
      headerBar:{
        marginTop:30
      },
});

export default Header