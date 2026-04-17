import { useEffect, useState, useRef } from 'react';
import NoteList from '../components/NoteList.jsx';
import NoteEditor from '../components/NoteEditor.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import { createNote, deleteNote, getNotes, updateNote } from '../api/notes.js';

export default function NotePage() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [draftNote, setDraftNote] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  // 비동기 작업별 UI 반영 위해 작업 단위로 상태 분리
  const [loading, setLoading] = useState({
    fetch: false,
    save: false,
    delete: false,
  });
  // 명확한 UX 위해 에러 발생 범위별로 상태 분리
  const [error, setError] = useState({
    global: null,
    form: null,
  });
  // 재실행 경로 제공 위해 마지막 실패 작업 저장 (함수 참조)
  const [retryAction, setRetryAction] = useState(null);

  const didFetch = useRef(false);

  // 특정 액션 X → 페이지 전체에 영향
  // retryAction X → 별도의 fetch 함수로 분리해서 재요청
  const fetchNotes = async () => {
    try {
      setLoading(prev => ({ ...prev, fetch: true }));
      setError(prev => ({ ...prev, global: null }));

      const notes = await getNotes();
      setNotes(notes);
    } catch (err) {
      setError(prev => ({
        ...prev,
        global: '노트를 불러오는 데 실패했습니다. 다시 시도해주세요.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, fetch: false }));
    }
  };

  // mount 시 한 번만 호출
  useEffect(() => {
    // 개발 시 StrictMode로 인한 API 중복 호출 때문에
    // 데이터 요청 성공과 에러 발생이 동시에 생기는 상황 방지 위해
    // 임시로 추가
    if (didFetch.current) return;
    didFetch.current = true;

    fetchNotes();
  }, []);

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
  const handleSaveNote = async () => {
    // 데이터 무결성 위해 category: '' 저장 차단
    // 빈 문자열 + 공백 방지
    if (!draftNote.category.trim()) {
      alert('카테고리를 선택해주세요');
      return;
    }

    // 낙관적 업데이트에 필요한 임시 변수
    let tempId;
    let prevNote;

    try {
      setLoading(prev => ({ ...prev, save: true }));
      setError(prev => ({ ...prev, form: null }));

      if (selectedNoteId === null) {
        // add
        tempId = crypto.randomUUID();
        const optimisticNote = { ...draftNote, id: tempId };

        // 먼저 반영
        setNotes(prev => [...prev, optimisticNote]);

        // 서버 결과로 교체
        const created = await createNote(draftNote);
        setNotes(prev =>
          prev.map(note => (note.id === tempId ? created : note)),
        );
      } else {
        // update

        // 먼저 반영
        setNotes(prev => {
          prevNote = prev.find(note => note.id === draftNote.id);
          return prev.map(note =>
            note.id === draftNote.id ? draftNote : note,
          );
        });

        await updateNote(draftNote);
      }

      setSelectedNoteId(null);
      setDraftNote(null);
      setRetryAction(null);
    } catch (err) {
      // 롤백
      if (selectedNoteId === null) {
        setNotes(prev => prev.filter(note => note.id !== tempId));
      } else if (prevNote) {
        setNotes(prev =>
          prev.map(note => (note.id === prevNote.id ? prevNote : note)),
        );
      }
      setError(prev => ({
        ...prev,
        form: '저장에 실패했습니다. 다시 시도해주세요.',
      }));
      setRetryAction(() => handleSaveNote);
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const handleAddNote = () => {
    // Save 로직과 일관성 유지
    setSelectedNoteId(null);

    // id 생성은 API에서 담당
    setDraftNote({
      category: '',
      title: '',
      content: '',
    });
  };

  // stale state 방지 위해 함수형 업데이트 적용
  const handleDeleteNote = async () => {
    // 낙관적 업데이트 위해 따로 저장
    let prevNotes;

    try {
      setLoading(prev => ({ ...prev, delete: true }));
      setError(prev => ({ ...prev, form: null }));

      // 먼저 삭제
      setNotes(prev => {
        prevNotes = prev;
        return prev.filter(note => note.id !== selectedNoteId);
      });

      await deleteNote(selectedNoteId);

      setSelectedNoteId(null);
      setDraftNote(null);
      setRetryAction(null);
    } catch (err) {
      // 롤백
      setNotes(prevNotes);
      setError(prev => ({
        ...prev,
        form: '삭제에 실패했습니다. 다시 시도해주세요.',
      }));
      setRetryAction(() => handleDeleteNote);
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleRetry = () => {
    if (!retryAction) return;
    retryAction();
  };

  return (
    <>
      {loading.fetch && <div className='overlay'>로딩 중...</div>}
      {error.global && (
        <div>
          <p style={{ color: 'red' }}>{error.global}</p>
          <button onClick={fetchNotes}>다시 시도</button>
          <button onClick={() => setError(prev => ({ ...prev, global: null }))}>
            닫기
          </button>
        </div>
      )}
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
          loading={loading}
          error={error.form}
          onChangeDraft={handleChangeDraft}
          onSaveNote={handleSaveNote}
          onDeleteNote={handleDeleteNote}
          onRetry={handleRetry}
        />
      )}
    </>
  );
}
