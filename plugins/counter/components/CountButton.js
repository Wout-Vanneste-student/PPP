import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const CountButton = props => {
  return (
    <TouchableOpacity
      style={styles.big_button}
      onPress={props.action}
      title={props.ButtonTitle}
    >
      <Text style={styles.button_text}>{props.ButtonTitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  big_button: {
    borderWidth: 2,
    borderColor: "#44234C",
    borderRadius: 5,
    width: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 10,
    alignSelf: "center"
  },
  button_text: {
    color: "#44234C",
    fontSize: 20,
    fontFamily: "Customfont-Bold"
  }
});

export default CountButton;
