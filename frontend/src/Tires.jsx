import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Parts.css';

function Tires() {
  const API_URL = 'http://localhost:5026/api/tires';

  const [tires, setTires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    size: '',
    wear: 0,
    price: 0
  });

  const fetchTires = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTires(data);
    } catch (error) {
      console.error('Ошибка при загрузке шин:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTires();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'wear' || name === 'price' ? parseInt(value) : value
    }));
  };

  const handleAddTire = async (e) => {
    e.preventDefault();
    if (!formData.brand || !formData.size) {
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
        fetchTires();
        setFormData({ brand: '', size: '', wear: 0, price: 0 });
      } else {
        alert('Ошибка при добавлении шины');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleUpdateTire = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchTires();
        setEditingId(null);
        setFormData({ brand: '', size: '', wear: 0, price: 0 });
      } else {
        alert('Ошибка при обновлении шины');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleDeleteTire = async (id) => {
    if (window.confirm('Вы уверены?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchTires();
        } else {
          alert('Ошибка при удалении шины');
        }
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }
  };

  const handleEditClick = (tire) => {
    setEditingId(tire.id);
    setFormData({
      brand: tire.brand,
      size: tire.size,
      wear: tire.wear,
      price: tire.price
    });
  };

  return (
    <div className="parts-container">
      <div className="parts-header">
        <Link to="/" className="back-button">← Назад</Link>
        <h1>🛞 Управление шинами</h1>
      </div>

      <form onSubmit={editingId ? (e) => handleUpdateTire(e, editingId) : handleAddTire} className="parts-form">
        <h2>{editingId ? 'Редактировать шину' : 'Добавить новую шину'}</h2>
        
        <div className="form-group">
          <label>Бренд</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Например: Michelin"
            required
          />
        </div>

        <div className="form-group">
          <label>Размер (напр. 225/50R17)</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            placeholder="225/50R17"
            required
          />
        </div>

        <div className="form-group">
          <label>Износ (%)</label>
          <input
            type="number"
            name="wear"
            value={formData.wear}
            onChange={handleInputChange}
            min="0"
            max="100"
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>Цена ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Например: 120"
          />
        </div>

        <button type="submit" className="btn-submit">
          {editingId ? 'Обновить шину' : 'Добавить шину'}
        </button>
        {editingId && (
          <button type="button" className="btn-cancel" onClick={() => {
            setEditingId(null);
            setFormData({ brand: '', size: '', wear: 0, price: 0 });
          }}>
            Отменить
          </button>
        )}
      </form>

      <div className="parts-list">
        <h2>Список шин ({tires.length})</h2>
        {loading ? (
          <p className="loading">Загрузка...</p>
        ) : tires.length === 0 ? (
          <p className="empty">Нет шин</p>
        ) : (
          <div className="items-grid">
            {tires.map(tire => (
              <div key={tire.id} className="item-card">
                <div className="item-header">
                  <h3>{tire.brand}</h3>
                  <span className="item-id">ID: {tire.id}</span>
                </div>
                <div className="item-details">
                  <p><strong>Размер:</strong> {tire.size}</p>
                  <p><strong>Износ:</strong> {tire.wear}%</p>
                  <p><strong>Цена:</strong> ${tire.price}</p>
                </div>
                <div className="item-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditClick(tire)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteTire(tire.id)}
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

export default Tires;

