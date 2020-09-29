import React, {useState} from 'react';
import { YellowBox, Platform, Dimension, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import firebase from '../../firebase_setup';
import 'firebase/firestore';
import styles from './auth_styles';

// Page Section Start
const SignInPage = ({ navigation }) => {
    const [emailAddress,setEmailAddress] = useState('');
    const [password,setPassword] = useState('');
    const [warning,setWarning] = useState('')
    const signInWithEmail = () => {
        console.log("email: "+emailAddress+"; pass: "+password)
        firebase.auth().signInWithEmailAndPassword(emailAddress.trim(),password)
        .then(user => {
        if (user) {
            setWarning('')
            setEmailAddress('')
            setPassword('')
            navigation.navigate("ProfilePage")
        }
        })
        .catch(error => {
        console.log(error.message)
        if (error.code == 'auth/weak-password') {
            setWarning('Weak Password')
        } else {
            setWarning(error.message)
        }
        })
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