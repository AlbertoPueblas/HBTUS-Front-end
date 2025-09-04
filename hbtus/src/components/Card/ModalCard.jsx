import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getUserData } from '../../app/slice/userSlice';
import { useNavigate } from 'react-router-dom';

//----------------------------------------------------------------

function UserCard({
    user = {},
    handleCreateAppointment,
    desactiveUser,
    onStateUserSuccess,
    restoreUser,
    deleteUser,
    onHideModal, // <-- viene desde Admin
    showProfile // <-- viene desde Admin
}) {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedDate, setEditedDate] = useState('');
    const [editedServiceId, setEditedServiceId] = useState('');
    const [profileData, setProfileData] = useState(user);
    const navigate = useNavigate();
    const userReduxData = useSelector(getUserData) || {};
    const userType = userReduxData?.decoded?.userRole;

    const handleCreateAppointmentProp = () => {
        if (!editedDate || !editedServiceId) {
            toast.error('Por favor, completa todos los campos.');
            return;
        }
        handleCreateAppointment(user.id, editedDate, editedServiceId);
        setEditModalVisible(false);
    };

    const handleDeactivate = (userId) => {
        desactiveUser(userId);
        setProfileData({ ...profileData, isActive: false });
        onStateUserSuccess();
    };

    const handleRestore = (userId) => {
        restoreUser(userId);
        setProfileData({ ...profileData, isActive: true });
        onStateUserSuccess();
    };

    const handleDeleteConfirmation = (userId) => {
        const confirmDelete = window.confirm('¿Estás seguro de que quieres borrar este perfil?');
        if (confirmDelete) {
            deleteUser(userId);
            onStateUserSuccess();
            onHideModal(); // <-- Cerrar modal tras borrar
        }
    };
      const goToHistory = () => {
    navigate('/histories', { state: { userId: user.id } });
  };

    return (
        <>
            {/* Modal de información del usuario */}
            <Modal show={showProfile} onHide={onHideModal} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{user.id} : {user.firstName} {user.lastName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Card.Title>Email: {user.email}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Phone: {user.phone}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">
                                Status: {user.isActive ? "Activo" : "Inactivo"}
                            </Card.Subtitle>
                            <Card.Subtitle>
                                Registrado: {dayjs(user.registrationDateTime).format("YYYY-MM-DD")}
                            </Card.Subtitle>

                            {userType === "Admin" && profileData.isActive && (
                                <Card.Link className='desActive' onClick={() => handleDeactivate(user.id)}>
                                    Desactivar Perfil
                                </Card.Link>
                            )}
                            {userType === "Admin" && !profileData.isActive && (
                                <Card.Link className='active' onClick={() => handleRestore(user.id)}>
                                    Restaurar Perfil
                                </Card.Link>
                            )}
                            {userType === "Admin" && (
                                <Card.Link className='deleteProfile' onClick={() => handleDeleteConfirmation(user.id)}>
                                    Eliminar Perfil
                                </Card.Link>
                            )}
                        </Card.Body>
                    </Card>
                    <Button variant="success" className="mt-3" onClick={() => setEditModalVisible(true)}>
                        Crear cita
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={goToHistory} >Historial</Button>
                    <Button variant="secondary" onClick={onHideModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para crear cita */}
            <Modal show={editModalVisible} onHide={() => setEditModalVisible(false)} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Crear Cita</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Fecha y hora</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={dayjs(editedDate).format("YYYY-MM-DDTHH:mm")}
                            onChange={(e) => setEditedDate(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">ID del Servicio</label>
                        <input
                            type="number"
                            className="form-control"
                            value={editedServiceId}
                            onChange={(e) => setEditedServiceId(Number(e.target.value))}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModalVisible(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleCreateAppointmentProp}>Crear Cita</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UserCard;
