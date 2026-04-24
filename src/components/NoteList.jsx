import { CATEGORY } from '../constants/category.js';

export default function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
  onClickAddBtn,
}) {
  const categoryMap = Object.fromEntries(
    Object.values(CATEGORY).map(c => [c.value, c.label]),
  );

  return (
    <>
      <header>
        <h1>노트 목록</h1>
        <button onClick={onClickAddBtn}>추가</button>
      </header>
      <ul>
        {notes.map(({ id, category, title, content }) => (
          <li
            key={id}
            onClick={() => onSelectNote(id)}
            className={`note-item ${selectedNoteId === id ? 'selected' : ''}`}
          >
            <h2>{title}</h2>
            <span className='meta'>{categoryMap[category]}</span>
            <p>{content}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
