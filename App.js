import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

import * as firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyC1vzo3Uk66RrEtkxRaUKzln93sppXtPGs",
  authDomain: "cookio-b4eaa.firebaseapp.com",
  databaseURL: "https://cookio-b4eaa.firebaseio.com",
  projectId: "cookio-b4eaa",
  storageBucket: "cookio-b4eaa.appspot.com",
  messagingSenderId: "244962151899",
  appId: "1:244962151899:web:46d43e6bdf48777df1ebfe"
};

firebase.initializeApp(firebaseConfig);

export default function App() {
  const [page, setPage] = useState('SignUp');
  const [emailAddress,setEmailAddress] = useState('');
  const [password,setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const submitButtonHandler = () => {
    firebase.auth().createUserWithEmailAndPassword(emailAddress,password)
    .catch(
      function(error) {
        setErrorMessage(error.message);
      }
    );
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setPage('')
      } else {
        setPage('SignUp')
      }
    });
  }
  const backButtonHandler = () => {
    setPage('SignUp'),
    setErrorMessage()
    setEmailAddress(''),
    setPassword('');
  }
  if (page == 'SignUp'){
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={[styles.boldText,{fontSize:60}]}>Cook I/O</Text>
        <Text style={[styles.boldText,{color:'red'}]}>{errorMessage}</Text>
        <View style={styles.lable_input}>
          {/* style of the object is seperated from style of the group */}
          <Text style={styles.boldText}>Email Address:</Text>
          
          <TextInput 
            style={styles.basic_input}
            placeholder='e.g. aaa@email.com'
            onChangeText={(e) => setEmailAddress(e)}  
          />
        </View>
        <View style={styles.lable_input}>
          {/* inheritence of style does not work */}
          <Text style={styles.boldText}>Password:</Text>
          <TextInput 
            style={styles.basic_input}
            placeholder='long than 6 character'
            onChangeText={(e) => setPassword(e)}  
          />
        </View>
        <View style={styles.lable_input}>
          <Button title='Submit' onPress={submitButtonHandler}/>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={{fontSize:50, fontWeight:'normal'}}>Default View</Text>
        <View style={styles.lable_input}>
          <Button title='Back' onPress={backButtonHandler}/>
        </View>
      </View>
    );
  }
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  lightText: {
    fontWeight: 'normal',
    fontSize: 22,
  },
  lable_input: {
    alignItems: 'baseline',
    padding: 20,
    backgroundColor: 'lightgray',
  },
  basic_input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
  }
});
