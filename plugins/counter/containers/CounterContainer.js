import React, { Component } from "react";
import CountButton from "../components/CountButton";
import { connect } from "react-redux";
import { incrementCount, decrementCount } from "../actions/CounterAction";
import { Text, StyleSheet, View } from "react-native";

class CounterContainer extends Component {
  handleBtnActionIncrement = () => {
    this.props.onIncrementClick(this.props.count);
  };

  handleBtnActionDecrement = () => {
    this.props.onDecrementClick(this.props.count);
  };

  render() {
    const { count } = this.props;
    return (
      <>
        <Text style={styles.countText}>Count: {count}</Text>
        <View style={styles.topButton}>
          <CountButton
            action={this.handleBtnActionIncrement}
            ButtonTitle="add to counter"
          />
        </View>
        <CountButton
          action={this.handleBtnActionDecrement}
          ButtonTitle="remove from counter"
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    count: state.counter.count
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIncrementClick: count => {
      dispatch(incrementCount(count));
    },
    onDecrementClick: count => {
      dispatch(decrementCount(count));
    }
  };
};

const styles = StyleSheet.create({
  topButton: {
    marginBottom: 15
  },
  countText: {
    color: "#44234C",
    fontSize: 25,
    fontFamily: "Customfont-Bold",
    textAlign: "center",
    marginBottom: 25
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);
