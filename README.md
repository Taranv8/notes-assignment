# 📓 Mini Notes App

A full-stack Notes application built with **Next.js 14** (App Router) and **MongoDB** (Mongoose).

---

## Features

| Feature | Details |
|---|---|
| ✅ Create Note | Title + description, saved to MongoDB |
| ✅ Read Notes | Grid view with title, description, created date |
| ✅ Update Note | Edit modal, DB + UI updated |
| ✅ Delete Note | Confirm dialog, immediate UI update |
| ✅ Search Notes | Server-side regex search by title (debounced) |
| ✅ Loading States | Skeleton cards, inline spinners on all mutations |

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router, Client Components)
- **Backend**: Next.js API Routes (Route Handlers)
- **Database**: MongoDB via Mongoose
- **Icons**: Lucide React

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo>
cd notes-app
npm install
```

### 2. Set Up MongoDB

Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) or use a local MongoDB instance.

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/notesdb?retryWrites=true&w=majority
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
notes-app/
├── app/
│   ├── api/
│   │   └── notes/
│   │       ├── route.js          # GET (all + search), POST
│   │       └── [id]/
│   │           └── route.js      # PUT, DELETE
│   ├── globals.css               # All styles
│   ├── layout.js                 # Root layout
│   └── page.js                   # Main page (client)
├── components/
│   ├── NoteCard.js               # Individual note card
│   ├── NoteModal.js              # Create / Edit modal
│   ├── DeleteModal.js            # Delete confirmation
│   ├── SkeletonGrid.js           # Loading skeleton
│   └── Toast.js                  # Toast notifications
├── lib/
│   └── mongodb.js                # Mongoose connection (cached)
├── models/
│   └── Note.js                   # Mongoose Note schema
├── .env.local.example            # Environment template
└── jsconfig.json                 # Path aliases (@/...)
```

---

## API Reference

### `GET /api/notes`
Fetch all notes.

**Query Params:**
- `?search=<term>` — filter notes by title (server-side regex, case-insensitive)

**Response:**
```json
{ "success": true, "data": [ { "_id": "...", "title": "...", "description": "...", "createdAt": "..." } ] }
```

---

### `POST /api/notes`
Create a new note.

**Body:**
```json
{ "title": "string", "description": "string" }
```

---

### `PUT /api/notes/:id`
Update a note by ID.

**Body:**
```json
{ "title": "string", "description": "string" }
```

---

### `DELETE /api/notes/:id`
Delete a note by ID.

---

## Design

- Editorial newspaper aesthetic — Playfair Display headings, DM Sans body
- Warm paper palette (`#f5f0e8`) with ink tones
- Animated card grid with hover states
- Fully accessible (ARIA labels, keyboard navigation, focus management)
