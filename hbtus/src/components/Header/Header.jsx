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
import { IoPersonOutline, IoHomeOutline, IoCalendarOutline, IoImageOutline, IoChatboxEllipsesOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import { ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { BsChatLeftHeart } from "react-icons/bs";

//----------------------------------------------------------------
function Header() {

  const userReduxData = useSelector(getUserData) || {}
  const token = userReduxData?.token
  const userType = userReduxData?.decoded?.userRole

  const navigate = useNavigate()

  const dispatch = useDispatch();
  const logOutMe = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

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
          {userType === "Admin" ? (
            <>
              <ButtonGroup>
                <DropdownButton className='navBarGroup'  title="Acciones" id="bg-nested-dropdown" drop="down">
                  <Dropdown.Item href="/">Home</Dropdown.Item>
                  <Dropdown.Item href="/admin">Usuarios</Dropdown.Item>
                  <Dropdown.Item href="/appointment">Citas</Dropdown.Item>
                  <Dropdown.Item href="/treatments">Servicios</Dropdown.Item>
                  <NavDropdown.Divider />

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
                <BsChatLeftHeart
                  className='iconNav2'
                  onClick={() => {
                    navigate('/reviews')
                  }} />

                  </DropdownButton>
                </ButtonGroup>
                  </>


          ) : userType === "User" ? (
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
                      navigate("/meDates");
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
                <BsChatLeftHeart
                  className='iconNav2'
                  onClick={() => {
                    navigate('/reviews')
                  }} />
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