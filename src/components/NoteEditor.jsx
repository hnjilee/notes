export default function NoteEditor({
  draftNote,
  loading,
  onChangeDraft,
  onSaveNote,
  onDeleteNote,
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
      <header>
        <select
          name='category'
          value={draftNote.category}
          onChange={handleChange}
        >
          <option value=''>카테고리</option>
          <option value='work'>업무</option>
          <option value='personal'>개인</option>
          <option value='etc'>기타</option>
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
