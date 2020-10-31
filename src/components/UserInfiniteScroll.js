import React, { Component, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Button, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import 'firebase/firestore';
import firebase from '../../firebase_setup';
var screenWidth = Dimensions.get('screen').width;
var screenHeight = Dimensions.get('screen').height;

//import cards use for render here
import PostCard from "../components/PostCard";
import { ThemeProvider } from "@react-navigation/native";

class UserInfiniteScroll extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            postData: [],
            lastVisible: null,
            loading: false,
            refreshing: false,
            fresh: true,
            haveMore: true,
        };
    }

    componentDidMount = async () => {
        try {
            // Cloud Firestore: Initial Query (Infinite Scroll)
            this.retrieveData()
        }
        catch (error) {
            console.log(error);
        }
        this.onEndReachedCalled = false;
    }
    
    //retrieve initial data
    retrieveData = async () => {
        try {
            console.log('retrieving initial data');
            // set state loading
            this.setState({ loading: true });

            // get initial query data
            let db = firebase.firestore();
            let userref = db.collection('Posts');
            let getuser = await userref.where('PostedUser', '==', this.props.where).get();
            let postData = getuser.docs.map(post => post.data());
            console.log('post Data');
            console.log(postData);

            let lastVisible = postData[postData.length - 1].ID;
            console.log("last visible: " + lastVisible);

            // set states
            this.setState({
                postData: postData,
                lastVisible: lastVisible,
                loading: false,
            });
    
            this.setState({haveMore: false});



        } catch (error) {
            console.log(error);
        }
    }

    //retrieve more data form firebse
    retrieveMore = async () => {
        if (this.state.haveMore == true) {
            try {
                console.log('Retrieving additional post Data');
                console.log("last visible: " + this.state.lastVisible);
                this.setState({ refreshing: true });

                let db = firebase.firestore();
                let userref = db.collection('Posts').startAfter(this.state.lastVisible).limit(1);
                let getuser = await userref.where('PostedUser', '==', this.props.where).get();
                let postData = getuser.docs.map(post => post.data());
                console.log('post Data');
                console.log(postData);

                if (postData.length == 0) {
                    this.setState({
                        haveMore: false,
                        refreshing: false,
                    });
                } else {
                    let lastVisible = postData[postData.length - 1].ID;
                    console.log('Last Visible ID: '+ lastVisible);

                    this.setState({
                        postData: [...this.state.postData, ...postData],
                        lastVisible: lastVisible,
                        refreshing: false,
                    });
                }

            } catch (error) {
                console.log(error);
            }
        }
    }

    renderHeader = () => {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>Items</Text>
            </View>
        );
    }

    renderFooter = () => {
        // Check If Loading
        try {
            if (this.state.loading || this.state.refreshing) {
                return (
                    <View style={styles.activityIndicator}>
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

    //List line
    ItemSeparatorComponent = () => {
        return <View style={styles.baseLine} />;
    };

    ListEmptyComponent() {
        return (
            <View style={styles.noListView}>
                {/* <Image
              style={styles.noListImage}
              source={require('../images/status/order_no_record.png')}
            /> */}
                <Text style={styles.NoListText}>No order</Text>
            </View>
        );
    }
    //tail
    ListFooterComponent = () => {
        return (
            <View style={styles.bottomfoot}>
                {
                    this.state.postData.length != 0 ?
                        !this.state.haveMore ? (
                            <Text style={styles.footText}>-congrat, you reached the end-</Text>
                        ) : (
                                <View style={styles.activeLoad}>
                                    <ActivityIndicator size="small" animating={this.state.animating} />
                                    <Text style={[styles.footText, styles.ml]}>Loading more...</Text>
                                </View>
                            )
                        :
                        null
                }

            </View>
        );
    };


    renderCard = (item) => {
        switch (this.props.card) {
            case "PostCard":
                return (<PostCard style={styles.postCard} item={item} navigation={this.props.navigation} />);

            default:
                throw "infinite scroll need a card to render, check if you enterd all parameters";
        }

    }

    _onEndReached = () => {
        if (this.state.haveMore && !this.onEndReachedCalled){
            this.retrieveMore()
        }
        ThemeProvider.onEndReachedCalled = true;
    }

    render() {
        return (
            <View style={styles.container}>
                <Button color="#ffb300"
                    title="My Profile"
                    onPress={() => this.props.navigation.navigate('ProfilePage')}
                />

                <CupertinoSearchBarBasic
                    style={styles.cupertinoSearchBarBasic}
                ></CupertinoSearchBarBasic>

                <FlatList
                    data={this.state.postData}
                    // Element Key
                    keyExtractor={(item, index) => String(index)}
                    //onEndReached={this._onEndReached}
                    refreshing={true}
                    renderItem={({ item }) => this.renderCard(item)}
                    // ItemSeparatorComponent={this.ItemSeparatorComponent}
                    // ListEmptyComponent={this.ListEmptyComponent}
                    ListFooterComponent={this.ListFooterComponent}
                    onEndReachedThreshold={0.001}

                    // Header (Title)
                    ListHeaderComponent={this.renderHeader}

                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.retrieveMore}
                        />
                    }
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cupertinoSearchBarBasic: {
        height: 40,
        marginTop: 24
    },
    scrollArea: {
        width: 360,
        height: 527,
        backgroundColor: "#E6E6E6"
    },
    scrollArea_contentContainerStyle: {
        height: 527,
        width: 360
    },
    postCard: {
        width: 300,
        height: 208,
        marginTop: 39,
        alignSelf: "center"
    },
    footer: {
        padding: 15,
    },
    footerText: {
        fontWeight: '600',
    },
    item: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        width: '100%',
    },
    header: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    listConten: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: '#ffffff',
        height: 50,
    },
    baseLine: {
        width: screenWidth,
        height: 1,
        backgroundColor: '#eeeeee',
    },
    noListView: {
        width: screenWidth,
        height: screenHeight - 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    NoListText: {
        marginTop: 15,
        fontSize: 18,
        color: '#999999',
    },
    noListImage: {
        width: 130,
        height: 140,
    },
    bottomfoot: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    footText: {
        marginTop: 5,
        fontSize: 12,
        color: '#999999',
    },

    activeLoad: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ml: {
        marginLeft: 10,
    },
});

export default UserInfiniteScroll;
