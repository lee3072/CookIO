
import React from "react";
import 'firebase/firestore';
import InfiniteScroll from "../components/InfiniteScroll";
import firebase from '../../firebase_setup';


class ShowUserPostsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: this.props.route.params.userid,
        }
        console.log("show user posts page: ")
        console.log(this.state.userid)
    }

    render() {
        return (
            <InfiniteScroll
                title={"Created Posts"}
                navigation={this.props.navigation}
                collection={"Posts"}
                card={"PostCard"}
                sortBy={"Date"}
                what={"PostedUser"}
                contain={[this.state.userid]}
            />
        );
    }
}

export default ShowUserPostsPage;
