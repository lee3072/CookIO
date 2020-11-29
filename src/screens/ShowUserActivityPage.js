import React from "react";
import { StyleSheet, Button, Image, Text, RefreshControl, View, FlatList, ActivityIndicator } from 'react-native';
import 'firebase/firestore';
import firebase from '../../firebase_setup';
import { ThemeProvider } from "@react-navigation/native";
import PostCard from "../components/PostCard";


class ShowUserActivityPage extends React.Component {
    //include comments, up/down vote and saved post
    constructor(props) {
        super(props);

        this.state = {
            userid: this.props.route.params.userid,

            //user data:
            interactions: [],
            ind: 1,

            //scroll
            data: [],
            limit: 3,
            refreshing: false,
            haveMore: true
        };
    }

    compare(a, b) {//TODO
        const dateA = a.obj.date;
        const dateB = b.obj.date;
        let re = 0;
        if (dateA > dateB)
            re = 1;
        else if (dateA < dateB)
            re = -1;
        return re;
    }

    componentDidMount = async () => {
        this.getUserData();
    }

    getUserData = async () => {
        let db = await firebase.firestore();
        let userRef = await (await db.collection("Users").doc(this.state.userid)).get();

        //get data needed
        let upVotes = userRef.get("upVotes");
        let downVotes = userRef.get("downVotes");
        let savedPosts = userRef.get("savedPostWithTime");
        let comments = userRef.get("postedComments");
        let tempInteraction = [];
        
        //put all data in an array and sort it accroding to time
        let i = 0;
        for (i = 0; i < upVotes.length; i++)
            tempInteraction.push({ type: "upVotes", obj: upVotes[i] })
        for (i = 0; i < downVotes.length; i++)
            tempInteraction.push({ type: "downVotes", obj: downVotes[i] })
        for (i = 0; i < savedPosts.length; i++)
            tempInteraction.push({ type: "savedPosts", obj: savedPosts[i] })
        for (i = 0; i < comments.length; i++)
            tempInteraction.push({ type: "comments", obj: comments[i] })
        tempInteraction = tempInteraction.sort(this.compare)

        //convert the second pass 1970/1/1 to date
        for(i = 0; i < tempInteraction.length; i++)
            tempInteraction[i].obj.date = this.secToDate(tempInteraction[i].obj.date)

        //update global variables. 
        let tempGetInfo = await this.getInfo(tempInteraction[0])
        this.setState({
            interactions: tempInteraction,
            data: [tempGetInfo]
        })
        console.log(tempInteraction)
    }
    secToDate(sec_nanoSec) {
        return new Date(sec_nanoSec / 1000000)
    }

    // scroll stuff
    _onEndReached = () => {
        if (this.state.haveMore && !this.onEndReachedCalled) {
            this.showMore()
        }
        ThemeProvider.onEndReachedCalled = true;
    }
    renderCard = (item) => {      
        return(
            <View>
                <Text>{item.title}</Text>
                <Text>{item.comment}</Text>
                <PostCard item={item.postObj} navigation={this.props.navigation} />
            </View>
        
        )
    }
    showMore = async () => {
        // console.log("in show more")
        this.setState({ refreshing: true });
        let i = this.state.ind;
        let o = 0;
        if (i == this.state.interactions.length) {
            this.setState({ haveMore: false })
        } else {
            for (o = 0; o < this.state.limit && i < this.state.interactions.length; o++, i++) {
                let tempGetInfo = await this.getInfo(this.state.interactions[i])
                this.state.data.push(tempGetInfo)
            }
            this.setState({ ind: i })
        }
        this.setState({ refreshing: false });
        // console.log(this.state.data)
    }
    getInfo = async (obj)=>{
        let title = "on " + obj.obj.date.toLocaleString() + " "
        let comment = null;
        let postObj = null;
        let commentObj = null;
        let db = await firebase.firestore();
        
        switch (obj.type) {
            case "upVotes":
                title += "up voted";
                postObj = await(await (await db.collection("Posts").doc(obj.obj.postID)).get()).data()
                break;
                // return (<Text>{"up Vote:"}</Text>)
            case "downVotes":
                title += "down voted";
                postObj = await(await (await db.collection("Posts").doc(obj.obj.postID)).get()).data()
                break;
                // return (<Text>{"down Vote:"}</Text>)
            case "savedPosts":
                title += "saved post";
                postObj = await(await (await db.collection("Posts").doc(obj.obj.postID)).get()).data()
                break;
                // return (<Text>{"saved Post:"}</Text>)
            case "comments":
                commentObj = await(await (await db.collection("Comments").doc(obj.obj.commentID)).get()).data()
                title += "commented:";
                comment = commentObj.Content
                postObj = await(await (await db.collection("Posts").doc(commentObj.Under)).get()).data()
                break;
                // return (<Text>{"comment"}</Text>)
            default:
                throw "error!!!!!!!!!!!!!!!!!!!!"
        }

        return({title: title, comment: comment, postObj: postObj})
    }
    header = () => {
        return (
            <View >
                <Text >User Activitys</Text>
            </View>
        );
    }
    footer = () => {
        // Check If Loading
        try {
            if (this.state.refreshing) {
                return (
                    <View>
                        <ActivityIndicator />
                    </View>
                );
            }
            else {
                return null;
            }
        } catch (error) {
            console.log(error);
        }
    }
    ListFooterComponent = () => {
        if (!this.state.haveMore) {
            return (<Text>-congrat, you reached the end-</Text>);
        } else {
            return (
                <View>
                    <ActivityIndicator size="small" animating={this.state.animating} />
                    <Text>Loading more...</Text>
                </View>
            );
        }
    };

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => String(index)}
                    onEndReached={this._onEndReached}
                    refreshing={true}
                    renderItem={({ item }) => this.renderCard(item)}
                    ListFooterComponent={this.ListFooterComponent}
                    onEndReachedThreshold={0.001}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.showMore}
                        />
                    }

                    ListHeaderComponent={this.header}
                />
            </View>
        );
    }
}

export default ShowUserActivityPage;
