# Quick Notes

**Quick Notes** is a simple, full-stack note-taking web application. The frontend is built with Vue 3 and Tailwind CSS, while the backend uses NestJS, Prisma, PostgreSQL, and MinIO for file storage.

---

## ✨ Features

- Create, edit, and delete notes
- Upload a file when creating a note
- **Search notes by title** (NEW!)
- Responsive and clean UI using NaiveUI and Tailwind CSS
- File storage via MinIO (S3-compatible)
- Fully containerized with Docker Compose

---

## 🛠️ Technology Stack

### Frontend
- Vue 3 (with TypeScript)
- Pinia (state management)
- Vue Router
- Vitest
- Tailwind CSS v4
- NaiveUI

### Backend
- NestJS (with Jest and Swagger)
- Prisma ORM
- PostgreSQL
- MinIO (S3-compatible file storage)

### DevOps
- Docker
- Docker Compose

---

## 📌 Current Status

This project is still in early development. Known limitations:

1. Editing a note cannot replace or remove the uploaded file.
2. Deleting a note does not delete the associated file from MinIO (orphaned file).

---

## � How to Use

### Basic Operations
1. **Create a Note**: Fill in the title and content, optionally attach a file, then click "Add Note"
2. **Edit a Note**: Click the "Edit" button on any note, modify the content, then click "Save"
3. **Delete a Note**: Click the "Delete" button on any note to remove it
4. **View Attachments**: Click the "📎 View Attachment" link to open uploaded files

### Search Functionality
- **Search by Title**: Use the search box at the top of the notes list
- **Real-time Search**: Results update automatically as you type (with 300ms debounce)
- **Clear Search**: Click the "Clear" button or clear the search input to show all notes
- **Case-insensitive**: Search works regardless of letter case

---

## �📦 Setup & Run (with Docker)

```bash
# Build and start all services
docker compose up --build

# Access the application
Frontend: http://localhost:5173
Backend API: http://localhost:3000
MinIO Console: http://localhost:9001
```

## 🔧 Database Setup

If this is your first time running the project, you may need to run database migrations:

```bash
# Run Prisma migrations (if needed)
docker-compose exec backend npx prisma migrate dev
```
