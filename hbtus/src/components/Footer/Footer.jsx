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
                {/* Columna de contacto */}
                <div className="footer-section">
                    <h4 className="h4-footer">Contacto</h4>
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

                {/* Columna de enlaces */}
                <div className="footer-section">
                    <h4 className="h4-footer">Enlaces</h4>
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
                            <button className="footer-link" onClick={handleOpenModal}>
                                Política de privacidad
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Columna “decorativa / informativa” */}
                <div className="footer-section">
                    <h4 className="h4-footer">Haz brillar tu ser</h4>
                    <p>Tu bienestar, nuestra prioridad 🌟</p>
                    <p><Link to="/reviews" className="footer-link">
                        Reseñas
                    </Link></p>
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
