import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import BookList from './components/Books/BookList';
import BookForm from './components/Books/BookForm';
import UserIndex from './page/Users/UserList';
import UserForm from './page/Users/UserForm';
import RoleList from './page/Role/RoleList';
import RoleForm from './page/Role/RoleForm';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Books Route - Added ProtectedRoute and Layout wrapper */}

          <Route path="/books/list" element={
            <ProtectedRoute>
              <Layout>
                <BookList />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/books/create" element={
            <ProtectedRoute>
              <Layout>
                <BookForm />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Users Route - Added ProtectedRoute and Layout wrapper */}
          <Route path="/users/list" element={
            <ProtectedRoute>
              <Layout>
                <UserIndex />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/users/create" element={
            <ProtectedRoute>
              <Layout>
                <UserForm />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Roles Route - Added ProtectedRoute and Layout wrapper */}
          <Route path="/roles/list" element={
            <ProtectedRoute>
              <Layout>
                <RoleList />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/roles/create" element={
            <ProtectedRoute>
              <Layout>
                <RoleForm />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

