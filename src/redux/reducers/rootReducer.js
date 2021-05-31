import {combineReducers} from "redux";

import {moduleOneReducer} from "./moduleOne/moduleOneReducer.js";

export const rootReducer = combineReducers({
    module1: moduleOneReducer
});