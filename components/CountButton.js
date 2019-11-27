import React from "react";
import { Button } from "react-native";

const CountButton = props => {
  return <Button onPress={props.action} title={props.ButtonTitle}></Button>;
};

export default CountButton;
