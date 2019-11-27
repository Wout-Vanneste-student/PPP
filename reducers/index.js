import { combineReducers } from "redux";
// import CounterReducer from "../reducers/CounterReducer";
import CounterReducer from "../plugins/counter/reducers";

export default combineReducers({
  counter: CounterReducer
});
