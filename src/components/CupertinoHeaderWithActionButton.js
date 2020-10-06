import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export const Header = ({props, title, action, lastPage, navi}) => {
  const goBack = () => {
    navi.navigate(lastPage)
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.leftWrapper}>
        <TouchableOpacity onPress={goBack} style={styles.leftIconButton}>
          <Icon name="ios-arrow-back" style={styles.leftIcon}></Icon>
          <Text style={styles.leftText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textWrapper}>
        <Text numberOfLines={1} style={styles.editPost}>
          {title}
        </Text>
      </View>
      <View style={styles.rightWrapper}>
        <TouchableOpacity style={styles.rightIconButton}>
          <Text style={styles.post}>
            {action}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#EFEFF4",
    paddingRight: 8,
    paddingLeft: 8
  },
  leftWrapper: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  leftIconButton: {
    flexDirection: "row"
  },
  leftIcon: {
    color: "#007AFF",
    fontSize: 32
  },
  leftText: {
    fontSize: 17,
    color: "#007AFF",
    paddingLeft: 5,
    alignSelf: "center"
  },
  textWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  editPost: {
    fontSize: 17,
    lineHeight: 17,
    color: "#000"
  },
  rightWrapper: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  rightIconButton: {},
  post: {
    color: "#007AFF",
    fontSize: 17,
    alignSelf: "center"
  }
});

export default Header;
