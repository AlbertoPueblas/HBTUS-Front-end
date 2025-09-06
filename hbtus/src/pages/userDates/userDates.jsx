import Card from 'react-bootstrap/Card';
import { useSelector } from 'react-redux';
import { getUserData } from '../../app/slice/userSlice';
import { useEffect, useState } from 'react';
import { bringDates, bringAllTreatments, deleteDate } from '../../services/apiCalls';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import dayjs from 'dayjs';
import { HiOutlinePencil } from "react-icons/hi2";
import { FcEmptyTrash, FcPlus } from "react-icons/fc";
import "./userDates.css";
import { useNavigate } from 'react-router-dom';
// import ModalDate from '../../components/ModalDate/ModalDate';
import { FcDownLeft } from "react-icons/fc";
import { toast } from 'react-toastify';
import AppointmentModal from '../../components/AppointmentModal/AppointmentModal';


//---------------------------------------------------------------------

export const Dates = () => {
    const navigate = useNavigate();
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState();
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("edit"); // o "create"
    const [treatments, setTreatments] = useState([]);
    const myPassport = useSelector(getUserData);
    const token = myPassport.token;

    useEffect(() => {
        const fetchData = async () => {
            const resDates = await bringDates(token);
            setDates(resDates.user.appointment);
            const resTreatments = await bringAllTreatments(token);
            setTreatments(resTreatments.data.services || []);
        };
        fetchData();
    }, [token]);

    const handleEditAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setModalMode("edit");
        setShowModal(true);
    };

    const handleNewTreatment = async (treatmentData) => {
        // Lógica para crear un nuevo tratamiento (POST al backend)
        // Opcional: actualizar lista de tratamientos
    };

    const handleOpenCreateModal = () => {
        setModalMode("create");
        setShowModal(true);
    };

    const deleteAppointment = async (id) => {
        const confirmation = window.confirm("¿Estás seguro de que deseas eliminar esta cita?");
        if (confirmation) {
            const res = await deleteDate(id, token);
            if (res) {
                const updatedDates = dates.filter(date => date.id !== id);
                setDates(updatedDates);
                toast.success("Cita eliminada con éxito");
                if (updatedDates.length === 0) {
                    navigate("/profile");
                }
            } else {
                toast.error("Error al eliminar la cita");
            }
        }
    };

    return (
        <Container className="container">
            <Row className="justify-content-center">
                <Col xs={12} md={8}>
                    <h3 className="text-center">Citas</h3>
                    <Card className='card'>
                        <Card.Body>
                            <h6>Proximamente...</h6>
                            {dates && dates.map((date, index) => (
                                <Card key={index} className="mb-2" onClick={() => handleNewTreatment(date)}>
                                    <Card.Body>
                                        <div className='icon'>
                                            <FcPlus className='icon' onClick={() => { navigate("/Create") }} />
                                            <HiOutlinePencil className='icon' onClick={(e) => { e.stopPropagation(); handleEditAppointment(date); }} />
                                            <FcEmptyTrash className='icon' onClick={(e) => { e.stopPropagation(); deleteAppointment(date.id) }} />
                                            <FcDownLeft className='icon' onClick={() => navigate("/profile")} />
                                        </div>
                                        <Card.Title>Día y hora</Card.Title>
                                        <Card>{dayjs(date.appointmentDate).format("dddd, MMMM D, YYYY h:mm A")}</Card>
                                        <Card.Title>Tratamiento</Card.Title>
                                        <Card>{date.service?.service}</Card>
                                        <Card.Title>Precio</Card.Title>
                                        <Card>{date.service?.price}€</Card>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <AppointmentModal
                show={showModal}
                mode={modalMode}
                onHide={() => setShowModal(false)}
                appointmentData={selectedAppointment}
                treatments={treatments}
                onUpdateAppointment={() => {
                    // Recargar citas después de editar
                    bringDates(token).then(res => setDates(res.user.appointment));
                }}
                onCreateTreatment={handleNewTreatment}
            />

        </Container>
    );
};