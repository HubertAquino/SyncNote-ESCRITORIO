import { Link, useLocation } from 'react-router-dom';

export function Sidebar({
  categories,
  activeCategory,
  onSelectCategory,
}: {
  categories: string[];
  activeCategory: string | 'all';
  onSelectCategory: (cat: string | 'all') => void;
}) {
  const { pathname } = useLocation();
  const isActive = (path: string) => (pathname === path ? 'active' : '');

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">SN</div>
        <div className="brand-name">SyncNote</div>
      </div>

      <nav className="side-nav">
        <Link className={`nav-item ${isActive('/')}`} to="/">Inicio</Link>
        <Link className={`nav-item ${isActive('/notes')}`} to="/notes">Notas</Link>
        <Link className={`nav-item ${isActive('/tasks')}`} to="/tasks">Tareas</Link>
      </nav>

      <div className="side-section">
        <div className="side-title">Categorías</div>
        <button
          className={`chip wide ${activeCategory === 'all' ? 'chip-active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >Todas</button>
        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip wide ${activeCategory === c ? 'chip-active' : ''}`}
              onClick={() => onSelectCategory(c)}
            >{c}</button>
          ))}
        </div>
      </div>

      <div className="side-footer">
        <small>v0.1.0</small>
      </div>
    </aside>
  );
}
