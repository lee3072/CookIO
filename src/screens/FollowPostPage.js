import React from "react";
import 'firebase/firestore';
import firebase from '../../firebase_setup';
import FollowpostInfiniteScroll from "../components/FollowpostInfiniteScroll";


class FollowPostPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            userid: this.props.route.params.userid,
        }
        // this.getEverthing();
    }
    render(){
        return(<FollowpostInfiniteScroll navigation={this.props.navigation} collection={"Posts"} card={"PostCard"} sortBy={"ID"} where={this.state.userid}/>);
    }
}

export default FollowPostPage;