import React from 'react';
import { StyleSheet, Button, Text, View, Alert } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';

var db = firebase.firestore();

class ChangePasswordPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            currentPassword: "",
        };
    }

    //reauthentication function

    reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    //change password function
    onChangePasswordPress = () => {

        this.reauthenticate(this.state.currentPassword).then(() => {
            var user = firebase.auth().currentUser;
            user.updatePassword(this.state.newPassword).then(() => {
            Alert.alert("Password was changed");
            }).catch((error) => {
                Alert.alert(error.message);
            });
        }).catch((error) => {
            Alert.alert(error.message);
        });

        /*
        var user = firebase.auth().currentUser;
        user.updatePassword(this.state.newPassword).then(() => {
            Alert.alert("Password was changed");
        }).catch((error) => {
            Alert.alert(error.message);
        });
        */
    }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput value={this.state.currentPassword}
        placeholder="Current Password" autoCapitalize="none" secureTextEntry={true}
        onChangeText={(text) => {this.setState({currentPassword: text}) }}
        />
        <TextInput value={this.state.newPassword}
        placeholder="New Password" autoCapitalize="none" secureTextEntry={true}
        onChangeText={(text) => {this.setState({newPassword: text}) }}
        />
        <Button title="Change Password" onPress={this.onChangePasswordPress} />
      </View>
    )
  }
}

export default ChangePasswordPage;