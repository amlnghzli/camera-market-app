import { useState } from 'react'
import './App.css'

const cameras = [
  {
    id: 1,
    name: 'Sony A7 IV',
    type: 'Mirrorless',
    brand: 'Sony',
    price: '$2,499',
    rating: '4.8/5',
    feature: 'Full-frame sensor',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    description:
      'A versatile full-frame mirrorless camera with excellent autofocus, 4K video, and strong low-light performance.',
  },
  {
    id: 2,
    name: 'Canon EOS R10',
    type: 'Mirrorless',
    brand: 'Canon',
    price: '$979',
    rating: '4.6/5',
    feature: 'Great for travel',
    image:
      'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=900&q=80',
    description:
      'Compact and lightweight, ideal for travel with fast subject tracking and a comfortable grip.',
  },
  {
    id: 3,
    name: 'Nikon D850',
    type: 'DSLR',
    brand: 'Nikon',
    price: '$2,299',
    rating: '4.7/5',
    feature: 'High-resolution stills',
    image:
      'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=900&q=80',
    description:
      'A flagship DSLR known for breathtaking detail, excellent dynamic range, and reliable handling.',
  },
  {
    id: 4,
    name: 'GoPro HERO12',
    type: 'Action',
    brand: 'GoPro',
    price: '$399',
    rating: '4.5/5',
    feature: 'Waterproof adventure',
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    description:
      'Built for rugged action, waterproof capture, and easy shooting on the go.',
  },
  {
    id: 5,
    name: 'Canon PowerShot G7 X Mark III',
    type: 'Compact',
    brand: 'Canon',
    price: '$749',
    rating: '4.4/5',
    feature: 'Pocket-friendly vlogging',
    image:
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=80',
    description:
      'A stylish compact camera with a bright lens, strong video features, and excellent portability.',
  },
]

const types = ['All', 'Mirrorless', 'DSLR', 'Compact', 'Action']

function App() {
  const [selectedType, setSelectedType] = useState('All')
  const [selectedCamera, setSelectedCamera] = useState(null)

  const filteredCameras =
    selectedType === 'All'
      ? cameras
      : cameras.filter((camera) => camera.type === selectedType)

  const handleCloseModal = () => setSelectedCamera(null)

  return (
    <div className="app-shell">
      <header className="hero-section">
        <div>
          <p className="eyebrow">Camera Market</p>
          <h1>Discover the best cameras available today</h1>
          <p className="hero-copy">
            Explore mirrorless, DSLR, compact, and action cameras in one curated list.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <strong>25+</strong>
            <span>models</span>
          </div>
          <div>
            <strong>4.8/5</strong>
            <span>average rating</span>
          </div>
        </div>
      </header>

      <section className="filters" aria-label="Camera type filter">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            className={selectedType === type ? 'filter-chip active' : 'filter-chip'}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </section>

      <section className="camera-grid" aria-label="Camera listing">
        {filteredCameras.map((camera) => (
          <article className="camera-card" key={camera.id}>
            <div className="card-top">
              <span className="camera-type">{camera.type}</span>
              <span className="camera-price">{camera.price}</span>
            </div>
            <img className="camera-image" src={camera.image} alt={camera.name} />
            <h2>{camera.name}</h2>
            <p className="brand">{camera.brand}</p>
            <p className="feature">{camera.feature}</p>
            <div className="card-footer">
              <span>⭐ {camera.rating}</span>
              <button type="button" onClick={() => setSelectedCamera(camera)}>
                View details
              </button>
            </div>
          </article>
        ))}
      </section>

      {selectedCamera && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={handleCloseModal} aria-label="Close details">
              ×
            </button>
            <img className="modal-image" src={selectedCamera.image} alt={selectedCamera.name} />
            <div className="modal-content">
              <p className="modal-eyebrow">{selectedCamera.brand}</p>
              <h2>{selectedCamera.name}</h2>
              <p className="modal-type">{selectedCamera.type}</p>
              <p className="modal-description">{selectedCamera.description}</p>
              <div className="modal-meta">
                <span>Price: {selectedCamera.price}</span>
                <span>Rating: {selectedCamera.rating}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
