import { useEffect, useState } from 'react';
import { cameraService } from '../services/api';
import '../styles/CameraList.css';

export default function CameraList({ onSelectCamera }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const CAMERAS_PER_PAGE = 12;

  const fetchCameras = async (pageNum = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await cameraService.getAllCameras(
        pageNum * CAMERAS_PER_PAGE,
        CAMERAS_PER_PAGE
      );
      setCameras(data);
      setHasMore(data.length === CAMERAS_PER_PAGE);
    } catch (err) {
      setError(err.message || 'Failed to load cameras');
      console.error('Error fetching cameras:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchCameras(0);
      setPage(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await cameraService.searchCameras(searchTerm);
      setCameras(data);
      setHasMore(false);
      setPage(0);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPage(0);
    fetchCameras(0);
  };

  useEffect(() => {
    fetchCameras(page);
  }, []);

  const handleNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchCameras(newPage);
  };

  const handlePrevPage = () => {
    if (page > 0) {
      const newPage = page - 1;
      setPage(newPage);
      fetchCameras(newPage);
    }
  };

  return (
    <div className="camera-list-container">
      <div className="camera-list-header">
        <h1>Camera Marketplace</h1>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by brand, model, or type..."
              className="search-input"
            />
            <button type="submit" className="btn-search">
              Search
            </button>
            {searchTerm && (
              <button
                type="button"
                className="btn-clear"
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading cameras...</div>
      ) : cameras.length === 0 ? (
        <div className="empty-state">
          <p>No cameras found. Try adjusting your search.</p>
        </div>
      ) : (
        <>
          <div className="camera-grid">
            {cameras.map((camera) => (
              <div
                key={camera.id}
                className="camera-card"
                onClick={() => onSelectCamera?.(camera.id)}
              >
                <div className="camera-image">
                  <img
                    src={camera.imageUrl}
                    alt={`${camera.brand} ${camera.model}`}
                  />
                  {camera.is4KCapable && (
                    <span className="badge-4k">4K</span>
                  )}
                </div>
                <div className="camera-info">
                  <h3>{camera.brand}</h3>
                  <p className="model">{camera.model}</p>
                  <p className="type">{camera.type}</p>
                  <div className="specs">
                    <span>{camera.megapixels}MP</span>
                    <span>{camera.sensor}</span>
                  </div>
                  <div className="price-section">
                    <span className="price">
                      ${camera.price.toFixed(2)}
                    </span>
                    <button className="btn-view">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {searchTerm === '' && (
            <div className="pagination">
              <button
                onClick={handlePrevPage}
                disabled={page === 0}
                className="btn-pagination"
              >
                Previous
              </button>
              <span className="page-info">Page {page + 1}</span>
              <button
                onClick={handleNextPage}
                disabled={!hasMore}
                className="btn-pagination"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
