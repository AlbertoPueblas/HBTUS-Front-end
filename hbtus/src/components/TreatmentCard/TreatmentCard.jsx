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
                            {modalType === 'create' ? 'Treatment Name' : 'Nombre del Tratamiento'}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={modalType === 'create' ? 'Enter treatment name' : 'Introduce el nombre del tratamiento'}
                            name="service"
                            value={treatmentData.service}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTreatmentPrice" className="mt-3">
                        <Form.Label>
                            {modalType === 'create' ? 'Treatment Price' : 'Precio del Tratamiento'}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            placeholder={modalType === 'create' ? 'Enter treatment price' : 'Introduce el precio del tratamiento'}
                            name="price"
                            value={treatmentData.price}
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
