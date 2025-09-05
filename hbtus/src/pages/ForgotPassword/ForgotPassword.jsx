import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import { ToastContainer, toast } from "react-toastify";
import Metatron from "../../images/metatron.png";
import { sendResetEmail } from "../../services/apiCalls"; // <-- función que llama a tu backend
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const res = await sendResetEmail({email});
      if (res.data && res.data.message) {
        toast.success(res.data.message);
      } else {
        toast.success("Correo de recuperación enviado");
      }
    } catch (error) {
      toast.error("No se pudo enviar el correo. Intenta de nuevo.");
    }
  };

  return (
    <>
      <Container className="my-4">
        <Card className="card">
          <Card.Body>
            <Row className="mb-3">
              <Col xs={12} md={4}>
                <Image src={Metatron} width={200} roundedCircle />
              </Col>
              <Col xs={12} md={8}>
                <h1>Recuperar contraseña</h1>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group controlId="validationEmail">
                    <Form.Label>Email</Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text>@</InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Por favor, introduce un email válido.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Button type="submit" className="Button mt-3">
                    Enviar correo
                  </Button>

                  <h6 className="mt-2">
                    Volver al <Link to="/login">Login</Link>
                  </h6>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
      <ToastContainer position="center" autoClose={3000} />
    </>
  );
};
