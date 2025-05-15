import "./Profile.css"
import Card from 'react-bootstrap/Card';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, logout } from '../../app/slice/userSlice';
import { useEffect, useState } from 'react';
import { bringDates, meProfile } from '../../services/apiCalls';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
// import Delete from "../../components/ModalAlert/ModalAlert";
//Iconos
import { FcPlus } from "react-icons/fc";
import { IoCalendarSharp, IoHomeOutline } from "react-icons/io5";
import  Icon  from "../../images/metatron.png";
import ModalProfile from "../../components/ModalProfile/ModalProfile";
import AppointmentModal from "../../components/AppointmentModal/AppointmentModal";

//--------------------------------------------------------

export const Profile = () => {

    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: ""
    });

    const [userData, setUserData] = useState([]);

    const myPassport = useSelector(getUserData)
    const token = myPassport.token;
    const userReduxData = useSelector(getUserData) || {}
    const userType = userReduxData?.decoded?.userRole


    const navigate = useNavigate();

    const [show, setShow] = useState(false);


    useEffect(() => {
        const fetchDataAndProfile = async () => {
            const myProfileData = await meProfile(token);
            setProfileData(myProfileData);
            const res = await bringDates(token);
            setUserData(res.user);
            
        };
        fetchDataAndProfile();
    }, [token || ""]);

    const inputHandler = (e) => {
        setProfileData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,

        }));
    };

    const dispatch = useDispatch();
    const logOutMe = () => {
        dispatch(logout())
    }

    return (
        <>
            <Container className="my-4">
                <Card className='card'>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col xs={12} md={4}>
                                <h6>Appointment</h6>
                                <div className="icons">
                                    <FcPlus className='icon' onClick={() => { navigate("/appointment") }} />
                                    <IoHomeOutline className='icon' onClick={() => { navigate("/menu", { state: { userData } }) }} />
                                    {userData.length > 0 && (
                                        <IoCalendarSharp className='icon' onClick={() => navigate("/medates")} />
                                    )}
                                </div>
                                <Image src={Icon} width={150} roundedCircle />
                                <h6>Profile</h6>
                                <div className="profile">
                                    <div className={userType === "User" ? "modify-left" : "modify-center"}>

                                        <AppointmentModal
                                            profileData={profileData}
                                            inputHandler={inputHandler}
                                            token={token} />
                                    </div>

                                    <div className="delet">
                                        {userType === "User" ? (
                                            <>
                                            <Delete
                                                profileData={profileData}
                                                inputHandler={inputHandler}
                                                token={token}
                                                />
                                                </>
                                            
                                        ) : (
                                            null
                                        )}
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={8}>

                                <h2>Mi Perfil</h2>
                                <Form >
                                    <Form.Group controlId="validationCustomUsername" >
                                        <Form.Label>Email</Form.Label>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                            <Form.Control
                                                className="input"
                                                name="email"
                                                type="email"
                                                placeholder="Email"
                                                aria-describedby="inputGroupPrepend"
                                                required
                                                value={profileData.email}
                                                onChange={inputHandler}
                                                readOnly
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid email.
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="validationCustom01">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            className="input"
                                            name="firstName"
                                            required
                                            type="text"
                                            placeholder="firstName"
                                            readOnly
                                            value={profileData.firstName}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="validationCustom02">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            className="input"
                                            name="lastName"
                                            required
                                            type="text"
                                            placeholder="lastName"
                                            readOnly
                                            value={profileData.lastName || ""}//Pueden estar vacios
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="validationCustom03">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            className="input"
                                            name="phone"
                                            required
                                            type="text"
                                            placeholder="phone"
                                            readOnly
                                            value={profileData.phone || ""}
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}