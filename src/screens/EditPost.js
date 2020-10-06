import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import * as Font from 'expo-font';
import firebase from '../../firebase_setup';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from "expo-permissions";
import 'firebase/firestore';
import styles from './auth_styles';


const EditPost = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [selectImg, setSelectedImg] = useState("");
  const [image, setImage] = useState();
  const [url, setUrl] = useState("");
  /*const [image, setImage] = useState(null);*/

  const changeMod = () => {
    navigation.navigate('ProfilePage')
  }




  let db = firebase.firestore();
  const postRef = db.collection("Posts");
  const currentUserRef = firebase.auth().currentUser.uid.toString();
  const uid = firebase.auth().currentUser.uid;
  //post as normal link user => post and post => user
  const post = async (uri) => {

    try {
      const photo = await Firebaase.getBlob(uri)

      const imageRef = firebase.storage().ref("image").child(uid)
      await imageRef.put(photo);

      const url = await imageRef.getDownloadURL();

      const ref = await postRef.add({
        PostedDate: Date(),
        postedUser: currentUserRef,
        Title: title,
        Tag: tags.split("#"),
        Content:  text,
        image: url,
        //selectImg: selectImg.split(" "),
      })
      db.collection("Users").doc(currentUserRef).update({
        postedPosts: firebase.firestore.FieldValue.arrayUnion(ref.id)
      })  
      
      return url;

    } catch (error) {
      console.log("Error @uploadProfilePhoto: ", error)
    }

      
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

  const getPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      return status;
    }
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync();

      /*let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });*/

      if (!result.cancelled) {
        setImage({localUri:result.uri});
        //alert("We need permission to access your camera roll.");

        return;
      }
    } catch (error) {
      console.log("Error @pickImageL ", error);
    }
  }

  const getBlob = async () => {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.onload = () => {
        resolve(xhr.response)
      }

      xhr.onerror = () => {
        reject(new TypeError("Network requet failed"))
      }

      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  }


  const addImage = async () => {
    const status = await getPermission();
    if (status !== "granted") {
      alert("We need permission to access your camera roll.");

      return;
    }
    pickImage();
  }


  const openImage = async () => {
    let permission = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permission.granted == false) {
      return;
    }

    let picker = await ImagePicker.launchImageLibraryAsync();
    
    if (picker.cancelled == true) {
      return;
    }
    //setSelectedImg(picker.uri);
    //setSelectedImg({localUri:picker.uri});
    setImage({localUri:picker.uri});
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
        {/*{image !== null ? (
            <Image
            style={styles.image}
            source={{uri:(image.localUri !== null) ? image.localUri : 'https://www.shutterstock.com/image-photo/yuzu-citron-tea-93229276'}} onChangeText={(e) => setSelectedImg(e)}/>
          ) : <Text>   Picture uploads here</Text>}*/}
          {/*<Image
            style={styles.image}
            source={{uri:(image.localUri !== null) ? image.localUri : 'https://www.shutterstock.com/image-photo/yuzu-citron-tea-93229276'}} onChangeText={(e) => setSelectedImg(e)}/>
          ) : <Text>   Picture uploads here</Text>*/}
        <TouchableOpacity 
          onPress={openImage}  
          style={styles.button}>
            {image ? (
              <Image source={{uri: image}}/>
            ): <Text style={styles.buttonText}>Image</Text>} 
          


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


/*
container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        paddingHorizontal: 32,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB"
    },
    inputContainer: {
        margin: 20,
        flexDirection: "row",
        backgroundColor: "grey"

    },
    tagContainer: {
        margin: 20,
        flexDirection: "row",
        backgroundColor: "grey",
    },
    titleContainer: {
        margin: 20,
        flexDirection: "row",
        borderColor: "#000000",
        borderBottomWidth: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16
    },
    photo: {
        alignItems: "flex-end",
        marginHorizontal: 32
    }
*/

export default EditPost;