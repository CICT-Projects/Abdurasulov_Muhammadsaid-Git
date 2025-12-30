﻿import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Parts.css';

function Motors() {
  const API_URL = 'http://localhost:5026/api/motors';

  const [motors, setMotors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    power: 0,
    type: 'Бензин',
    price: 0
  });

  const fetchMotors = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMotors(data);
    } catch (error) {
      console.error('Ошибка при загрузке моторов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'power' || name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleAddMotor = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type) {
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
        fetchMotors();
        setFormData({ name: '', power: 0, type: 'Бензин', price: 0 });
      } else {
        alert('Ошибка при добавлении мотора');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleUpdateMotor = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchMotors();
        setEditingId(null);
        setFormData({ name: '', power: 0, type: 'Бензин', price: 0 });
      } else {
        alert('Ошибка при обновлении мотора');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleDeleteMotor = async (id) => {
    if (window.confirm('Вы уверены?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchMotors();
        } else {
          alert('Ошибка при удалении мотора');
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const handleEditClick = (motor) => {
    setEditingId(motor.id);
    setFormData({
      name: motor.name,
      power: motor.power,
      type: motor.type,
      price: motor.price
    });
  };

  return (
    <div className="parts-container">
      <div className="parts-header">
        <Link to="/" className="back-button">← Назад</Link>
        <h1>⚙️ Управление моторами</h1>
      </div>

      <form onSubmit={editingId ? (e) => handleUpdateMotor(e, editingId) : handleAddMotor} className="parts-form">
        <h2>{editingId ? 'Редактировать мотор' : 'Добавить новый мотор'}</h2>
        
        <div className="form-group">
          <label>Название</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Например: V8 Turbo"
            required
          />
        </div>

        <div className="form-group">
          <label>Мощность (л.с.)</label>
          <input
            type="number"
            name="power"
            value={formData.power}
            onChange={handleInputChange}
            placeholder="Например: 450"
          />
        </div>

        <div className="form-group">
          <label>Тип двигателя</label>
          <select name="type" value={formData.type} onChange={handleInputChange}>
            <option value="Бензин">Бензин</option>
            <option value="Дизель">Дизель</option>
            <option value="Электро">Электро</option>
            <option value="Гибрид">Гибрид</option>
          </select>
        </div>

        <div className="form-group">
          <label>Цена ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Например: 5000"
          />
        </div>

        <button type="submit" className="btn-submit">
          {editingId ? 'Обновить мотор' : 'Добавить мотор'}
        </button>
        {editingId && (
          <button type="button" className="btn-cancel" onClick={() => {
            setEditingId(null);
            setFormData({ name: '', power: 0, type: 'Бензин', price: 0 });
          }}>
            Отменить
          </button>
        )}
      </form>

      <div className="parts-list">
        <h2>Список моторов ({motors.length})</h2>
        {loading ? (
          <p className="loading">Загрузка...</p>
        ) : motors.length === 0 ? (
          <p className="empty">Нет моторов</p>
        ) : (
          <div className="items-grid">
            {motors.map(motor => (
              <div key={motor.id} className="item-card">
                <div className="item-header">
                  <h3>{motor.name}</h3>
                  <span className="item-id">ID: {motor.id}</span>
                </div>
                <div className="item-details">
                  <p><strong>Мощность:</strong> {motor.power} л.с.</p>
                  <p><strong>Тип:</strong> {motor.type}</p>
                  <p><strong>Цена:</strong> ${motor.price}</p>
                </div>
                <div className="item-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditClick(motor)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteMotor(motor.id)}
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


export default Motors;

