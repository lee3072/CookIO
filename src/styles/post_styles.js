
import { Platform, Dimensions, StyleSheet} from 'react-native';
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
if (Platform.OS === 'web') {screenHeight = 720; screenWidth = 405;}

// Style Section Start
const styles = StyleSheet.create({
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