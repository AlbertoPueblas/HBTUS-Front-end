import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserById, historyUser, updateUserHistory } from '../../services/apiCalls'; // <-- Importa aquí
import { useSelector } from 'react-redux';
import { getUserData } from '../../app/slice/userSlice';
import './History.css';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Button } from 'react-bootstrap';

//---------------------------------------------------------------------------------

function HistoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userReduxData = useSelector(getUserData);
  const token = userReduxData.token;

  const userId = location.state?.userId;
  const [userName, setUserName] = useState('');
  const [userHistory, setUserHistory] = useState([]);
  const [editingNote, setEditingNote] = useState({}); // Para manejar notas editables

  useEffect(() => {
    if (!userId) {

      navigate('/somewhere');
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await historyUser(userId, token);
        setUserHistory(response.data);
        console.log(response.data);

      } catch (error) {
        setUserHistory([]);
      }
    };

    if (token) fetchHistory();
  }, [userId, token, navigate]);


  useEffect(() => {
    if (!userId) {

      navigate('/somewhere');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await getUserById(userId, token);
        setUserName(`${response.data.firstName} ${response.data.lastName}`);

        console.log("user", response.data);

      } catch (error) {
        setUserName([]);
      }
    }
      if (token) fetchUser();
    }, [userId, token]);

  // Guardar cambios en una nota
  const handleSaveNote = async (historyId) => {
    try {
      await updateUserHistory(historyId, editingNote[historyId], token);
      alert('Nota actualizada');
      // Opcional: actualizar el historial local para reflejar cambios sin recargar
      setUserHistory((prev) =>
        prev.map((item) =>
          item.id === historyId ? { ...item, note: editingNote[historyId] } : item
        )
      );
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }
  };

  return (
    <div>
      <InputGroup>
        <InputGroup.Text id='title'>
        <h5>Historial de: <span> {userName} </span></h5>
        </InputGroup.Text>
      </InputGroup>
      {userHistory.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {userHistory.map((item) => (
            <li key={item.id} style={{ marginBottom: '1rem' }}>
              <InputGroup className='custom-card'>
                <InputGroup.Text><Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSaveNote(item.id)}>
                  Guardar
                </Button></InputGroup.Text>
                <Form.Control
                  as="textarea"
                  value={editingNote[item.id] ?? item.note}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, [item.id]: e.target.value })
                  }
                  aria-label="Note textarea"
                />
              </InputGroup>
              <div style={{ marginTop: '0.5rem' }}>
                {' '}
                <small className="text-muted">{new Date(item.createdAt).toLocaleString()}</small>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay historial disponible.</p>
      )}

    </div>
  );
}

export default HistoryPage;
