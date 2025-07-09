# Quick Notes

**Quick Notes** is a simple, full-stack note-taking web application. The frontend is built with Vue 3 and Tailwind CSS, while the backend uses NestJS, Prisma, PostgreSQL, and MinIO for file storage.

---

## ✨ Features

- Create, edit, and delete notes
- Upload a file when creating a note
- Responsive and clean UI using Tailwind CSS
- File storage via MinIO (S3-compatible)
- Fully containerized with Docker Compose

---

## 🛠️ Technology Stack

### Frontend
- Vue 3 (with TypeScript)
- Pinia (state management)
- Vue Router
- Tailwind CSS v4

### Backend
- NestJS
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
3. Uploaded files are stored, but their URLs are not yet displayed in the frontend.
4. Bucket is private, so files are not accessible without a signed URL.
5. Tailwind layout still needs improvements (e.g., color contrast and spacing).
6. No input validation yet — the "Add" button accepts empty titles (though nothing is submitted).
7. Uploaded file input is not reset after submission.

---

## 📦 Setup & Run (with Docker)

```bash
# Build and start all services
docker compose up --build
