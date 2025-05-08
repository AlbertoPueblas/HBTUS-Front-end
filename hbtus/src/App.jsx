import Header from './components/Header/Header'
import './App.css'
import { Body } from './pages/Body/Body'
import { ToastContainer, Bounce } from 'react-toastify'



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
      <Header />
      <Body />
    </>
  )
}

export default App