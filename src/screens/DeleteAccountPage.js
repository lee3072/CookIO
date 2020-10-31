import React from 'react';
import { StyleSheet, Button, Text, View, Alert } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';

var db = firebase.firestore();

class DeleteAccountPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: "",
            username: "",
        };
    }
    componentDidMount() {
        const currentUser = firebase.auth().currentUser;

        if (currentUser) {
            //get and set username
            function getUserName(documentSnapshot) {
                return documentSnapshot.get('userName');
            }
              
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getUserName(documentSnapshot))
            .then(userName => {
                this.setState({username: userName})
            });
            

        }
    }
    //reauthentication function

    reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    onDeletePress = () => {

        this.reauthenticate(this.state.currentPassword).then(() => {
            var user = firebase.auth().currentUser;
            db.collection('Usernames')
            .doc('Unique')
            .update({
                UserNames: firebase.firestore.FieldValue.arrayRemove(this.state.username),
            })
            db.collection("Users").doc(user.uid).delete().then(function() {
                console.log("doc deleted")
                //Alert.alert("Password was changed");
            }).catch(function(error) {
                console.log('error in deleting doc')
                //Alert.alert(error.message);
            });
            user.delete().then(function() {
                console.log('delete account')
            }).catch(function(error) {
                Alert.alert(error.message);
            });
        }).catch((error) => {
            Alert.alert(error.message);
        });
        this.props.navigation.navigate('SignInPage')
    }

  render() {
    return (
        <View style={styles.container}>
            <View style={styles.backButton}>
                <Button
                    color= "#ffdb85"
                    title="back"
                    onPress={() => {
                        this.props.navigation.navigate('EditProfilePage')
                    }}
                />
            </View>
            <View style={{ marginTop: 30}}>
                <Text style={styles.titleStyle}>Delete Account</Text>
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
                        <Text style={styles.textStyle}>Enter Password:</Text>
                        <TextInput style={styles.subInputContainer} value={this.state.currentPassword}
                            placeholder="Current Password" autoCapitalize="none" secureTextEntry={true}
                            onChangeText={(text) => {this.setState({currentPassword: text}) }}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>You cannot recover you account after you proceed to delete it.</Text>
                    </View>
                    <View style={styles.buttonStyle}>
                        <Button color= "#ffb300"
                        title="Delete Account" onPress={this.onDeletePress} />
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
    textContainer: {
        flexDirection: "row",
        paddingTop: 15,
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
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
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
        paddingVertical: 25,
    }
});

export default DeleteAccountPage;