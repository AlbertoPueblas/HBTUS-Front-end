import "./Login.css"
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { loginCall } from "../../services/apiCalls";
import Image from 'react-bootstrap/Image';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../app/slice/userSlice";
import { decodeToken } from "react-jwt";
import { Link } from 'react-router-dom';
import Metatron from "../../images/metatron.png"
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

//---------------------------------------------------------------------------------

export const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [validated, setValidated] = useState(false);
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
        isActive: ""
    });
    const [isValid, setIsValid] = useState({ email: null, password: null });
    
    // Nuevo estado para mostrar/ocultar la contraseña
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            await loginMe();
        }
        setValidated(true);
    };

    const inputHandler = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const loginMe = async () => {
        try {
            const res = await loginCall(credentials);
            if (res.data && res.data.token) {
                const uDecoded = decodeToken(res.data.token);
                const passport = { token: res.data.token, decoded: uDecoded };
                dispatch(login(passport));
                toast.success("Inicio de sesión exitoso");
                setTimeout(() => {
                    const role = uDecoded.userRole;
                    if (role === "Admin") navigate("/admin");
                    else if (role === "Clients") navigate("/menu");
                }, 1000);
            } else toast.error("Error al iniciar sesión");
        } catch (error) {
            if (error.response?.data?.isActive === false) {
                toast.warning("Tu cuenta no está activa, contacta al administrador");
            }
            toast.error("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
        }
    };

    // Función para mostrar la contraseña temporalmente
    const handleShowPasswordTemporarily = () => {
        setShowPassword(true);
        setTimeout(() => setShowPassword(false), 1500); // se oculta automáticamente a los 4 segundos
    };

    return (
        <>
            <Container className="my-4">
                <Card className='card'>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col xs={12} md={4}>
                                <Image src={Metatron} width={200} roundedCircle />
                            </Col>
                            <Col xs={12} md={8}>
                                <h1>Iniciar sesión</h1>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Form.Group controlId="validationCustomUsername" >
                                        <Form.Label>Email</Form.Label>
                                        <InputGroup hasValidation>
                                            <InputGroup.Text>@</InputGroup.Text>
                                            <Form.Control
                                                className="input"
                                                name="email"
                                                type="email"
                                                placeholder="Email"
                                                required
                                                value={credentials.email}
                                                onChange={inputHandler}
                                                isValid={isValid.email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Credenciales incorrectas.
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group controlId="validationCustom02" className="mt-3">
                                        <Form.Label>Contraseña</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                className="input"
                                                name="password"
                                                required
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                value={credentials.password}
                                                onChange={inputHandler}
                                                isValid={isValid.password}
                                            />
                                            <Button 
                                                variant="outline-secondary" 
                                                onClick={handleShowPasswordTemporarily}
                                                title="Mostrar contraseña 4s"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </InputGroup>
                                        <h6 className="mt-2">
                                            Aún no estás registrado? Registrate <Link to="/register">aquí</Link>
                                        </h6>
                                        <Form.Control.Feedback>Todo correcto!</Form.Control.Feedback>
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        title={"login!"}
                                        className={"Button mt-3"}
                                    >
                                        Login
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <p className="mt-2">
  ¿Olvidaste tu contraseña? <Link to="/forgot-password">Recupérala aquí</Link>
</p>
            </Container>
            <ToastContainer />
        </>
    )
}
