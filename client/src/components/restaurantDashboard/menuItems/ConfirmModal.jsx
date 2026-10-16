import React from 'react';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { FaExclamationTriangle, FaTrashAlt, FaInfoCircle } from 'react-icons/fa';

const ConfirmModal = ({ selectedItem, modalMode, isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const isDelete = modalMode === 'delete';

  const getModalConfig = () => {
    switch (modalMode) {
      case 'delete':
        return {
          title: 'Delete Menu Item',
          desc: 'Are you sure you want to delete this dish? This action will permanently remove it from your menu.',
          icon: <FaTrashAlt size={26} style={{ color: 'var(--red)' }} />,
          btnText: 'Yes, Delete Item',
        };
      case 'topRated':
        return {
          title: 'Update Top Rated Flag',
          desc: 'Toggle the Top Rated badge for this dish on the public menu.',
          icon: <FaInfoCircle size={28} style={{ color: 'var(--gold)' }} />,
          btnText: 'Confirm Update',
        };
      case 'recommended':
        return {
          title: 'Update Recommended Flag',
          desc: 'Toggle the Chef’s Recommended badge for this dish.',
          icon: <FaInfoCircle size={28} style={{ color: 'var(--red)' }} />,
          btnText: 'Confirm Update',
        };
      case 'new':
        return {
          title: 'Update New Dish Flag',
          desc: 'Toggle the New Arrival badge for this dish.',
          icon: <FaInfoCircle size={28} style={{ color: 'var(--ink)' }} />,
          btnText: 'Confirm Update',
        };
      default:
        return {
          title: 'Confirm Action',
          desc: 'Do you want to proceed with this update?',
          icon: <FaExclamationTriangle size={28} style={{ color: 'var(--gold)' }} />,
          btnText: 'Confirm',
        };
    }
  };

  const config = getModalConfig();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(40, 38, 31, 0.5)',
        backdropFilter: 'blur(3px)',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-float)',
          width: '100%',
          maxWidth: '440px',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '24px 24px 16px', textAlign: 'center', position: 'relative' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--muted)',
            }}
          >
            <IoMdCloseCircleOutline size={24} />
          </button>

          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            {config.icon}
          </div>

          <h3
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: '1.35rem',
              color: 'var(--ink)',
              margin: '0 0 6px',
            }}
          >
            {config.title}
          </h3>

          {selectedItem && (
            <p
              style={{
                fontWeight: '700',
                fontSize: '0.88rem',
                color: 'var(--red)',
                margin: '0 0 6px',
              }}
            >
              Target: {selectedItem.itemName}
            </p>
          )}

          <p style={{ fontSize: '0.84rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
            {config.desc}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            padding: '16px 24px 24px',
            borderTop: '1px solid var(--line)',
            background: 'var(--paper)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              background: 'var(--cream)',
              color: 'var(--ink)',
              fontWeight: '600',
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={onConfirm}
            style={{ flex: 1, padding: '10px 16px', fontSize: '0.88rem' }}
          >
            {config.btnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
