







const EditPost = ({ navigation }) => {

  const [text, setText] = useState("");
  const [image, setImage] = useState();

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
      })
      db.collection("Users").doc(currentUserRef).update({
        postedPosts: firebase.firestore.FieldValue.arrayUnion(ref.id)
      })  
      
      return url;

    } catch (error) {
      console.log("Error @uploadProfilePhoto: ", error)
    }

      
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

      if (!result.cancelled) {
        setImage({localUri:result.uri});

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

        <TextInput 
        multiline={true} 
        maxLength={10} 
        textAlignVertical='top' 
        style={styles.postInput} 
        value={text} 
        placeholder='Type Here' 
        onChangeText={(e) => setText(e)}></TextInput>

        <TextInput 
        multiline={true} 
        maxLength={40}  style={styles.titleInput} value={tags} placeholder='#tage1 #tage2 ...' onChangeText={(e) => setTags(e)}></TextInput>

        <TouchableOpacity 
          onPress={openImage}  
          style={styles.button}>
            {image ? (
              <Image source={{uri: image}}/>
            ): <Text style={styles.buttonText}>Image</Text>} 
        </TouchableOpacity>        
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

    
  );

}


export default EditPost;