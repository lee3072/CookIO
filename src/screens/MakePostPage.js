import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Alert } from 'react-native';
import * as Font from 'expo-font';
import firebase from '../../firebase_setup';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from "expo-permissions";
import 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";
import { firestore } from 'firebase';
import styles from '../styles/post_styles';
import { colors } from 'react-native-elements';


const EditPost = ({ navigation }) => {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("default");

  const changeMod = () => {
    navigation.navigate('ProfilePage')
  }

  let db = firebase.firestore();
  const postRef = db.collection("Posts");
  const currentUserRef = firebase.auth().currentUser.uid.toString();
  var ref = null;

  const initPost = async () => {
    //see if title is empty
    if (title == '') {
      alert('Please Enter Title');
      return;
    }
    //see if the content is empty
    if (text == '') {
      alert('Please Enter Cotent');
      return;
    }
    //create post
    ref = await postRef.add({
      ID: "temp",
      Title: title,
      Content: text,
      Tag: tags,
      Image: image,
      PostedUser: "anonymous",
      PostedUserName: "anonymous",
      PostedDate: Date(),
      DownVote: 0,
      UpVote: 0,
      VotedUser: [],
      CommentsIDs: [],
    })
    //add post to tag
    var topicRef = db.collection("Tags").doc(tags);
    const topicList = await topicRef.get();
    //if the tags does not exist in the database, add it to the database
    if (topicList.exists) {
      // if exist
      topicRef.update({
        list: firebase.firestore.FieldValue.arrayUnion(ref.id)
      })
    } else {
      // if does not exist, creat new tag
      topicRef = db.collection("Tags").doc(tags).set({
        ID: tags,
        list: [ref.id],
        date: Date(),
      });
    }
    //if there is a image attached
    if (image != "") {
      let imgref = await uploadImage(image, `post/${ref.id.toString()}`);
      ref.update({
        Image: imgref,
      })
    }
  }

  const handlePost = async () => {
    // if (image != "") {
      await initPost();
      db.collection('Users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(doc => {
        ref.update({
          ID: ref.id.toString(),
          PostedUser: currentUserRef,
          PostedUserName: doc.data().userName
        })
      })
      db.collection("Users").doc(currentUserRef).update({
        postedPosts: firebase.firestore.FieldValue.arrayUnion(ref.id)
      })
      navigation.navigate("ProfilePage");
    // } else {
    //   Alert.alert("Please select an Image");
    // }
  }

  const handlePostAno = async () => {
    // if (image != "") {
      await initPost();
      ref.update({
        ID: ref.id.toString(),
      })
      db.collection("Users").doc(currentUserRef).update({
        postedPosts: firebase.firestore.FieldValue.arrayUnion(ref.id)
      })
      navigation.navigate("ProfilePage");
    // } else {
    //   Alert.alert("Please select an Image");
    // }
  }

  uploadImage = async (uri, filenname) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase.storage().ref(filenname).put(file);

      upload.on(
        "state_changed",
        snapshot => { },
        err => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  const pickImage = async () => {
    // let permission = await ImagePicker.requestCameraRollPermissionsAsync();
    // if (permission.granted == false) {
    //     return;
    // }   
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={changeMod}>
          <Ionicons name="md-arrow-back" size={24} color="#D8D9DB"></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePost}>
          <Text style={{ fontWeight: "500" }}>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePostAno}>
          <Text style={{ fontWeight: "500" }}>PostAno</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <TextInput autoFocus={true} maxLength={50} multiline={true} numberOfLines={1} style={{ flex: 1 }} placeholder="Title of the post" onChangeText={title => setTitle(title)} value={title}></TextInput>
      </View>
      <View style={styles.inputContainer}>
        <TextInput autoFocus={true} maxLength={50} multiline={true} numberOfLines={10} style={{ flex: 1 }} placeholder="Want to share something?" textAlignVertical='top' onChangeText={text => setText(text)} value={text}></TextInput>
      </View>
      <View style={styles.tagContainer}>
        <TextInput autoFocus={true} maxLength={50} multiline={true} numberOfLines={1} style={{ flex: 1 }} placeholder="please enter exicelly one tag or no tag" onChangeText={tags => setTags(tags)} value={tags}></TextInput>
      </View>
      <TouchableOpacity style={styles.photo} onPress={pickImage}>
        <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
      </TouchableOpacity>
      <View style={{ marginHorizontal: 32, marginTop: 32, height: 400, resizeMode: "contain" }}>
        <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }}></Image>
      </View>
    </SafeAreaView>
  );
}

export default EditPost;