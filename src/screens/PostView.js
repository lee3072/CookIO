import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import * as Font from 'expo-font';
import 'firebase/firestore';
import styles from './auth_styles';


const PostView = () => {

    return (
        <SafeAreaView style={styles.container}>
            
            <View style={styles.titleContainer}>
                <Text style={{ fontWeight: "500" }}>Title</Text>
            </View>
            <View style={{marginHorizontal: 30, marginTop: 12, height: 150, backgroundColor: "grey", }}>
                <Text style={{ fontWeight: "500" }}>Image</Text>
            </View>
            <View style={styles.showContentContainer}>
                    <Text style={{ fontWeight: "500" }}>Content</Text>
            </View>
            <View style={styles.showTagContainer}>
                <Text style={{ fontWeight: "500" }}>Tags</Text>
            </View>
            <View style={styles.voteContainer}>
                <TouchableOpacity >
                    <Text style={{ marginLeft:20, marginRight: 20, padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>Up</Text>
                </TouchableOpacity>
                <TouchableOpacity >
                    <Text style={{padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>Down</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.showCommentContainer}>
                <Text style={{ fontWeight: "500" }}>Comments</Text>
            </View>
        </SafeAreaView>
    );

}

export default PostView;