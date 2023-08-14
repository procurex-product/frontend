import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
const NotesManager = () => {
  const { productId } = useParams();
  console.log(productId);
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    title: '',
    note: '',
  });
  const [selectedNote, setSelectedNote] = useState(null); // To store the selected note for editing
  
  useEffect(() => {
    // Fetch all notes for the selected product initially
    fetchNotes(productId);
  }, [productId]);

  const fetchNotes = async (productId) => {
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/api/notes/${productId}`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setFormData({
      product_id: note.product_id,
      title: note.title,
      note: note.note,
    });
  };

  const handleNoteSave = async (event) => {
    event.preventDefault();
    try {
      if (selectedNote) {
        // If a note is selected, update the existing note
        await fetch(`https://procurex-backend.onrender.com/api/notes/${selectedNote.note_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setSelectedNote(null); // Clear selected note after update
      } else {
        // If no note is selected, add a new note
        const response = await fetch(`https://procurex-backend.onrender.com/api/notes/add/${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log('Note added:', data);
      }
      // Clear the form fields after submission
      setFormData({
        product_id: productId,
        title: '',
        note: '',
      });
      fetchNotes(productId); // Fetch the updated notes after submission
    } catch (error) {
      console.error('Error adding/updating note:', error);
    }
  };

  const handleNoteDelete = async (noteId) => {
    try {
      await fetch(`https://procurex-backend.onrender.com/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      fetchNotes(productId); // Fetch the updated notes after deletion
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Add and Manage Notes</h2>
      <form onSubmit={handleNoteSave}>
        {/* Hidden field to store the product_id */}
        <input type="hidden" name="product_id" value={formData.product_id} />
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="note" className="form-label">
            Note
          </label>
          <textarea
            className="form-control"
            id="note"
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          {selectedNote ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      <h2 className="my-4">Notes</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {notes.map((note) => (
          <div className="col" key={note.note_id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text">
                  {note.note.length > 100 && selectedNote?.note_id !== note.note_id
                    ? note.note.substring(0, 100) + '...'
                    : note.note}
                </p>
                <button
                  onClick={() => handleNoteClick(note)}
                  className="btn btn-primary me-2"
                >
                  View Note
                </button>
                <button
                  onClick={() => handleNoteDelete(note.note_id)}
                  className="btn btn-danger"
                >
                  Delete Note
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Note Modal */}
      {selectedNote && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedNote.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setSelectedNote(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="note" className="form-label">
                    Note
                  </label>
                  <textarea
                    className="form-control"
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setSelectedNote(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNoteSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesManager;

