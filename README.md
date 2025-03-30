# Tajir.pro Backend

A backend API for Tajir.pro - A platform to empower small businesses in Pakistan.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MySQL (via Docker)

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tajir-pro-backend.git
cd tajir-pro-backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Start the database:
```bash
# On Windows
.\scripts\setup-db.ps1

# On Unix-based systems
./scripts/setup-db.sh
```

5. Start the development server:
```bash
npm run dev
```

## Database Management

- phpMyAdmin is available at http://localhost:8080
  - Username: root
  - Password: root
- MySQL is running on localhost:3306
  - Database: tajir_pro
  - Username: tajir
  - Password: tajir123

## API Documentation

The API documentation will be available at `/docs` when running the server.

## Testing

Run tests:
```bash
npm test
```

## Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the application
- `npm run start`: Start the production server
- `npm run test`: Run tests
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## Project Structure

```
├── app/
│   ├── controllers/    # API Controllers
│   ├── models/        # Database Models
│   ├── validators/    # Request Validators
│   └── middleware/    # Custom Middleware
├── config/           # Configuration files
├── database/         # Database migrations and seeds
├── resources/        # Views and other resources
└── start/           # Application entry points
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 