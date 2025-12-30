﻿import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Parts.css';

function Bodies() {
  const API_URL = 'http://localhost:5026/api/bodies';

  const [bodies, setBodies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Седан',
    color: '',
    material: 'Металл',
    price: 0
  });

  const fetchBodies = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setBodies(data);
    } catch (error) {
      console.error('Ошибка при загрузке корпусов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBodies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleAddBody = async (e) => {
    e.preventDefault();
    if (!formData.type || !formData.color) {
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
        fetchBodies();
        setFormData({ type: 'Седан', color: '', material: 'Металл', price: 0 });
      } else {
        alert('Ошибка при добавлении корпуса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleUpdateBody = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchBodies();
        setEditingId(null);
        setFormData({ type: 'Седан', color: '', material: 'Металл', price: 0 });
      } else {
        alert('Ошибка при обновлении корпуса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleDeleteBody = async (id) => {
    if (window.confirm('Вы уверены?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchBodies();
        } else {
          alert('Ошибка при удалении корпуса');
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const handleEditClick = (body) => {
    setEditingId(body.id);
    setFormData({
      type: body.type,
      color: body.color,
      material: body.material,
      price: body.price
    });
  };

  return (
    <div className="parts-container">
      <div className="parts-header">
        <Link to="/" className="back-button">← Назад</Link>
        <h1>🔧 Управление корпусами</h1>
      </div>

      <form onSubmit={editingId ? (e) => handleUpdateBody(e, editingId) : handleAddBody} className="parts-form">
        <h2>{editingId ? 'Редактировать корпус' : 'Добавить новый корпус'}</h2>
        
        <div className="form-group">
          <label>Тип корпуса</label>
          <select name="type" value={formData.type} onChange={handleInputChange}>
            <option value="Седан">Седан</option>
            <option value="Кроссовер">Кроссовер</option>
            <option value="Хэтчбек">Хэтчбек</option>
            <option value="Минивэн">Минивэн</option>
            <option value="Пикап">Пикап</option>
          </select>
        </div>

        <div className="form-group">
          <label>Цвет</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="Например: Черный"
            required
          />
        </div>

        <div className="form-group">
          <label>Материал</label>
          <select name="material" value={formData.material} onChange={handleInputChange}>
            <option value="Металл">Металл</option>
            <option value="Пластик">Пластик</option>
            <option value="Композит">Композит</option>
            <option value="Углеволокно">Углеволокно</option>
          </select>
        </div>

        <div className="form-group">
          <label>Цена ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Например: 15000"
          />
        </div>

        <button type="submit" className="btn-submit">
          {editingId ? 'Обновить корпус' : 'Добавить корпус'}
        </button>
        {editingId && (
          <button type="button" className="btn-cancel" onClick={() => {
            setEditingId(null);
            setFormData({ type: 'Седан', color: '', material: 'Металл', price: 0 });
          }}>
            Отменить
          </button>
        )}
      </form>

      <div className="parts-list">
        <h2>Список корпусов ({bodies.length})</h2>
        {loading ? (
          <p className="loading">Загрузка...</p>
        ) : bodies.length === 0 ? (
          <p className="empty">Нет корпусов</p>
        ) : (
          <div className="items-grid">
            {bodies.map(body => (
              <div key={body.id} className="item-card">
                <div className="item-header">
                  <h3>{body.type}</h3>
                  <span className="item-id">ID: {body.id}</span>
                </div>
                <div className="item-details">
                  <p><strong>Цвет:</strong> {body.color}</p>
                  <p><strong>Материал:</strong> {body.material}</p>
                  <p><strong>Цена:</strong> ${body.price}</p>
                </div>
                <div className="item-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditClick(body)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteBody(body.id)}
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


export default Bodies;

