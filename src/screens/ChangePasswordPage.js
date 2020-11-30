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
    }

  render() {
    return (
        <View style={styles.container}>
            <View style={[styles.backButton,styles.iosButtonSetting,{marginTop:(Platform.OS === 'ios') ? 40 : 20, marginBottom: 10}]}>
                <Button
                    color= "#ffdb85"
                    title="back"
                    onPress={() => {
                        this.props.navigation.navigate('EditProfilePage')
                    }}
                />
            </View>
            <View style={{ marginTop: 30}}>
                <Text style={styles.titleStyle}>Change Password</Text>
                <View
                    style={{
                        borderBottomColor: '#bdbdbd',
                        borderBottomWidth: 1,
                        paddingVertical: 5,
                        marginVertical: 15,
                        marginBottom: 20,
                    }}
                />
                <View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.textStyle}>Current Password:</Text>
                        <TextInput style={styles.subInputContainer} value={this.state.currentPassword}
                            placeholder="Current Password" autoCapitalize="none" secureTextEntry={true}
                            onChangeText={(text) => {this.setState({currentPassword: text}) }}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.textStyle}>New Password:</Text>
                        <TextInput style={styles.subInputContainer} value={this.state.newPassword}
                            placeholder="New Password" autoCapitalize="none" secureTextEntry={true}
                            onChangeText={(text) => {this.setState({newPassword: text}) }}
                        />
                    </View>
                    <View style={[styles.buttonStyle,styles.iosButtonSetting]}>
                        <Button color= "#ffb300"
                        title="Change Password" onPress={this.onChangePasswordPress} />
                    </View>
                </View>
            </View>
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
    profileContainer: {
        alignItems: "center",
        marginTop: 50,
    }, 
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 15,
    },
    textStyle: {
        color: "#363636",
        paddingTop: 10,
        fontSize: 15,
    },
    titleStyle: {
        color: "#363636",
        paddingVertical: 0,
        fontSize: 22,
    },
    backButton: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignSelf: "flex-start"
    },
    subInputContainer: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        marginTop: 10,
        paddingLeft: 5,
        fontSize: 15,
        width: 250,
    },
    buttonStyle: {
        marginVertical: 25,
    },
    iosButtonSetting: {
        borderWidth: (Platform.OS === 'ios') ? 2 : 0,
        marginVertical: (Platform.OS === 'ios') ? 2 : 0,
        borderColor: (Platform.OS === 'ios') ? "#ffb300" : "white"
    }
});

export default ChangePasswordPage;