import React from "react";
import 'firebase/firestore';
import InfiniteScroll from "../components/InfiniteScroll"
class DirectMessageMainAllUserPage extends React.Component {
    constructor(props){
      super (props);
    }
    
    render(){
      return (
        <InfiniteScroll 
          title={'DM page'} 
          navigation={this.props.navigation} 
          collection={"Users"} 
          card={"UserCard"} 
          sortBy={"userEmail"}
        />
      );
    }
  }


export default DirectMessageMainAllUserPage;
