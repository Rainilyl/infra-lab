import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';

export default function ExerciseList({ exercises, activeCategory, onCategoryChange, activeId, completedIds }) {
  const { t } = useI18n();
  const categories = Object.keys(exercises);

  return (
    <div className="exercise-sidebar">
      <div className="sidebar-header">
        <h3>{t.exercise.sidebarTitle}</h3>
        <div className="sidebar-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`sidebar-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {t.category[cat] || cat}
            </button>
          ))}
        </div>
      </div>
      <div className="sidebar-list">
        {(exercises[activeCategory] || []).map(ex => (
          <Link
            key={ex.id}
            to={`/exercise/${ex.id}`}
            className={`sidebar-item ${activeId === ex.id ? 'active' : ''}`}
          >
            <span className={`sidebar-item-check ${completedIds.has(ex.id) ? 'done' : ''}`} />
            <span>{ex.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
