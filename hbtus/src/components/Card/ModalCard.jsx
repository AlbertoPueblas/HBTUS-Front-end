import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { CgProfile } from "react-icons/cg";
import { FcCancel } from 'react-icons/fc';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getUserData } from '../../app/slice/userSlice';

//----------------------------------------------------------------

function UserCard({ user ={}, handleCreateAppointment, desactiveUser,  onStateUserSuccess, restoreUser, deleteUser }) {

    const [showProfile, setShowProfile] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false); // Modal de crear/editar cita
    const [editedDate, setEditedDate] = useState('');
    const [editedServiceId, setEditedServiceId] = useState('');
    const [isCreatingAppointment, setIsCreatingAppointment] = useState(true); // Para saber si estamos creando una cita
    const [profileData, setProfileData] = useState(user)
    const userReduxData = useSelector(getUserData) || {}

    const token = userReduxData?.token
    const userType = userReduxData?.decoded?.userRole


    const handleCloseProfile = () => setShowProfile(false);
    const handleShowProfile = () => setShowProfile(true);

    const handleCreateAppointmentProp = () => {
        if (!editedDate || !editedServiceId) {
            toast.error('Por favor, completa todos los campos.');
            return;
        }
        // Llama a la función pasada desde Admin.jsx
        handleCreateAppointment(user.id, editedDate, editedServiceId);
        setEditModalVisible(false); // Cierra el modal
    };
    
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
            
            
        }))
        console.log(prevData);
        onStateUserSuccess();
    }
    
    
    const handleDeleteConfirmation = (userId) => {
        const confirmDelete = window.confirm('¿Estás seguro de que quieres borrar este perfil?');
    
        if (confirmDelete) {
            deleteUser(userId)
        }
        onStateUserSuccess();
    };

    return (
        <>
            <div className="icons">
                {user.isActive ? (
                    <CgProfile className='icon' variant="primary" onClick={handleShowProfile} />
                ) : (
                    <FcCancel className='icon' variant="primary" onClick={handleShowProfile} />
                )}
            </div>

            {/* Modal de perfil */}
            <Modal show={showProfile} onHide={handleCloseProfile} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{user.id} : {user.firstName} {user.lastName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Card.Title>Email: {user.email}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                Phone: {user.phone}
                            </Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">
                                Status: {user.isActive ? "Activo" : "Inactivo"}
                            </Card.Subtitle>
                            <Card.Subtitle>Registrado: {dayjs(user.registrationDateTime).format("YYYY-MM-DD")}</Card.Subtitle>
                    {userType === "Admin" && user.isActive && (
                                <Card.Link className='desActive' onClick={() => handleDeactivate(profileData.id)}>Desactive Profile</Card.Link>
                            )}

                            {userType === "Admin" && !user.isActive && (
                                <Card.Link className='active' 
                                onClick={() => handleRestore(profileData.id)}>
                                    Restore Profile</Card.Link>
                            )}

                            {userType === "Admin" && (
                                <Card.Link className='deleteProfile' 
                                onClick={() => handleDeleteConfirmation(profileData.id)}>
                                    Delete Profile</Card.Link>
                            )}
                        </Card.Body>
                    </Card>
                    <Button variant="success" onClick={() => setEditModalVisible(true)}>
                        Crear cita
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseProfile}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para crear cita */}
            <Modal show={editModalVisible} onHide={() => setEditModalVisible(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Cita</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
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
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModalVisible(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleCreateAppointmentProp}>
                        Crear Cita
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UserCard;
