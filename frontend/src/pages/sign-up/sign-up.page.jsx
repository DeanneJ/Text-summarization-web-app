import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { toast } from 'react-toastify';
import { Card, Input, Button, Typography } from '@material-tailwind/react';

function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector(state => state.auth);

  useEffect(() => {
    // navigate('/profile');
  }, [navigate, userInfo]);

  const submitHandler = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await register({
        name,
        email,
        password,
      }).unwrap();
      toast.success('Account created successfully');
      dispatch(setCredentials({ ...res }));
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='flex justify-center mt-10'>
      <Card color='transparent' shadow={false}>
        <Typography variant='h4' color='blue-gray'>
          Sign Up
        </Typography>
        <Typography color='gray' className='mt-1 font-normal'>
          Nice to meet you! Enter your details to register.
        </Typography>
        <form className='max-w-screen-lg mt-8 mb-2 w-80 sm:w-96' onSubmit={submitHandler}>
          <div className='flex flex-col gap-6 mb-1'>
            <Typography variant='h6' color='blue-gray' className='-mb-2'>
              Your Name
            </Typography>
            <Input
              value={name}
              name='name'
              onChange={e => setName(e.target.value)}
              size='lg'
              placeholder='John Doe'
              className='!border-t-blue-gray-200 focus:!border-t-gray-900'
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
            <Typography variant='h6' color='blue-gray' className='-mb-3'>
              Your Email
            </Typography>
            <Input
              size='lg'
              placeholder='name@mail.com'
              value={email}
              name='email'
              onChange={e => setEmail(e.target.value)}
              className='!border-t-blue-gray-200 focus:!border-t-gray-900'
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
              placeholder='********'
              name='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='!border-t-blue-gray-200 focus:!border-t-gray-900'
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
            <Typography variant='h6' color='blue-gray' className='-mb-3'>
              Confirm Password
            </Typography>
            <Input
              type='password'
              size='lg'
              placeholder='********'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className='!border-t-blue-gray-200 focus:!border-t-gray-900'
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
            />
          </div>
          <Button className='mt-6' fullWidth type='submit'>
            Register
          </Button>
          <Typography color='gray' className='mt-4 font-normal text-center'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='font-medium text-gray-500 underline ml-[10px]'
            >
              Sign In
            </Link>
          </Typography>
        </form>
      </Card>
    </div>
  );
}

export default SignUpPage;
