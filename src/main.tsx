// import React from 'react';
import ReactDOM from 'react-dom/client';
import { router } from './router.tsx';
import { RouterProvider } from 'react-router-dom';
import { enableMapSet } from 'immer'

enableMapSet();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode will cause double render
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>,
);
