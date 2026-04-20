import NoteList from '../components/NoteList.jsx';
import NoteEditor from '../components/NoteEditor.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import useNotes from '../hooks/useNotes.js';

export default function NotePage() {
  const {
    filteredNotes,
    categories,
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
    <>
      {loading.fetch && <div className='overlay'>로딩 중...</div>}
      {error.global && (
        <div>
          <p style={{ color: 'red' }}>{error.global}</p>
          <button onClick={fetchNotes}>다시 시도</button>
          <button onClick={handleCloseErrorMsg}>닫기</button>
        </div>
      )}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onChangeCategory={setSelectedCategory}
      />
      <NoteList
        notes={filteredNotes}
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
