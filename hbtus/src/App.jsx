import Header from './components/Header/Header'
import './App.css'
import { Body } from './pages/Body/Body'
import { ToastContainer, Bounce } from 'react-toastify'
import { AutoLogout } from './components/AutoLogout/AutoLogout'



function App() {

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <AutoLogout />
      <Header />
      <Body />
    </>
  )
}

export default App