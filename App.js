// firebase.firestore().collection().doc().update().arrayUnion() create the array if there is no array or addes element to it if it exist 
// user does not contain array for following users/topics, saved other user's posts, up/down voted posts, posted comments
// those will be added when by arrayUnion() when new posts are created or user followed new users/topics or saved other user's posts
// or up/down voted posts or posted comments on other posts
 
import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { YellowBox, Platform, Dimension, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
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
if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}
const Stack = createStackNavigator();
var textScale = 1;

let customFonts = {
  'Rokkitt': require('./assets/fonts/rokkitt/Rokkitt-Regular.ttf'),
  'Merriweather': require('./assets/fonts/merriweather/Merriweather-Regular.otf'),
};
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
if (Platform.OS === 'web') {screenHeight = 720; screenWidth = 405;}

export default class App extends React.Component {
  state = {
    fontsLoaded: false,
  };
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount() {
    YellowBox.ignoreWarnings(['Setting a timer for a long'])
    this._loadFontsAsync();
  }
  render() {
    if (this.state.fontsLoaded) {
      return (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}} >
            <Stack.Screen name="SignInPage" component={SignInPage}/>
            <Stack.Screen name="SignUpPage" component={SignUpPage}/>
            <Stack.Screen name="Temp" component={TempPage}/>
            <Stack.Screen name="createProfilePage" component={createProfilePage}/>
            <Stack.Screen name="editPost" component={editPostPage}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return <AppLoading />
    }
  }
}

// Page Section Start
const TempPage = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {navigation.navigate('SignInPage'); firebase.auth().signOut()}} style={styles.submitButton}>
        <Text style={styles.submitButtonTitle}>Log Out</Text>
      </TouchableOpacity>
    </View>)
}

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
        //navigation.navigate("Temp")
        navigation.navigate("editPost");
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
  
const SignUpPage = ({ navigation }) => {
  const [emailAddress,setEmailAddress] = useState('');
  // const [userName, setUserName] = useState('');
  // const [topicsOfInterest, setTopicsOfInterest] = useState('');
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
        navigation.navigate("createProfilePage")
        let db = firebase.firestore()
        db.collection("Comments").add({
          date: Date(),
          content: "Welcome Comment",
          commentedUser: "User/"+firebase.auth().currentUser.uid.toString(),
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
          // db.collection("Tags").add({
          //   topic: "welcomeTag",
          // }).then(welcomeTag => {
            
          // })
        
        
          // db.collection("Users")
          // .doc(firebase.auth().currentUser.uid.toString())
          // .update({
          //   postedPosts: firebase.firestore.FieldValue.arrayUnion("Test")
          // }) // arrayUnion() create the array if there is no array or addes element to it if it exist 
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

const createProfilePage = ({ navigation }) => {
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
          navigation.navigate('Temp')
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
        <Text style={[styles.purpose,{width: 340/360*screenWidth}]}>For New User</Text>
        <Text style={[styles.appName,{width: 300/360*screenWidth}]}>Create Profile</Text>
      </View>
      <Text style={styles.warning}>{warning}</Text>
      <View style={[styles.question,styles.emailAddress]}>
        <Text style={styles.questionLabel}>Username:</Text>
        <TextInput style={styles.questionTextInput} value={userName} placeholder='require unique username' onChangeText={(e) => setUserName(e)}></TextInput>
      </View>
      <View style={[styles.question,styles.password]}>
        <Text style={[styles.questionLabel,{width: 300/360*screenWidth}]}>Topics Of Interest:</Text>
        <TextInput style={styles.questionTextInput} value={topicsOfInterest} placeholder='tell what are you interested in' onChangeText={(e) => setTopicsOfInterest(e)}></TextInput>
      </View>
      <TouchableOpacity onPress={submit} style={styles.submitButton}>
        <Text style={styles.submitButtonTitle}>Submit</Text>
      </TouchableOpacity>
    </View>)
}

const editPostPage = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [tages, setTages] = useState('');
  const [texts, setContent] = useState('');
  const [imgs, setImgs] = useState('');
  //const [warning, setWarning] = useState('');
  const post = () => {
    let db = firebase.firestore()
    //check if has empty title
    const postRef = db.collection("Posts").doc();
    postRef.set({
      PostedDate: Date(),
      postedUser: firebase.auth().currentUser.uid.toString(),
      Title: title,
      tag: tages,
      content:  texts,
      image: imgs,
      
    })
  }
  return (<View style={editPostStyle.container}>
            <View style={editPostStyle.title}>
              <Text style={[editPostStyle.title]}>creat psot</Text>
            </View>
            {/* <Text style={editPostStyle.warning}>{warning}</Text> */}
            <View style={[editPostStyle.setTitle]}>
              <Text style={editPostStyle.setTitle.title}>Title:</Text>
              <TextInput style={editPostStyle.setTitle.texts} value={title} placeholder='Enter the name of the post' onChangeText={(e) => setTitle(e)}></TextInput>
            </View>
            <View style={[editPostStyle.setTages]}>
              <Text style={editPostStyle.setTitle.title}>Tages:</Text>
              <TextInput style={editPostStyle.setTitle.texts} value={tages} placeholder='#tage1 #tage2 ...' onChangeText={(e) => setTages(e)}></TextInput>
            </View>
            <View style={[editPostStyle.setContant]}>
              <Text style={editPostStyle.setContant.title}>Content:</Text>
              <TextInput style={editPostStyle.setContant.texts} value={texts} placeholder='say something..' onChangeText={(e) => setContent(e)}></TextInput>
            </View>
            
            <View style={[editPostStyle.setURL]}>
              <Text style={editPostStyle.setURL.title}>Images URLs:</Text>
              <TextInput style={editPostStyle.setURL.texts} value={imgs} placeholder='url1 url2 ...' onChangeText={(e) => setImgs(e)}></TextInput>
            </View>
            
            <TouchableOpacity onPress={post} style={editPostStyle.postButton}>
              <Text style={editPostStyle.postButton.title}>Post</Text>
            </TouchableOpacity>
          </View>)
}

const viewPostPage = ({navigation}) => {

}

const feedPage = ({navigation}) => {

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
  warning: {
    position: 'absolute',
    left: 21/360*screenWidth,
    top: 145/720*screenHeight*1.125,
    color: 'red',
    fontFamily: 'Rokkitt',
    fontWeight: 'bold',
    fontSize: 18/360*screenWidth,
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
    fontSize: 16/360*screenWidth,
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
    color:'#fff',
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
    left: 224/360*screenWidth,
    top: 0/720*screenHeight*1.125,
    display: 'flex',
    alignItems: 'flex-start',
  },
  changeModButtonWrapper: {
    fontFamily: 'Rokkitt',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 20/360*screenWidth,
    lineHeight: 23/720*screenHeight*1.125,
  }

});

const editPostStyle = StyleSheet.create({
  // fontFamily: 'Rokkitt',
  width: screenWidth,
  height: screenHeight,
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexWrap: 'nowrap',
    padding: 5,
    backgroundColor: '#999',
    width: screenWidth,
    height: screenHeight,
  },

  //title of the post page
  title: {
    flex: 1,
    height: 100,
    fontFamily: 'Rokkitt',
    fontStyle: 'normal',
    fontWeight: 'bold',
    textAlign: 'auto',
    fontsize: 100 * textScale
  },

  subTitle: {
    
    flex: 1,
    height: 100,
    fontStyle: 'normal',
    fontWeight: 'bold',
    textAlign: 'auto',
    fontsize: 10 * textScale
  },

  //enter the title container
  setTitle: {
    flex: 1,
    title: {
    },
    texts:{
      flex: 1,
      height: 80,
      borderColor: 'gray',
      borderWidth: 1,
      fontStyle: 'normal',
      fontWeight: 'normal',
      textAlign: 'auto',
      fontsize: 10 * textScale
    }
  },

  //tage field
  setTages: {
    flex: 1,
    title: {
      flex: 1,
      height: 100,
      fontStyle: 'normal',
      fontWeight: 'bold',
      textAlign: 'auto',
      fontsize: 10 * textScale
    },
    texts:{
      flex: 1,
      height: 100,
      fontStyle: 'normal',
      fontWeight: 'normal',
      textAlign: 'auto',
      fontsize: 10 * textScale
    }
  },

  //contant field
  setContant: {
    flex: 5,
    title: {
      flex: 1,
      height: 100,
      fontStyle: 'normal',
      fontWeight: 'bold',
      textAlign: 'auto',
      fontsize: 10 * textScale
    },
    texts:{
      flex: 7,
      height: 100,
      fontStyle: 'normal',
      fontWeight: 'normal',
      textAlign: 'auto',
      fontsize: 10 * textScale
    }
  },

  //image, urls field
  setURL: {
    flex: 1,
    title: {
      flex: 1,
      height: 100,
      fontStyle: 'normal',
      fontWeight: 'bold',
      textAlign: 'auto',
      fontsize: 10 * textScale
    },
    texts:{
      flex: 1,
      height: 100,
      fontStyle: 'normal',
      fontWeight: 'normal',
      textAlign: 'auto',
      fontsize: 10 * textScale
    }
  },

  //warning
  warning: {
    position: 'absolute',
    flex: 1,
    color: 'red',
    fontFamily: 'Rokkitt',
    fontWeight: 'bold',
    fontSize: 18/360*screenWidth,
  },

  //post button
  postButton: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    title: {
      fontStyle: 'bold',
      fontWeight: '600',
      // fontSize: 36/360*screenWidth,
      // lineHeight: 41/720*screenHeight*1.125,
      color:'#fff',
    },
    button: {
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    }
  }

});
