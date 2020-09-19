import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { Platform, Dimension, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
// import { Button } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
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
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} >
        <Stack.Screen name="Sign In" component={SignInPage}/>
        <Stack.Screen name="Sign Up" component={SignUpPage}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

let customFonts = {
  'Rokkitt': require('./assets/fonts/rokkitt/Rokkitt-Regular.ttf'),
  'Merriweather': require('./assets/fonts/merriweather/Merriweather-Regular.otf'),
};
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
if (Platform.OS === 'web') {screenHeight = 720; screenWidth = 405;}

// Page Section Start
class SignInPage extends React.Component {
  state = {
    fontsLoaded: false,
  };
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount() {
    this._loadFontsAsync();
  }
  render() {
    if (this.state.fontsLoaded) {
      return (<View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.purpose}>Sign In For</Text>
          <Text style={styles.appName}>Cook I/O</Text>
        </View>
        <View style={[styles.question,styles.emailAddress]}>
          <Text style={styles.questionLabel}>Email Address:</Text>
          <TextInput style={styles.questionTextInput}></TextInput>
        </View>
        <View style={[styles.question,styles.password]}>
          <Text style={styles.questionLabel}>Password:</Text>
          <TextInput style={styles.questionTextInput}></TextInput>
        </View>
        {/* <View style={styles.submitButton}>
          <Button title="Sign In" titleStyle={styles.submitButtonTitle} buttonStyle={[{backgroundColor: '#000'}]}></Button>
        </View> */}
        <View style={styles.changeMod}>
          <Text style={styles.changeModLabel}>Don't have a Account?</Text>
          <TouchableOpacity >
            <Text style={styles.changeModButton}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>)
    } else {
      return <AppLoading />
    }
  }
  
}

class SignUpPage extends React.Component {
  state = {
    fontsLoaded: false,
  };
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount() {
    this._loadFontsAsync();
  }
  render() {
    if (this.state.fontsLoaded) {
      return (<View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.purpose}>Sign Up For</Text>
          <Text style={styles.appName}>Cook I/O</Text>
        </View>
        <View style={[styles.question,styles.emailAddress]}>
          <Text style={styles.questionLabel}>Email Address:</Text>
          <TextInput style={styles.questionTextInput}></TextInput>
        </View>
        <View style={[styles.question,styles.password]}>
          <Text style={styles.questionLabel}>Password:</Text>
          <TextInput style={styles.questionTextInput}></TextInput>
        </View>
        <View style={styles.submitButton}>
          <Button title="Sign Up" titleStyle={styles.submitButtonTitle} buttonStyle={[{backgroundColor: '#000'}]}></Button>
        </View>
        <View style={styles.changeMod}>
          <Text style={styles.changeModLabel}>Already have a Account?</Text>
          <TouchableOpacity>
            <Text style={styles.changeModButton}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>)
    } else {
      return <AppLoading />
    }
  }
  
}


// Style Section Start
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
    left: 0,
    top: 0,
    // backgroundColor: '#fff',
    backgroundColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  purpose: {
    position: 'absolute',
    width: 207/360*screenWidth,
    height: 43/720*screenHeight*1.125,
    left: 21/360*screenWidth,
    top: 34/720*screenHeight*1.125,
    fontFamily: 'Merriweather',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 36/360*screenWidth,
    lineHeight: 43/720*screenHeight*1.125,
    display: 'flex',
    alignItems: 'center',
    // backgroundColor: '#888',
  },
  appName: {
    position: 'absolute',
    width: 206/360*screenWidth,
    height: 38/720*screenHeight*1.125,
    left: 77/360*screenWidth,
    top: 88/720*screenHeight*1.125,
    fontFamily: 'Merriweather',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 36/360*screenWidth,
    lineHeight: 43/720*screenHeight*1.125,
    display: 'flex',
    alignItems: 'center',
    // backgroundColor: '#888',
  },
  question: {
    position: 'absolute',
    width: 318/360*screenWidth,
    height: 94/720*screenHeight*1.125,
    left: 21/360*screenWidth,
  },
  emailAddress: {
    top: 196/720*screenHeight*1.125,
  },
  password: {
    top: 320/720*screenHeight*1.125,
  },
  questionLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 262/360*screenWidth,
    height: 41/720*screenHeight*1.125,
    fontFamily: 'Rokkitt',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 36/360*screenWidth,
    lineHeight: 41/720*screenHeight*1.125,
  },
  questionTextInput: {
    position: 'absolute',
    left: 0,
    top: 46/720*screenHeight*1.125,
    width: 318/360*screenWidth,
    height: 48/720*screenHeight*1.125,
    backgroundColor: '#888',
  },
  submitButton: {
    position: 'absolute',
    width: 205/360*screenWidth,
    height: 66/720*screenHeight*1.125,
    left: 78/360*screenWidth,
    top: 474/720*screenHeight*1.125,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    
  },
  submitButtonTitle: {
    fontFamily: 'Rokkitt',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 36/360*screenWidth,
    lineHeight: 41/720*screenHeight*1.125,
  },
  changeMod: {
    position: 'absolute',
    width: 318/360*screenWidth,
    height: 26/720*screenHeight*1.125,
    left: 21/360*screenWidth,
    top: 580/720*screenHeight*1.125,
  },
  changeModLabel: {
    position: 'absolute',
    width: 207/360*screenWidth,
    height: 26/720*screenHeight*1.125,
    left: 0,
    top: 0,

    fontFamily: 'Rokkitt',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 18/360*screenWidth,
    lineHeight: 20/720*screenHeight*1.125,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  changeModButton: {
    position: 'absolute',
    width: 207/360*screenWidth,
    height: 26/720*screenHeight*1.125,
    left: 223/360*screenWidth,
    top: 0/720*screenHeight*1.125,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    fontFamily: 'Rokkitt',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 20/360*screenWidth,
    lineHeight: 23/720*screenHeight*1.125,
  },
});



// const [page, setPage] = useState('SignUp');
//   const [emailAddress,setEmailAddress] = useState('');
//   const [password,setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const submitButtonHandler = () => {
//     firebase.auth().createUserWithEmailAndPassword(emailAddress,password)
//     .catch(
//       function(error) {
//         setErrorMessage(error.message);
//       }
//     );
//     firebase.auth().onAuthStateChanged(function(user) {
//       if (user) {
//         setPage('')
//       } else {
//         setPage('SignUp')
//       }
//     });
//   }
//   const backButtonHandler = () => {
//     setPage('SignUp'),
//     setErrorMessage()
//     setEmailAddress(''),
//     setPassword('');
//   }
//   if (page == 'SignUp'){
//     return (
//       <View style={styles.container}>
//         <StatusBar style="auto" />
//         <Text style={[styles.boldText,{fontSize:60}]}>Cook I/O</Text>
//         <Text style={[styles.boldText,{color:'red'}]}>{errorMessage}</Text>
//         <View style={styles.lable_input}>
//           {/* style of the object is seperated from style of the group */}
//           <Text style={styles.boldText}>Email Address:</Text>
          
//           <TextInput 
//             style={styles.basic_input}
//             placeholder='e.g. aaa@email.com'
//             onChangeText={(e) => setEmailAddress(e)}  
//           />
//         </View>
//         <View style={styles.lable_input}>
//           {/* inheritence of style does not work */}
//           <Text style={styles.boldText}>Password:</Text>
//           <TextInput 
//             style={styles.basic_input}
//             placeholder='long than 6 character'
//             onChangeText={(e) => setPassword(e)}  
//           />
//         </View>
//         <View style={styles.lable_input}>
//           <Button title='Submit' onPress={submitButtonHandler}/>
//         </View>
//       </View>
//     );
//   } else {
//     return (
//       <View style={styles.container}>
//         <Text style={{fontSize:50, fontWeight:'normal'}}>Default View</Text>
//         <View style={styles.lable_input}>
//           <Button title='Back' onPress={backButtonHandler}/>
//         </View>
//       </View>
//     );
//   }