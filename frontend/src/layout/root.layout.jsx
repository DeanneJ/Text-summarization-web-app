import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { FooterWithLogo } from '../components/shared/Footer';
import { NavbarWithSolidBackground } from '../components/shared/Navigation';

function RootLayout() {
  return (
    <>
      <NavbarWithSolidBackground />
      <ToastContainer />
      <Outlet />
    </>
  );
}

export default RootLayout;
