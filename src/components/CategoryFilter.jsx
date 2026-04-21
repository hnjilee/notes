import { CATEGORY } from '../constants/category.js';

export default function CategoryFilter({ selectedCategory, onChangeCategory }) {
  return (
    <>
      <h1>카테고리</h1>
      <ul>
        {Object.values(CATEGORY).map(category => (
          <li
            key={category.value}
            onClick={() => onChangeCategory(category.value)}
            className={selectedCategory === category.value ? 'active' : ''}
          >
            {category.label}
          </li>
        ))}
      </ul>
    </>
  );
}
