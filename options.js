// options.js

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
  
    // Function to display notes in the options page
    function displayNotes(notes) {
      notesList.innerHTML = '';
      notes.forEach(function (note) {
        const noteItem = document.createElement('li');
        noteItem.className = 'note-item';
        noteItem.textContent = note;
        notesList.appendChild(noteItem);
      });
    }
  });
  