import "./Profile.css";
import Card from 'react-bootstrap/Card';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, logout } from '../../app/slice/userSlice';
import { useEffect, useState } from 'react';
import { bringDates, meProfile } from '../../services/apiCalls';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import { IoCalendarSharp, IoHomeOutline } from "react-icons/io5";
import Icon from "../../images/metatron.png";
import ModalProfile from "../../components/ModalProfile/ModalProfile";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

//-------------------------------------------------------------------------------

export const Profile = () => {
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const [userData, setUserData] = useState([]);
    const myPassport = useSelector(getUserData);
    const token = myPassport.token;
    const userType = myPassport?.decoded?.userRole;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profile = await meProfile(token);
                setProfileData(profile);
                const res = await bringDates(token);
                setUserData(res.user || []);
            } catch (error) {
                console.error(error);
            }
        };
        if (token) fetchData();
    }, [token]);

    const inputHandler = (e) => {
        setProfileData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const logOutMe = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <Container className="my-4">
            <Card className='card'>
                <Card.Body>
                    <Row>
                        <Col xs={12} md={4}>
                            <h6>Inicio</h6>
                            <div className="icons">
                                <IoHomeOutline className='icon' onClick={() => navigate("/", { state: { userData } })} />
                                {userData.length > 0 && (
                                    <IoCalendarSharp className='icon' onClick={() => navigate("/medates")} />
                                )}
                            </div>
                            <Image src={Icon} width={150} roundedCircle />
                            <h6>Mi perfil</h6>
                            <div className="profile">
                                <ModalProfile 
                                    profileData={profileData} 
                                    inputHandler={inputHandler} 
                                    token={token} 
                                />
                            </div>
                        </Col>
                        <Col xs={12} md={8}>
                            <h2>Mi Perfil</h2>
                            <Form>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="firstName">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={profileData.firstName}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="lastName">
                                    <Form.Label>Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={profileData.lastName || ""}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="phone">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        value={profileData.phone || ""}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="validationCustom04">
    <Form.Label>Fecha de nacimiento</Form.Label>
    <Form.Control
        className="input"
        name="birthDate"
        type="date"
        placeholder="Fecha de nacimiento"
        readOnly
        value={profileData.birthDate || ""}
    />
    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
</Form.Group>

                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};
