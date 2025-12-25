//import { Navigate } from 'react-router-dom';
//import { getCurrentUser } from '../utils/auth.js';

const ProtectedRoute = ({ children }) => {
  //const user = getCurrentUser();
  
  // if (!user) {
  //   return <Navigate to="/login" />;
  // }

  // if (requireAdmin && user.role !== 'admin') {
  //       return <Navigate to="/" />;
  //   }
    
  //  if (requireStockManager && user.role !== 'stock' && user.role !== 'admin') {
  //       return <Navigate to="/" />;
  //   }
    
  return children;
};

export default ProtectedRoute;