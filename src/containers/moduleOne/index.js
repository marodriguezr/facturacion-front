import {useSelector, useDispatch} from "react-redux";

export const ModuleOne = () => {
    const dispatch = useDispatch();
    const {value} = useSelector((state) => state.module1.basic); 

    console.log(value);
    return (
    <>
        <h1>{value}</h1>
        <input type="button" value="Press me" onClick={() => {dispatch({type: "counter/incremented"})}}></input>
    </>);
};