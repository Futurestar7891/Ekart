import { Routes, Route } from "react-router-dom";
import signUp from "../Screen/publicScreens/signUp";
import signIn from "../Screen/publicScreens/signIn";
import Home from "../Screen/publicScreens/Home";
import AccessDenied from "../Screen/publicScreens/AccessDenied";

function publicRoutes() {
  return <div style={{width:"100vw"}}>
    <Routes>
        <Route path="/" Component={Home}/>
        <Route path="/signup" Component={signUp}/>
        <Route path="/signin" Component={signIn}/>
        <Route path="/denied" Component={AccessDenied}/>
    </Routes>
  </div>;
}

export default publicRoutes;
