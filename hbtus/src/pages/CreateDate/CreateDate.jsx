import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'; // Asegúrate de importar el plugin utc
import 'react-day-picker/dist/style.css';
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { appointmentCreate, bringAllTreatments } from "../../services/apiCalls";
import { useSelector } from "react-redux";
import { getUserData } from "../../app/slice/userSlice";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { FcOk } from "react-icons/fc";
import { toast } from "react-toastify";
import axios from "axios"; // Asegúrate de tener axios instalado

// Extiende dayjs con el plugin de UTC
dayjs.extend(utc);

//---------------------------------------------------------------------

export const CreateDate = () => {
  const now = dayjs();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appCreate, setAppCreate] = useState({
    appointmentDate: "",
    serviceId: "",
  });

  const navigate = useNavigate();
  const myPassport = useSelector(getUserData);
  const token = myPassport.token;

  const manageDate = (date) => {
    if (dayjs(date).diff(now, "d") <= 0 || dayjs(date).day() === 0 || dayjs(date).day() === 6) {
      toast.warning("Fecha anterior a la actual o fin de semana");
      setSelectedDate(null);
      return;
    }
    setSelectedDate(dayjs(date));
  };

  const manageTime = (time) => {
    if (dayjs(time).hour() < 8 || dayjs(time).hour() > 20) {
      toast.warning("El horario es: 08:00h a 20:00h");
      return;
    }
    setSelectedTime(time);
  };

  const dateForMe = async () => {
    const selectedDateTime = getSelectedDateTime();

    if (!appCreate.serviceId || !selectedDateTime) {
        toast.warning("Por favor un tratamiento y una fecha/hora.");
        return;
    }

    try {
        // Asegúrate de convertir la fecha a formato ISO con zona horaria UTC
        const dateCheck = selectedDateTime.utc().toISOString();  // Convertir a UTC y luego a formato ISO
        console.log("Fecha y hora para verificar disponibilidad (ISO):", dateCheck);

        const res = await axios.get("/api/appointments/checkAvailability", {
            params: {
                appointmentDate: dateCheck,
                serviceId: appCreate.serviceId,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Si la respuesta es positiva (disponible), creamos la cita
        if (res.status === 200 && res.data.available) {
            const appointmentRes = await appointmentCreate({ ...appCreate, appointmentDate: selectedDateTime.toISOString() }, token);
            setTimeout(() => {
                navigate("/profile");
                toast.success("Cita creada con éxito");
            }, 2000);
        } else {
            toast.error("La fecha y hora seleccionada ya está ocupada.");
        }
    } catch (error) {
        console.error("Error al verificar disponibilidad:", error);
        toast.error("Hubo un error al verificar la disponibilidad.");
    }
  };

  const getSelectedDateTime = () => {
    if (selectedDate && selectedTime) {
      // Asegúrate de que selectedDate y selectedTime son dayjs antes de usar .hour() y .minute()
      const date = dayjs(selectedDate);
      const time = dayjs(selectedTime);
      return date.hour(time.hour()).minute(time.minute());
    }
    return null;
  };

  useEffect(() => {
    const fetchTreatments = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await bringAllTreatments(token);
        setTreatments(resp.data.services);
        console.log(resp.data);
      } catch (error) {
        setError("Error al traer datos");
      }
      setLoading(false);
    };
    fetchTreatments();
  }, [token]);

  const inputHandlerDates = (e) => {
    setAppCreate((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <div className="content">
        <DayPicker
          mode="single"
          selected={selectedDate ? selectedDate.toDate() : undefined}
          onSelect={manageDate}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Hora de la cita"
            value={selectedTime}
            onChange={manageTime}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <div className="result">
          <Form.Control as="select" name="serviceId" onChange={inputHandlerDates} className="select">
            <option value="">Selecciona un tratamiento</option>
            {treatments.map((job) => (
              <option value={job.id} key={job.id}>Tratamiento: {job.service} precio: {job.price}€</option>
            ))}
          </Form.Control>
          <FcOk className="btnOk" onClick={dateForMe}>Get Appointment</FcOk>
        </div>
      </div>
    </div>
  );
};
