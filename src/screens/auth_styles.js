import { Platform, Dimensions, StyleSheet} from 'react-native';
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
if (Platform.OS === 'web') {screenHeight = 720; screenWidth = 405;}

// Style Section Start
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: screenWidth,
        height: screenHeight,
        left: 0,
        top: 0,
        // backgroundColor: '#fff',
        backgroundColor: '#999',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        left: 0,
        top: 0,
    },
    purpose: {
        position: 'absolute',
        width: 207/360*screenWidth,
        height: 43/720*screenHeight*1.125,
        left: 21/360*screenWidth,
        top: 34/720*screenHeight*1.125,
        fontFamily: 'Merriweather',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 36/360*screenWidth,
        lineHeight: 43/720*screenHeight*1.125,
        display: 'flex',
        alignItems: 'center',
        // backgroundColor: '#888',
    },
    purposeModifier: {
        width: 340/360*screenWidth,
    },
    appName: {
        position: 'absolute',
        width: 206/360*screenWidth,
        height: 38/720*screenHeight*1.125,
        left: 77/360*screenWidth,
        top: 88/720*screenHeight*1.125,
        fontFamily: 'Merriweather',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 36/360*screenWidth,
        lineHeight: 43/720*screenHeight*1.125,
        display: 'flex',
        alignItems: 'center',
        // backgroundColor: '#888',
    },
    appNameModifier: {
        width: 300/360*screenWidth,
    }, 
    warning: {
        position: 'absolute',
        left: 21/360*screenWidth,
        top: 145/720*screenHeight*1.125,
        color: 'red',
        fontFamily: 'Rokkitt',
        fontWeight: 'bold',
        fontSize: 18/360*screenWidth,
    },
    question: {
        position: 'absolute',
        width: 318/360*screenWidth,
        height: 94/720*screenHeight*1.125,
        left: 21/360*screenWidth,
    },
    emailAddress: {
        top: 196/720*screenHeight*1.125,
    },
    password: {
        top: 320/720*screenHeight*1.125,
    },
    questionLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 262/360*screenWidth,
        height: 41/720*screenHeight*1.125,
        fontFamily: 'Rokkitt',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 36/360*screenWidth,
        lineHeight: 41/720*screenHeight*1.125,
    },
    questionLabelModifier: {
        width: 300/360*screenWidth,
    },
    questionTextInput: {
        position: 'absolute',
        left: 0,
        top: 46/720*screenHeight*1.125,
        width: 318/360*screenWidth,
        height: 48/720*screenHeight*1.125,
        backgroundColor: '#888',
        fontSize: 16/360*screenWidth,
    },
    submitButton: {
        position: 'absolute',
        width: 205/360*screenWidth,
        height: 66/720*screenHeight*1.125,
        left: 78/360*screenWidth,
        top: 474/720*screenHeight*1.125,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        
    },
    submitButtonTitle: {
        fontFamily: 'Rokkitt',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 36/360*screenWidth,
        lineHeight: 41/720*screenHeight*1.125,
        color:'#fff',
    },
    changeMod: {
        position: 'absolute',
        width: 318/360*screenWidth,
        height: 26/720*screenHeight*1.125,
        left: 21/360*screenWidth,
        top: 580/720*screenHeight*1.125,
    },
    changeModLabel: {
        position: 'absolute',
        width: 207/360*screenWidth,
        height: 26/720*screenHeight*1.125,
        left: 0,
        top: 0,
    
        fontFamily: 'Rokkitt',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 18/360*screenWidth,
        lineHeight: 20/720*screenHeight*1.125,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
    },
    changeModButton: {
        position: 'absolute',
        width: 207/360*screenWidth,
        height: 26/720*screenHeight*1.125,
        left: 224/360*screenWidth,
        top: 0/720*screenHeight*1.125,
        display: 'flex',
        alignItems: 'flex-start',
    },
    changeModButtonWrapper: {
        fontFamily: 'Rokkitt',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 20/360*screenWidth,
        lineHeight: 23/720*screenHeight*1.125,
    },



    
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


    


  
});
export default styles;