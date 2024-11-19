import React from 'react';
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from '@material-tailwind/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import { logout } from '../../slices/authSlice';

export function NavbarWithSolidBackground() {
  const [openNav, setOpenNav] = React.useState(false);

  const { userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className='flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6'>
      {userInfo && (
        <Typography
          as='li'
          variant='small'
          color='blue-gray'
          className='p-1 font-normal'
        >
          <Link to='/summaries' href='#' className='flex items-center'>
            My Summaries
          </Link>
        </Typography>
      )}
      <Typography
        as='li'
        variant='small'
        color='blue-gray'
        className='p-1 font-normal'
      >
        <Link to='/' className='flex items-center'>
          Text Summarizer
        </Link>
      </Typography>
      <Typography
        as='li'
        variant='small'
        color='blue-gray'
        className='p-1 font-normal'
      >
        <Link to='/pdf' className='flex items-center'>
          PDF Summarizer
        </Link>
      </Typography>
      <Typography
        as='li'
        variant='small'
        color='blue-gray'
        className='p-1 font-normal'
      >
        <Link to='/feedbacks' className='flex items-center'>
          User Feedbacks
        </Link>
      </Typography>
    </ul>
  );

  return (
    <Navbar className='sticky top-0 z-10 max-w-full px-4 py-2 bg-gray-100 rounded-none h-max lg:px-8 lg:py-4'>
      <div className='flex items-center justify-between text-blue-gray-900'>
        {/* Left aligned brand name */}
        <Typography
          as='a'
          href='#'
          className='mr-4 cursor-pointer py-1.5 font-medium'
        >
          BriefBot
        </Typography>

        {/* Center aligned navList */}
        <div className='justify-center flex-grow hidden lg:flex'>{navList}</div>

        {/* Right-aligned buttons */}
        <div className='flex items-center gap-2 ml-auto'>
          {userInfo ? (
            <>
              <Typography
                as='li'
                variant='small'
                color='blue-gray'
                className='p-1 font-medium'
              >
                <Link
                  to='/profile'
                  className='flex mr-3 font-bold transition-colors hover:text-gray-500'
                >
                  {userInfo.name}
                </Link>
              </Typography>

              <Button size='sm' onClick={logoutHandler}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to='/login'>
                <Button size='sm' className='ml-3'>
                  Login
                </Button>
              </Link>

              <Link to='/signup'>
                <Button size='sm' className='ml-3'>
                  Signup
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger icon */}
        <IconButton
          variant='text'
          className='lg:hidden'
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className='w-6 h-6' strokeWidth={2} />
          ) : (
            <Bars3Icon className='w-6 h-6' strokeWidth={2} />
          )}
        </IconButton>
      </div>

      {/* Mobile view */}
      <Collapse open={openNav}>{navList}</Collapse>
    </Navbar>
  );
}
