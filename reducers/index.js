import { combineReducers } from "redux";
// import CounterReducer from "../reducers/CounterReducer";
import { CounterReducer } from "../plugins/counter";

export default combineReducers({
  counter: CounterReducer
});
