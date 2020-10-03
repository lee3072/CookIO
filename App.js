// firebase.firestore().collection().doc().update().arrayUnion() create the array if there is no array or addes element to it if it exist 
// user does not contain array for following users/topics, saved other user's posts, up/down voted posts, posted comments
// those will be added when by arrayUnion() when new posts are created or user followed new users/topics or saved other user's posts
// or up/down voted posts or posted comments on other posts
 
import React, {useState} from 'react';
import { YellowBox} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
//import * as firebase from "firebase";


import SignInPage from './src/screens/SignInPage';
import SignUpPage from './src/screens/SignUpPage';
import CreateProfilePage from './src/screens/CreateProfilePage';
import ProfilePage from './src/screens/ProfilePage';
import EditProfilePage from './src/screens/EditProfilePage';
import ChangePasswordPage from './src/screens/ChangePasswordPage';
import MakePostPage from './src/screens/MakePostPage'
import firebase from './firebase_setup';

let customFonts = {
  'Rokkitt': require('./src/assets/fonts/rokkitt/Rokkitt-Regular.ttf'),
  'Merriweather': require('./src/assets/fonts/merriweather/Merriweather-Regular.otf'),
};

const Stack = createStackNavigator();

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
            <Stack.Screen name="CreateProfilePage" component={CreateProfilePage}/>
            <Stack.Screen name="ProfilePage" component={ProfilePage}/>
            <Stack.Screen name="EditProfilePage" component={EditProfilePage}/>
            <Stack.Screen name="ChangePasswordPage" component={ChangePasswordPage}/>
            <Stack.Screen name="MakePostPage" component={MakePostPage}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return <AppLoading />
    }
  }
}

