import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import * as Font from 'expo-font';
import firebase from '../../firebase_setup';
import * as ImagePicker from 'expo-image-picker';
import 'firebase/firestore';
import styles from './auth_styles';


const EditPost = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [selectImg, setSelectedImg] = useState(null);
  const [url, setUrl] = useState("");
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


/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB"
  },
  titleInput: {
    margin: 10,
    padding: 5,
    height: '5%',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  buttonContent: {
    height: '10%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContent: {
    flex: 1,
    flexDirection: 'column',
  },

  boldText: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  lightText: {
    fontWeight: 'normal',
    fontSize: 22,
  },
  lable_input: {
    alignItems: 'baseline',
    padding: 20,
    backgroundColor: 'lightgray',
  },
  basic_input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#777',
    textAlign: 'center',
  },
  button: {
    width: 70,
    height: 20,
    backgroundColor:'lightgray',
    borderRadius: 25,  //makes the end round
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  postInput: {
    margin: 10,
    padding: 5,
    height: '40%',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  image: {
    width: '90%',
    height: '30%',
    margin: 20,
    resizeMode: 'contain',
  }
});*/
export default EditPost;