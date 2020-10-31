import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import * as Font from 'expo-font';
import firebase from '../../firebase_setup';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from "expo-permissions";
import 'firebase/firestore';
import { Ionicons } from "@expo/vector-icons";
import { firestore } from 'firebase';
import styles from '../styles/post_styles';


//const EditPost = ({ navigation }) => {
const EditPostPage = ( props ) => {
  const [image, setImage] = useState(props.route.params.post.image);
  const [text, setText] = useState(props.route.params.post.content);
  const [title, setTitle] = useState(props.route.params.post.title);
  const [tags, setTags] = useState("");
  
  const changeMod = () => {
      props.navigation.navigate('ProfilePage')
    }

  let db = firebase.firestore();
  const postRef = db.collection("Posts");
  const currentUserRef = firebase.auth().currentUser.uid.toString();
  var ref = null;
  var updateRef = null;

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
    if (image == '') {
      setImage({image: props.route.params.post.id});
    }
    if (tags == '') {
      setTags({tags: props.route.params.post.tags});
    }
    updateRef = await postRef.doc(props.route.params.post.id).update({
      ID: props.route.params.post.id,
      Title: title,
      Content:  text,
      Tag: tags.split("#"),
      Image: image,
      PostedUser: currentUserRef,
      PostedDate: Date(),
      DownVote: 0,
      UpVote: 0,
      VotedUser: [],
    })
  }

  const handlePost = async () => {
    await initPost();
    props.navigation.navigate("ListTopicPage");  

  }

  const handlePostAno = async () => {
    await initPost();
    updateRef.doc(props.route.params.post.id).update({
      PostedUser: "anonymous",
    })
    props.navigation.navigate("ListTopicPage");
  }

  const pickImage = async () => {
      let permission = await ImagePicker.requestCameraRollPermissionsAsync();
      if (permission.granted == false) {
          return;
      }   
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
          setImage({localUri:result.uri});
      }
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


  return (
      <SafeAreaView style={styles.container}>
          <View style={styles.header}>
              <TouchableOpacity onPress={changeMod}>
                  <Ionicons name="md-arrow-back" size={24} color="#D8D9DB"></Ionicons>
              </TouchableOpacity>
              <TouchableOpacity onPress = {handlePost}>
                  <Text style={{ fontWeight: "500" }}>Post</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress = {handlePostAno}>
                  <Text style={{ fontWeight: "500" }}>PostAno</Text>
              </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
              <TextInput autoFocus={true} multiline={true} numberOfLines={1} style={{ flex: 1 }} placeholder="Title of the post" onChangeText={title => setTitle(title)} value = {title}></TextInput>
          </View>
          <View style={styles.inputContainer}>
              <TextInput autoFocus={true} multiline={true} numberOfLines={10} style={{ flex: 1 }} placeholder="Want to share something?" textAlignVertical = 'top' onChangeText={text => setText(text)} value = {text}></TextInput>
          </View>
          <View style={styles.tagContainer}>
              <TextInput autoFocus={true} multiline={true} numberOfLines={1} style={{ flex: 1 }} placeholder="#tag1 #tag2.." onChangeText={tags => setTags(tags)} value = {tags}></TextInput>
          </View>
          <TouchableOpacity style={styles.photo} onPress={pickImage}>
              <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
          </TouchableOpacity>
          <View style={{marginHorizontal: 32, marginTop: 32, height: 150, resizeMode: "contain"}}>
              <Image source={{uri:image.localUri}} style={{width:"100%", height: "100%"}}></Image>
          </View>
      </SafeAreaView>
  );
}

export default EditPostPage;