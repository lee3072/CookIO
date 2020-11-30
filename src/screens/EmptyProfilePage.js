import React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

class EmptyProfilePage extends React.Component {
    constructor(props) {
        super(props);
    }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.backButton}>
            <Button
                color= "#ffdb85"
                title="Go to my profile"
                onPress={() => {
                    this.props.navigation.navigate('ProfilePage')
                }}
            />
            </View>
            <Text style={styles.warn}>You cannot view this profile</Text>
            <Text style={styles.warn}>Possible reasons: </Text>
            <Text style={styles.warn}>  You blocked this user.</Text>
            <Text style={styles.warn}>  This user blocked you.</Text>
            <Text style={styles.warn}>  This user does not exist.</Text>
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

export default EmptyProfilePage;