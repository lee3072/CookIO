import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import firebase from '../../firebase_setup';
import 'firebase/firestore';
import "firebase/storage";
//import { TextInput } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import styles from '../styles/post_styles';


var db = firebase.firestore();

class EditPostPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.route.params.id,
            title: "default title",
            uid: firebase.auth().currentUser.uid.toString(),
            image: "",
            text: "",
            tags: "",

            newTitle: "",
            newImage: '',
            newText: "",
            newTags: "",
        }
        this.getEverthing();
    }

    getEverthing = async () => {
        let db = firebase.firestore();
        let postRef = db.collection('Posts').doc(this.state.id);
        const post = await postRef.get();
        this.setState({
            title: post.get('Title'),
            image: post.get('Image'),
            text: post.get('Content'),
            tags: post.get('Tag'),
        })
        console.log('Edit Post Page-------------------------');
        console.log("id: ", this.state.id);
        console.log("title: ", this.state.title);
        console.log("image: ", this.state.image);
        console.log("text: ", this.state.text);
        console.log("tags: ", this.state.tags);
        //console.log(this.state.users.includes(this.state.uid));        
    }

    componentDidMount() {
        this.setState({newTitle: this.state.title})
        this.setState({newImage: this.state.image})
        this.setState({newText: this.state.text})
        //this.setState({newTags: this.state.tags})
        
        
        /*db.collection('Posts')
            .doc(this.state.id.Title).set(this.state.newTitle)*/
            /*.get()
            .then(postTitle => {
                this.setState({title: postTitle})
                this.setState({newTitle: postTitle})
            })*/
            ;
        
    }

    changeMod = () => {
        this.props.navigation.navigate('ProfilePage')
      }
  

    initPost = async () => {
        //see if title is empty
        if (this.state.title == '') {
          alert('Please Enter Title');
          return;
        }
        //see if the content is empty
        if (this.state.newtext == '') {
            alert('Please Enter Cotent');
            return;
        }
        
        ref = await postRef.add({
          ID: "temp",
          Title: this.state.title,
          Content:  this.state.text,
          Tag: this.state.tags.split("#"),
          Image: this.state.image,
          PostedUser: "anonymous",
          PostedDate: Date(),
          DownVote: 0,
          UpVote: 0,
          VotedUser: [],
        })
      }
    
      handlePost = async () => {
        await initPost();
        ref.update({
          ID: ref.id.toString(),
          PostedUser: currentUserRef,
        })
        db.collection("Users").doc(currentUserRef).update({
          postedPosts: firebase.firestore.FieldValue.arrayUnion(ref.id)
        }) 
        this.props.navigation.navigate("ProfilePage"); 
      }
    
      handlePostAno = async () => {
        await initPost();
        ref.update({
          ID: ref.id.toString(),
        })
        db.collection("Users").doc(currentUserRef).update({
          postedPosts: firebase.firestore.FieldValue.arrayUnion(ref.id)
        }) 
        this.props.navigation.navigate("ProfilePage"); 
      }
    
      pickImage = async () => {
          let permission = await ImagePicker.requestCameraRollPermissionsAsync();
          if (permission.granted == false) {
              return;
          }   
          let result = await ImagePicker.launchImageLibraryAsync();
          if (!result.cancelled) {
              setImage({localUri:result.uri});
              //console.log(image);
          }
      }

    render() {
        return(
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.changeMod}>
                        <Ionicons name="md-arrow-back" size={24} color="#D8D9DB"></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {this.handlePost}>
                        <Text style={{ fontWeight: "500" }}>Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {this.handlePostAno}>
                        <Text style={{ fontWeight: "500" }}>PostAno</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <TextInput autoFocus={true} multiline={true} numberOfLines={1} style={{ flex: 1 }} placeholder="Title of the post" 
                    //onChangeText={(title) => this.setState(title)} 
                    onChangeText={(text) => {this.setState({newTitle: text}) }}

                    value = {this.state.title}>

                    </TextInput>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput autoFocus={true} multiline={true} numberOfLines={10} style={{ flex: 1 }} placeholder="Want to share something?" textAlignVertical = 'top' onChangeText={text => setText(text)} value = {this.state.text}></TextInput>
                </View>
                <View style={styles.tagContainer}>
                    <TextInput autoFocus={true} multiline={true} numberOfLines={1} style={{ flex: 1 }} placeholder="#tag1 #tag2.." onChangeText={tags => setTags(this.state.tags)} /*value = {this.state.tags.split(",")}*/></TextInput>
                </View>
                <TouchableOpacity style={styles.photo} onPress={this.pickImage}>
                    <Ionicons name="md-camera" size={32} color="#D8D9DB"></Ionicons>
                </TouchableOpacity>
                <View style={{marginHorizontal: 32, marginTop: 32, height: 150, resizeMode: "contain"}}>
                    <Image source={{uri:this.state.image.localUri}} style={{width:"100%", height: "100%"}}></Image>
                </View>
            </SafeAreaView>
        )
    }

}


export default EditPostPage;