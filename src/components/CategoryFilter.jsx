export default function CategoryFilter({
  categories,
  selectedCategory,
  onChangeCategory,
}) {
  return (
    <>
      <h1>카테고리</h1>
      <ul>
        {categories.map(category => (
          <li
            key={category}
            onClick={() => onChangeCategory(category)}
            className={selectedCategory === category ? 'active' : ''}
          >
            {category}
          </li>
        ))}
      </ul>
    </>
  );
}
