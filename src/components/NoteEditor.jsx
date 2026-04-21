import { CATEGORY } from '../constants/category.js';

export default function NoteEditor({
  draftNote,
  loading,
  error,
  onChangeDraft,
  onSaveNote,
  onDeleteNote,
  onRetry,
}) {
  const handleChange = e => {
    const { name, value } = e.target;
    onChangeDraft({ [name]: value });
  };

  const handleSave = e => {
    e.preventDefault();
    onSaveNote();
  };

  return (
    <form>
      {error && (
        <div>
          <p style={{ color: 'red' }}>{error}</p>
          <button type='button' onClick={onRetry}>
            다시 시도
          </button>
        </div>
      )}
      <header>
        <select
          name='category'
          value={draftNote.category}
          onChange={handleChange}
        >
          <option value=''>카테고리</option>
          <option value={CATEGORY.WORK.value}>{CATEGORY.WORK.label}</option>
          <option value={CATEGORY.PERSONAL.value}>
            {CATEGORY.PERSONAL.label}
          </option>
          <option value={CATEGORY.ETC.value}>{CATEGORY.ETC.label}</option>
        </select>
        <input
          type='text'
          name='title'
          value={draftNote.title}
          onChange={handleChange}
          placeholder='제목'
        />
      </header>
      <textarea
        name='content'
        value={draftNote.content}
        onChange={handleChange}
        placeholder='내용'
      ></textarea>
      <footer>
        <button disabled={loading.save} onClick={handleSave}>
          {loading.save ? '동기화 중...' : '저장'}
        </button>
        <button type='button' disabled={loading.delete} onClick={onDeleteNote}>
          {loading.delete ? '삭제 중...' : '삭제'}
        </button>
      </footer>
    </form>
  );
}
