// firebase.firestore().collection().doc().update().arrayUnion() create the array if there is no array or addes element to it if it exist 
// user does not contain array for following users/topics, saved other user's posts, up/down voted posts, posted comments
// those will be added when by arrayUnion() when new posts are created or user followed new users/topics or saved other user's posts
// or up/down voted posts or posted comments on other posts
 
import React, {useState} from 'react';
import { YellowBox} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import DirectMessageMainPage from './src/screens/DirectMessageMainPage'
import DirectMessageMainAllUserPage from './src/screens/DirectMessageMainAllUserPage'
import DirectMessageUserPage from './src/screens/DirectMessageUserPage'
import SignInPage from './src/screens/SignInPage';
import SignUpPage from './src/screens/SignUpPage';
import CreateProfilePage from './src/screens/CreateProfilePage';
import ProfilePage from './src/screens/ProfilePage';
import EditProfilePage from './src/screens/EditProfilePage';
import ChangePasswordPage from './src/screens/ChangePasswordPage';
import MakePostPage from './src/screens/MakePostPage'
import EditPost from './src/screens/EditPost';
import FeedPage from './src/screens/FeedPage'
import PostView from './src/screens/PostView'
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

  async askPermissions () {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }
    return true;
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount() {
    YellowBox.ignoreWarnings(['Setting a timer for a long'])
    this._loadFontsAsync();
    this.askPermissions();
  }
  render() {
    if (this.state.fontsLoaded) {
      return (
        <NavigationContainer>
          <StatusBar style="light"></StatusBar>
          <Stack.Navigator screenOptions={{headerShown: false}} >
            <Stack.Screen name="SignInPage" component={SignInPage}/>
            <Stack.Screen name="SignUpPage" component={SignUpPage}/>
            <Stack.Screen name="DirectMessageMainPage" component={DirectMessageMainPage}/>
            <Stack.Screen name="DirectMessageMainAllUserPage" component={DirectMessageMainAllUserPage}/>
            <Stack.Screen name="DirectMessageUserPage" component={DirectMessageUserPage}/>
            <Stack.Screen name="CreateProfilePage" component={CreateProfilePage}/>
            <Stack.Screen name="ProfilePage" component={ProfilePage}/>
            <Stack.Screen name="EditProfilePage" component={EditProfilePage}/>
            <Stack.Screen name="ChangePasswordPage" component={ChangePasswordPage}/>
            <Stack.Screen name="MakePostPage" component={MakePostPage}/>
            <Stack.Screen name="FeedPage" component={FeedPage}/>
            {/* <Stack.Screen name="EditPost" component={EditPost}/> */}
            <Stack.Screen name="PostView" component={PostView}/>

          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return <AppLoading />
    }
  }
}

