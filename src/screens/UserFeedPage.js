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

    // getEverthing = async () => {
    //     let db = firebase.firestore();
    //     let postRef = db.collection('Posts').doc(this.state.id);
    //     const post = await postRef.get();
    //     this.setState({
    //         userid: post.get('PostedUser'),
    //     })
    // }
    render(){
        return(<UserInfiniteScroll navigation={this.props.navigation} collection={"Posts"} card={"PostCard"} sortBy={"ID"} where={this.state.userid}/>);
    }
}

export default UserFeedPage;
