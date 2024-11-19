import React from 'react';
import { Outlet } from 'react-router-dom';
import Login from './components/Login';

function SignInPage() {
  return (
    <div>
      <Login/>
    </div>
  );
}

export default SignInPage;
