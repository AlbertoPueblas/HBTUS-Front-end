import { useEffect, useState } from "react";
import "./Admin.css";
import Table from 'react-bootstrap/Table';
import { allUsers, deleteAppointmentByAdmin, 
    deleteUser, restoreUser, desactiveUser, 
    createAppointmentByAdmin, 
    getDatesUsersByAdmin, 
    updateAppointment, 
    allTreatments 
} from "../../services/apiCalls";
import { useSelector } from "react-redux";
import { getUserData } from "../../app/slice/userSlice";
import UserCard from "../../components/Card/ModalCard";
import Pagination from 'react-bootstrap/Pagination';
import { toast } from "react-toastify";
import { FcCancel, FcPlanner } from "react-icons/fc";
import AppointmentModal from "../../components/AppointmentModal/AppointmentModal";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
    const [users, setUsers] = useState([]);
    const [stateUser, setStateUser] = useState(false);
    const [services, setServices] = useState([]);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [appointmentData, setAppointmentData] = useState([]);  // Se cambia a lista vacía
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 15;

    const userReduxData = useSelector(getUserData);
    const token = userReduxData.token;
    const userType = userReduxData?.decoded?.userRole || null;

    const navigate = useNavigate();

  // ✅ 1. Control de acceso
  useEffect(() => {
    if (userType && userType !== "Admin") {
      toast.error("Acceso denegado");
      navigate("/"); // o /login
    }
  }, [userType, navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await allUsers(token, currentPage);
                let fetchedUsers = res.data.users.map(user => ({
                    ...user,
                    appointment: user.appointment || []
                }));
                setUsers(fetchedUsers);
                setTotalPages(res.data.total_pages);
            } catch (error) {
                toast.error(error.message || "Error al cargar");
            }
        };
        fetchUsers();
    }, [currentPage, token, stateUser, userType]);

    useEffect(() => {
  const fetchServices = async () => {
    try {
      const res = await allTreatments(token); // función que llame al endpoint de servicios
      setServices(res.data); // asumiendo que el array viene en res.data
    } catch (error) {
      toast.error(error.message || "Error fetching services");
    }
  };
  fetchServices();
}, [token]);


    const handleStateUserSuccessfully = () => {
        setStateUser(!stateUser);
    };

    const restoreProfile = async (id) => {
        try {
            await restoreUser(id, token);
            toast.success("Profile restored");
            handleStateUserSuccessfully();
        } catch {
            toast.error("Error to restore profile");
        }
    };

    const desactiveProfile = async (id) => {
        try {
            await desactiveUser(id, token);
            toast.success("Profile disabled");
            handleStateUserSuccessfully();
        } catch {
            toast.error("Error to disable profile");
        }
    };

    const deletePermanent = async (id) => {
        try {
            await deleteUser(id, token);
            if (users.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
            toast.success("User deleted successfully");
            handleStateUserSuccessfully();
        } catch {
            toast.error("Error deleting user");
        }
    };

    const delAppointment = async (id) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            try {
                await deleteAppointmentByAdmin(id, token);
                toast.success("Appointment deleted");
                handleStateUserSuccessfully();
            } catch {
                toast.error("Error deleting appointment");
            }
        }
    };

    const handleCreateAppointment = async (userId, appointmentDate, serviceId) => {
        if (!appointmentDate || !serviceId) {
            toast.error("Please complete all fields.");
            return;
        }

        // Convertir la fecha a un formato compatible con MySQL (YYYY-MM-DD HH:mm:ss)
        const formattedDate = new Date(appointmentDate).toISOString().slice(0, 19).replace("T", " ");

        try {
            await createAppointmentByAdmin({ appointmentDate: formattedDate, serviceId, userId }, token);
            toast.success("Appointment created");
            handleStateUserSuccessfully();
            closeAppointmentModal();
        } catch {
            toast.error("Error creating appointment");
        }
    };

    const handleShowProfile = (user) => {
        setSelectedProfile(user);
        setShowProfile(true);
        setShowAppointmentModal(false); // Close the appointment modal if open
    };

    const openAppointmentModal = async (user) => {
        setSelectedUser(user);
        setAppointmentData([]); // Reinicia los datos de la cita

        try {
            const response = await getDatesUsersByAdmin(user.id, token);
            
            // Accedemos correctamente a la propiedad 'data' que contiene las citas
            const appointments = Array.isArray(response.data) ? response.data : [];

            if (appointments.length === 0) {
                toast.info("Este usuario no tiene citas.");
            }

            setAppointmentData(appointments); // Asigna las citas si es un array
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setAppointmentData([]);  // Asegúrate de que appointmentData sea siempre un array vacío si hay error
            toast.error("Hubo un problema al obtener las citas.");
        }

        setShowAppointmentModal(true);
        setShowProfile(false);  // Asegúrate de ocultar el perfil cuando abres el modal de cita
    };


    const handleCloseProfile = () => {
        setShowProfile(false); 
        setSelectedProfile(null);
    };

    const closeAppointmentModal = () => {
        setShowAppointmentModal(false);
        setSelectedUser(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const reloadAppointments = async () => {
  if (!selectedUser) return;

  try {
    const response = await getDatesUsersByAdmin(selectedUser.id, token);
    const appointments = Array.isArray(response.data) ? response.data : [];
    setAppointmentData(appointments);
  } catch (error) {
    toast.error("Error al recargar las citas.");
  }
};


    let placeholders = [];
    if (users.length < itemsPerPage) {
        placeholders = Array(itemsPerPage - users.length).fill({});
    }

    return (
        <div className="table-responsive">
            <h3>Usuarios</h3>
            <Table striped bordered hover className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th className="celda">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                                {showProfile && selectedProfile?.id === user.id && (
                                    <UserCard
                                        user={user}
                                        showProfile={showProfile}
                                        restoreUser={restoreProfile}
                                        desactiveUser={desactiveProfile}
                                        deleteUser={deletePermanent}
                                        onStateUserSuccess={handleStateUserSuccessfully}
                                        handleCreateAppointment={handleCreateAppointment}
                                        onHideModal={handleCloseProfile}
                                    />
                                )}
                                <div className="icons">
                                    {user.isActive ? (
                                        <CgProfile className='icon' onClick={() => handleShowProfile(user)} />
                                    ) : (
                                        <FcCancel className='icon' onClick={() => handleShowProfile(user)} />
                                    )}
                                    {user.appointment.length > 0 && (
                                        <FcPlanner className="icon" onClick={() => openAppointmentModal(user)} />
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {placeholders.map((_, index) => (
                        <tr key={`placeholder-${index}`}>
                            <td colSpan={8} className="placeholder-row1"></td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="pagination">
                <Pagination>
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>

            {showAppointmentModal && selectedUser && (
                <AppointmentModal
                    show={showAppointmentModal} 
                    onHide={closeAppointmentModal}  
                    appointmentData={appointmentData}
                    setAppointmentData={setAppointmentData}
                    onSave={handleCreateAppointment}
                    services={services}
                    modalType="list"
                    appointments={selectedUser?.appointment || []}
                    user={selectedUser}
                    onReload={reloadAppointments}
                    token={token}
                />
            )}
        </div>
    );
};
