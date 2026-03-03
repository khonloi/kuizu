import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout';
import { ToastProvider } from './context/ToastContext';
import { HomePage } from './pages';

// Placeholders for deleted pages
const AuthPage = () => <div style={{ padding: '20px' }}>Auth Page Placeholder</div>;
const ProfilePage = () => <div style={{ padding: '20px' }}>Profile Page Placeholder</div>;

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Standard layout pages */}
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/dashboard" element={
            <MainLayout>
              <div style={{ padding: '40px', maxWidth: '1440px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Welcome back to Kuizu!</h1>
                {/* Other dashboard components would go here */}
              </div>
            </MainLayout>
          } />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
