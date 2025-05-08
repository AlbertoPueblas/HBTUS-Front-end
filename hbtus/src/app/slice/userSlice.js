import { createSlice } from "@reduxjs/toolkit";

// creamos nuestro pasillo para el usuario (slice de user)
export const userSlice = createSlice({
    name: "user", // nombre del pasillo
    initialState: { // estado inicial del pasillo
        token: "",
        decodificado: {
            id: "",
            userId: "",
            name: "",
            email: "",
            userRole: Number
        }
    },
    // distintas acciones que puedo realizar en este pasillo (todas reciben un state y un action y devuelven un nuevo estado)
    reducers: {
        login: (state, action) => {
            
            return {
                ...state,
                ...action.payload,
            }
        },

        logout: (state, action) => {

            return {
                token: "",
                decodificado: {
                    userRole: "",
                    name: "",
                    email: "",
                    id: ""
                },
            }
        },
        setUserDetails: (state, action) => {
            state.decodificado = action.payload; 
        },
        setUser: (state, action) => {
            state.decodificado.id = action.payload;
        },
        setUserId: (state, action) => {
            state.decodificado.userId = action.payload;
        }
    }
})

// exportamos las acciones a las que accederemos a través del useDispatch para escribir en el almacén
export const { login, logout, setUserDetails, setUserId } = userSlice.actions

// definimos y exportamos los métodos que nos permitirán venir al almacén a leer información
export const getUserData = (state) => state.user
export const getLoggedAmount = (state) => state.user.vecesLogeado


export default userSlice.reducer;