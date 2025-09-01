import { useState, useRef } from "react";
import { Modal, Button } from "react-bootstrap";

function Privacity({ show, onHide, onAccept }) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const bodyRef = useRef(null);

  // Detectar si el usuario ha llegado al final del scroll
  const handleScroll = () => {
    if (bodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setScrolledToBottom(true);
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Política de privacidad</Modal.Title>
      </Modal.Header>

      <Modal.Body
        ref={bodyRef}
        onScroll={handleScroll}
        style={{
          maxHeight: "400px",
          overflowY: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
        className="no-scrollbar"
      >
        <p>
          En HazBrillarTuSer valoramos tu confianza y nos comprometemos
          a proteger tu información personal. Esta Política de Privacidad explica cómo recopilamos,
          usamos y protegemos tus datos.
        </p>
        <p>
          <strong>1. Información que recopilamos</strong><br />
          Datos de contacto (nombre, correo electrónico, teléfono).<br />
          Información de navegación (dirección IP, tipo de dispositivo, cookies).<br />
          Datos de uso de nuestros servicios.<br />
          Otra información que nos proporciones voluntariamente.
        </p>
        <p>
          <strong>2. Cómo usamos tu información</strong><br />
          - Proporcionar y mejorar nuestros servicios.<br />
          - Enviar notificaciones importantes.<br />
          - Cumplir con obligaciones legales.
        </p>
        <p>
          <strong>3. Cómo compartimos tu información</strong><br />
          - No vendemos ni alquilamos tus datos personales. <br />
          - Podemos compartir tu información únicamente con: <br />
          - Autoridades legales, si es requerido por ley.<br />
        </p>
        <p>
          <strong>4. Seguridad de la información</strong><br />
          Adoptamos medidas de seguridad técnicas y organizativas razonables
          para proteger tus datos contra accesos no autorizados,
          pérdida o alteración. <br />
        </p>
        <p>
          <strong>6. Derechos de los usuarios</strong><br />
          - Tienes derecho a: <br />
          - Rectificar información incorrecta o incompleta. <br />
          - Solicitar la eliminación de tus datos.<br />
          - Oponerte al tratamiento de tus datos para ciertos fines.<br />
          - Retirar tu consentimiento en cualquier momento.<br />
          - Para ejercer estos derechos, contáctanos en:<br />- hazbrillartuser@gmail.com<br />
        </p>
        <p>
          <strong>8. Cambios en esta política</strong><br />
          Nos reservamos el derecho de modificar esta Política de Privacidad.
          Te notificaremos cualquier cambio relevante a través de nuestro sitio web o por correo electrónico.
        </p>
        <p>
          <strong>9. Contacto<br /></strong>
          Si tienes dudas sobre esta política de privacidad, puedes contactarnos en:<br />
          - hazbrillartuser@gmail.com<br />
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button
          variant="primary"
          onClick={onAccept}
          disabled={!scrolledToBottom}
        >
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Privacity;
