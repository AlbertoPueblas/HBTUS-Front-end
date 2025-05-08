import { useEffect, useState } from "react";
import "./Admin.css";
import Table from 'react-bootstrap/Table';
import {
    allUsers,
    deleteAppointmentByAdmin,
    deleteUser,
    restoreUser,
    desactiveUser,
    createAppointmentByAdmin
} from "../../services/apiCalls";
import { useSelector } from "react-redux";
import { getUserData } from "../../app/slice/userSlice";
import UserCard from "../../components/Card/ModalCard";
import Pagination from 'react-bootstrap/Pagination';
import { toast } from "react-toastify";
import { FcPlanner } from "react-icons/fc";
import AppointmentModal from "../../components/AppointmentCard/AppointmentCard";

//------------------------------------------------------------------------------------

export const Admin = () => {
    const [users, setUsers] = useState([]);
    const [stateUser, setStateUser] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [appointmentData, setAppointmentData] = useState({
        service: "",
        price: ""
    });

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 12;

    const userReduxData = useSelector(getUserData);
    const token = userReduxData.token;
    const userType = userReduxData.decoded.userRole;

    const [filterUser, setFilterUser] = useState([]);

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
                console.log("desde admin",res.data.users);
            } catch (error) {
                toast.error(error.message || "Error fetching users");
            }
            
        };
        fetchUsers();
    }, [currentPage, token, stateUser, userType]);

    const handleStateUserSuccessfully = () => {
        setStateUser(!stateUser);
    };

    const restoreProfile = async (id) => {
        if (userType !== "Admin") {
            toast.error("Unauthorized action", "#f44336");
            return;
        }
        try {
            await restoreUser(id, token);
            toast.success("Profile restored", "#4caf50");
            handleStateUserSuccessfully();
        } catch (error) {
            toast.error("Error to restore profile");
        }
    };

    const desactiveProfile = async (id) => {
        if (userType !== "Admin") {
            toast.error("Unauthorized action", "#f44336");
            return;
        }
        try {
            await desactiveUser(id, token);
            toast.success("Profile disabled", "#4caf50");
            handleStateUserSuccessfully();
        } catch (error) {
            toast.error("Error to disable profile");
        }
    };

    const deletePermanent = async (id) => {
        if (userType !== "Admin") {
            toast.error("Unauthorized action", "#f44336");
            return;
        }
        try {
            await deleteUser(id, token);
            // Ajustar la página si es necesario
            if (users.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
            toast.success("User deleted successfully", "#4caf50");
        } catch (error) {
            toast.error("Error deleting user");
        }
        handleStateUserSuccessfully();
    };

    const delAppointment = async (id) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            try {
                await deleteTreatmentByAdmin(id, token);
                toast.success("Appointment deleted successfully", "#4caf50");
            } catch (error) {
                toast.error("Error deleting appointment");
            }
        }
    };

    // Función para crear una cita
    const handleCreateAppointment = async (userId, appointmentDate, serviceId) => {
        if (!appointmentDate || !serviceId) {
            toast.error("Please complete all fields.");
            return;
        }
        try {
            await createAppointmentByAdmin({
                appointmentDate,
                serviceId,
                userId
            }, token);
            toast.success("Appointment created successfully.");
            handleStateUserSuccessfully();
            setShowAppointmentModal(false); // Cierra el modal
        } catch (error) {
            toast.error("Error creating appointment.");
        }
    };

    // Abrir el modal para crear cita
    const openAppointmentModal = (user) => {
        console.log("Abriendo modal de tratamiento para el usuario:", user); // Depuración
        setAppointmentData({
            service: "", // Aquí puedes asignar el servicio que desees
            price: "" // Y el precio inicial
        });
        setSelectedUser(user); // Configura el usuario seleccionado
        setShowAppointmentModal(true);
    };

    const closeAppointmentModal = () => {
        setShowAppointmentModal(false);
        setSelectedUser(null); // Limpia el usuario seleccionado
    };

    // Paginación
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    let placeholders = [];
    if (users.length < itemsPerPage) {
        placeholders = Array(itemsPerPage - users.length).fill({});
    }

    return (
        <div className="table-responsive">
            <h3>Users</h3>
            <Table striped bordered hover className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th className="celda">Actions</th>
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
                                <UserCard
                                    user={user}
                                    restoreUser={restoreProfile}
                                    desactiveUser={desactiveProfile}
                                    deleteUser={deletePermanent}
                                    onStateUserSuccess={handleStateUserSuccessfully}
                                    deleteAppointmentByAdmin={delAppointment}
                                    handleCreateAppointment={handleCreateAppointment} // Pasar la función a UserCard
                                />

                                {user.appointment.length > 0 && (
                                    <FcPlanner className="icon" variant="primary" onClick={() => openAppointmentModal(user)} />
                                )}
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
                    <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </div>

            {/* Modal para crear cita */}
            {showAppointmentModal && (
                <AppointmentModal
                showProfile={false}
                onHideProfile={() => {}} // o puedes no pasarlo si no se usa
                showAppointments={showAppointmentModal}
                onHideAppointments={closeAppointmentModal}
                appointmentData={appointmentData}
                setAppointmentData={setAppointmentData}
                onSave={handleCreateAppointment}
                modalType="create"
                appointments={selectedUser?.appointment || []}
                onModifyAppointment={() => {}}
                // IMPORTANTE: lo que estaba causando que no aparezcan los datos
                setProfileData={() => {}} // opcional, puedes omitirlo si no se usa
            />
            
            )}
        </div>
    );
};
