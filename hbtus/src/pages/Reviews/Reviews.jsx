import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { FaStar } from "react-icons/fa";
import { addReview, getAllReviews } from "../../services/apiCalls";
import { getUserData } from "../../app/slice/userSlice";
import Pagination from "react-bootstrap/Pagination";
import "./Reviews.css"

//----------------------------------------------------------------------

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getAllReviews();
        setReviews(res.reviews || []);

        // Calcular páginas
        if (res.reviews) {
          setTotalPages(Math.ceil(res.reviews.length / itemsPerPage));
        }
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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calcular media de reseñas
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  // Paginación local
  const paginatedReviews = reviews
    .slice()
    .reverse()
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />

      <Card className="card my-3">
        <Card.Body>
          <h4>Reseñas</h4>

          {/* Mostrar media de reseñas */}
          {reviews.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              <h5>
                Valoración media: {averageRating} / 5
              </h5>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={25}
                    color={star <= Math.round(averageRating) ? "#ffc107" : "#e4e5e9"}
                  />
                ))}
                <span style={{ marginLeft: 10, fontSize: 14 }}>
                  ({reviews.length} reseñas)
                </span>
              </div>
            </div>
          )}

          {reviews.length === 0 ? (
            <p>No hay reseñas todavía</p>
          ) : (
            paginatedReviews.map((r) => (
              <Card key={r.id} className="mb-2">
                <Card.Body>
                  <p><strong>{r.user.firstName || "Usuario"}</strong> dijo:</p>
                  <p>{r.comment}</p>
                  <div style={{ display: "flex", alignItems: "center" }} className="start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={20}
                        color={star <= r.rating ? "#ffc107" : "#e4e5e9"}
                      />
                    ))}
                    <span style={{ marginLeft: 10, fontSize: 12 }}>
                      {new Date(r.createdAt).toLocaleString()}
                    </span>
                  </div>

                </Card.Body>
              </Card>
            ))
          )}

          {/* Paginación */}
          {reviews.length > itemsPerPage && (
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
          )}
        </Card.Body>
      </Card>

      {/* Formulario de añadir reseña */}
      {token && userRole !== "Admin" && (
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
