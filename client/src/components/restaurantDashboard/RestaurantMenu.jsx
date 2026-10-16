import React, { useState, useEffect } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import ConfirmModal from './menuItems/ConfirmModal';
import AddNewItemModal from './menuItems/AddNewItemModal';
import EditOrViewItem from './menuItems/EditOrViewItem';
import MenuItemRow from './menuItems/MenuItemRow';
import api from '../../config/ApiConfig.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import runningLoader from '../../assets/runningLoader.gif';

const RestaurantMenu = ({ activeRestaurantId }) => {
  const { user } = useAuth();
  const restaurantId = activeRestaurantId || user?._id;
  const [menuItems, setMenuItems] = useState([]);

  const [isAddNewItemModalOpen, setIsAddNewItemModalOpen] = useState(false);
  const [isEditViewItemModalOpen, setIsEditViewItemModalOpen] = useState(false);
  const [isControlsModalOpen, setIsControlsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      if (!restaurantId) return;
      setIsLoading(true);
      try {
        const response = await api.get(`/menu/${restaurantId}`);
        if (response.data.success) {
          setMenuItems(response.data.data || []);
        }
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to load menu items', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantId]);

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConfirmAction = async () => {
    setIsProcessing(true);
    try {
      if (modalMode === 'delete') {
        await api.delete(`/menu/delete/${selectedItem._id}`, {
          data: { restaurantId },
        });
        setMenuItems((prev) => prev.filter((m) => m._id !== selectedItem._id));
        showToast('Item deleted successfully!');
      } else {
        const toggleFieldMap = {
          topRated: 'isTopRated',
          recommended: 'isRecommended',
          new: 'isNew',
        };
        const field = toggleFieldMap[modalMode];
        if (field) {
          const newValue = !selectedItem[field];
          const response = await api.put(`/menu/update/${selectedItem._id}`, {
            restaurantId,
            [field]: newValue,
          });
          if (response.data.success) {
            setMenuItems((prev) =>
              prev.map((m) => (m._id === selectedItem._id ? { ...m, [field]: newValue } : m)),
            );
            showToast(`${modalMode} status updated!`);
          }
        }
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Action failed', 'error');
    }
    setIsControlsModalOpen(false);
    setIsProcessing(false);
  };

  const handleEditItem = async (updatedItem) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('restaurantId', restaurantId);
      if (updatedItem.itemName !== selectedItem.itemName)
        formData.append('itemName', updatedItem.itemName);
      if (updatedItem.description !== selectedItem.description)
        formData.append('description', updatedItem.description);
      if (updatedItem.price !== selectedItem.price) formData.append('price', updatedItem.price);
      if (updatedItem.category !== selectedItem.category)
        formData.append('category', updatedItem.category);
      if (updatedItem.type !== selectedItem.type) formData.append('type', updatedItem.type);

      if (updatedItem.imageFile) {
        formData.append('image', updatedItem.imageFile);
      } else if (!updatedItem.imageUrl && selectedItem.image?.url) {
        formData.append('removeImage', 'true');
      }

      const response = await api.put(`/menu/update/${selectedItem._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setMenuItems((prev) =>
          prev.map((m) => (m._id === selectedItem._id ? response.data.data : m)),
        );
        showToast('Item updated successfully!');
        setIsEditViewItemModalOpen(false);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update item', 'error');
    }
    setIsProcessing(false);
  };

  const handleAddItem = async (newItem) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('restaurantId', restaurantId);
      formData.append('itemName', newItem.itemName);
      formData.append('description', newItem.description || '');
      formData.append('price', newItem.price);
      formData.append('category', newItem.category);
      formData.append('type', newItem.type);
      formData.append('isNew', 'true');

      if (newItem.imageFile) {
        formData.append('image', newItem.imageFile);
      }

      const response = await api.post('/menu/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        setMenuItems((prev) => [response.data.data, ...prev]);
        showToast('Item added successfully!');
        setIsAddNewItemModalOpen(false);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add item', 'error');
    }
    setIsProcessing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'var(--cream)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-card)',
          padding: '16px 20px',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '1.4rem',
              margin: 0,
              color: 'var(--ink)',
            }}
          >
            Menu Management
          </h2>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>
            Manage dishes, toggle availability status, and control featured flags.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search dishes or categories…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              background: 'var(--paper)',
              fontSize: '0.85rem',
              color: 'var(--ink)',
              minWidth: '220px',
            }}
          />

          <button
            type="button"
            className="button button-primary"
            onClick={() => setIsAddNewItemModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              padding: '9px 16px',
            }}
          >
            <IoMdAddCircleOutline size={18} />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Grid Headers */}
      <div className="menu-grid-header">
        <div>Dish details</div>
        <div style={{ textAlign: 'center' }}>Price</div>
        <div>Category</div>
        <div>Availability status</div>
        <div>Flags</div>
        <div>Actions</div>
      </div>

      {/* Menu Item Rows */}
      {isLoading ? (
        <div className="empty-state" style={{ padding: '60px 20px' }}>
          <span className="empty-mark">⏳</span>
          <h3>Loading kitchen menu…</h3>
          <p>Fetching dishes from database.</p>
        </div>
      ) : filteredMenuItems.length > 0 ? (
        <div>
          {filteredMenuItems.map((item, index) => (
            <MenuItemRow
              key={item._id || index}
              item={item}
              restaurantId={restaurantId}
              setMenuItems={setMenuItems}
              setIsProcessing={setIsProcessing}
              showToast={showToast}
              setSelectedItem={setSelectedItem}
              setModalMode={setModalMode}
              setIsControlsModalOpen={setIsControlsModalOpen}
              setIsEditViewItemModalOpen={setIsEditViewItemModalOpen}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-mark">🍽️</span>
          <h3>No dishes found</h3>
          <p>Click "Add New Item" above to add your first menu item.</p>
        </div>
      )}

      {/* Modals */}
      {isControlsModalOpen && (
        <ConfirmModal
          selectedItem={selectedItem}
          modalMode={modalMode}
          isOpen={isControlsModalOpen}
          onClose={() => setIsControlsModalOpen(false)}
          onConfirm={handleConfirmAction}
        />
      )}

      {isAddNewItemModalOpen && (
        <AddNewItemModal
          isOpen={isAddNewItemModalOpen}
          onClose={() => setIsAddNewItemModalOpen(false)}
          onAdd={handleAddItem}
        />
      )}

      {isEditViewItemModalOpen && (
        <EditOrViewItem
          selectedItem={selectedItem}
          modalMode={modalMode}
          isOpen={isEditViewItemModalOpen}
          onClose={() => setIsEditViewItemModalOpen(false)}
          onSave={handleEditItem}
        />
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(40, 38, 31, 0.45)',
            backdropFilter: 'blur(3px)',
          }}
        >
          <img
            src={runningLoader}
            alt="Processing..."
            style={{ width: '64px', height: '64px', marginBottom: '12px' }}
          />
          <p style={{ color: '#fff', fontWeight: '700', fontSize: '1rem' }}>
            Updating kitchen records…
          </p>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 10000,
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-float)',
            color: '#fff',
            fontWeight: '600',
            fontSize: '0.88rem',
            background: toast.type === 'error' ? 'var(--red)' : 'var(--green)',
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
