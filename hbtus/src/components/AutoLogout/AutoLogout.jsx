import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../app/slice/userSlice";
import { toast } from "react-toastify";

const AUTO_LOGOUT_MINUTES = 30; // minutos de inactividad
const AUTO_LOGOUT_MS = AUTO_LOGOUT_MINUTES * 60 * 1000; // en milisegundos

export const AutoLogout = () => {
  const dispatch = useDispatch();
  const timer = useRef(null);

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      dispatch(logout());
      toast.info("Has sido desconectado por inactividad");
    }, AUTO_LOGOUT_MS);
  };

  useEffect(() => {
    // Eventos que reinician el temporizador
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Logout solo si se cierra la pestaña o se abandona
    const handleUnload = (e) => {
      // Si se está cerrando la pestaña o cambiando de dominio, hacer logout
      dispatch(logout());
    };

    window.addEventListener("unload", handleUnload);

    // Inicializamos el temporizador
    resetTimer();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      window.removeEventListener("unload", handleUnload);
    };
  }, [dispatch]);

  return null;
};
