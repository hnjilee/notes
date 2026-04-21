let mockNotes = [
  { id: 1, category: 'work', title: 'note1', content: 'note1' },
  { id: 2, category: 'personal', title: 'note2', content: 'note2' },
  { id: 3, category: 'etc', title: 'note3', content: 'note3' },
];

export async function getNotes() {
  await delay(1000);

  // 에러 UI 테스트 목적
  if (Math.random() < 0.1) {
    throw new Error('random error - failed to get data');
  }

  return [...mockNotes];
}

export async function createNote(note) {
  await delay(1000);

  const newNote = {
    ...note,
    id: crypto.randomUUID(),
  };
  mockNotes.push(newNote);

  return newNote;
  // throw new Error('failed to save data');
}

export async function updateNote(updatedNote) {
  await delay(1000);

  // 대상 존재 여부 체크
  const exists = mockNotes.some(note => note.id === updatedNote.id);

  // id 없는 경우 에러 발생
  if (!exists) {
    throw new Error('Note not found');
  }

  mockNotes = mockNotes.map(note =>
    note.id === updatedNote.id ? updatedNote : note,
  );

  return updatedNote;
  // throw new Error('failed to update data');
}

export async function deleteNote(id) {
  await delay(1000);

  // 대상 존재 여부 체크
  const exists = mockNotes.some(note => note.id === id);

  // id 없는 경우 에러 발생
  if (!exists) {
    throw new Error('Note not found');
  }

  mockNotes = mockNotes.filter(note => note.id !== id);

  return id;
  // throw new Error('failed to delete data');
}

// 로딩 UI 테스트 목적
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
