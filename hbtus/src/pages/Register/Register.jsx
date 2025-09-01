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
//------------------------------------------------------------------------------

export const Register = () => {

    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [credentials, setCredentials] = useState({
        firstName: "",
        email: "",
        password: ""
    })

    const [registerTime, setRegisterTime] = useState(null)
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);


    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const currentDate = new Date(); // Obtiene la fecha y hora actual
            setRegisterTime(currentDate); // Guarda la fecha y hora de registro
            await register(currentDate); //Pasamos los datos a la función
        }
        setValidated(true);
    };

    const register = async () => {
        try {
            const res = await newRegister(credentials);

            if (res.data && res.data.email) {
                toast.success("Registro completado.");
                setTimeout(() => {
                    navigate("/home");
                }, 1000);
            } else {
                toast.success(res.data.message || "#4caf50", "Usuario desactivado");
                setTimeout(() => {
                    navigate("/home")
                }, 1000)
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message === "Email already exists") {
                toast.error("Error al registrar, prueba de nuevo");
            } else {
                toast.error("Email ya registrado");
            }
        }
    };

    const activeProfile = async () => {
        try {
            const response = await activeUser(id, token);
            navigate("/home")

        } catch (error) {

        }
    }

    const inputHandler = (e) => {
        setCredentials((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
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
                                        <Form.Group as={Col} sm="12" md="4" controlId="validationCustom1">
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                name="firstName"
                                                required
                                                type="text"
                                                placeholder="First name"
                                                value={credentials.firstName}
                                                onChange={inputHandler}
                                            />
                                            <Form.Control.Feedback>Todo correcto!</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} sm="12" md="4" controlId="validationCustomUsername">
                                            <Form.Label>Email</Form.Label>
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
                                        <Form.Group as={Col} sm="12" md="4" controlId="validationCustom2">
                                            <Form.Label>Contraseña</Form.Label>
                                            <Form.Control
                                                name="password"
                                                required
                                                type="password"
                                                placeholder="Password"
                                                value={credentials.password}
                                                onChange={inputHandler}
                                            />
                                            <Form.Control.Feedback>Todo correcto!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">
                                                Laa contraseña debe contener al menos 8 caracteres.
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
                                    <Button type="submit">Registrame</Button>
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
}
