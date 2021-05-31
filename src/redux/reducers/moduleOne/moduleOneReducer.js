import {combineReducers} from "redux";

import {counterReducer} from "./aReducer.js";

export const moduleOneReducer = combineReducers({
    basic: counterReducer
});