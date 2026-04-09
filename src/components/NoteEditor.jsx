export default function NoteEditor({
  draftNote,
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
        <button onClick={handleSave}>저장</button>
        <button type='button' onClick={onDeleteNote}>
          삭제
        </button>
      </footer>
    </form>
  );
}
