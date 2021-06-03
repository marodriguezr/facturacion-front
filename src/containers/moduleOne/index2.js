import { useSelector, useDispatch } from "react-redux";
import {decreaseNumber} from "../../redux/actions/module1/count.js"

export const ModuleTwo = () => {
    const dispatch = useDispatch();
    const { value } = useSelector((state) => state.module1.basic);

    console.log(value);

    const handleDecreaseNumber = () => {
        decreaseNumber(value-1)(dispatch);
    };
    return (
        <>
            <h1>{value}</h1>
            <input type="button" value="Press me" onClick={handleDecreaseNumber}></input>
        </>);
};