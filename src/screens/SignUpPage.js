import React, {useState} from 'react';
import { Button, YellowBox, Platform, Dimension, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import firebase from '../../firebase_setup';
import 'firebase/firestore';
import styles from '../styles/auth_styles';



const SignUpPage = ({ navigation }) => {
    const [emailAddress,setEmailAddress] = useState('');
    const [password,setPassword] = useState('');
    const [warning,setWarning] = useState('')
    const signUpWithEmail = () => {
      firebase.auth().createUserWithEmailAndPassword(emailAddress.trim(),password)
      .then(user => {
        if (user) {
          setWarning('')
          setEmailAddress('')
          setPassword('')
          navigation.navigate("CreateProfilePage")
          let db = firebase.firestore()
          db.collection("Users")
          .doc(firebase.auth().currentUser.uid.toString()).set({
            id: firebase.auth().currentUser.uid, // for DM
            userEmail: emailAddress,
            userIcon: null,
            userName: "",
            topicsOfInterest: "",
            postedPosts: [],
            numberOfFollowers: 0,
            followingUsers: [],
            followingTags: [],
            postedComments: [],
            blockedUsers: [], // for DM
            dmUsers: [], // for DM
            followingOnlyMod: false,
            followers: [],
          })
          firebase.database().ref(firebase.auth().currentUser.uid).push("initialization")
        }
      })
      .catch(error => {
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
      navigation.navigate('SignInPage')
    }
  
    return (<View style={styles.container}>
      <View style={styles.GuestView}>
        <Button color="#ffb300"
            title="Guest View"
            onPress={() => navigation.navigate('GuestViewPage')}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.purpose}>Sign Up For</Text>
        <Text style={styles.appName}>Cook I/O</Text>
      </View>
      <Text style={styles.warning}>{warning}</Text>
      <View style={[styles.question,styles.emailAddress]}>
        <Text style={styles.questionLabel}>Email Address:</Text>
        <TextInput style={styles.questionTextInput} value={emailAddress} placeholder=' e.g. aaa@email.com' onChangeText={(e) => setEmailAddress(e)}></TextInput>
      </View>
      <View style={[styles.question,styles.password]}>
        <Text style={styles.questionLabel}>Password:</Text>
        <TextInput secureTextEntry={true} style={styles.questionTextInput} value={password} placeholder=' require longer than 6 character' onChangeText={(e) => setPassword(e)}></TextInput>
      </View>
      <TouchableOpacity onPress={signUpWithEmail} style={styles.submitButton}>
        <Text style={styles.submitButtonTitle}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.changeMod}>
        <Text style={styles.changeModLabel}>Already have a Account?</Text>
        <TouchableOpacity onPress={changeMod} style={styles.changeModButton}>
          <Text style={styles.changeModButtonWrapper}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>)
  }

  export default SignUpPage;