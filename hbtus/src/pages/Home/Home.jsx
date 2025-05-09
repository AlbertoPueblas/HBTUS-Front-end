import "./Home.css"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export const Home = () => {


    return (
        <>
      <Card className="tarjetaHome" border="info" 
      style={{ width: '55rem', height: '48rem', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: '2rem' }}>
        <Card.Header><h1 className="titulo">Haz Brillar tu ser</h1></Card.Header>
        <Card.Body>
          <Card.Title><h3 className="advertencia">INFORMACION IMPORTANTE</h3></Card.Title>
          <Card.Text>
             <div className="presentacion">
                <p>Las técnicas energéticas son prácticas que se enfocan en el manejo,<br /> empleo
                    y canalización de la energía, tanto en personas, animales,<br /> nuestro entorno o en el universo.</p>
                <p>Los servicios de esta web no tienen nada que ver con la medicina <br /> ni la psiquiatría.
                    Tampoco sustituye a ningún tratamiento médico y/o psiquiátrico.</p>
                <p><span>No soy médico.</span> No estoy licenciada, certificada, ni registrada como médico,<br />
                    enfermera o cualquier otra profesión de la salud en ninguna jurisdicción. <br />
                    No proporciono ningún tipo de servicios de medicina. <br />
                    Las técnicas que realizo no son un sustituto de la atención médica   profesional <br />
                    de un médico ni de otros servicios de salud ofrecidos por profesionales cualificados. <br />
                    No realizo tratamientos médicos ni desarrollo planes de tratamiento ni   seguimientos para estos</p>
            </div>
          </Card.Text>
        </Card.Body>
         <Button variant="primary">Politica de privacidad</Button>
<Card.Footer className="text-muted">
  <a href="mailto:hazbrillartuser@gmail.com" className="email-link">hazbrillartuser@gmail.com </a>
</Card.Footer>

      </Card>
      <br />
    </>
  );
};
