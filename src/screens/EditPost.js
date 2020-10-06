import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Font from 'expo-font';
import firebase from '../../firebase_setup';
import * as ImagePicker from 'expo-image-picker';
import 'firebase/firestore';
import styles from './auth_styles';


const EditPost = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [selectImg, setSelectedImg] = useState("");
  const [url, setUrl] = useState("");
  /*const [image, setImage] = useState(null);*/

  const changeMod = () => {
    navigation.navigate('ProfilePage')
  }




  let db = firebase.firestore();
  const postRef = db.collection("Posts");
  const currentUserRef = firebase.auth().currentUser.uid.toString();
  //post as normal link user => post and post => user
  const post = async () => {
    const ref = await postRef.add({
      PostedDate: Date(),
      postedUser: currentUserRef,
      Title: title,
      Tag: tags.split("#"),
      Content:  text,
      selectImg: selectImg.split(" "),
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
      Tag: tags.split("#"),
      Content:  text,
      selectImg: selectImg.split(" "),
    })
    db.collection("Users").doc(currentUserRef).update({
      postedPosts: firebase.firestore.FieldValue.arrayUnion(ref.id)
    })    
  }




  openImage = async () => {
    let permission = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permission.granted == false) {
      return;
    }

    let picker = await ImagePicker.launchImageLibraryAsync();
    
    if (picker.cancelled == true) {
      return;
    }
    setSelectedImg({localUri:picker.uri});
    console.log(picker);
  }


  
  return (

    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.postcontainer}
    >
      <View style={styles.buttonContent} >
          <TouchableOpacity onPress={changeMod} style={styles.button}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={post} style={styles.button}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

      <View style={styles.inputContent} >
        <TextInput multiline={true} 
        maxLength={40} style = {styles.titleInput} value={title} placeholder='Enter the name of the post' onChangeText={(e) => setTitle(e)}></TextInput>


        {/*<TextInput 
          style = {styles.titleInput}
          placeholder="Title"
          textAlignVertical={'top'}
          onChangeText={(e) => setTitle(e)}
        />*/}
        
        {/*<TextInput 
          style = {styles.postInput}
          placeholder="Type here"
          textAlignVertical={'top'}
          onChangeText={(e) => setText(e)}
          />*/}
        <TextInput 
        multiline={true} 
        maxLength={10} 
        textAlignVertical='top' 
        style={styles.postInput} 
        value={text} 
        placeholder='Type Here' 
        onChangeText={(e) => setText(e)}></TextInput>
        {/*<TextInput multiline={true} textAlign='left' maxLength={200} textAlignVertical='top' style={styles.postInput} value={text} placeholder='Type Here' onChangeText={(e) => setText(e)}></TextInput>*/}

        <TextInput 
        multiline={true} 
        maxLength={40}  style={styles.titleInput} value={tags} placeholder='#tage1 #tage2 ...' onChangeText={(e) => setTags(e)}></TextInput>

        {/*<TextInput 
          style = {styles.titleInput}
          placeholder="Tags"
          textAlignVertical={'top'}
          onChangeText={(e) => setTags(e)}
        />*/}
        <TouchableOpacity 
          onPress={openImage}  
          style={styles.button}>
          <Text style={styles.buttonText}>Image</Text>
        </TouchableOpacity>
      </View>
        
        {/*<View style={styles.inputContent} >
          
          <TextInput 
          placeholder='Enter the name of the post' 
          multiline={true} 
          maxLength={40} 
          style = {styles.titleInput} 
          value={title} 
          textAlignVertical={'top'} onChangeText={(e) => setTitle(e)}></TextInput>
          
          <TextInput 
          placeholder='Type Here' 
          multiline={true} 
          maxLength={40} 
          style = {styles.basic_input} 
          value={title} 
          textAlignVertical='top'
          onChangeText={(e) => setTitle(e)}></TextInput>



        </View>*/}



      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

    
  );

}


export default EditPost;