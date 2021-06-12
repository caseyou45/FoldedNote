import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension";

import noteReducer from "./reducers/noteReducer";

const reducer = combineReducers({
  note: noteReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
