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




    postcontainer: {
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
        borderRadius: 25,  /*makes the end round*/
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
});
export default styles;