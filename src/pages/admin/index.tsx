import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminIndex() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    
    // Redirect to dashboard if authenticated, otherwise to login
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin-auth');
    }
  }, [navigate]);
  
  // This component won't render anything as it immediately redirects
  return null;
}
