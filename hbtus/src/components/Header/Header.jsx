import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Header.css"
import { getUserData, logout } from '../../app/slice/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'react-bootstrap/Image';
import { FcImport } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { IoPersonOutline, IoHomeOutline, IoCalendarOutline, IoImageOutline } from "react-icons/io5";
import { toast } from 'react-toastify';


//----------------------------------------------------------------
function Header() {

  const userReduxData = useSelector(getUserData) || {}
  const token = userReduxData?.token
  const userType = userReduxData?.decoded?.userRole

  const navigate = useNavigate()

  const dispatch = useDispatch();
  const logOutMe = () => {
    dispatch(logout())
    toast.success("You have been logged out, come back soon","rgb(6, 108, 204)")
  }

  return (
    <Navbar expand="lg" className="navBar">
      <Container fluid>

        <Navbar.Brand href="home"><h2></h2></Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="navbarScroll" /> */}
        {/* <Navbar.Collapse id="navbarScroll"> */}
        {/* <Nav.Link href="/home">Home</Nav.Link> */}
        <Nav
          className="me-auto my-2 my-lg-0"
          style={{ maxHeight: '100px' }}
          navbarScroll
        >
          {userType === 1 ? (
            <>
              <NavDropdown title="Actions" id="navbarScrollingDropdown" className='actions' >
                <NavDropdown.Item href="/admin">Users</NavDropdown.Item>
                <NavDropdown.Item href="/stylist">Stylist</NavDropdown.Item>
                <NavDropdown.Item href="/allAppointment">Appointment</NavDropdown.Item>
                <NavDropdown.Item href="/treatments">Treatment</NavDropdown.Item>
                <NavDropdown.Divider />
                {token && <Nav.Link href="/profile">Profile</Nav.Link>}
              </NavDropdown>
            </>

          ) : userType === 2 ? (
            <>
              <NavDropdown title="Manager" className='actions' >
                <NavDropdown.Item href="/manager">Users</NavDropdown.Item>
                <NavDropdown.Item href="/treatments">Treatment</NavDropdown.Item>
                <NavDropdown.Divider />
                {token && <Nav.Link href="/profile">Profile</Nav.Link>}
              </NavDropdown>
            </>
          ) : (
            <>
              <div className='iconDiv'>

                <IoHomeOutline className='iconNav' onClick={() => { navigate("/home") }} />
                {token && (
                  <IoCalendarOutline
                    className='iconNav'
                    onClick={() => {
                      navigate("/appointment");
                    }} />
                )}
                  {<IoImageOutline
                  className='iconNav'
                  onClick={() => {
                    navigate("/menu");
                  }} />}
                {token && <IoPersonOutline
                  className='iconNav'
                  onClick={() => {
                    navigate("/profile");
                  }}
                />}
              </div>
            </>
          )}
        </Nav>
        {token ? (
  <FcImport
    className='exit'
    onClick={() => {
      logOutMe();
      navigate("/home");
    }} />
) : (
  <Nav.Link
    onClick={() => navigate("/login")}
    style={{ cursor: "pointer", marginLeft: "1em", fontWeight: "bold" }}
  >
    Iniciar sesión
  </Nav.Link>
)}

        {/* </Navbar.Collapse> */}
      </Container>
    </Navbar>
  );
}

export default Header;