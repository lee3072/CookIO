import React, {useState} from 'react';
import { YellowBox, Platform, Dimension, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import firebase from '../../firebase_setup';
import 'firebase/firestore';
import styles from '../styles/auth_styles';
import {Notifications} from 'expo';
import * as Permissions from "expo-permissions";


const CreateProfilePage = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [topicsOfInterest, setTopicsOfInterest] = useState('');
    const [warning,setWarning] = useState('')

    
    const submit = () => {
    let db = firebase.firestore()
    if (userName !== ''){
    db.collection("Usernames").doc("Unique").get().then(doc => {
        if (!doc.get("UserNames").includes(userName)){
        db.collection("Users").doc(firebase.auth().currentUser.uid.toString()).update({
            userName: userName,
            topicsOfInterest: topicsOfInterest,
        })
        db.collection("Usernames").doc("Unique").update({
            UserNames: firebase.firestore.FieldValue.arrayUnion(userName)           
        })
        setUserName('')
        setTopicsOfInterest('')
        setWarning('')
        
        var i = 0
        firebase.database().ref(firebase.auth().currentUser.uid)
        .endAt()
        .limitToLast(1)
        .on('child_added', snapshot => {
            if (i != 0) {
                Notifications.presentLocalNotificationAsync({
                    title: "from: "+snapshot.child("user/_id").val(),
                    body: snapshot.child("text").val(),
                  });
            }
            i++
        });

        navigation.navigate('ProfilePage')
        } else {
        setWarning('Username is already occupied')
        }
    })
    }
    else {
    setWarning('Username cannot be empty!')
    }
}
return (<View style={styles.container}>
    <View style={styles.header}>
        <Text style={[styles.purpose,styles.purposeModifier]}>For New User</Text>
        <Text style={[styles.appName,styles.appNameModifier]}>Create Profile</Text>
    </View>
    <Text style={styles.warning}>{warning}</Text>
    <View style={[styles.question,styles.emailAddress]}>
        <Text style={styles.questionLabel}>Username:</Text>
        <TextInput style={styles.questionTextInput} value={userName} placeholder='require unique username' onChangeText={(e) => setUserName(e)}></TextInput>
    </View>
    <View style={[styles.question,styles.password]}>
        <Text style={[styles.questionLabel,styles.questionLabelModifier]}>Topics Of Interest:</Text>
        <TextInput style={styles.questionTextInput} value={topicsOfInterest} placeholder='tell what are you interested in' onChangeText={(e) => setTopicsOfInterest(e)}></TextInput>
    </View>
    <TouchableOpacity onPress={submit} style={styles.submitButton}>
        <Text style={styles.submitButtonTitle}>Submit</Text>
    </TouchableOpacity>
    </View>)
}

export default CreateProfilePage;