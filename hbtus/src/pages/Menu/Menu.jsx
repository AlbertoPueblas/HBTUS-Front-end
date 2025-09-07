import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import "./Menu.css"
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserData } from "../../app/slice/userSlice";
import { toast } from 'react-toastify';
import { bringAllTreatments } from '../../services/apiCalls';
import { Accordion } from 'react-bootstrap';

//-----------------------------------------------------------------------------

export const Menu = () => {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openIndex, setOpenIndex] = useState(null); // controla qué card está abierta

  const userReduxData = useSelector(getUserData);
  const token = userReduxData.token;

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const res = await bringAllTreatments(currentPage);
        setServices(res.data.services);
        setTotalPages(res.data.total_pages);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error al cargar los servicios");
      }
    };
    fetchTreatments();
  }, [currentPage]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index); // abre/cierra el acordeón
  };

  return (
    <div className="container cart-services">
      <div className="row">
        {services.map((service, index) => (
          <div className="col-md-4 mb-4" key={service.id}>
            <Card
              border="primary"
              className="h-100 d-flex flex-column cursor-pointer"
              onClick={() => toggleAccordion(index)} // 👉 hace clic en toda la card
              style={{ cursor: "pointer" }}
            >
              <Card.Header>{service.service || "Servicio"}</Card.Header>

              <Card.Body className="flex-grow-1">
                <Card.Text style={{ minHeight: "80px" }}>
                  {service.description?.slice(0, 100) || "Sin descripción"}
                </Card.Text>
              </Card.Body>

              <Accordion activeKey={openIndex === index ? "0" : null} flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Ver más detalles</Accordion.Header>
                  <Accordion.Body>
                    <p><strong>Descripción completa:</strong><br />{service.longDescription || "No disponible"}</p>
                    <p><strong>Precio:</strong> {service.price} €</p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
