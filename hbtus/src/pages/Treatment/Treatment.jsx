import { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import { allTreatments, createTreatment, deleteTreatment, modifyTreatment } from "../../services/apiCalls";
import { useSelector } from "react-redux";
import { getUserData } from "../../app/slice/userSlice";
import { FcPlus } from "react-icons/fc";
import Pagination from 'react-bootstrap/Pagination';
import { FiSettings } from "react-icons/fi";
import { MdOutlineDeleteForever } from "react-icons/md";
import "./Treatment.css"
import { toast } from "react-toastify";
import TreatmentModal from "../../components/TreatmentCard/TreatmentCard";


//-------------------------------------------------------------------------------------

export const Treatments = () => {
    const [services, setServices] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [showModify, setShowModify] = useState(false);
    const [treatmentData, setTreatmentData] = useState({
        Service: "",
        price: ""
    });

    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const itemsPerPage = 10;

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const userReduxData = useSelector(getUserData);
    const token = userReduxData.token;

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const res = await allTreatments(token, currentPage);
                setServices(res.data.services);
                
                setTotalPages(res.data.total_pages);
            } catch (error) {
                toast.error(error);
            }
        };
        fetchTreatments();
    }, [currentPage, token, deleteSuccess, treatmentData]);

    const handleShowCreate = () => {
        setTreatmentData({ service: "", price: "" });
        setShowCreate(true);
    };

    const handleShowModify = (treatment) => {
        setTreatmentData(treatment);
        setShowModify(true);
    };
    const handleDeleteSuccess = () => {
        setDeleteSuccess(!deleteSuccess);

    }

    const handleCloseCreate = () => setShowCreate(false);
    const handleCloseModify = () => setShowModify(false);

    const handleCreateTreatment = async () => {
        try {
            const newTreatmentData = {
                ...treatmentData,
                price: Number(treatmentData.price)
            };
    
            await createTreatment(newTreatmentData, token);
            toast.success("El tratamiento ha sido creado");
            setShowCreate(false);
            setTreatmentData({ service: "", price: "" });
    
            const res = await allTreatments(token, currentPage);
            setServices(res.data.services);
        } catch (error) {
            console.error(error);
            toast.error("Fallo al crear el tratamiento");
        }
    };
    

    const handleModifyTreatment = async () => {
        try {
            const updatedTreatment = {
                ...treatmentData,
                price: Number(treatmentData.price),
            };
    
            await modifyTreatment(updatedTreatment, token);
    
            toast.success("El tratamiento ha sido modificado", "#4caf50");
            setShowModify(false);
            setTreatmentData({ service: "", price: "" });
    
            // Aquí llamas a allTreatments para refrescar los datos
            const res = await allTreatments(token, currentPage);
            setServices(res.data.services);
        } catch (error) {
            toast.error("Fallo al modificar el tratamiento");
        }
    };
    
    const handleDeleteTreatment = async (id) => {
        if (window.confirm("Estás seguro de borrar el tratamiento")) {
            try {
                await deleteTreatment(id, token);
                toast.success("El tratamiento ha sido eliminado", "#4caf50");
                // Verificar si la página actual quedará vacía después de eliminar
                if (services.length === 1 && currentPage > 1) {
                    // Retroceder una página si la página actual quedará vacía
                    setCurrentPage(prevPage => prevPage - 1);
                }
            } catch (error) {
                console.error(error);
                toast.error("Error al eliminar el tratamiento", "#f44336");
            }
            handleDeleteSuccess();
        }
    };

    let placeholders = [];

    if (services.length < itemsPerPage) {

        //Crea el numero de filas necesarias para completar la tabla
        placeholders = Array(itemsPerPage - services.length).fill({})
    }

    // Paginación
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setTotalPages(page)
    };

    return (
        <div className="table-responsive">
            <h3>Servicios</h3>
            <Table striped bordered hover className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Servicio
                            <FcPlus className="cita"
                                onClick={handleShowCreate} />

                        </th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((t) => (
                        <tr key={t.id}>
                            <td>{t.id}</td>
                            <td>{t.service}</td>
                            <td>{t.price} €</td>
                            <td >
                                <FiSettings className="setings"
                                    onClick={() => handleShowModify(t)} />
                                <MdOutlineDeleteForever className="delete"
                                    onClick={(e) => handleDeleteTreatment(t.id)} />
                            </td>
                        </tr>
                    ))}
                    {placeholders.map((_, index) => (
                        <tr key={`placeholder-${index}`}>
                            <td colSpan={6} className="placeholder-row3"></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <TreatmentModal
                show={showCreate}
                onHide={handleCloseCreate}
                treatmentData={treatmentData}
                setTreatmentData={setTreatmentData}
                onCreate={handleCreateTreatment}
                onSave={handleCreateTreatment}
                 modalType="create"
            />
            <TreatmentModal
                show={showModify}
                onHide={handleCloseModify}
                treatmentData={treatmentData}
                setTreatmentData={setTreatmentData}
                onModify={handleModifyTreatment}
                onSave={handleModifyTreatment}
            />

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