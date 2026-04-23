import { useEffect, useState, useRef } from 'react';
import { createNote, deleteNote, getNotes, updateNote } from '../api/notes.js';
import { CATEGORY } from '../constants/category.js';
import { runWithMinDelay } from '../utils/async.js';

export default function useNotes() {
  const [notes, setNotes] = useState([]);
  const [draftNote, setDraftNote] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY.ALL.value);
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
  // 사용자에게 재실행 경로 제공 위해 마지막 실패 작업 저장 (함수 참조)
  const [retryAction, setRetryAction] = useState(null);

  /* notes 데이터 요청 */

  // 사용자 액션이 아니므로 retryAction에 저장 X
  // → 별도의 fetch 함수로 분리해 재요청
  const fetchNotes = async () => {
    try {
      setLoading(prev => ({ ...prev, fetch: true }));
      setError(prev => ({ ...prev, global: null }));

      const notes = await runWithMinDelay(() => getNotes(), 500);
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

  const didFetch = useRef(false);

  // mount 시 한 번만 호출
  useEffect(() => {
    // 개발 시 StrictMode로 인한 API 중복 호출 때문에
    // 데이터 요청 성공과 에러 발생이 동시에 생기는 상황 방지 위해
    // 임시로 추가
    if (didFetch.current) return;
    didFetch.current = true;

    fetchNotes();
  }, []);

  /* 파생 데이터
  상태 중복 피하기 위해 별도의 state가 아니라 파생 데이터로 계산 */

  // Page(useNotes)에서 계산해서 전달 → List는 "렌더링 책임만"
  const filteredNotes = notes.filter(note => {
    if (selectedCategory === CATEGORY.ALL.value) return true;
    return note.category === selectedCategory;
  });

  /* 이벤트 처리 함수 */

  const handleSelectNote = id => {
    setDraftNote({ ...notes.find(note => note.id === id) });
    setError(prev => ({ ...prev, form: null }));
  };

  // Page/Editor의 책임 분리 위해 상위에서 draft 완성
  const handleChangeDraft = patch => {
    setDraftNote(prev => ({ ...prev, ...patch }));
    setError(prev => ({ ...prev, form: null }));
  };

  const handleSaveNote = async () => {
    // 데이터 무결성 위해 category: '' 저장 차단
    // 빈 문자열 + 공백 방지
    if (!draftNote.category.trim()) {
      alert('카테고리를 선택해주세요');
      return;
    }

    // 낙관적 업데이트에 필요한 변수
    let tempId;
    let prevNote;

    try {
      setLoading(prev => ({ ...prev, save: true }));
      setError(prev => ({ ...prev, form: null }));

      if (draftNote.id === undefined) {
        // add

        // 먼저 반영
        tempId = crypto.randomUUID();
        const optimisticNote = { ...draftNote, id: tempId };
        setNotes(prev => [...prev, optimisticNote]);

        // 서버 결과로 교체
        const created = await runWithMinDelay(() => createNote(draftNote));
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

        await runWithMinDelay(() => updateNote(draftNote));
      }

      setDraftNote(null);
      setRetryAction(null);
    } catch (err) {
      // 롤백
      if (draftNote.id === undefined) {
        setNotes(prev => prev.filter(note => note.id !== tempId));
      } else {
        setNotes(prev =>
          prev.map(note => (note.id === prevNote?.id ? prevNote : note)),
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
    // id 생성은 API에서 담당
    setDraftNote({
      category: '',
      title: '',
      content: '',
    });

    setError(prev => ({ ...prev, form: null }));
  };

  const handleDeleteNote = async () => {
    // 낙관적 업데이트 위해 따로 저장
    let prevNotes;

    try {
      setLoading(prev => ({ ...prev, delete: true }));
      setError(prev => ({ ...prev, form: null }));

      // 먼저 삭제
      setNotes(prev => {
        prevNotes = prev;
        return prev.filter(note => note.id !== draftNote.id);
      });

      await runWithMinDelay(() => deleteNote(draftNote.id));

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

  const handleCloseErrorMsg = () =>
    setError(prev => ({ ...prev, global: null }));

  const handleRetry = () => {
    if (!retryAction) return;
    retryAction();
  };

  return {
    draftNote,
    selectedCategory,
    loading,
    error,
    filteredNotes,

    fetchNotes,
    setSelectedCategory,
    handleSelectNote,
    handleChangeDraft,
    handleSaveNote,
    handleAddNote,
    handleDeleteNote,
    handleCloseErrorMsg,
    handleRetry,
  };
}
