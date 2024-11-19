import {
  Card,
  Input,
  Button,
  Typography,
} from '@material-tailwind/react';

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../../slices/usersApiSlice';
import { setCredentials } from '../../../slices/authSlice';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async e => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='flex justify-center mt-20'>
      <Card color='transparent' shadow={false}>
        <Typography variant='h4' color='blue-gray'>
          Login
        </Typography>
        <Typography color='gray' className='mt-1 font-normal'>
          Nice to meet you! Enter your details to login.
        </Typography>
        <form className='max-w-screen-lg mt-8 mb-2 w-80 sm:w-96' onSubmit={submitHandler}>
          <div className='flex flex-col gap-6 mb-1'>
            <Typography variant='h6' color='blue-gray' className='-mb-3'>
              Your Email
            </Typography>
            <Input
              size='lg'
              value={email}
            onChange={e => setEmail(e.target.value)}
              placeholder='name@mail.com'
              className=' !border-t-blue-gray-200 focus:!border-t-gray-900'
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
            <Typography variant='h6' color='blue-gray' className='-mb-3'>
              Password
            </Typography>
            <Input
              type='password'
              size='lg'
              value={password}
            onChange={e => setPassword(e.target.value)}
              placeholder='********'
              className=' !border-t-blue-gray-200 focus:!border-t-gray-900'
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
          </div>
          <Button className='mt-6' fullWidth type='submit'>
            sign up
          </Button>
          <Typography color='gray' className='mt-4 font-normal text-center'>
            Do not have an account?{' '}
            <Link to='/signup' href='#' className='font-medium text-gray-900'>
              Sign In
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}
