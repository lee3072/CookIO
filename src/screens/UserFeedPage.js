import React from "react";
import 'firebase/firestore';
import UserInfiniteScroll from "../components/UserInfiniteScroll";
import firebase from '../../firebase_setup';


class UserFeedPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            userid: this.props.route.params.userid,
        }
        // this.getEverthing();
    }
    render(){
        return(<UserInfiniteScroll navigation={this.props.navigation} collection={"Posts"} card={"PostCard"} sortBy={"ID"} where={this.state.userid}/>);
    }
}

export default UserFeedPage;