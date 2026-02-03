# Notes Backend API

Minimal REST API for managing notes with validation, intelligent search, update tracking, and rate-limited creation.

---

## Features

- Create, read, update, and search notes
- Input validation with trimming and empty string rejection
- Partial updates with no-change detection
- Case-insensitive search across title and content
- Rate limiting on note creation (5 requests per minute)
- MongoDB integration using Mongoose

---

## Setup

1. Install dependencies
```bash
npm install
```

2. Configure environment
- Copy `.env.example` to `.env`
- Set `MONGOURL` to your MongoDB connection string

3. Start the server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## API Endpoints

### Create Note
**POST** `/notes`

```json
{
  "title": "Meeting Notes",
  "content": "Discussed hiring plan"
}
```

Rules:
- Title and content are required
- Extra spaces are trimmed
- Empty strings are rejected
- Rate limit: 5 requests per minute

---

### Get All Notes
**GET** `/notes`

- Returns all notes
- Sorted by most recently updated

---

### Update Note
**PUT** `/notes/:id`

```json
{
  "title": "Updated title"
}
```

Rules:
- Partial updates allowed
- Rejects empty values
- Detects when no actual change occurs
- Automatically updates `updatedAt`

---

### Search Notes
**GET** `/notes/search?q=meeting`

- Searches in title and content
- Case-insensitive
- Ignores extra spaces
- Supports partial matches (`meet` → `meeting`)
- Empty query returns error

---

## Error Handling

Standard HTTP status codes are used:
- **400** – Validation or bad request
- **404** – Note not found
- **429** – Rate limit exceeded
- **500** – Internal server error

Error response format:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Rate Limiting

- Applied to **POST /notes**
- Maximum **5 requests per minute per IP**
- Exceeding the limit returns **429**

---

## Project Structure

```
├── connection.js
├── index.js
├── controller/
│   └── notes.js
├── middleware/
│   └── rateLimiter.js
├── models/
│   └── notes.js
├── routes/
│   └── notes.js
└── package.json
```

---

## Testing with cURL

Create a note:
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Sample note"}'
```

Get all notes:
```bash
curl http://localhost:3000/notes
```

Update a note:
```bash
curl -X PUT http://localhost:3000/notes/<id> \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated content"}'
```

Search notes:
```bash
curl http://localhost:3000/notes/search?q=test
```

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

---

## License

ISC
