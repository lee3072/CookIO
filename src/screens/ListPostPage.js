import React from "react";
import 'firebase/firestore';
import InfiniteScroll from "../components/InfiniteScroll"

class ListPostPage extends React.Component {
  constructor(props){
    super (props);
    console.log("in post page");
    let document = this.props.route.params.document;
    console.log("doc: " + document);
  }
  render(){
    return (<InfiniteScroll title={'list post page'} navigation={this.props.navigation} collection={"Posts"} what={"Tag"} contain={[this.props.route.params.document]} card={"PostCard"} sortBy={"ID"}/>);
  }
}

export default ListPostPage;
