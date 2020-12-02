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
import DirectMessageUserPage from './src/screens/DirectMessageUserPage'
import SignInPage from './src/screens/SignInPage';
import SignUpPage from './src/screens/SignUpPage';
import CreateProfilePage from './src/screens/CreateProfilePage';
import ProfilePage from './src/screens/ProfilePage';
import GuestProfilePage from './src/screens/GuestProfilePage';
import EmptyProfilePage from './src/screens/EmptyProfilePage';
import FollowingPage from './src/screens/FollowingPage';
import FollowingTagPage from './src/screens/FollowingTagPage';
import BlockListPage from './src/screens/BlockListPage';
import EditProfilePage from './src/screens/EditProfilePage';
import ChangePasswordPage from './src/screens/ChangePasswordPage';
import DeleteAccountPage from './src/screens/DeleteAccountPage';
import MakePostPage from './src/screens/MakePostPage'
import ListTopicPage from './src/screens/ListTopicPage'
import ListPostPage from './src/screens/ListPostPage'
import PostView from './src/screens/PostView'
import UsersProfilePage from './src/screens/UsersProfilePage';
import EditPostPage from './src/screens/EditPostPage';
import GuestErrorPage from './src/screens/GuestErrorPage';
import FollowPostPage from './src/screens/FollowPostPage';
import GuestViewPage from './src/screens/GuestViewPage';
import SavedPostPage from './src/screens/SavedPostPage';
import UserLinePage from './src/screens/UserLinePage'
import ShowUserActivityPage from './src/screens/ShowUserActivityPage'
import ShowUserPostsPage from './src/screens/ShowUserPostsPage'

// import FeedPage from './src/screens/FeedPage';
// import PostView from './src/screens/PostView';
import UserFeedPage from './src/screens/UserFeedPage';
import UserPostView from './src/screens/UserPostView';
import firebase from './firebase_setup';

console.disableYellowBox = true; //this hides warning from expo

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
            <Stack.Screen name="GuestViewPage" component={GuestViewPage}/>
            <Stack.Screen name="GuestProfilePage" component={GuestProfilePage}/>
            <Stack.Screen name="SignUpPage" component={SignUpPage}/>
            <Stack.Screen name="DirectMessageMainPage" component={DirectMessageMainPage}/>
            <Stack.Screen name="DirectMessageUserPage" component={DirectMessageUserPage}/>
            <Stack.Screen name="CreateProfilePage" component={CreateProfilePage}/>
            <Stack.Screen name="GuestErrorPage" component={GuestErrorPage}/>
            <Stack.Screen name="ProfilePage" component={ProfilePage}/>
            <Stack.Screen name="EmptyProfilePage" component={EmptyProfilePage}/>
            <Stack.Screen name="BlockListPage" component={BlockListPage}/>
            <Stack.Screen name="FollowingPage" component={FollowingPage}/>
            <Stack.Screen name="FollowingTagPage" component={FollowingTagPage}/>
            <Stack.Screen name="UsersProfilePage" component={UsersProfilePage}/>
            <Stack.Screen name="EditProfilePage" component={EditProfilePage}/>
            <Stack.Screen name="ChangePasswordPage" component={ChangePasswordPage}/>
            <Stack.Screen name="DeleteAccountPage" component={DeleteAccountPage}/>
            <Stack.Screen name="MakePostPage" component={MakePostPage}/>
            <Stack.Screen name="ListPostPage" component={ListPostPage}/>
            <Stack.Screen name="ListTopicPage" component={ListTopicPage}/>
            <Stack.Screen name="UserPostView" component={UserPostView}/>
            <Stack.Screen name="EditPostPage" component={EditPostPage}/> 
            <Stack.Screen name="UserFeedPage" component={UserFeedPage}/>
            <Stack.Screen name="FollowPostPage" component={FollowPostPage}/>
            <Stack.Screen name="SavedPostPage" component={SavedPostPage}/>
            <Stack.Screen name="PostView" component={PostView}/>
            <Stack.Screen name="UserLinePage" component={UserLinePage}/>
            <Stack.Screen name="ShowUserActivityPage" component={ShowUserActivityPage}/>
            <Stack.Screen name="ShowUserPostsPage" component={ShowUserPostsPage}/>

          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return <AppLoading />
    }
  }
}

