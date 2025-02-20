import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Forgot from './pages/auth/forgot';
import Reset from './pages/auth/reset';
import Sidebar from './components/sidebar/sidebar';
import Layout from './components/layout/layout';
import Dashboard from './pages/dashboard/dashboard';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getLoginstatus } from './services/auth.service';
import { SET_LOGIN } from './redux/features/auth/auth.slice';
import { AddProduct } from './pages/addProduct/add.product';
import ProductDetail from './components/product/productDetail/product.detail';
import EditProduct from './pages/editProduct/edit.product';
import Profile from './pages/profile/profile';
import EditProfile from './pages/profile/edit.profile';

axios.defaults.withCredentials = true

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    async function loginStatus () {
      const status = await getLoginstatus()
      dispatch(SET_LOGIN(status))
    }
    loginStatus()
  }, [dispatch])

  return (
    <BrowserRouter>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/forgot" element={<Forgot/>} />
        <Route path="/resetpassword/:resetToken" element={<Reset/>} />

        <Route path="/dashboard" element={
          <Sidebar>
            <Layout>
              <Dashboard/>
            </Layout>
          </Sidebar>
        }/>
        <Route path="/add-product" element={
          <Sidebar>
            <Layout>
              <AddProduct/>
            </Layout>
          </Sidebar>
        }/>
        <Route path="/product-detail/:id" element={
          <Sidebar>
            <Layout>
              <ProductDetail/>
            </Layout>
          </Sidebar>
        }/>
        <Route path="/edit-product/:id" element={
          <Sidebar>
            <Layout>
              <EditProduct/>
            </Layout>
          </Sidebar>
        }/>
        <Route path="/profile" element={
          <Sidebar>
            <Layout>
              <Profile/>
            </Layout>
          </Sidebar>
        }/>
        <Route path="/edit-profile" element={
          <Sidebar>
            <Layout>
              <EditProfile/>
            </Layout>
          </Sidebar>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
