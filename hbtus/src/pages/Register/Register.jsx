import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import { newRegister } from "../../services/apiCalls";
import Image from 'react-bootstrap/Image';
import MPImage from "../../images/metatron.png";
import Privacity from '../../components/ModalPrivacity/ModalPrivacity';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import "./Register.css";

registerLocale("es", es);

//----------------------------------------------------------------------------------
export const Register = () => {
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [credentials, setCredentials] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        birthDate: "",
    });

    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPasswordTemporarily = () => {
        setShowPassword(true);
        setTimeout(() => setShowPassword(false), 3000);
    };

    const inputHandler = (e) => {
        setCredentials((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        // Validación de contraseña
        if (credentials.password !== credentials.confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        // Validación de fecha de nacimiento
        if (!credentials.birthDate) {
            toast.error("La fecha de nacimiento es obligatoria");
            return;
        }

        setValidated(true);
        await register();
    };

    const register = async () => {
        try {
            const res = await newRegister(credentials);
            if (res.data && res.data.message) {
                toast.success("Compruebe su correo para finalizar el registro, no se olvide de buscar en la carpeta de spam");
            }
            // Redirigir al inicio tras registro exitoso
            setTimeout(() => {
                window.location.href = "https://hbtus.vercel.app/";
            }, 4000);
        } catch (error) {
            if (error.response?.data?.message === "Email is already in use") {
                toast.error("Error: Email ya registrado");
            } else {
                toast.error("Error al registrar");
            }
        }
    };
    //Ajuste Daypicker
    const toYMD = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const parseYMD = (s) => {
        const [y, m, d] = s.split("-").map(Number);
        return new Date(y, m - 1, d);
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Container className="my-4">
                <Card className='card'>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col xs={12} md={4}>
                                <Image className='img' src={MPImage} width={200} roundedCircle />
                            </Col>
                            <Col xs={12} md={8}>
                                <h1 className='texto'>Registrate</h1>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} sm="12" md="5">
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                name="firstName"
                                                required
                                                type="text"
                                                placeholder="Nombre"
                                                value={credentials.firstName}
                                                onChange={inputHandler}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Introduce un nombre válido
                                            </Form.Control.Feedback>

                                            <Form.Label>Email</Form.Label>
                                            <InputGroup className="mt-2" hasValidation>

                                                <InputGroup.Text >@</InputGroup.Text>
                                                <Form.Control id="inputE"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Email"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                    value={credentials.email}
                                                    onChange={inputHandler}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Introduzca un email válido.
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group as={Col} sm="12" md="5">
                                            {/* Campo password */}
                                            <Form.Label>Contraseña</Form.Label>

                                            <InputGroup>
                                                <Form.Control
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    placeholder="Contraseña"
                                                    value={credentials.password}
                                                    onChange={inputHandler}
                                                    isInvalid={
                                                        validated &&
                                                        credentials.password !== "" &&
                                                        credentials.password !== credentials.confirmPassword
                                                    }

                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={handleShowPasswordTemporarily}
                                                    title="Mostrar contraseña 4s"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </Button>
                                                <Form.Control.Feedback type="invalid">
                                                    Las contraseñas no coinciden.
                                                </Form.Control.Feedback>
                                            </InputGroup>

                                            <Form.Label>Contraseña</Form.Label>
                                            <InputGroup className="mt-2">
                                                <Form.Control
                                                    name="confirmPassword"
                                                    // required
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Confirmar Contraseña"
                                                    value={credentials.confirmPassword}
                                                    onChange={inputHandler}
                                                    isInvalid={
                                                        validated &&
                                                        credentials.confirmPassword !== "" &&
                                                        credentials.confirmPassword !== credentials.password
                                                    }

                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={handleShowPasswordTemporarily}
                                                    title="Mostrar contraseña 4s"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </Button>

                                                <Form.Control.Feedback type="invalid">
                                                    Las contraseñas no coinciden.
                                                </Form.Control.Feedback>
                                                {/* <Form.Control.Feedback type="valid">
                                                    Las contraseñas coinciden.
                                                </Form.Control.Feedback> */}
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group as={Col} sm="12" md="5" className="mt-2">
                                            <Form.Label>Teléfono</Form.Label>
                                            <Form.Control
                                                name="phone"
                                                required
                                                type="text"
                                                placeholder="Teléfono"
                                                value={credentials.phone}
                                                onChange={inputHandler}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Introduce un teléfono válido.
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group as={Col} sm="12" md="5" className="mt-2">
                                            <Form.Label>Fecha de nacimiento</Form.Label>
                                            <ReactDatePicker
                                                selected={credentials.birthDate ? parseYMD(credentials.birthDate) : null}
                                                onChange={(date) =>
                                                    inputHandler({
                                                        target: {
                                                            name: "birthDate",
                                                            value: date ? toYMD(date) : "",
                                                        },
                                                    })
                                                }
                                                dateFormat="yyyy-MM-dd"
                                                locale="es"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                className="form-control"
                                                maxDate={new Date()}
                                                placeholderText="Fecha de nacimiento"
                                                required
                                            />
                                            {validated && !credentials.birthDate && (
                                                <div className="invalid-feedback d-block">
                                                    Introduce tu fecha de nacimiento.
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            required
                                            checked={acceptedPrivacy}
                                            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                                            feedback="Debes aceptar la política de privacidad."
                                            feedbackType="invalid"
                                            label={
                                                <>
                                                    Acepto la{" "}
                                                    <Button
                                                        variant="link"
                                                        className="p-0 align-baseline"
                                                        onClick={() => setShowPrivacy(true)}
                                                    >
                                                        Política de Privacidad
                                                    </Button>
                                                </>
                                            }
                                        />
                                    </Form.Group>

                                    <Button type="submit">Registrarme</Button>
                                </Form>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>

            <Privacity
                show={showPrivacy}
                onHide={() => setShowPrivacy(false)}
                onAccept={() => {
                    setAcceptedPrivacy(true);
                    setShowPrivacy(false);
                }}
            />
        </>
    );
};
