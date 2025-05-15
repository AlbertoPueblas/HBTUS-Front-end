import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

//------------------------------------------------------------------------------------------

function HistoryPage() {
    const { userId } = useParams();  // Obtén el userId de la URL
    const [userHistory, setUserHistory] = useState([]);
    
    useEffect(() => {
        // Aquí puedes hacer una llamada API para obtener el historial del usuario
        // Por ejemplo:
        const fetchHistory = async () => {
            const response = await fetch(`/api/users/${userId}/history`);
            const data = await response.json();
            setUserHistory(data);
        };

        fetchHistory();
    }, [userId]);  // Dependemos del userId para obtener el historial correcto

    return (
        <div>
            <h2>Historial de Citas para el Usuario {userId}</h2>
            {userHistory.length > 0 ? (
                <ul>
                    {userHistory.map((item, index) => (
                        <li key={index}>
                            {item.date} - {item.service}
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
