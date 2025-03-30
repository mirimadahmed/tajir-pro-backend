# Function to check if Docker is running
function Test-DockerRunning {
    try {
        $null = docker info
        return $true
    }
    catch {
        return $false
    }
}

# Function to start containers
function Start-Containers {
    Write-Host "Starting Docker containers..."
    docker-compose up -d
    Write-Host "Waiting for MySQL to be ready..."
    Start-Sleep -Seconds 10
}

# Function to run migrations
function Run-Migrations {
    Write-Host "Running database migrations..."
    node ace migration:run
}

# Function to seed the database
function Seed-Database {
    Write-Host "Seeding the database..."
    node ace db:seed
}

# Main script
Write-Host "Setting up Tajir.pro database..."

# Check Docker
if (-not (Test-DockerRunning)) {
    Write-Host "Docker is not running. Please start Docker first."
    exit 1
}

# Start containers
Start-Containers

# Run migrations
Run-Migrations

# Seed database (if needed)
# Seed-Database

Write-Host "Database setup completed!"
Write-Host "You can access phpMyAdmin at http://localhost:8080"
Write-Host "MySQL is running on localhost:3306" 