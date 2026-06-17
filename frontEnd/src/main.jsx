import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AnimatePresence } from "framer-motion";

import App from './App.jsx'
import store from './store/store'
import './index.css'
import { AuthLayout } from './components/index.js'
import { Login, AddPost, Signup, EditPost, Post, AllPost, Home, NotFound } from './pages/index'


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: (
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                ),
            },
            {
                path: "/signup",
                element: (
                    <AuthLayout authentication={false}>
                        <Signup />
                    </AuthLayout>
                ),
            },
            {
                path: "/all-posts",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <AllPost />
                    </AuthLayout>
                ),
            },
            {
                path: "/add-post",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <AddPost />
                    </AuthLayout>
                ),
            },
            {
                path: "/edit-post/:slug",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <EditPost />
                    </AuthLayout>
                ),
            },
            {
                path: "/post/:slug",
                element: <Post />,
            },
            {
                path: "*",
                element: <NotFound />
            }
        ],
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <AnimatePresence mode="wait">
        <React.StrictMode>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </React.StrictMode>
    </AnimatePresence>
)