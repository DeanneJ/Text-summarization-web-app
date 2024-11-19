import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import RootLayout from './layout/root.layout.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-tailwind/react';
import Signup from './pages/sign-up/sign-up.page.jsx'
import Login  from './pages/login/sign-in.page.jsx';

import store from './store';
import { Provider } from 'react-redux';
import Profile from './pages/profile/profile.jsx';
import Summaries from './pages/mySummaries/SummaryList.jsx';

import { Summarize } from './pages/Summarizer/TextSummarizer.jsx';
import { PdfSummarize } from './pages/Summarizer/PdfSummarizer.jsx';
import FeedbackList from './pages/feedbacks/feedbackList.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Summarize />,
      },
      {
        path: '/pdf',
        element: <PdfSummarize />,
      },
      {
        path: '/feedbacks',
        element: <FeedbackList />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/summaries',
        element: <Summaries />,
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
    <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
  </StrictMode>
  </Provider>
)
