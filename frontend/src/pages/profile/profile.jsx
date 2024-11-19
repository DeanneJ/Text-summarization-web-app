import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../../slices/usersApiSlice';
import { setCredentials, logout } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const [updateProfile] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);

    }
  }, [userInfo]);

  const submitHandler = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const updatedInfo = {
          _id: userInfo._id,
          name,
          email,
        };
        if (password) {
          updatedInfo.password = password;
        }
        const res = await updateProfile(updatedInfo).unwrap();
        dispatch(setCredentials(res));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(
          err?.data?.message || err?.error || 'Failed to update profile'
        );
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userInfo._id).unwrap();
      await dispatch(logout());
      toast.success('Account deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || 'Failed to delete account'
      );
    }
  };

  return (
    <div className='max-w-md p-8 mx-auto mt-10 shadow-md mb-[20px]'>
      <h1 className='mb-4 text-2xl font-bold text-center'>User Profile</h1>

      <form onSubmit={submitHandler} className='space-y-4'>

        <div className='flex flex-col space-y-2'>
          <label htmlFor='name' className='text-sm font-semibold'>
            Name
          </label>
          <input
            type='text'
            id='name'
            placeholder='Enter name'
            value={name}
            onChange={e => setName(e.target.value)}
            className='px-4 py-2 border rounded-lg'
          />
        </div>

        <div className='flex flex-col space-y-2'>
          <label htmlFor='email' className='text-sm font-semibold'>
            Email Address
          </label>
          <input
            id='email'
            placeholder='Enter email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='px-4 py-2 border rounded-lg'
          />
        </div>

        <div className='flex flex-col space-y-2'>
          <label htmlFor='password' className='text-sm font-semibold'>
            Password
          </label>
          <input
            type='password'
            id='password'
            placeholder='Enter password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='px-4 py-2 border rounded-lg'
          />
        </div>

        <div className='flex flex-col space-y-2'>
          <label htmlFor='confirmPassword' className='text-sm font-semibold'>
            Confirm Password
          </label>
          <input
            type='password'
            id='confirmPassword'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className='px-4 py-2 border rounded-lg'
          />
        </div>

        <button
          type='submit'
          className='w-full py-2 text-white transition duration-300 bg-black rounded-lg hover:bg-gray-800'
        >
          Update
        </button>
        <button
          type='button'
          onClick={handleDelete}
          className='w-full py-2 text-white transition duration-300 bg-black rounded-lg hover:bg-gray-800'
        >
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default Profile;
