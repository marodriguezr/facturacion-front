import * as countTypes from "../../constants/module1/clientsTypes";

export const decreaseNumber = (x) => {
    return (dispatch) => {
        dispatch({type: countTypes.DECREASE_NUMBER, payload: {value: x}});
    }
};
