# Quick Notes

**Quick Notes** is a simple, full-stack note-taking web application. The frontend is built with Vue 3 and Tailwind CSS, while the backend uses NestJS, Prisma, PostgreSQL, and MinIO for file storage.

---

## ✨ Features

- Create, edit, and delete notes
- Upload a file when creating a note
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

## 📦 Setup & Run (with Docker)

```bash
# Build and start all services
docker compose up --build
