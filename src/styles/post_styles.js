
import { Platform, Dimensions, StyleSheet} from 'react-native';
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
if (Platform.OS === 'web') {screenHeight = 720; screenWidth = 405;}

// Style Section Start
const styles = StyleSheet.create({
    
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