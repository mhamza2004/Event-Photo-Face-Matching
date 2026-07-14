import { FaSignOutAlt } from "react-icons/fa";

function LogoutButton(){

const logout=()=>{

localStorage.removeItem("token");

window.location.href="/";

};

return(

<button
className="logout-btn"
onClick={logout}
style={{
width:"auto",
padding:"12px 24px",
}}
>

<FaSignOutAlt/>

{" "}

Logout

</button>

);

}

export default LogoutButton;