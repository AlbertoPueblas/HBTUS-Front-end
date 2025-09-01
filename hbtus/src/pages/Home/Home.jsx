import "./Home.css"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Privacity from "../../components/ModalPrivacity/ModalPrivacity";
import { useState } from "react";

//-----------------------------------------------------

export const Home = () => {
    const [show, setShow] = useState(false);

    return (
        <>
      <Card className="tarjetaHome" border="info" 
      style={{ width: '100%',maxWidth: '55rem', maxHeighth: '48rem', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem' }}>
        <Card.Header><h1 className="titulo">Haz Brillar tu ser</h1></Card.Header>
        <Card.Body>
          <Card.Title><h3 className="advertencia">INFORMACION IMPORTANTE</h3></Card.Title>
          <Card.Text>
             <div className="presentacion">
                <span>Las técnicas energéticas son prácticas que se enfocan en el manejo,<br /> empleo
                    y canalización de la energía, tanto en personas, animales,<br /> nuestro entorno o en el universo.</span>
                <span>Los servicios de esta web no tienen nada que ver con la medicina <br /> ni la psiquiatría.
                    Tampoco sustituye a ningún tratamiento médico y/o psiquiátrico.</span>
                <span><span>No soy médico.</span> No estoy licenciada, certificada, ni registrada como médico,<br />
                    enfermera o cualquier otra profesión de la salud en ninguna jurisdicción. <br />
                    No proporciono ningún tipo de servicios de medicina. <br />
                    Las técnicas que realizo no son un sustituto de la atención médica   profesional <br />
                    de un médico ni de otros servicios de salud ofrecidos por profesionales cualificados. <br />
                    No realizo tratamientos médicos ni desarrollo planes de tratamiento ni   seguimientos para estos</span>
            </div>
          </Card.Text>
        </Card.Body>
         {/* <Button variant="primary" onClick={() => setShow(true)}>Politica de privacidad</Button> */}
<Card.Footer className="text-muted">
  <a href="mailto:hazbrillartuser@gmail.com" className="email-link">hazbrillartuser@gmail.com </a>
</Card.Footer>

      </Card>
      <br />
      <Privacity show={show} onHide={() => setShow(false)}/>
    </>
  );
};
