import React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class GuestErrorPage extends React.Component {
    constructor(props) {
        super(props);
    }

  render() {
    return (
        <View style={styles.container}>
            <View style={styles.backButton}>
                <Button
                    color= "#ffdb85"
                    title="Go to main page"
                    onPress={() => {
                        this.props.navigation.navigate('GuestViewPage')
                    }}
                />
                </View>
                <Text style={styles.warn}>You need to login to view this profile.</Text>
        </View>
  
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: "center",
        padding: 13,
    },
    backButton: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    warn: {
        fontSize: 20,
        fontWeight: "bold",
        paddingVertical: 10,
    },
});

export default GuestErrorPage;