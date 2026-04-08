import { useState } from 'react';
import NoteList from '../components/NoteList';
import NoteEditor from '../components/NoteEditor';
import CategoryFilter from '../components/CategoryFilter';

export default function NotePage() {
  const [notes, setNotes] = useState([
    { id: 1, category: 'work', title: 'note1', content: 'note1' },
    { id: 2, category: 'personal', title: 'note2', content: 'note2' },
    { id: 3, category: 'etc', title: 'note3', content: 'note3' },
  ]);

  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const [draftNote, setDraftNote] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSelectNote = id => {
    setSelectedNoteId(id);
    // 원본 수정하지 않기 위해 복사
    setDraftNote({ ...notes.find(note => note.id === id) });
  };

  // Editor/Page의 책임 분리 위해 상위에서 draft 완성
  const handleChangeDraft = patch =>
    setDraftNote(prev => ({ ...prev, ...patch }));

  // stale state 방지 위해 함수형 업데이트 적용
  const handleSaveNote = () => {
    if (selectedNoteId === null) {
      // add
      setNotes(prev => [...prev, draftNote]);
    } else {
      // update
      setNotes(prev =>
        prev.map(note => (note.id === draftNote.id ? draftNote : note)),
      );
    }

    setSelectedNoteId(null);
    setDraftNote(null);
  };

  const handleAddNote = () => {
    // Save 로직과 일관성 유지
    setSelectedNoteId(null);
    setDraftNote({
      id: crypto.randomUUID(),
      category: '',
      title: '',
      content: '',
    });
  };

  const handleDeleteNote = () => {
    setNotes(notes.filter(note => note.id !== selectedNoteId));
    setSelectedNoteId(null);
    setDraftNote(null);
  };

  return (
    <>
      <NoteList
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelectNote={handleSelectNote}
        selectedCategory={selectedCategory}
      />
      {draftNote && (
        <NoteEditor
          draftNote={draftNote}
          onChangeDraft={handleChangeDraft}
          onSaveNote={handleSaveNote}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onChangeCategory={setSelectedCategory}
      />
    </>
  );
}
