import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { FaStar } from "react-icons/fa";
import { addReview, getAllReviews } from "../../services/apiCalls";
import { getUserData } from "../../app/slice/userSlice";
import { CardBody } from "react-bootstrap";
import Pagination from 'react-bootstrap/Pagination';


export const Reviews = () => {
  const myPassport = useSelector(getUserData);
  const token = myPassport?.token;
  const userRole = myPassport?.decoded?.userRole;

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  // Traer todas las reviews al montar el componente
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getAllReviews();
        setReviews(res.reviews || []);
      } catch (error) {
        toast.error("Error al cargar las reseñas");
      }
    };
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment || rating === 0) {
      toast.error("Debes escribir un comentario y seleccionar una valoración");
      return;
    }

    if (!token) {
      toast.error("Usuario no autenticado");
      return;
    }

    try {
      const res = await addReview({ comment, rating }, token);
      toast.success(res.message || "Review añadida correctamente");

      // Actualizamos la lista de reviews en tiempo real
      setReviews((prev) => [
        ...prev,
        {
          id: res.review.id,
          comment: res.review.comment,
          rating: res.review.rating,
          createdAt: res.review.createdAt,
        },
      ]);

      setComment("");
      setRating(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al añadir la review");
    }
  };



  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />

      {/* Listado de reseñas */}
      <Card className="card my-3">
        <Card.Body>
          <h4>Reseñas</h4>
          {reviews.length === 0 ? (
            <p>No hay reseñas todavía</p>
          ) : (
            reviews
              .slice()
              .reverse()
              .map((r) => (
                <Card key={r.id} className="mb-2">
                  <Card.Body>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={20}
                          color={star <= r.rating ? "#ffc107" : "#e4e5e9"}
                        />
                      ))}
                      <span style={{ marginLeft: 10, fontSize: 12 }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{r.comment}</p>
                  </Card.Body>
                </Card>
              ))
          )}
        </Card.Body>
      </Card>
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
      {/* Formulario de añadir reseña */}
      {token && userRole !== 'Admin' && (
        <Card className="card my-3">
          <Card.Body>
            <h4>Añadir reseña</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tu comentario</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Escribe tu comentario..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Valoración</Form.Label>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={30}
                      style={{ marginRight: 5, cursor: "pointer" }}
                      color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    />
                  ))}
                </div>
              </Form.Group>

              <Button type="submit">Enviar reseña</Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </>

  );
};
