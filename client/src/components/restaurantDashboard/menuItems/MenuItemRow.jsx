import React from 'react';
import { FaAward } from 'react-icons/fa';
import { AiTwotoneLike } from 'react-icons/ai';
import { LuChevronDown, LuPencilLine, LuEye, LuTrash2 } from 'react-icons/lu';
import { statusChipStyles, statusLabels } from './menuData';
import api from '../../../config/ApiConfig.jsx';

const MenuItemRow = ({
  item,
  restaurantId,
  setMenuItems,
  setIsProcessing,
  showToast,
  setSelectedItem,
  setModalMode,
  setIsControlsModalOpen,
  setIsEditViewItemModalOpen,
}) => {
  const isAvailable = item.status === 'available';

  const handleToggleAvailability = async () => {
    const nextStatus = isAvailable ? 'unavailable' : 'available';
    setIsProcessing(true);
    try {
      const response = await api.put(`/menu/update/${item._id}`, {
        restaurantId,
        status: nextStatus,
      });
      if (response.data.success) {
        setMenuItems((prev) =>
          prev.map((m) => (m._id === item._id ? { ...m, status: nextStatus } : m)),
        );
        showToast(
          nextStatus === 'unavailable'
            ? `Item marked as Unavailable (Sold out)`
            : `Item marked as Available!`,
          nextStatus === 'unavailable' ? 'error' : 'success',
        );
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update availability', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsProcessing(true);
    try {
      const response = await api.put(`/menu/update/${item._id}`, {
        restaurantId,
        status: newStatus,
      });
      if (response.data.success) {
        setMenuItems((prev) =>
          prev.map((m) => (m._id === item._id ? { ...m, status: newStatus } : m)),
        );
        showToast(`Status updated to ${newStatus}!`);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="menu-item-row">
      {/* 1. Item Name, Image & Description */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <img
          src={item.image?.url || '/assets/bitehero-food-pasta.png'}
          alt={item.itemName}
          style={{
            width: '64px',
            height: '64px',
            objectFit: 'cover',
            borderRadius: '8px',
            border: '1px solid var(--line)',
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--ink)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.itemName}
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: '2px',
            }}
          >
            {item.description || 'Artisanal dish'}
          </div>
        </div>
      </div>

      {/* 2. Price */}
      <div style={{ textAlign: 'center' }}>
        <strong
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: '1.05rem',
            color: 'var(--ink)',
          }}
        >
          ₹{Number(item.price).toFixed(2)}
        </strong>
      </div>

      {/* 3. Category & Type */}
      <div>
        <div style={{ fontWeight: '600', fontSize: '0.86rem', color: 'var(--ink)' }}>
          {item.category}
        </div>
        <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{item.type}</div>
      </div>

      {/* 4. Status & Unavailable Toggle Button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Direct One-Click Availability Button */}
        <button
          type="button"
          onClick={handleToggleAvailability}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '999px',
            fontSize: '0.76rem',
            fontWeight: '700',
            letterSpacing: '0.02em',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            border: isAvailable
              ? '1px solid rgba(82, 108, 68, 0.4)'
              : '1px solid rgba(180, 58, 47, 0.4)',
            background: isAvailable ? 'rgba(82, 108, 68, 0.12)' : 'rgba(180, 58, 47, 0.12)',
            color: isAvailable ? 'var(--green)' : 'var(--red)',
          }}
          title={isAvailable ? 'Click to mark as Unavailable' : 'Click to mark as Available'}
        >
          <span style={{ fontSize: '0.7rem' }}>{isAvailable ? '●' : '✕'}</span>
          <span>{isAvailable ? 'Available' : 'Unavailable'}</span>
        </button>

        {/* Status Dropdown */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select
            value={item.status}
            onChange={handleStatusChange}
            style={{
              width: '100%',
              padding: '4px 20px 4px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: '600',
              border: '1px solid var(--line)',
              background: 'var(--paper)',
              color: 'var(--ink)',
              cursor: 'pointer',
              appearance: 'none',
            }}
          >
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="discontinued">Discontinued</option>
          </select>
          <LuChevronDown
            style={{
              position: 'absolute',
              right: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: '0.7rem',
              color: 'var(--muted)',
            }}
          />
        </div>
      </div>

      {/* 5. Controls: Top Rated, Recommended, New */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => {
            setSelectedItem(item);
            setModalMode('topRated');
            setIsControlsModalOpen(true);
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: '1px solid var(--line)',
            background: item.isTopRated ? 'var(--gold)' : 'var(--paper)',
            color: item.isTopRated ? '#28261f' : 'var(--muted)',
            cursor: 'pointer',
          }}
          title={item.isTopRated ? 'Top Rated' : 'Mark as Top Rated'}
        >
          <FaAward size={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedItem(item);
            setModalMode('recommended');
            setIsControlsModalOpen(true);
          }}
          style={{
            padding: '6px',
            borderRadius: '6px',
            border: '1px solid var(--line)',
            background: item.isRecommended ? 'var(--red)' : 'var(--paper)',
            color: item.isRecommended ? '#fff' : 'var(--muted)',
            cursor: 'pointer',
          }}
          title={item.isRecommended ? 'Recommended' : 'Mark as Recommended'}
        >
          <AiTwotoneLike size={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedItem(item);
            setModalMode('new');
            setIsControlsModalOpen(true);
          }}
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            border: '1px solid var(--line)',
            background: item.isNew ? 'var(--red)' : 'var(--paper)',
            color: item.isNew ? '#fff' : 'var(--muted)',
            fontSize: '0.72rem',
            fontWeight: '700',
            cursor: 'pointer',
          }}
          title={item.isNew ? 'New Item' : 'Mark as New'}
        >
          New
        </button>
      </div>

      {/* 6. Actions: Edit, View, Delete */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => {
            setSelectedItem(item);
            setModalMode('edit');
            setIsEditViewItemModalOpen(true);
          }}
          style={{
            padding: '6px 8px',
            borderRadius: '6px',
            border: '1px solid var(--line)',
            background: 'var(--paper)',
            color: 'var(--ink)',
            cursor: 'pointer',
          }}
          title="Edit Item"
        >
          <LuPencilLine size={15} />
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedItem(item);
            setModalMode('view');
            setIsEditViewItemModalOpen(true);
          }}
          style={{
            padding: '6px 8px',
            borderRadius: '6px',
            border: '1px solid var(--line)',
            background: 'var(--paper)',
            color: 'var(--ink)',
            cursor: 'pointer',
          }}
          title="View Details"
        >
          <LuEye size={15} />
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedItem(item);
            setModalMode('delete');
            setIsControlsModalOpen(true);
          }}
          style={{
            padding: '6px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(180, 58, 47, 0.3)',
            background: 'rgba(180, 58, 47, 0.08)',
            color: 'var(--red)',
            cursor: 'pointer',
          }}
          title="Delete Item"
        >
          <LuTrash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default MenuItemRow;
