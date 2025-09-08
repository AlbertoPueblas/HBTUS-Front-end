import React, { useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import Privacity from "../ModalPrivacity/ModalPrivacity";

function Footer() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);
  const handleAccept = () => {
    alert("Política de privacidad aceptada ✅");
    setModalVisible(false);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contacto */}
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>
            Email:{" "}
            <a href="mailto:hazbrillartuser@gmail.com" className="footer-link">
              hazbrillartuser@gmail.com
            </a>
          </p>
          <p>
            Teléfono:{" "}
            <a href="tel:+34648279125" className="footer-link">
              +34 648 27 91 25
            </a>
          </p>
        </div>

        {/* Enlaces */}
        <div className="footer-section">
          <h4>Enlaces</h4>
          <ul className="footer-list">
            <li>
              <Link to="/" className="footer-link">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link to="/menu" className="footer-link">
                Servicios
              </Link>
            </li>
            <li>
              <Link className="footer-link" onClick={handleOpenModal}>
                Política de privacidad
              </Link>
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="footer-section">
          <h4>Síguenos</h4>
          <p>Próximamente</p>
        </div>
      </div>

      <div className="footer-copy">
        &copy; {new Date().getFullYear()} Haz brillar tu ser. Todos los derechos reservados.
      </div>

      <Privacity
        show={modalVisible}
        onHide={handleCloseModal}
        onAccept={handleAccept}
      />
    </footer>
  );
}

export default Footer;
