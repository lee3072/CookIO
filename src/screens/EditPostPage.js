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
  const [tags, setTags] = useState(props.route.params.post.tag);
  
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
      setTags({tags: props.route.params.post.tag});
    }
    updateRef = await postRef.doc(props.route.params.post.id).update({
      ID: props.route.params.post.id,
      Title: title,
      Content:  text,
      Tag: tags,
      Image: image,
      PostedUser: currentUserRef,
      PostedDate: Date(),
      DownVote: 0,
      UpVote: 0,
      VotedUser: [],
    })
    
    db.collection("Tags").doc(props.route.params.post.tag).update({
      list: firebase.firestore.FieldValue.arrayRemove(props.route.params.post.id)
    })

    db.collection("Tags").doc(props.route.params.post.tag).get().then( doc => {
      if (doc.data().list.length == 0) db.collection("Tags").doc(props.route.params.post.tag).delete();
    })

    var topicRef = db.collection("Tags").doc(tags);
    const topicList = await topicRef.get();
    //if the tags does not exist in the database, add it to the database
    if (topicList.exists) {
      // if exist
      topicRef.update({
        list: firebase.firestore.FieldValue.arrayUnion(props.route.params.post.id)
      })
    } else {
      // if does not exist, creat new tag
      topicRef = db.collection("Tags").doc(tags).set({
        ID: tags,
        list: [props.route.params.post.id],
        date: Date(),
      });
    }



    if (image != "") {
      let imgref = await uploadImage(image, `post/${props.route.params.post.id.toString()}`);
      postRef.doc(props.route.params.post.id).update({
        Image: imgref,
      })
    }
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
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
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
          <TextInput autoFocus={true} maxLength={50} multiline={true} numberOfLines={1} style={{ flex: 1 }} placeholder="please enter exicelly one tag or no tag" onChangeText={tags => setTags(tags)} value={tags}></TextInput>
          </View>
          <TouchableOpacity style={styles.photo} onPress={pickImage}>
              <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
          </TouchableOpacity>
          <View style={{marginHorizontal: 32, marginTop: 32, height: 150, resizeMode: "contain"}}>
          <Image source={{ uri: image }} style={{ width: "100%", height: "100%" }}></Image>
          </View>
      </SafeAreaView>
  );
}

export default EditPostPage;