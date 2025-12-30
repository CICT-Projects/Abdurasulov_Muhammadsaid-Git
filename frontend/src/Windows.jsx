import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Parts.css';

function Windows() {
  const API_URL = 'http://localhost:5026/api/windows';

  const [windows, setWindows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: 'Переднее',
    tinted: false,
    price: 0
  });

  const fetchWindows = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setWindows(data);
    } catch (error) {
      console.error('Ошибка при загрузке окон:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWindows();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? parseFloat(value) : value)
    }));
  };

  const handleAddWindow = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.position) {
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
        fetchWindows();
        setFormData({ name: '', position: 'Переднее', tinted: false, price: 0 });
      } else {
        alert('Ошибка при добавлении окна');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleUpdateWindow = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchWindows();
        setEditingId(null);
        setFormData({ name: '', position: 'Переднее', tinted: false, price: 0 });
      } else {
        alert('Ошибка при обновлении окна');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleDeleteWindow = async (id) => {
    if (window.confirm('Вы уверены?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchWindows();
        } else {
          alert('Ошибка при удалении окна');
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const handleEditClick = (win) => {
    setEditingId(win.id);
    setFormData({
      name: win.name,
      position: win.position,
      tinted: win.tinted,
      price: win.price
    });
  };

  return (
    <div className="parts-container">
      <div className="parts-header">
        <Link to="/" className="back-button">← Назад</Link>
        <h1>🪟 Управление окнами</h1>
      </div>

      <form onSubmit={editingId ? (e) => handleUpdateWindow(e, editingId) : handleAddWindow} className="parts-form">
        <h2>{editingId ? 'Редактировать окно' : 'Добавить новое окно'}</h2>
        
        <div className="form-group">
          <label>Название</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Например: Front Left"
            required
          />
        </div>

        <div className="form-group">
          <label>Позиция</label>
          <select name="position" value={formData.position} onChange={handleInputChange}>
            <option value="Переднее">Переднее</option>
            <option value="Переднее боковое">Переднее боковое</option>
            <option value="Заднее боковое">Заднее боковое</option>
            <option value="Заднее">Заднее</option>
          </select>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="tinted"
              checked={formData.tinted}
              onChange={handleInputChange}
            />
            Тонированное
          </label>
        </div>

        <div className="form-group">
          <label>Цена ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Например: 300"
          />
        </div>

        <button type="submit" className="btn-submit">
          {editingId ? 'Обновить окно' : 'Добавить окно'}
        </button>
        {editingId && (
          <button type="button" className="btn-cancel" onClick={() => {
            setEditingId(null);
            setFormData({ name: '', position: 'Переднее', tinted: false, price: 0 });
          }}>
            Отменить
          </button>
        )}
      </form>

      <div className="parts-list">
        <h2>Список окон ({windows.length})</h2>
        {loading ? (
          <p className="loading">Загрузка...</p>
        ) : windows.length === 0 ? (
          <p className="empty">Нет окон</p>
        ) : (
          <div className="items-grid">
            {windows.map(win => (
              <div key={win.id} className="item-card">
                <div className="item-header">
                  <h3>{win.name}</h3>
                  <span className="item-id">ID: {win.id}</span>
                </div>
                <div className="item-details">
                  <p><strong>Позиция:</strong> {win.position}</p>
                  <p><strong>Тонировка:</strong> {win.tinted ? 'Да' : 'Нет'}</p>
                  <p><strong>Цена:</strong> ${win.price}</p>
                </div>
                <div className="item-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditClick(win)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteWindow(win.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Windows;

