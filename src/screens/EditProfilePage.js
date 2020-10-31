import React from 'react';
import { StyleSheet, Button, Text, Image, View, Alert, ScrollView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';
import "firebase/storage";
import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

var db = firebase.firestore();

class EditProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newImage: '',
            newEmail: "",
            currentPassword: "",
            newUsername: "",
            username: "",
            currentIcon: '',
            newInterest: '',
        };
    }
    componentDidMount() {
        const currentUser = firebase.auth().currentUser;

        if (currentUser) {
            //get and set email
                this.setState({newEmail: currentUser.email})
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
                this.setState({newUsername: userName})
            });

            //get and set interest
            function getInterest(documentSnapshot) {
                return documentSnapshot.get('topicsOfInterest');
            }
              
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getInterest(documentSnapshot))
            .then(topicOfInterest => {
                this.setState({interest: topicOfInterest})
                this.setState({newInterest: topicOfInterest})
            });

            //get and set profile picture
            function getIcon(documentSnapshot) {
                return documentSnapshot.get('userIcon');
            }
              
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getIcon(documentSnapshot))
            .then(userIcon => {
                this.setState({currentIcon: userIcon})
            });
        }
    }

    uploadImage = async (uri, filenname) => {

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase.storage().ref(filenname).put(file);

            upload.on(
                "state_changed",
                snapshot => {},
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };

    onChangePhotoPress = async() => {
        var user = firebase.auth().currentUser;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        
        if (!result.cancelled) {
            this.setState({newImage: result.uri})

            remoteUri = await this.uploadImage(this.state.newImage, `profile/${user.uid}`)
            db.collection('Users').doc(user.uid).update({
                userIcon: remoteUri,
            });
            this.setState({currentIcon: result.uri})
        }

    }

    //reauthentication function
    reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    //Change email function
    onChangeEmailPress = () => {
        this.reauthenticate(this.state.currentPassword).then(() => {
            var user = firebase.auth().currentUser;
            user.updateEmail(this.state.newEmail).then(() => {
                db.collection('Users').doc(user.uid).update({
                    userEmail: this.state.newEmail,
                });
                Alert.alert("Email was changed");
            }).catch((error) => {
                Alert.alert(error.message);
            });
        }).catch((error) => {
            Alert.alert(error.message);
        });

    }

    //change username function
    onChangeUsernamePress = () => {
        var user = firebase.auth().currentUser;

        db.collection("Usernames").doc("Unique").get().then(doc => {
            if (!doc.get("UserNames").includes(this.state.newUsername)){
                db.collection('Usernames')
                .doc('Unique')
                .update({
                    UserNames: firebase.firestore.FieldValue.arrayRemove(this.state.username),
                })

                db.collection('Usernames')
                .doc('Unique')
                .update({
                    UserNames: firebase.firestore.FieldValue.arrayUnion(this.state.newUsername),
                })

                db.collection('Users')
                .doc(user.uid)
                .update({
                    userName: this.state.newUsername,
                })
                .then(() => {
                    this.setState({username: this.state.newUsername})
                    Alert.alert("Username was changed");
                });
            } else {
                Alert.alert("Username already exists");
            }
        })

    }

    onChangeInterestPress = () => {
        var user = firebase.auth().currentUser;

        db.collection("Usernames").doc("Unique").get().then(doc => {
            db.collection('Users')
            .doc(user.uid)
            .update({
                topicsOfInterest: this.state.newInterest,
            })
            .then(() => {
                Alert.alert("Your interest was changed");
            });
        })
    }




  render() {
    return (
      <View style={styles.container}>
          <View style={styles.backButton}>
            <Button
                color= "#ffdb85"
                title="back"
                onPress={() => {
                    this.props.navigation.navigate('ProfilePage')
                }}
            />
            </View>
          <ScrollView>
          
          <View style={{ margineTop: 20}}>
            <View style = {styles.profileContainer}>
                <Image
                    style={styles.icon}
                    source={
                        this.state.currentIcon
                            ? { uri: this.state.currentIcon }
                            : require("../assets/temp_icon.jpg")}/>
                <View style={styles.photoButton}>
                    <Button color= "#ffb300"
                      title="Change Profile Photo" onPress={this.onChangePhotoPress} />
                </View>
            </View>

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
                <Text style={styles.textStyle}>Email Address</Text>
                <View>
                    <TextInput style={styles.inputContainer} value={this.state.newEmail}
                        autoCapitalize="none" keyboardType="email-address"
                        onChangeText={(text) => {this.setState({newEmail: text}) }}
                    />
                </View>
                <Text style={styles.subTextStyle}>* Enter your password to change you email address</Text>
                <View style={styles.rowContainer}>
                    <TextInput style={styles.subInputContainer} value={this.state.currentPassword}
                        placeholder="Password" autoCapitalize="none" secureTextEntry={true}
                        onChangeText={(text) => {this.setState({currentPassword: text}) }}
                    />
                    <Button color= "#ffb300"
                        title="Change Email" onPress={this.onChangeEmailPress} />

                </View>

            </View>

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
                <Text style={styles.textStyle}>Username</Text>
                <View style={styles.rowContainer}>
                    <TextInput style={styles.usernameContainer} value={this.state.newUsername}
                        placeholder="New Username" autoCapitalize="none"
                        onChangeText={(text) => {this.setState({newUsername: text}) }}
                    />
                    <Button color= "#ffb300"
                        title="Change Username" onPress={this.onChangeUsernamePress} />
                </View>
                
            </View>

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
                <Text style={styles.textStyle}>Interest</Text>
                <TextInput style={styles.interestContainer} value={this.state.newInterest}
                placeholder="New Interest" autoCapitalize="none"
                onChangeText={(text) => {this.setState({newInterest: text}) }}
                />
                <View style={styles.photoButton}>
                    <Button color= "#ffb300"
                    title="Change Interest" onPress={this.onChangeInterestPress} />
                </View>
                
                
            </View>

            <View
                style={{
                    borderBottomColor: '#bdbdbd',
                    borderBottomWidth: 1,
                    paddingVertical: 5,
                    marginVertical: 15,
                    marginBottom: 20,
                }}
            />

            <Button color= "#ffb300"
                title="Change Password" onPress={() => this.props.navigation.navigate('ChangePasswordPage')} />
            <View style={styles.buttonStyle}>
                <Button color= "#ffb300"
                    title="Delete Account" onPress={() => this.props.navigation.navigate('DeleteAccountPage')} />
            </View>
        </View>

        </ScrollView>
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
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    icon: {
        width: 146,
        height: 146,
        borderRadius: 68,
    },

    profileContainer: {
        alignItems: "center",
        marginTop: 20,
    }, 
    photoButton: {
        padding: 10,
        alignItems: "center",
    },
    textStyle: {
        color: "#363636",
        paddingVertical: 10,
        fontSize: 18,
    },
    
    inputContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        margin: 1,
        paddingLeft: 15,
        fontSize: 15,
    },
    subInputContainer: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        margin: 1,
        marginTop: 10,
        paddingLeft: 15,
        fontSize: 15,
        width: 250,
    },
    subTextStyle: {
        color: "#363636",
        paddingVertical: 10,
        fontSize: 13,
        paddingLeft: 5,
    },
    usernameContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        margin: 1,
        paddingLeft: 15,
        fontSize: 15,
        width: 200,
    },
    interestContainer: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        margin: 1,
        marginTop: 10,
        paddingLeft: 15,
        fontSize: 15,
    },
    backButton: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    buttonStyle: {
        marginTop: 5,
    },
});

export default EditProfilePage;