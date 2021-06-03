import * as countTypes from "../../constants/module1/clientsTypes.js";

const initialState = {
    value: 0
}

export function counterReducer(state = initialState, action) {
    // Reducers usually look at the type of action that happened
    // to decide how to update the state
    switch (action.type) {
        case 'counter/incremented':
            console.log("Incremented");
            return { ...state, value: state.value + 1 }
        case countTypes.DECREASE_NUMBER:
            return { ...state, value: action.payload.value }
        default:
            // If the reducer doesn't care about this action type,
            // return the existing state unchanged
            return state
    }
}