import { Routes, Route } from "react-router-dom";
import ProductDetail from "../Screen/ProtectedScreens/ProductDetail";
import Home from "../Screen/publicScreens/Home";
import Cart from "../Screen/ProtectedScreens/Cart";
import Address from "../Screen/ProtectedScreens/Address";
import Success from "../Screen/ProtectedScreens/Success";
import Orders from "../Screen/ProtectedScreens/Orders";
import signUp from "../Screen/publicScreens/signUp";
import signIn from "../Screen/publicScreens/signIn";
import AccessDenied from "../Screen/publicScreens/AccessDenied";

function Routess() {
     return <div style={{width:"100vw"}}>
    <Routes>
        
        <Route path="/" Component={Home}/>
        <Route path="/product/detail/:id" Component={ProductDetail} />
      <Route path="cart" Component={Cart} />
      <Route path="address" Component={Address} />
      <Route path="success" Component={Success} />
      <Route path="/orders" Component={Orders}/>
       <Route path="/signup" Component={signUp}/>
        <Route path="/signin" Component={signIn}/>
        <Route path="/denied" Component={AccessDenied}/>
        
    </Routes>
  </div>;

}

export default Routess;

