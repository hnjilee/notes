let mockNotes = [
  { id: 1, category: 'work', title: 'note1', content: 'note1' },
  { id: 2, category: 'personal', title: 'note2', content: 'note2' },
  { id: 3, category: 'etc', title: 'note3', content: 'note3' },
];

export async function getNotes() {
  return Promise.resolve([...mockNotes]);
}

export async function createNote(note) {
  const newNote = {
    ...note,
    id: crypto.randomUUID(),
  };
  mockNotes.push(newNote);
  return Promise.resolve(newNote);
}

export async function updateNote(updatedNote) {
  // 대상 존재 여부 체크
  const exists = mockNotes.some(note => note.id === updatedNote.id);

  // id 없는 경우 에러 발생
  if (!exists) {
    throw new Error('Note not found');
  }

  mockNotes = mockNotes.map(note =>
    note.id === updatedNote.id ? updatedNote : note,
  );
  return Promise.resolve(updatedNote);
}

export async function deleteNote(id) {
  // 대상 존재 여부 체크
  const exists = mockNotes.some(note => note.id === id);

  // id 없는 경우 에러 발생
  if (!exists) {
    throw new Error('Note not found');
  }

  mockNotes = mockNotes.filter(note => note.id !== id);
  return Promise.resolve(id);
}
