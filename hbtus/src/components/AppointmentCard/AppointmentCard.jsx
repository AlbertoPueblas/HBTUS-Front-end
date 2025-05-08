import { useSelector } from 'react-redux';
import { getUserData } from '../../app/slice/userSlice';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { MdDeleteForever, MdOutlineDeleteForever } from 'react-icons/md';
import { Card } from 'react-bootstrap';
import { allAppointments, allUsers } from '../../services/apiCalls';
import { toast } from 'react-toastify';

function AppointmentModal({ 
    showProfile, 
    onHideProfile, 
    showAppointments, 
    onHideAppointments,
    user, 

}) {
    const [users, setUsers] = useState([]);
    const [stateUser, setStateUser] = useState (false)
    const [profileData, setProfileData] = useState({});
    const userReduxData = useSelector(getUserData) || {};
    const token = userReduxData?.token;
    const userType = userReduxData?.decoded?.userRole;

    const handleShowProfile = () => {
        setProfileData(userReduxData);
        console.log(userReduxData);
        
    };

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await allAppointments(token);
                console.log("Citas recibidas:", res.data.appointment);
                setAppointments(res.data.appointment);
            } catch (error) {
                toast.error("Error al obtener citas");
            }
        };
    
        fetchAppointments();
    }, [token]);
    
    

    const handleCloseProfile = () => onHideProfile();

    const handleShowAppointments = () => {};

    const handleCloseAppointments = () => onHideAppointments();

    const handleDeactivate = (userId) => {
        desactiveUser(userId);
        setProfileData(prevData => ({
            ...prevData,
            isActive: false
        }));
        onStateUserSuccess();
    };

    const handleRestore = (userId) => {
        restoreUser(userId);
        setProfileData(prevData => ({
            ...prevData,
            isActive: true
        }));
        onStateUserSuccess();
    };

    const handleDeleteAppointment = (appointmentId) => {
        deleteAppointmentByAdmin(appointmentId);
        setProfileData(prevData => ({
            ...prevData,
        }));
        onStateUserSuccess();
    };

    const handleDeleteConfirmation = (userId) => {
        const confirmDelete = window.confirm('¿Estás seguro de que quieres borrar este perfil?');
        if (confirmDelete) {
            deleteUser(userId);
        }
        onStateUserSuccess();
    };
    console.log("pintamos",users)

    return (
        <>
            {/* Modal para mostrar el perfil del usuario */}
            <Modal show={showProfile} onHide={handleCloseProfile} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{profileData.id} : {profileData.firstName} {profileData.lastName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Card.Title>Email: {profileData.email}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                Phone: {profileData.phone}
                            </Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">
                                Status: {profileData.isActive ? "Activo" : "Inactivo"}
                            </Card.Subtitle>
                            Register in: {dayjs(profileData.registrationDateTime).format("YYYY-MM-DD")}
                            <Card.Text></Card.Text>

                            {userType === "Admin" && profileData.isActive && (
                                <Card.Link className='desActive' onClick={() => handleDeactivate(profileData.id)}>Desactive Profile</Card.Link>
                            )}

                            {userType === "Admin" && !profileData.isActive && (
                                <Card.Link className='active' onClick={() => handleRestore(profileData.id)}>
                                    Restore Profile
                                </Card.Link>
                            )}

                            {userType === "Admin" && (
                                <Card.Link className='deleteProfile' onClick={() => handleDeleteConfirmation(profileData.id)}>
                                    Delete Profile
                                </Card.Link>
                            )}
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseProfile}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para mostrar las citas del usuario */}
            <Modal show={showAppointments} onHide={handleCloseAppointments}>
                <Modal.Header closeButton>
                    <Modal.Title>Citas de {appointments.user} {user}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {appointments.length > 0 ? (
                        appointments.map((dates) => (
                            <Card key={dates.id}>
                                <Card.Body>
                                    <Card.Title>ID: {dates.id}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Día: {new Date(dates.appointmentDate).toLocaleString()}
                                    </Card.Subtitle>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Nombre: {dates.user.firstName}
                                    </Card.Subtitle>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Apellido: {dates.user.lastName}
                                    </Card.Subtitle>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Email: {dates.user.email}
                                    </Card.Subtitle>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Teléfono: {dates.user.phone}
                                    </Card.Subtitle>
                                    <Card.Subtitle>
                                        Servicio: {dates.service.service}
                                    </Card.Subtitle>
                                    <MdDeleteForever className='icon'
                                        onClick={() => handleDeleteAppointment(dates.id)} />
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p></p>
                    )}
                        {/* <p>No tienes citas agendadas.</p>
                        <input className='inputCalendario'
                            type="datetime-local"
                            name="appointmentDate"
                            value={dayjs(modifiedAppointment.appointmentDate).format("YYYY-MM-DDTHH:mm")}
                            onChange={handleInputChange}/> */}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAppointments}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AppointmentModal;
