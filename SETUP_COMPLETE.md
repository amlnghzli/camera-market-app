# Camera Market - Complete Setup Guide

This guide covers the full setup for both the .NET Core API and React frontend with JWT authentication.

## Project Structure

```
camera-market-app/          # React Frontend (Vite)
├── src/
│   ├── components/         # React components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── CameraList.jsx
│   │   ├── CameraDetail.jsx
│   │   └── CameraForm.jsx
│   ├── context/
│   │   └── AuthContext.jsx # Auth state management
│   ├── services/
│   │   └── api.js          # API calls & auth service
│   ├── styles/
│   │   ├── Auth.css
│   │   ├── CameraList.css
│   │   ├── CameraDetail.css
│   │   └── CameraForm.css
│   ├── App.jsx
│   └── main.jsx
├── .env.local              # Environment variables
├── .env.development
└── package.json

camera-api/                 # .NET Core API
├── Controllers/
│   ├── AuthController.cs   # Register/Login endpoints
│   └── CamerasController.cs # Camera CRUD endpoints
├── Models/
│   ├── Camera.cs
│   └── User.cs
├── Data/
│   ├── CameraDbContext.cs
│   └── AuthDbContext.cs
├── Services/
│   └── TokenService.cs     # JWT token generation
├── DTOs/
│   └── AuthDtos.cs
├── appsettings.json        # Configuration
├── Program.cs              # Startup configuration
└── CameraApi.csproj        # Project file
```

## Prerequisites

### Backend (.NET Core API)
- .NET 8 SDK
- SQL Server (local or remote)
- Visual Studio, VS Code, or Rider

### Frontend (React)
- Node.js 16+
- npm or yarn

## Step-by-Step Setup

### 1. Setup .NET Core API

#### Option A: Using SQL Server (Recommended)

```bash
cd camera-api

# Restore packages
dotnet restore

# Update connection string in appsettings.json
# For local SQL Server with Windows Auth:
# "DefaultConnection": "Server=.;Database=CameraMarketDb;Trusted_Connection=true;Encrypt=false;"

# Create database and apply migrations
dotnet ef database update

# Run the API
dotnet run
```

The API will start on:
- HTTP: http://localhost:5175
- HTTPS: https://localhost:5174

#### Option B: Using Docker

```bash
# From camera-api directory
docker-compose up -d

# This starts both SQL Server and the API
# API will be available at http://localhost:5174
```

#### JWT Configuration

The API uses JWT for authentication. The secret is configured in `appsettings.json`:

```json
"Jwt": {
  "Secret": "your-super-secret-key-change-this-in-production-at-least-32-characters-long!",
  "Issuer": "camera-api",
  "Audience": "camera-market-app",
  "ExpirationMinutes": 60
}
```

**⚠️ Important:** Change the secret in production!

### 2. Setup React Frontend

```bash
cd camera-market-app

# Install dependencies
npm install

# Create .env.local file (already included)
# Contains: VITE_API_URL=https://localhost:5174/api

# Run development server
npm run dev
```

The frontend will start on: http://localhost:5173

### 3. Trust HTTPS Certificate (Development)

For development with HTTPS:

```bash
# In camera-api directory
dotnet dev-certs https --trust
```

If you still get certificate errors, you can:
1. Disable SSL verification in development (not recommended for production)
2. Or use HTTP by running on port 5175

## API Endpoints

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "message": "User registered successfully"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Cameras (All require Authorization header)

#### List Cameras
```bash
GET /api/cameras?skip=0&take=20&activeOnly=true
Authorization: Bearer {token}

Response (200): Camera[]
```

#### Get Camera by ID
```bash
GET /api/cameras/{id}
Authorization: Bearer {token}

Response (200): Camera
```

#### Search Cameras
```bash
GET /api/cameras/search/{searchTerm}
Authorization: Bearer {token}

Response (200): Camera[]
```

#### Create Camera
```bash
POST /api/cameras
Authorization: Bearer {token}
Content-Type: application/json

{
  "brand": "Canon",
  "model": "EOS R5",
  "type": "Mirrorless",
  "price": 3499.99,
  "sensor": "Full Frame",
  "megapixels": 45,
  "resolution": "8192 x 5464",
  "is4KCapable": true,
  "description": "Professional camera",
  "imageUrl": "https://..."
}

Response (201): Camera
```

#### Update Camera
```bash
PUT /api/cameras/{id}
Authorization: Bearer {token}
Content-Type: application/json

{...camera data...}

Response (200): Camera
```

#### Delete Camera
```bash
DELETE /api/cameras/{id}
Authorization: Bearer {token}

Response (204): No Content
```

## React Components

### Authentication Flow

1. **Login/Register Page** - First screen before authentication
   - Uses `AuthContext` for state management
   - Stores JWT token in localStorage
   - Automatically logs in after successful registration

2. **CameraList** - Displays all cameras
   - Pagination support
   - Search functionality
   - Click to view details

3. **CameraDetail** - Modal showing camera details
   - Full specs
   - Edit button to modify camera
   - Delete functionality (add as needed)

4. **CameraForm** - Add/Edit cameras
   - Form validation
   - Type and sensor dropdowns
   - Image URL preview

## Using the API in Components

### Example: Fetching Cameras

```jsx
import { useEffect, useState } from 'react';
import { cameraService } from './services/api';

function MyComponent() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await cameraService.getAllCameras(0, 20);
        setCameras(data);
      } catch (error) {
        console.error('Error fetching cameras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  return (
    <div>
      {loading ? 'Loading...' : cameras.map(c => <div key={c.id}>{c.brand}</div>)}
    </div>
  );
}
```

### Authentication Hook

```jsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Testing the Application

### Test User Account

Register a new account:
1. Go to http://localhost:5173
2. Click "Register"
3. Fill in the form and submit
4. Login with the new account

### Test API with Swagger

Visit: https://localhost:5174/swagger

All endpoints are documented with request/response examples.

## Troubleshooting

### CORS Errors
- Ensure API is running on port 5174
- Check CORS origins in `Program.cs`
- Clear browser cache

### Authentication Failures
- Check JWT secret in `appsettings.json`
- Verify token is stored in localStorage
- Check browser console for detailed errors

### Database Connection Issues
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- For local server, use: `Server=.;` or `Server=localhost;`

### HTTPS Certificate Issues
```bash
# Trust the development certificate
dotnet dev-certs https --trust

# Or clear and regenerate
dotnet dev-certs https --clean
dotnet dev-certs https
```

## Environment-Specific Configuration

### Development
- API URL: `https://localhost:5174/api`
- JWT expires in 60 minutes
- SQL Server local instance

### Production Deployment

1. **Change JWT Secret**
   ```json
   "Jwt": {
     "Secret": "your-production-secret-key-minimum-32-characters-long!"
   }
   ```

2. **Update CORS Origins**
   ```csharp
   options.AddPolicy("ReactApp", policyBuilder =>
   {
     policyBuilder
       .WithOrigins("https://yourdomain.com")
       .AllowAnyMethod()
       .AllowAnyHeader();
   });
   ```

3. **Configure Database**
   - Update connection string for production server
   - Use environment variables instead of appsettings

4. **Update React API URL**
   - Set `VITE_API_URL` to production API endpoint
   - Build: `npm run build`

## Next Steps

1. **Add user roles/permissions** - Implement admin features
2. **Add shopping cart** - Buy cameras functionality
3. **Add reviews** - Let users review cameras
4. **Add favorites** - Save favorite cameras
5. **Setup CI/CD** - Automated deployments
6. **Add tests** - Unit and integration tests
7. **Setup logging** - Centralized error tracking
8. **Add image upload** - Instead of URLs

## Database Schema

### Users Table
```sql
- Id (INT, Primary Key)
- Email (VARCHAR(255), Unique)
- Username (VARCHAR(100), Unique)
- PasswordHash (VARCHAR(500))
- FirstName (VARCHAR(100))
- LastName (VARCHAR(100))
- CreatedAt (DATETIME)
- UpdatedAt (DATETIME)
- IsActive (BIT)
```

### Cameras Table
```sql
- Id (INT, Primary Key)
- Brand (VARCHAR(100))
- Model (VARCHAR(200))
- Type (VARCHAR(50))
- Price (DECIMAL(10,2))
- Sensor (VARCHAR(200))
- Megapixels (INT)
- Resolution (VARCHAR(100))
- Is4KCapable (BIT)
- Description (VARCHAR(1000))
- ImageUrl (VARCHAR(500))
- CreatedAt (DATETIME)
- UpdatedAt (DATETIME)
- IsActive (BIT)
```

## Support & Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [React Documentation](https://react.dev)
- [Entity Framework Core](https://docs.microsoft.com/ef/core)
- [JWT Authentication](https://jwt.io)
- [Vite Documentation](https://vitejs.dev)

## License

MIT
