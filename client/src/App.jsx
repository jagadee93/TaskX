
import { Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout';
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/register';
import Unauthorized from './pages/Unauthorised';
import Missing from './pages/Missing';
import PersistLogin from './utils/PersistLogin';
import RequireAuth from './utils/RequireAuth';
function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/register' element={<Register />} />
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect this routes  */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />} >
            <Route path='/' element={<Home />} />
          </Route>
        </Route>
        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Routes>
    </Layout >
  )
}

export default App
