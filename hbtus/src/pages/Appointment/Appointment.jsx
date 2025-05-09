import { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import { allAppointments } from "../../services/apiCalls";
import { useSelector } from "react-redux";
import { getUserData } from "../../app/slice/userSlice";
import Pagination from 'react-bootstrap/Pagination';
import { toast } from "react-toastify";
import { FiSettings } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import dayjs from "dayjs";
import 'react-day-picker/dist/style.css';
import './Appointment.css';
import { appointmentCreate } from "../../services/apiCalls";
import { useNavigate } from "react-router-dom";

//--------------------------------------------------
export const AdminAppointment = () => {
    const [appointment, setAppointment] = useState([]);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 15;
    const userReduxData = useSelector(getUserData);
    const token = userReduxData.token;

    const [showModify, setShowModify] = useState(false);
    const [appointmentData, setAppointmentData] = useState({
        id: "",
        appointmentDate: "",
        serviceId: ""
    });
    
  
   
    const navigate = useNavigate();
    const myPassport = useSelector(getUserData);
    // const token = myPassport.token;

  
  
    // Actualiza el estado
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await allAppointments(token, currentPage);
                setAppointment(res.data.appointment);
                console.log(res.data.appointment);

                setTotalPages(res.data.total_pages);
            } catch (error) {
                showToast(error);
            }
        };
        fetchAppointments();
    }, [currentPage, token]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleShowModify = (appointment) => {
        setAppointmentData({
            id: appointment.id,
            appointmentDate: dayjs(appointment.appointmentDate).format("YYYY-MM-DDTHH:mm"), // ISO format for input[type=datetime-local]
            serviceId: appointment.serviceId
        });
        setShowModify(true);
    };
    

    //Crea el numero de filas necesarias para completar la tabla
    const placeholders = Array(itemsPerPage - appointment.length).fill({})

    const updateByAdmin = async (id) => {
        await updateForUser(id, token)
        toast.success("Update appointment successfully")
    }
    return (
        <div className="table-responsive">
            <h3>Todas las citas</h3>

            <Table striped bordered hover className="table">
                <thead>
                    <tr>
                        <th className="Id">ID</th>
                        <th>Cita</th>
                        <th>Servicio</th>
                        <th>Email</th>
                        <th>Nombre</th>
                        <th> Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {appointment.map((date, index) => (
                        console.log(date),

                        <tr className="rowAppointment" key={index}>
                            <td className="Id">{date.id}</td>
                            <td>{dayjs(date.appointmentDate).format("D MMM  YY - h:mm A")}</td>
                            <td width={250}>{date.service?.service || '-'}</td>
                            <td>{date.user?.email}</td>
                            <td width={200}>{date.user?.firstName || '-'}</td>
                            <td width={120}>{ }{date.user?.phone}</td>
                        </tr>
                    ))}
                    {/* Genera columnas vacias  */}
                    {placeholders.map((_, index) => (
                        <tr key={`placeholder-${index}`}>
                            <td colSpan={6} className="placeholder-row"></td>
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
        </div>
    );
};