import NoteList from '../components/NoteList.jsx';
import NoteEditor from '../components/NoteEditor.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import useNotes from '../hooks/useNotes.js';

export default function NotePage() {
  const {
    filteredNotes,
    draftNote,
    selectedCategory,
    loading,
    error,

    fetchNotes,
    setSelectedCategory,
    handleSelectNote,
    handleChangeDraft,
    handleSaveNote,
    handleAddNote,
    handleDeleteNote,
    handleCloseErrorMsg,
    handleRetry,
  } = useNotes();

  return (
    <div className='container'>
      {loading.fetch && <div className='overlay'>불러오는 중...</div>}
      {error.global && (
        <div className='overlay error'>
          <p>{error.global}</p>
          <div>
            <button onClick={fetchNotes}>다시 시도</button>
            <button onClick={handleCloseErrorMsg}>닫기</button>
          </div>
        </div>
      )}
      <div className='category'>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onChangeCategory={setSelectedCategory}
        />
      </div>
      <div className='list'>
        <NoteList
          notes={filteredNotes}
          selectedNoteId={draftNote?.id}
          onSelectNote={handleSelectNote}
          onClickAddBtn={handleAddNote}
        />
      </div>
      <div className='editor'>
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
      </div>
    </div>
  );
}
