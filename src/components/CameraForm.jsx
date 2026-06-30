import { useState, useEffect } from 'react';
import { cameraService } from '../services/api';
import '../styles/CameraForm.css';

export default function CameraForm({ camera, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    type: '',
    price: '',
    sensor: '',
    megapixels: '',
    resolution: '',
    is4KCapable: false,
    description: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!camera?.id;

  useEffect(() => {
    if (camera) {
      console.log(camera);
      setFormData({
        brand: camera.brand || '',
        model: camera.model || '',
        type: camera.type || '',
        price: camera.price || '',
        sensor: camera.sensor || '',
        megapixels: camera.megapixels || '',
        resolution: camera.resolution || '',
        is4KCapable: camera.is4KCapable || false,
        description: camera.description || '',
        imageUrl: camera.imageUrl || '',
      });
    }
  }, [camera]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.brand.trim() || !formData.model.trim()) {
      setError('Brand and Model are required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        megapixels: parseInt(formData.megapixels) || 0,
      };

      if (isEditing) {
        await cameraService.updateCamera(camera.id, submitData);
      } else {
        await cameraService.createCamera(submitData);
      }

      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to save camera');
    } finally {
      setLoading(false);
    }
  };

  const cameraTypes = [
    'DSLR',
    'Mirrorless',
    'Compact',
    'Bridge',
    'Film',
    'Instant',
  ];

  const sensorTypes = [
    'Full Frame',
    'APS-C',
    'Micro Four Thirds',
    '1 inch',
    '1/1.3 inch',
  ];

  return (
    <div className="camera-form-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <h2>{isEditing ? 'Edit Camera' : 'Add New Camera'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                id="brand"
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., Canon"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Model *</label>
              <input
                id="model"
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., EOS R5"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Type</option>
                {cameraTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sensor">Sensor</label>
              <select
                id="sensor"
                name="sensor"
                value={formData.sensor}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Sensor</option>
                {sensorTypes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="megapixels">Megapixels</label>
              <input
                id="megapixels"
                type="number"
                name="megapixels"
                value={formData.megapixels}
                onChange={handleChange}
                placeholder="24"
                min="0"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="resolution">Resolution</label>
            <input
              id="resolution"
              type="text"
              name="resolution"
              value={formData.resolution}
              onChange={handleChange}
              placeholder="e.g., 8192 x 5464"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              id="imageUrl"
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Camera description..."
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-group checkbox">
            <label htmlFor="is4KCapable">
              <input
                id="is4KCapable"
                type="checkbox"
                name="is4KCapable"
                checked={formData.is4KCapable}
                onChange={handleChange}
                disabled={loading}
              />
              <span>4K Video Capable</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                ? 'Update Camera'
                : 'Create Camera'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
