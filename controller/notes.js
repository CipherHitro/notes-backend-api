const { Notes } = require('../models/notes')

// GET /notes - Get all notes sorted by most recently updated first
async function GetNotes(req, res) {
    try {
        const notes = await Notes.find().sort({ updatedAt: -1 });
        
        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to fetch notes",
            message: error.message
        });
    }
}

// POST /notes - Create a new note
async function CreateNote(req, res) {
    try {
        const { title, content } = req.body;
        console.log(title, content)
        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                error: "Both title and content are required"
            });
        }
        
        // Trim and check for empty strings
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();
        
        if (trimmedTitle === "" || trimmedContent === "") {
            return res.status(400).json({
                success: false,
                error: "Title and content cannot be empty or contain only spaces"
            });
        }
        
        // Create new note
        const note = await Notes.create({
            title: trimmedTitle,
            content: trimmedContent
        });
        
        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to create note",
            message: error.message
        });
    }
}

// PUT /notes/:id - Update a note (partial updates allowed)
async function UpdateNote(req, res) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        
        // Check if note exists
        const existingNote = await Notes.findById(id);
        
        if (!existingNote) {
            return res.status(404).json({
                success: false,
                error: "Note not found"
            });
        }
        
        // Prepare update object
        const updateData = {};
        let hasChanges = false;
        
        // Validate and add title if provided
        if (title !== undefined) {
            const trimmedTitle = title.trim();
            if (trimmedTitle === "") {
                return res.status(400).json({
                    success: false,
                    error: "Title cannot be empty or contain only spaces"
                });
            }
            if (trimmedTitle !== existingNote.title) {
                updateData.title = trimmedTitle;
                hasChanges = true;
            }
        }
        
        // Validate and add content if provided
        if (content !== undefined) {
            const trimmedContent = content.trim();
            if (trimmedContent === "") {
                return res.status(400).json({
                    success: false,
                    error: "Content cannot be empty or contain only spaces"
                });
            }
            if (trimmedContent !== existingNote.content) {
                updateData.content = trimmedContent;
                hasChanges = true;
            }
        }
        
        // If no changes detected
        if (!hasChanges) {
            return res.status(200).json({
                success: true,
                message: "No changes detected. Note remains unchanged.",
                data: existingNote
            });
        }
        
        // Update the note
        const updatedNote = await Notes.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: updatedNote
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: "Invalid note ID format"
            });
        }
        
        res.status(500).json({
            success: false,
            error: "Failed to update note",
            message: error.message
        });
    }
}

// GET /notes/search?q=query - Search notes by title or content
async function SearchNote(req, res) {
    try {
        const { q } = req.query;
        
        // Validate query parameter
        if (!q || q.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Search query (q) is required and cannot be empty"
            });
        }
        
        // Trim and prepare search query
        const searchQuery = q.trim();
        
        // Case-insensitive search in both title and content
        const notes = await Notes.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } }
            ]
        }).sort({ updatedAt: -1 });
        if(notes.length > 0){

            res.status(200).json({
                success: true,
                count: notes.length,
                query: searchQuery,
                data: notes
            });
        }
        else{
            res.status(404).json({
                success: false,
                message: "notes not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Failed to search notes",
            message: error.message
        });
    }
}

module.exports = {
    GetNotes,
    CreateNote,
    UpdateNote,
    SearchNote
}