import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import CameraList from './components/CameraList';
import CameraDetail from './components/CameraDetail';
import CameraForm from './components/CameraForm';
import './App.css';

function App() {
  const { isAuthenticated, logout, user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [editingCamera, setEditingCamera] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCamera(null);
    setRefreshKey((prev) => prev + 1);
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        {showRegister ? (
          <Register
            onSuccess={() => {
              setShowRegister(false);
              alert('Registration successful! Please login.');
            }}
            onToggleLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onSuccess={() => {
              // Redirect to main app after login
              window.location.reload();
            }}
            onToggleRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app authenticated-app">
      <header className="app-header">
        <div className="header-content">
          <h1>Camera Market</h1>
          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={() => {
                setShowForm(true);
                setEditingCamera(null);
              }}
            >
              Add Camera
            </button>
            <span className="user-info">
              Welcome, {user?.username || user?.email}
            </span>
            <button className="btn-logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <CameraList
          key={refreshKey}
          onSelectCamera={setSelectedCameraId}
        />
      </main>

      {selectedCameraId && (
        <CameraDetail
          cameraId={selectedCameraId}
          onClose={() => setSelectedCameraId(null)}
          onEdit={(camera) => {
            setEditingCamera(camera);
            setShowForm(true);
            setSelectedCameraId(null);
          }}
        />
      )}

      {showForm && (
        <CameraForm
          camera={editingCamera}
          onSuccess={handleFormSuccess}
          onClose={() => {
            setShowForm(false);
            setEditingCamera(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
