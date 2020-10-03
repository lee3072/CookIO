import React, {useState} from 'react';
import { YellowBox, Platform, Dimension, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import firebase from '../../firebase_setup';
import 'firebase/firestore';
import styles from '../styles/auth_styles';



const SignUpPage = ({ navigation }) => {
    const [emailAddress,setEmailAddress] = useState('');
    const [password,setPassword] = useState('');
    const [warning,setWarning] = useState('')
    const signUpWithEmail = () => {
      console.log("email: "+emailAddress+"; pass: "+password)
      firebase.auth().createUserWithEmailAndPassword(emailAddress.trim(),password)
      .then(user => {
        if (user) {
          setWarning('')
          setEmailAddress('')
          setPassword('')
          navigation.navigate("CreateProfilePage")
          let db = firebase.firestore()
          db.collection("Comments").add({
            date: Date(),
            content: "Welcome Comment",
            commentedUser: "Users/"+firebase.auth().currentUser.uid.toString(),
          }).then(welcomeComment => {
            db.collection("Posts").add({
              postedUser: emailAddress,
              image: null,
              content: "Welcome Content",
              PostedDate: Date(),
              tag: "Tags/"+"welcomeTag",
              comments: ["Comments/"+welcomeComment.id.toString()],
            }).then(welcomePost => {
              db.collection("Tags").doc("welcomeTag").update({
                postsInThisTopic: firebase.firestore.FieldValue.arrayUnion("Posts/"+welcomePost.id)
              }).catch( error => {
                db.collection("Tags").doc("welcomeTag").set({
                  postsInThisTopic: firebase.firestore.FieldValue.arrayUnion("Posts/"+welcomePost.id)
                })
              })
              db.collection("Comments").doc(welcomeComment.id.toString()).update({
                belongedPost: "Posts/"+welcomePost.id
              })
              db.collection("Users")
              .doc(firebase.auth().currentUser.uid.toString()).set({
                userEmail: emailAddress,
                userIcon: null,
                userName: "",
                topicsOfInterest: "",
                postedPosts: ["Posts/"+welcomePost.id],
                numberOfFollowers: 0,
              })
              
  
              
            })
          })
         
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
      navigation.navigate('SignInPage')
    }
  
    return (<View style={styles.container}>
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