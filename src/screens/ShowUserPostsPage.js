
import React from "react";
import 'firebase/firestore';
import InfiniteScrollDesc from "../components/InfiniteScrollDesc";
import InfiniteScroll from "../components/InfiniteScroll";
import firebase from '../../firebase_setup';
import { Button,  View, } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";


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
            <ScrollView>
                <View style={{
                    borderTopWidth: (Platform.OS === 'ios') ? 2 : 0,
                    borderBottomWidth: (Platform.OS === 'ios') ? 2 : 0,
                    marginVertical: (Platform.OS === 'ios') ? 2 : 0,
                    borderColor: (Platform.OS === 'ios') ? "#ffb300" : "white"
                }}>
                    <Button color= "#ffb300"
                        title="User Line"
                        onPress={() => {
                            this.props.navigation.navigate('UserLinePage')
                        }}
                    />
                </View>
                <InfiniteScrollDesc
                    title={"Created Posts"}
                    navigation={this.props.navigation}
                    collection={"Posts"}
                    card={"PostCard"}
                    sortBy={"Date"}
                    what={"PostedUser"}
                    contain={[this.state.userid]}
                />
            </ScrollView>
        );
    }
}

export default ShowUserPostsPage;
