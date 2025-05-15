// import { useEffect, useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import { MdDeleteForever } from 'react-icons/md';
// import { Card } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import dayjs from 'dayjs';

// function AppointmentModal({ 
//     showAppointments, 
//     onHideAppointments, 
//     user, 
//     appointmentData  // Recibe las citas filtradas como prop
// }) {
//     const [appointments, setAppointments] = useState(appointmentData);  // Usa las citas filtradas

//     useEffect(() => {
//         // Si las citas se actualizan desde el padre, actualiza el estado local.
//         setAppointments(appointmentData);
//     }, [appointmentData]);

//     const handleCloseAppointments = () => onHideAppointments();

//     const handleDeleteAppointment = async (appointmentId) => {
//         if (window.confirm("Are you sure you want to delete this appointment?")) {
//             try {
//                 // Lógica de eliminación de cita (puedes agregar la función de API aquí)
//                 toast.success("Appointment deleted");
//             } catch (error) {
//                 toast.error("Error deleting appointment");
//             }
//         }
//     };

//     return (
//         <Modal show={showAppointments} onHide={onHideAppointments}>
//             <Modal.Header closeButton>
//                 <Modal.Title>Citas de {user?.firstName || "Usuario"} {user?.lastName || "Desconocido"}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 {appointments.length > 0 ? (
//                     appointments.map((dates) => (
//                         <Card key={dates.id}>
//                             <Card.Body>
//                                 <Card.Title>ID: {dates.id}</Card.Title>
//                                 <Card.Subtitle className="mb-2 text-muted">
//                                     Día: {dayjs(dates.appointmentDate).format('DD/MM/YYYY HH:mm')}
//                                 </Card.Subtitle>
//                                 <Card.Subtitle>
//                                     Servicio: {dates.service ? dates.service.service : "Desconocido"}
//                                 </Card.Subtitle>
                                
//                                 {/* Botón para eliminar la cita */}
//                                 <MdDeleteForever 
//                                     className='icon' 
//                                     onClick={() => handleDeleteAppointment(dates.id)} 
//                                 />
//                             </Card.Body>
//                         </Card>
//                     ))
//                 ) : (
//                     <p>No hay citas para este usuario.</p>
//                 )}
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleCloseAppointments}>
//                     Close
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }

// export default AppointmentModal;
