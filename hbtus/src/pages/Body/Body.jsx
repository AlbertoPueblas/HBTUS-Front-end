import { Navigate, Route, Routes } from "react-router-dom"
import { Register } from "../Register/Register"
import { Admin } from "../Admin/Admin";
import { Home } from "../Home/Home";
import { Login } from "../Login/Login";
// import { Menu } from "../Menu/Menu";
// import { Profile } from "../Profile/Profile";
// import { Appointment } from "../Appointment/Appointment"
// import { Dates } from "../MeDates/MeDates"
import { AdminAppointment } from "../Appointment/Appointment";
import { Treatments } from "../Treatment/Treatment";


//--------------------------------------------------------------

export const Body = () => {
    return (
        <>
            <Routes>
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                {/* <Route path="/menu" element={<Menu />} /> */}
                {/* <Route path="/profile" element={<Profile />} /> */}
                {/* <Route path="/appointment" element={<Appointment />} /> */}
                <Route path="/appointment" element={<AdminAppointment />} />
                <Route path="/treatments" element={<Treatments />} />
                {/* <Route path="/medates" element={<Dates />} /> */}
            </Routes>
        </>
    )
}