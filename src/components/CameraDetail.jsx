import { useEffect, useState } from 'react';
import { cameraService } from '../services/api';
import '../styles/CameraDetail.css';

export default function CameraDetail({ cameraId, onClose, onEdit }) {
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cameraId) return;

    const fetchCamera = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cameraService.getCameraById(cameraId);
        setCamera(data);
      } catch (err) {
        setError(err.message || 'Failed to load camera details');
        console.error('Error fetching camera:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCamera();
  }, [cameraId]);

  if (!cameraId) return null;

  if (loading) {
    return (
      <div className="camera-detail-modal">
        <div className="modal-content">
          <div className="loading">Loading camera details...</div>
          <button onClick={onClose} className="btn-close">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="camera-detail-modal">
        <div className="modal-content">
          <div className="error-message">{error}</div>
          <button onClick={onClose} className="btn-close">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="camera-detail-modal">
        <div className="modal-content">
          <p>Camera not found</p>
          <button onClick={onClose} className="btn-close">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="camera-detail-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <button onClick={onClose} className="btn-close-icon">
          ✕
        </button>

        <div className="detail-layout">
          <div className="detail-image">
            <img
              src={camera.imageUrl}
              alt={`${camera.brand} ${camera.model}`}
            />
            {camera.is4KCapable && (
              <span className="badge-4k">4K Capable</span>
            )}
          </div>

          <div className="detail-info">
            <h2>
              {camera.brand} {camera.model}
            </h2>

            <div className="detail-price">
              <span className="price">${camera.price.toFixed(2)}</span>
            </div>

            <div className="detail-specs">
              <div className="spec-row">
                <span className="label">Type:</span>
                <span className="value">{camera.type}</span>
              </div>
              <div className="spec-row">
                <span className="label">Sensor:</span>
                <span className="value">{camera.sensor}</span>
              </div>
              <div className="spec-row">
                <span className="label">Resolution:</span>
                <span className="value">{camera.resolution}</span>
              </div>
              <div className="spec-row">
                <span className="label">Megapixels:</span>
                <span className="value">{camera.megapixels} MP</span>
              </div>
              <div className="spec-row">
                <span className="label">4K Video:</span>
                <span className="value">
                  {camera.is4KCapable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {camera.description && (
              <div className="detail-description">
                <h3>Description</h3>
                <p>{camera.description}</p>
              </div>
            )}

            <div className="detail-actions">
              <button onClick={() => onEdit?.(camera)} className="btn-edit">
                Edit
              </button>
              <button onClick={onClose} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
