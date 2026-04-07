export default function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
  selectedCategory,
}) {
  return (
    <>
      <header>
        <h1>노트 목록</h1>
        <button>추가</button>
      </header>
      <ul>
        {notes.map(({ id, category, title, content }) => (
          <li key={id} onClick={() => onSelectNote(id)}>
            <h2>{title}</h2>
            <span>{category}</span>
            <p>{content}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
