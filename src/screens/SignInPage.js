import React, {useState} from 'react';
import { YellowBox, Platform, Dimension, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import firebase from '../../firebase_setup';
import 'firebase/firestore';
import styles from '../styles/auth_styles';
import {Notifications} from 'expo';
import * as Permissions from "expo-permissions";

// Page Section Start
const SignInPage = ({ navigation }) => {
    const [emailAddress,setEmailAddress] = useState('');
    const [password,setPassword] = useState('');
    const [warning,setWarning] = useState('')

    const signInWithAccount = (account) => {
        firebase.auth().signInWithEmailAndPassword(account,password)
        .then(user => {
        if (user) {
            setWarning('')
            setEmailAddress('')
            setPassword('')
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
            navigation.navigate("ProfilePage")
        }
        })
        .catch(error => {
            if (error.code == 'auth/invalid-email') {
                firebase.firestore().collection("Users").where('userName', '==', emailAddress.trim())
                .get()
                .then(function(querySnapshot) {
                    if (querySnapshot.empty) {
                        setWarning("Email or Username is invalid")
                    }
                    querySnapshot.forEach(function(doc) {
                        signInWithAccount(doc.data().userEmail)
                    });
                })
            }
            else if (error.code == 'auth/weak-password') {
                setWarning('Weak Password')
            } 
            else {
                setWarning(error.message)
            }
        })
    }
    
    const signInWithEmail = () => {
        signInWithAccount(emailAddress.trim());
    }
    const changeMod = () => {
        setWarning('')
        setEmailAddress('')
        setPassword('')
        navigation.navigate('SignUpPage')
    }
    return (<View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.purpose}>Sign In For</Text>
        <Text style={styles.appName}>Cook I/O</Text>
        </View>
    <Text style={styles.warning}>{warning}</Text>
        <View style={[styles.question,styles.emailAddress]}>
        <Text style={styles.questionLabel}>Email Address:</Text>
        <TextInput style={styles.questionTextInput} value={emailAddress} placeholder=' e.g. aaa@email.com' onChangeText={(e) => setEmailAddress(e)}></TextInput>
        </View>
        <View style={[styles.question,styles.password]}>
        <Text style={styles.questionLabel}>Password:</Text>
        <TextInput secureTextEntry={true} value={password} style={styles.questionTextInput} placeholder=' require longer than 6 character' onChangeText={(e) => setPassword(e)}></TextInput>
        </View>
        <TouchableOpacity onPress={signInWithEmail} style={styles.submitButton}>
        <Text style={styles.submitButtonTitle}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.changeMod}>
        <Text style={styles.changeModLabel}>Don't have a Account?</Text>
        <TouchableOpacity onPress={changeMod} style={styles.changeModButton}>
            <Text style={styles.changeModButtonWrapper}>Sign Up</Text>
        </TouchableOpacity>
        </View>
    </View>)
}

export default SignInPage;
