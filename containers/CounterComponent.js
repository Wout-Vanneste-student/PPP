import React, { Component } from "react";
import CountButton from "../components/CountButton";
import { connect } from "react-redux";
import { incrementCount, decrementCount } from "../actions/index";
import { Text } from "react-native";

class CounterComponent extends Component {
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
        <Text>Count: {count}</Text>
        <CountButton
          action={this.handleBtnActionIncrement}
          ButtonTitle="add to counter"
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(CounterComponent);
