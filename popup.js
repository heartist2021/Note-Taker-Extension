// popup.js

document.addEventListener('DOMContentLoaded', function () {
  const noteInput = document.getElementById('note-input');
  const saveButton = document.getElementById('save-button');
  const notesList = document.getElementById('notes-list');

  // Load and display existing notes
  getNotes(function (notes) {
    displayNotes(notes);
  });

  // Save a new note when the button is clicked
  saveButton.addEventListener('click', function () {
    const note = noteInput.value.trim();
    if (note !== '') {
      saveNote(note);
      noteInput.value = '';
      // Reload and display updated notes
      getNotes(function (notes) {
        displayNotes(notes);
      });
    }
  });

  // Function to save a note
  function saveNote(note) {
    chrome.storage.sync.get({ notes: [] }, function (data) {
      const notes = data.notes;
      notes.push(note);
      chrome.storage.sync.set({ notes: notes });
    });
  }

  // Function to retrieve notes
  function getNotes(callback) {
    chrome.storage.sync.get({ notes: [] }, function (data) {
      const notes = data.notes;
      callback(notes);
    });
  }

  // Function to display notes in the popup
  function displayNotes(notes) {
    notesList.innerHTML = '';
    notes.forEach(function (note, index) {
      const noteItem = document.createElement('li');
      noteItem.className = 'note-item';

      const noteContent = document.createElement('div');
      noteContent.className = 'note-content';
      noteContent.textContent = note;
      noteItem.appendChild(noteContent);

      const actionButtons = document.createElement('div');
      actionButtons.className = 'action-buttons';

      // Add an "Edit" button
      const editButton = document.createElement('button');
      editButton.className = 'action-button';
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', function () {
        const updatedNote = prompt('Edit your note:', note);
        if (updatedNote !== null) {
          notes[index] = updatedNote;
          chrome.storage.sync.set({ notes: notes });
          // Reload and display updated notes
          getNotes(function (updatedNotes) {
            displayNotes(updatedNotes);
          });
        }
      });
      actionButtons.appendChild(editButton);

      // Add a "Delete" button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'action-button';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function () {
        notes.splice(index, 1);
        chrome.storage.sync.set({ notes: notes });
        // Reload and display updated notes
        getNotes(function (updatedNotes) {
          displayNotes(updatedNotes);
        });
      });
      actionButtons.appendChild(deleteButton);

      noteItem.appendChild(actionButtons);
      notesList.appendChild(noteItem);
    });
  }
});
