import React, { useState } from "react";
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Header from "../components/CupertinoHeaderWithActionButton";
import 'firebase/firestore';
import firebase from '../../firebase_setup';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from "expo-permissions";
import styles from './auth_styles';


function EditPostPage({ navigation }) {
  const [title, setTitle] = useState('');
  const [tages, setTages] = useState('');
  const [texts, setContent] = useState('');
  const [imgs, setImgs] = useState(''); 

  const changeMod = () => {
    navigation.navigate('ProfilePage')
  }

  let db = firebase.firestore();
  const postRef = db.collection("Posts");
  const currentUserRef = firebase.auth().currentUser.uid.toString();

  //post as normal link user => post and post => user
  const post = async (uri) => {
    
    const ref = await postRef.add({
      PostedDate: Date(),
      postedUser: currentUserRef,
      Title: title,
      Tag: tages.split("#"),
      Content:  texts,
      Image: imgs.split(" "),
    })
    db.collection("Users").doc(currentUserRef).update({
      postedPosts: firebase.firestore.FieldValue.arrayUnion(ref.id)
    })    

  }

  //post as anonymous only link user => post
  const anPost = async () => {
    const ref = await postRef.add({
      PostedDate: Date(),
      Title: title,
      Tag: tages.split("#"),
      Content:  texts,
      Image: imgs.split(" "),
    })
    db.collection("Users").doc(currentUserRef).update({
      postedPosts: firebase.firestore.FieldValue.arrayUnion(ref.id)
    })    
  }
  return (
    <View style={styles.container}>
      
      <View style={styles.cupertinoHeaderWithActionButton}>
        <Header title='Edit Post' lastPage='SignInPage' navi={navigation}/>
      </View>      
      <View style={styles.group}>
        <Text style={styles.title}>Title:</Text>
        <TextInput multiline={true} maxLength={40} style={styles.titleText} value={title} placeholder='Enter the name of the post' onChangeText={(e) => setTitle(e)}></TextInput>
      </View>
      <View style={styles.group1Stack}>
        <View style={styles.group1}>
          <Text style={styles.tages}>Tages:</Text>
          <TextInput multiline={true} maxLength={40}  style={styles.tagsText} value={tages} placeholder='#tage1 #tage2 ...' onChangeText={(e) => setTages(e)}></TextInput>
        </View>
        <View style={styles.group2}>
          <Text style={styles.content}>Content:</Text>
          <TextInput multiline={true} textAlign='left' maxLength={200} textAlignVertical='top' style={styles.contentText} value={texts} placeholder='say something..' onChangeText={(e) => setContent(e)}></TextInput>
        </View>
      </View>
      <View style={styles.group3}>
        <Text style={styles.images}>Images:</Text>
        <TextInput style={styles.imgText} value={imgs} placeholder='url1 url2 ...' onChangeText={(e) => setImgs(e)}></TextInput>
      </View>
      <TouchableOpacity onPress={post} style={[styles.buttonContainer]}>
          <Text style={styles.post}>post</Text>
      </TouchableOpacity> 
      <TouchableOpacity onPress={anPost} style={[styles.buttonContainer]}>
          <Text style={styles.post}>post as anonymous</Text>
      </TouchableOpacity> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cupertinoHeaderWithActionButton: {
    height: 40,
    marginTop: 20
  },
  buttonContainer: {
    backgroundColor: "#999999",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
    flexDirection: "row",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    minWidth: 88,
    maxWidth: 200,
    paddingLeft: 16,
    paddingRight: 16
  },
  post: {
    color: "#000000",
    fontSize: 14
  },
  cupertinoHeaderWithActionButtonStack: {
    height: 40,
    marginTop: 20
  },
  group: {
    width: 300,
    height: 50,
    marginTop: 11,
    marginLeft: 30
  },
  title: {
    fontFamily: "Merriweather",
    color: "#121212",
    height: 20,
    width: 90
  },
  titleText: {
    width: 300,
    minHeight: 30,
    height: 'auto',
    backgroundColor: "#E6E6E6"
  },
  group1: {
    top: 0,
    left: 0,
    width: 300,
    height: 50,
    position: "absolute"
  },
  tages: {
    fontFamily: "Merriweather",
    color: "#121212",
    height: 20,
    width: 90
  },
  tagsText: {
    width: 300,
    minHeight: 30,
    height: 'auto',
    backgroundColor: "#E6E6E6"
  },
  group2: {
    top: 49,
    left: 0,
    width: 300,
    height: 50,
    position: "absolute"
  },
  content: {
    fontFamily: "Merriweather",
    color: "#121212",
    height: 20,
    width: 90
  },
  contentText: {
    width: 300,
    minHeight: 100,
    height: 'auto',
    backgroundColor: "#E6E6E6"
  },
  group1Stack: {
    width: 300,
    height: 99,
    marginLeft: 30
  },
  group3: {
    width: 300,
    height: 150,
    marginTop: 70,
    marginLeft: 30
  },
  images: {
    fontFamily: "Merriweather",
    color: "#121212",
    height: 20,
    width: 90
  },
  imgText: {
    width: 300,
    minHeight: 30,
    height: 'auto',
    backgroundColor: "#E6E6E6"
  },
});

export default EditPostPage;
