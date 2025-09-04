import { Navigate, Route, Routes } from "react-router-dom"
import { Register } from "../Register/Register"
import { Admin } from "../Admin/Admin";
import { Home } from "../Home/Home";
import { Login } from "../Login/Login";
// import { Menu } from "../Menu/Menu";
import { Profile } from "../Profile/Profile";
import { Dates } from "../userDates/userDates"
import { AdminAppointment } from "../Appointment/Appointment";
import { Treatments } from "../Treatment/Treatment";
import { CreateDate } from "../CreateDate/CreateDate"
import HistoryPage from "../History/History";
import { Menu } from "../Menu/Menu";
import ConfirmEmailPage from "../ConfirmEmail/ConfirmEmail";


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
                <Route path="/menu" element={<Menu />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create" element={<CreateDate />} />
                <Route path="/appointment" element={<AdminAppointment />} />
                <Route path="/treatments" element={<Treatments />} />
                <Route path="/medates" element={<Dates />} />
                <Route path="/histories" element={<HistoryPage />} />
                <Route path="/confirm/:token" element={<ConfirmEmailPage />} />
            </Routes>
        </>
    )
}