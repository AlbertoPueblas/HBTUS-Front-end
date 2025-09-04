import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { confirmEmail } from "../../services/apiCalls";

const ConfirmEmailPage = () => {
  const { token } = useParams<{ token: string }>("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("Confirmando correo...");

  useEffect(() => {
    if (!token) return setMessage("Token inválido");

    const confirm = async () => {
      try {
        const res = await confirmEmail(token);
        setMessage(res.message || "Correo confirmado correctamente ✅");
        // Redirige después de 2 segundos al login
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        setMessage("Error al confirmar el correo ❌");
      }
    };

    confirm();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default ConfirmEmailPage;
