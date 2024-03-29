import React from "react";
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import 'firebase/firestore';
import firebase from '../../firebase_setup';
import { ThemeProvider } from "@react-navigation/native";
var screenWidth = Dimensions.get('screen').width;
var screenHeight = Dimensions.get('screen').height;

//import cards use for render here
import PostCard from "../components/PostCard";
import TagCard from "../components/TagCard";
import CommentCard from "../components/CommentCard";
import UserCard from "../components/UserCard";

class InfiniteScrollDesc extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            lastVisible: null,
            loading: false,
            refreshing: false,
            fresh: true,
            haveMore: true,
            list: [],
            count: 3,
            limit: 3,
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
            // console.log('retrieving initial data');
            // set state loading
            this.setState({ loading: true });

            //if retrieving from a collection
            let initialQuery = await firebase.firestore()
                .collection(this.props.collection)
                
            if (this.props.what != null && this.props.contain != null) 
                initialQuery = initialQuery.where(this.props.what, 'in', this.props.contain)
            
            initialQuery = initialQuery
                .orderBy(this.props.sortBy, "desc")
                .limit(this.state.limit);
            
            let postSnapshots = await initialQuery.get();

            let data = postSnapshots.docs.map(post => post.data());
            // console.log('post Data');
            // console.log(data);

            let lastVisible = data[data.length - 1].Date;
            // console.log("last visible: " + lastVisible);

            // set states
            this.setState({
                data: data,
                lastVisible: lastVisible,
                loading: false,
            });
        } catch (error) {
            console.log(error);
        }
    }
    //retrieve more data form firebse
    retrieveMore = async () => {
        try {
            // console.log('Retrieving additional post Data');
            // console.log("last visible: " + this.state.lastVisible);
            this.setState({ refreshing: true });

            let additionalQuery = await firebase.firestore()
                .collection(this.props.collection)

            if (this.props.what != null && this.props.contain != null) 
                additionalQuery = additionalQuery.where(this.props.what, 'in', this.props.contain)
            
            additionalQuery = additionalQuery
                .orderBy(this.props.sortBy, "desc")
                .startAfter(this.state.lastVisible)
                .limit(this.state.limit);

            let postSnapshots = await additionalQuery.get();
            let data = postSnapshots.docs.map(post => post.data());
            // console.log('post Data');
            // console.log(data);

            if (data.length == 0) {
                this.setState({
                    haveMore: false,
                    refreshing: false,
                });
            } else {
                let lastVisible = data[data.length - 1].Date;
                // console.log('Last Visible Date: ' + lastVisible);

                this.setState({
                    data: [...this.state.data, ...data],
                    lastVisible: lastVisible,
                    refreshing: false,
                });
            }

        } catch (error) {
            this.setState({
                haveMore: false,
                refreshing: false,
            });
            console.log(error);
        }
    }

    renderHeader = () => {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>{this.props.title}</Text>
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
                    this.state.data.length != 0 ?
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
            //TODO: 
            case "PostCard":
                return (<PostCard style={styles.postCard} item={item} navigation={this.props.navigation} />);
            case "TagCard":
                return (<TagCard style={styles.postCard} item={item} navigation={this.props.navigation} />);
            case "CommentCard":
                return (<CommentCard style={styles.postCard} item={item} navigation={this.props.navigation} />);
            case "UserCard":
                return (<UserCard style={styles.userCard} item={item} navigation={this.props.navigation} />);
            default:
                throw "infinite scroll need a card to render, check if you enterd all parameters";
        }

    }

    _onEndReached = () => {
        if (this.state.haveMore && !this.onEndReachedCalled) {
            this.retrieveMore()
        }
        ThemeProvider.onEndReachedCalled = true;
    }

    showMore = async () => {
        this.retrieveMore();
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    // Element Key
                    keyExtractor={(item, index) => String(index)}
                    onEndReached={this._onEndReached}
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
                            onRefresh={this.showMore}
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
    userCard: {
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

export default InfiniteScrollDesc;
