import axios from "axios"

//---------------------------------------------

// const API_URL = "http://localhost:3000/api/";
const API_URL = import.meta.env.VITE_BACKEND_URL;

export const activeProfile = async (active, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.put(`${API_URL}user/active`, active, config)
}

export const appointmentCreate = async(appCreate, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  console.log("API",appCreate, token);
  
  const res = await axios.post(`${API_URL}appointment/create`,appCreate, config);
  return res
}

export const bringDates = async (token) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const res = await axios.get(`${API_URL}appointment/dates`, config)
    return res.data
}

export const bringAllTreatments = async (token, page = 1) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.get(`${API_URL}service/allServices?page=${page}`, config)
}



export const desactiveProfile = async (active, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.put(`${API_URL}users/Delete`, active, config)
}

export const deleteDate = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const res = await axios.delete(`${API_URL}appointment/deleteAppointment/${id}`, config)
  return res
}

export const getAppointmentId = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const res = await axios.get(`${API_URL}appointment/appointments/${id}`, config)
  return res
}

export const meProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const res = await axios.get(`${API_URL}users/profile`, config)
  return res.data
}

export const newRegister = async (credentials) => {
    return axios.post(`${API_URL}auth/register`, credentials)
}

export const loginCall = async (credentials) => {
    const res = await axios.post(`${API_URL}auth/login`, credentials);
    return res
};

export const updateAppointment = async (dataToSend, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const res = await axios.put(`${API_URL}appointment/modAppointment`,dataToSend, config)
  return res
}

export const updateProfile = async (profileData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const res = await axios.put(`${API_URL}users/profile`, profileData, config)
  return res
}



//Admin calls.

export const allAppointments = async (token, page = 1, limit = 15) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.get(`${API_URL}appointment/totalDates?page=${page}&limit${limit}`, config);
}

export const allTreatments = async (token, page = 1, limit = 15) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.get(`${API_URL}service/services?page=${page}&limit${limit}`, config);
}

export const allUsers = async (token, page = 1, limit =15) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.get(`${API_URL}users/allUsers?page=${page}&limit${limit}`, config);
}

export const createTreatment = async (treatmentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
console.log(treatmentData);

  return axios.post(`${API_URL}service/create`, treatmentData, config)
}

export const desactiveUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.put(`${API_URL}users/disable/${id}`, {}, config)
}

export const deleteAppointmentByAdmin = async (id, token) => {

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.delete(`${API_URL}appointment/deleteByAdmin/${id}`, config)
}

export const deleteUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.delete(`${API_URL}users/permanentDell/${id}`, config)
}

export const deleteTreatment = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.delete(`${API_URL}service/delservice/${id}`, config)
}

export const modifyTreatment = async (treatmentData, token) => {
  const { id } = treatmentData;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios.put(`${API_URL}service/putService/${id}`, treatmentData, config);
};

export const updateForUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.put(`${API_URL}user/updateByAd/${id}`,{}, config)
}

export const restoreUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.put(`${API_URL}users/restore/${id}`,{},  config)
}
export const createAppointmentByAdmin = async (appointmentData, token) => {
  const { userId } = appointmentData;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  
  return axios.post(`${API_URL}appointment/createDate/${userId}`,appointmentData,  config)
};

export const updateAppointmentByAdmin = async (appointmentData, token) => {
  const { id } = appointmentData;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.put(`${API_URL}appointment/modifyApp/${id}`,appointmentData,  config)
};

export const getDatesUsersByAdmin = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.get(`${API_URL}users/dates/${id}`, config);
    return response; 
  } catch (error) {
   
    throw error;
  }
}

export const historyUser = async (id, token) => {
    const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(`${API_URL}users/userHistory/${id}`, config);
    return response; 
}

export const updateUserHistory = async (historyId, note, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const body = { note };

  const response = await axios.put(
    `${API_URL}users/updateHistory/${historyId}`,
    body,
    config
  );

  return response;
};

export const getUserById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const response = await axios.get(`${API_URL}users/user/${id}`, config);
    return response; 
  } catch (error) {
   
    throw error;
  }
}