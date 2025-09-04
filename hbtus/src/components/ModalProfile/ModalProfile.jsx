import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { updateProfile } from '../../services/apiCalls';
import { IoPersonAddOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

function ModalProfile({ profileData, inputHandler, token }) {
    const [show, setShow] = useState(false);
    const [saving, setSaving] = useState(false);

    const closeModal = () => setShow(false);
    const openModal = () => setShow(true);

    const profileUpdate = async () => {
        try {
            setSaving(true);
            await updateProfile(profileData, token);
            toast.success("Perfil actualizado correctamente");
            setShow(false);
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar el perfil");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <IoPersonAddOutline className='icon' onClick={openModal} title="Modificar perfil" />
            <Modal show={show} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar perfil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <InputGroup hasValidation>
                                <InputGroup.Text>@</InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={inputHandler}
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="firstName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={profileData.firstName}
                                onChange={inputHandler}
                            />
                        </Form.Group>
                        <Form.Group controlId="lastName">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={profileData.lastName || ""}
                                onChange={inputHandler}
                            />
                        </Form.Group>
                        <Form.Group controlId="phone">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={profileData.phone || ""}
                                onChange={inputHandler}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Cerrar</Button>
                    <Button variant="success" onClick={profileUpdate} disabled={saving}>
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalProfile;
