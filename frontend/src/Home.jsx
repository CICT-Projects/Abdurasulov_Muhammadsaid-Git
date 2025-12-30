import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1>🚗 Управление автозапчастями</h1>
        <p>Выберите раздел для управления</p>
      </div>

      <div className="navigation-grid">
        <Link to="/cars" className="nav-card cars-card">
          <div className="card-icon">🚗</div>
          <h2>Машины</h2>
          <p>Управление автомобилями</p>
          <span className="card-action">Перейти →</span>
        </Link>

        <Link to="/motors" className="nav-card motors-card">
          <div className="card-icon">⚙️</div>
          <h2>Моторы</h2>
          <p>Управление двигателями</p>
          <span className="card-action">Перейти →</span>
        </Link>

        <Link to="/windows" className="nav-card windows-card">
          <div className="card-icon">🪟</div>
          <h2>Окна</h2>
          <p>Управление стеклами и окнами</p>
          <span className="card-action">Перейти →</span>
        </Link>

        <Link to="/tires" className="nav-card tires-card">
          <div className="card-icon">🛞</div>
          <h2>Шины</h2>
          <p>Управление шинами и колесами</p>
          <span className="card-action">Перейти →</span>
        </Link>

        <Link to="/bodies" className="nav-card bodies-card">
          <div className="card-icon">🔧</div>
          <h2>Корпусы</h2>
          <p>Управление кузовами автомобилей</p>
          <span className="card-action">Перейти →</span>
        </Link>
      </div>

      <div className="home-footer">
        <p>Всего разделов: 5 | Машины, Моторы, Окна, Шины, Корпусы</p>
      </div>
    </div>
  );
}

export default Home;

