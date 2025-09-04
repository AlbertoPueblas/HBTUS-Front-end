import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import { newRegister } from "../../services/apiCalls"
import Image from 'react-bootstrap/Image';
import MPImage from "../../images/metatron.png"
import Privacity from '../../components/ModalPrivacity/ModalPrivacity';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import "./Register"

registerLocale("es", es);

export const Register = () => {

    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [credentials, setCredentials] = useState({
        firstName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        birthDate: "",
    });

    const [registerTime, setRegisterTime] = useState(null)
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Mostrar la contraseña temporalmente
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

        if (credentials.password !== credentials.confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        setValidated(true);
        const currentDate = new Date();
        setRegisterTime(currentDate);

        await register();
    };

    const register = async () => {
        try {
            const res = await newRegister(credentials);
            if (res.data && res.data.message) {
                toast.success(res.data.message);
            }
            // Navegar a /home u otra página tras registro
            // navigate("/home");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message === "Email is already in use") {
                toast.error("Error: Email ya registrado");
            } else {
                toast.error("Error al registrar");
            }
        }
    };

    return (
        <>
            <Container className="my-4">
                <Card className='card'>
                    <h4>Registrate</h4>
                    <Card.Body>
                        <Row>
                            <Col xs={12} md={4}>
                                <Image src={MPImage} width={200} roundedCircle />
                            </Col>
                            <Col xs={12} md={8}>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} sm="12" md="5" controlId="validationCustom1">
                                            <Form.Label></Form.Label>
                                            <Form.Control
                                                name="firstName"
                                                required
                                                type="text"
                                                placeholder="Nombre"
                                                value={credentials.firstName}
                                                onChange={inputHandler}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Introduce un nombre
                                            </Form.Control.Feedback>

                                            <Form.Label></Form.Label>
                                            <InputGroup hasValidation>
                                                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                                <Form.Control
                                                    name="email"
                                                    type="email"
                                                    placeholder="Email"
                                                    aria-describedby="inputGroupPrepend"
                                                    required
                                                    value={credentials.email}
                                                    onChange={inputHandler}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Por favor, introduzca un email válido.
                                                </Form.Control.Feedback>
                                            </InputGroup>

                                        </Form.Group>

                                        <Form.Group as={Col} sm="12" md="5" controlId="validationCustom2">
                                            <Form.Label></Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    name="password"
                                                    required
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Contraseña"
                                                    value={credentials.password}
                                                    onChange={inputHandler}
                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={handleShowPasswordTemporarily}
                                                    title="Mostrar contraseña 4s"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </Button>
                                            </InputGroup>
                                            <Form.Control.Feedback type="invalid">
                                                Debe contener al menos 6 caracteres.
                                            </Form.Control.Feedback>
                                            <Form.Label></Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    name="confirmPassword"
                                                    required
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Confirmar Contraseña"
                                                    value={credentials.confirmPassword}
                                                    onChange={inputHandler}
                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={handleShowPasswordTemporarily}
                                                    title="Mostrar contraseña 4s"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </Button>
                                            </InputGroup>
                                            <Form.Control.Feedback type="invalid">
                                                Debe contener al menos 6 caracteres.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} sm="12" md="5" controlId="validationPhone">
                                            <Form.Label></Form.Label>
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

                                        <Form.Group as={Col} sm="12" md="5" controlId="validationBirthDate">
                                            <Form.Label></Form.Label>
                                            <ReactDatePicker 
                                                selected={credentials.birthDate ? new Date(credentials.birthDate) : null}
                                                onChange={(date) =>
                                                    inputHandler({
                                                        target: {
                                                            name: "birthDate",
                                                            value: date ? date.toISOString().split("T")[0] : "",
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
                                            <Form.Control.Feedback type="invalid">
                                                Introduce tu fecha de nacimiento.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            required
                                            checked={acceptedPrivacy}
                                            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
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
