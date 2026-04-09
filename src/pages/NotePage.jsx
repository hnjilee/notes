import { useState } from 'react';
import NoteList from '../components/NoteList.jsx';
import NoteEditor from '../components/NoteEditor.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';

export default function NotePage() {
  const [notes, setNotes] = useState([
    { id: 1, category: 'work', title: 'note1', content: 'note1' },
    { id: 2, category: 'personal', title: 'note2', content: 'note2' },
    { id: 3, category: 'etc', title: 'note3', content: 'note3' },
  ]);

  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const [draftNote, setDraftNote] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Page에서 계산해서 전달
  // List는 "렌더링 책임만"
  // 파생 상태 중복 X
  const filteredNotes = notes.filter(note => {
    if (selectedCategory === 'ALL') return true;
    return note.category === selectedCategory;
  });

  // 하드코딩 제거 위해 notes로부터 동적으로 생성
  // 빈 값 포함되지 않도록 필터링 추가 (데이터 오염 시 UI도 망가짐)
  // 'ALL'은 항상 포함 (데이터 X, 별도의 제어값)
  const categories = Array.from(
    new Set([
      'ALL',
      ...notes //
        .map(note => note.category)
        .filter(category => category !== ''),
    ]),
  );

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

  // stale state 방지 위해 함수형 업데이트 적용
  const handleDeleteNote = () => {
    setNotes(prev => prev.filter(note => note.id !== selectedNoteId));
    setSelectedNoteId(null);
    setDraftNote(null);
  };

  return (
    <>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onChangeCategory={setSelectedCategory}
      />
      <NoteList
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        onSelectNote={handleSelectNote}
        onClickAddBtn={handleAddNote}
      />
      {draftNote && (
        <NoteEditor
          draftNote={draftNote}
          onChangeDraft={handleChangeDraft}
          onSaveNote={handleSaveNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
    </>
  );
}
