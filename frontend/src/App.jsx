import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Motors from './Motors';
import Windows from './Windows';
import Tires from './Tires';
import Bodies from './Bodies';

function Cars() {
  const API_URL = 'http://localhost:5026/api/cars';
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: ''
  });

  // Загрузка всех машин
  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Ошибка при загрузке машин:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка машин при монтировании компонента
  useEffect(() => {
    fetchCars();
  }, []);

  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  // Добавление новой машины
  const handleAddCar = async (e) => {
    e.preventDefault();
    if (!formData.brand || !formData.model || !formData.color) {
      alert('Заполните все поля');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newCar = await response.json();
        setCars([...cars, newCar]);
        setFormData({ brand: '', model: '', year: new Date().getFullYear(), color: '' });
      }
    } catch (error) {
      console.error('Ошибка при добавлении машины:', error);
    }
  };

  // Загрузка данных машины для редактирования
  const handleEditStart = async (car) => {
    setEditingId(car.id);
    setFormData(car);
  };

  // Сохранение изменений машины
  const handleUpdateCar = async (e) => {
    e.preventDefault();
    if (!formData.brand || !formData.model || !formData.color) {
      alert('Заполните все поля');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedCar = await response.json();
        setCars(cars.map(car => car.id === editingId ? updatedCar : car));
        setEditingId(null);
        setFormData({ brand: '', model: '', year: new Date().getFullYear(), color: '' });
      }
    } catch (error) {
      console.error('Ошибка при обновлении машины:', error);
    }
  };

  // Удаление машины
  const handleDeleteCar = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту машину?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCars(cars.filter(car => car.id !== id));
      }
    } catch (error) {
      console.error('Ошибка при удалении машины:', error);
    }
  };

  // Отмена редактирования
  const handleCancel = () => {
    setEditingId(null);
    setFormData({ brand: '', model: '', year: new Date().getFullYear(), color: '' });
  };

  return (
    <div className="container">
      <div className="cars-header">
        <Link to="/" className="back-to-home">← Главная</Link>
        <h1>🚗 Управление автомобилями</h1>
      </div>

      {/* Форма добавления/редактирования */}
      <form className="form" onSubmit={editingId ? handleUpdateCar : handleAddCar}>
        <h2>{editingId ? 'Редактировать машину' : 'Добавить новую машину'}</h2>
        
        <input
          type="text"
          name="brand"
          placeholder="Марка (Toyota, BMW, etc.)"
          value={formData.brand}
          onChange={handleInputChange}
          required
        />
        
        <input
          type="text"
          name="model"
          placeholder="Модель (Camry, X5, etc.)"
          value={formData.model}
          onChange={handleInputChange}
          required
        />
        
        <input
          type="number"
          name="year"
          placeholder="Год выпуска"
          value={formData.year}
          onChange={handleInputChange}
          min="1900"
          max={new Date().getFullYear()}
          required
        />
        
        <input
          type="text"
          name="color"
          placeholder="Цвет"
          value={formData.color}
          onChange={handleInputChange}
          required
        />
        
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Сохранить' : 'Добавить'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Отмена
            </button>
          )}
        </div>
      </form>

      {/* Список машин */}
      <div className="cars-section">
        <h2>Список автомобилей ({cars.length})</h2>
        
        {loading && <p className="loading">Загрузка...</p>}
        
        {cars.length === 0 && !loading && (
          <p className="empty">Нет добавленных машин. Добавьте первую!</p>
        )}

        <div className="cars-grid">
          {cars.map(car => (
            <div key={car.id} className="car-card">
              <div className="car-info">
                <h3>{car.brand} {car.model}</h3>
                <p><strong>Год:</strong> {car.year}</p>
                <p><strong>Цвет:</strong> <span className="color-badge" style={{backgroundColor: car.color}}></span> {car.color}</p>
              </div>
              <div className="car-actions">
                <button 
                  className="btn btn-edit" 
                  onClick={() => handleEditStart(car)}
                >
                  ✏️ Редактировать
                </button>
                <button 
                  className="btn btn-delete" 
                  onClick={() => handleDeleteCar(car.id)}
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/motors" element={<Motors />} />
        <Route path="/windows" element={<Windows />} />
        <Route path="/tires" element={<Tires />} />
        <Route path="/bodies" element={<Bodies />} />
      </Routes>
    </Router>
  );
}

export default App;

