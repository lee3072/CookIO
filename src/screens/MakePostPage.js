import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import * as Font from 'expo-font';
import firebase from '../../firebase_setup';
import * as ImagePicker from 'expo-image-picker';
import 'firebase/firestore';
import styles from '../styles/post_styles';


const MakePostPage = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [selectImg, setSelectedImg] = useState(null);
  const [url, setUrl] = useState("");
  const [warning, setWarning] = useState("");
  const [image, setImage] = useState(null);

  const changeMod = () => {
    navigation.navigate('ProfilePage')
  }
  
  const postButtonHandler = () => {
    let db = firebase.firestore()
    if (text !== ''){
    db.collection("Posts").doc("makepost").get().then(doc => {
        db.collection("Posts").doc(firebase.auth().currentUser.uid.toString()).update({
            title: title,
            text: text,
            tags: tags,
            selectImg: selectImg,
        })
        
        setTitle('')
        setText('')
        setTags('')
        setImage('');
        setSelectedImg(null);
        navigation.navigate('ProfilePage')
       
    })
    }
    else {
    setWarning('Username cannot be empty!')
    }



    uploadPhotoAsync = async uri => {
      const path = 'photos/${this.uid}/${Date.now()}.jpg'
      
    }
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
    <View style={styles.postcontainer}>
      <StatusBar style="auto" />
      <View style={styles.buttonContent} >
        <TouchableOpacity onPress={changeMod} style={styles.button}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={postButtonHandler} style={styles.button}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContent} >
        <TextInput 
          style = {styles.titleInput}
          placeholder="Title"
          textAlignVertical={'top'}
          onChangeText={(e) => setTitle(e)}
          />
        {
          selectImg !== null ? (
            <Image
            style={styles.image}
            source={{uri:(selectImg.localUri !== null) ? selectImg.localUri : 'https://www.shutterstock.com/image-photo/yuzu-citron-tea-93229276'}}/>
          ) : <Text>   Picture uploads here</Text>
        }
        <TextInput 
          style = {styles.postInput}
          placeholder="Type here"
          textAlignVertical={'top'}
          onChangeText={(e) => setText(e)}
          />
        <TextInput 
          style = {styles.titleInput}
          placeholder="Tags"
          textAlignVertical={'top'}
          onChangeText={(e) => setTags(e)}
        />
        <TouchableOpacity 
          onPress={openImage}  
          style={styles.button}>
          <Text style={styles.buttonText}>Image</Text>
        </TouchableOpacity>
      </View>
    </View>  
  );

}
export default MakePostPage;