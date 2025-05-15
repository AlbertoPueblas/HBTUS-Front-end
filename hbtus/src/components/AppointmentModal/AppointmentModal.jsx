import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MdDeleteForever } from 'react-icons/md';
import { HiOutlinePencil } from 'react-icons/hi2';
import { FcEmptyTrash } from 'react-icons/fc';
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { deleteAppointmentByAdmin, updateAppointment } from '../../services/apiCalls';

function AppointmentModal({
  show,
  onHide,
  user,
  appointmentData = [],
  token,
  services,
  onReload = () => {}
}) {
  const [modalMode, setModalMode] = useState('list'); // list | edit
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    serviceId: ''
  });

  const servicesArray = services.services;

useEffect(() => {
  if (modalMode === 'edit' && selectedAppointment) {
    setFormData({
      appointmentDate: dayjs(selectedAppointment.appointmentDate).local().format("YYYY-MM-DDTHH:mm"),
      serviceId: selectedAppointment.service?.id || ''
    });
  }
}, [modalMode, selectedAppointment]);


const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};


  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setModalMode('edit');
  };

 const handleSave = async () => {

  if (!selectedAppointment || !token) return;

  // Convertir fecha a formato "YYYY-MM-DD HH:mm:ss"
  const formattedDate = dayjs(formData.appointmentDate).format("YYYY-MM-DD HH:mm:ss");

  const dataToSend = {
    appointmentId: selectedAppointment.id,
    appointmentDate: formattedDate,
    serviceId: formData.serviceId
  };

  try {
    await updateAppointment(dataToSend, token);
    toast.success("Cita actualizada correctamente");
    setModalMode('list');
    setSelectedAppointment(null);
     // recarga citas en el padre
    onHide();
  } catch (error) {
    toast.error("Error al actualizar la cita");
    console.error(error);
  }
};

  const handleDeleteAppointment = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
      try {
        await deleteAppointmentByAdmin(id, token);
        toast.success("Cita eliminada");
        setModalMode('list');
        setSelectedAppointment(null);
        onReload();
        onHide();
      } catch (error) {
        toast.error("Error al eliminar la cita");
      }
    }
  };

  const renderList = () => (
    <>
      {appointmentData.length > 0 ? (
        appointmentData.map((appointment) => (
          <Card key={appointment.id} className="mb-2">
            <Card.Body>
              <div className="d-flex justify-content-end gap-2">
                <HiOutlinePencil
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleEditClick(appointment)}
                />
                <FcEmptyTrash
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDeleteAppointment(appointment.id)}
                />
              </div>
              <Card.Title>ID: {appointment.id}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Día: {dayjs(appointment.appointmentDate).format('DD/MM/YYYY HH:mm')}
              </Card.Subtitle>
              <Card.Text>Servicio: {appointment.service?.service || "Desconocido"}</Card.Text>
              <Card.Text>Precio: {appointment.service?.price}€</Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No hay citas para este usuario.</p>
      )}
    </>
  );

  const renderEdit = () => (
    <>
      <div>
        <label>Fecha y hora:</label>
        <input
          type="datetime-local"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      <div className="mt-2">
        <label>Tratamiento:</label>
        <select
          name="serviceId"
          value={formData.serviceId}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="">Selecciona un tratamiento</option>
          {servicesArray && servicesArray.map(t => (
            <option key={t.id} value={t.id}>
              {t.service} - {t.price}€
            </option>
          ))}
        </select>
      </div>
    </>
  );
console.log(services)
  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalMode === 'edit'
            ? 'Modificar Cita'
            : 'Citas de ' + (user?.firstName || 'Usuario')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalMode === 'list' ? renderList() : renderEdit()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
          if (modalMode === 'edit') {
            setModalMode('list');
            setSelectedAppointment(null);
          } else {
            onHide();
          }
        }}>
          {modalMode === 'edit' ? 'Cancelar edición' : 'Cerrar'}
        </Button>
        {modalMode === 'edit' && (
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default AppointmentModal;
