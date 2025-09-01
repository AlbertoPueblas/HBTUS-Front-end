import "./TreatmentCard.css";
import { useSelector } from 'react-redux';
import { getUserData } from '../../app/slice/userSlice';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

//---------------------------------------------------------------------

function TreatmentModal({ show, onHide, treatmentData, setTreatmentData, onSave, modalType, appointments, onModifyAppointment }) {
    const myPassport = useSelector(getUserData);
    const token = myPassport.token;

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setTreatmentData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onSave();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {modalType === 'create' ? 'Create Treatment' : 'Modify Treatment'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formTreatmentName">
                        <Form.Label>
                            {modalType === 'create' ? 'Nombre del servicio' : 'Nombre del Tratamiento'}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={modalType === 'create' ? 'Añade el nombre' : 'Introduce el nombre del tratamiento'}
                            name="service"
                            value={treatmentData.service}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTreatmentPrice" className="mt-3">
                        <Form.Label>
                            {modalType === 'create' ? 'Precio' : 'Precio del Tratamiento'}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            placeholder={modalType === 'create' ? 'precio' : 'Introduce el precio del tratamiento'}
                            name="price"
                            value={treatmentData.price}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTreatmentLongDescription" className="mt-3">
                        <Form.Label>
                            {modalType === 'create' ? 'Descripción del servicio completa' : 'Descripción del tratamiento completo'}
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Introduce una descripción completa"
                            name="longDescription"
                            value={treatmentData.longDescription || ""}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                     <Form.Group controlId="formTreatmentDescription" className="mt-3">
                        <Form.Label>
                            {modalType === 'create' ? 'Descripción del servicio' : 'Descripción del tratamiento'}
                        </Form.Label>
                        <Form.Control
                            tyoe="text"
                            rows={4}
                            placeholder="Introduce una descripción"
                            name="description"
                            value={treatmentData.description || ""}
                            onChange={handleInputChange}
                        />
                    </Form.Group>


                    {/* Mostrar las citas del cliente */}
                    {appointments && appointments.length > 0 && (
                        <div className="appointments-list">
                            <h5>Citas del Cliente:</h5>
                            <ul>
                                {appointments.map((appointment) => (
                                    <li key={appointment.id}>
                                        <p><strong>Cita #{appointment.id}</strong></p>
                                        <p>Fecha: {new Date(appointment.appointmentDate).toLocaleString()}</p>
                                        <p>Servicio: {appointment.service?.service || 'Sin servicio'}</p>
                                        <p>Precio: {appointment.service?.price ? `${appointment.service.price} €` : 'Sin precio'}</p>
                                        <Button
                                            variant="warning"
                                            onClick={() => onModifyAppointment(appointment.id)}
                                        >
                                            Modificar Cita
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    {modalType === 'create' ? 'Cancel' : 'Cancelar'}
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {modalType === 'create' ? 'Save Treatment' : 'Guardar Tratamiento'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TreatmentModal;
