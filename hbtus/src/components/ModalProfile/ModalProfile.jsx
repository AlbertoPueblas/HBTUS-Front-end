import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { updateProfile } from '../../services/apiCalls';
import { IoPersonAddOutline } from 'react-icons/io5';
// import ModalPassword from '../ModalPassword/ModalPassword';

//-----------------------------------------------------------

function ModalProfile(props) {

    const { profileData, inputHandler, token } = props;
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const closeModal = () => {
        setShow(false);
    }

    const openPasswordModal = () => {
        setShow(false);
        setShowPasswordModal(true);
    }

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setShow(true); // Reopen Memodal if needed
    }

    const profileUpdate = async () => {
        await updateProfile(profileData, token);
        setTimeout(() => {
            navigate("/Profile");
            setShow(false);
        }, 2000);
    };

    return (
        <>
            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
                <IoPersonAddOutline className='icon' variant="primary" onClick={() => setShow(true)}>
                    modify profile
                </IoPersonAddOutline>
                <Modal show={show} onHide={closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="validationCustomUsername" >
                            <Form.Label>Email</Form.Label>
                            <InputGroup hasValidation>
                                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="email"
                                    value={profileData.email}
                                    onChange={inputHandler}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid email.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="validationCustom01">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                placeholder="firstName"
                                value={profileData.firstName}
                                onChange={inputHandler}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="validationCustom02">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                placeholder="lastName"
                                value={profileData.lastName || ""}
                                onChange={inputHandler}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="validationCustom03">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                name="phone"
                                required
                                type="text"
                                placeholder="phone"
                                value={profileData.phone || ""}
                                onChange={inputHandler}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Link variant="primary" onClick={openPasswordModal}>
                            Change Password
                        </Link>
                        <Button variant="secondary" onClick={closeModal}>Close</Button>
                        <Button variant="success" onClick={() => {
                            profileUpdate();
                            navigate("/profile");
                        }}>Save changes</Button>
                    </Modal.Footer>
                </Modal>
                {/* <ModalPassword
                    profileData={profileData}
                    token={token}
                    show={showPasswordModal}
                    onHide={closePasswordModal}
                /> */}
            </div>
        </>
    );
}
export default ModalProfile;