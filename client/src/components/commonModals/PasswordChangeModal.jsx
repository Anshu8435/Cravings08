import React, { useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { LuLoaderCircle } from 'react-icons/lu';
import { FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';
import api from '../../config/ApiConfig';
import toast from 'react-hot-toast';

const PasswordChangeModal = ({ open = true, isOpen = true, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = open !== undefined ? open : isOpen;

  const handleCloseModal = () => {
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    try {
      if (formData.newPassword !== formData.confirmNewPassword) {
        toast.error('New password and confirm password do not match.');
        setIsLoading(false);
        return;
      }
      const res = await api.patch('/common/change-password', formData);
      toast.success('Password changed successfully!');
      handleCloseModal();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unknown error occurred during password change. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(40, 38, 31, 0.65)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--line)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 24px 48px rgba(40, 38, 31, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <header
          style={{
            position: 'relative',
            background: 'var(--paper)',
            padding: '24px 20px',
            borderBottom: '1px solid var(--line)',
            textAlign: 'center',
          }}
        >
          <button
            onClick={handleCloseModal}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink)',
              opacity: 0.7,
              fontSize: '1.4rem',
            }}
            aria-label="Close modal"
          >
            ✕
          </button>

          <p className="eyebrow" style={{ marginBottom: '6px' }}>
            ACCOUNT SETTINGS
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: '1.4rem',
              fontFamily: "'Fraunces', Georgia, serif",
              color: 'var(--ink)',
            }}
          >
            Change Password
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
            Keep your account secure by updating your credentials.
          </p>
        </header>

        {/* Form Body */}
        <div
          style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div>
            <label
              htmlFor="oldPassword"
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: '700',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}
            >
              Current Password
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              placeholder="Enter current password"
              value={formData.oldPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                background: 'var(--paper)',
                color: 'var(--ink)',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: '700',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="At least 6 characters"
              value={formData.newPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                background: 'var(--paper)',
                color: 'var(--ink)',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: '700',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="Repeat new password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                background: 'var(--paper)',
                color: 'var(--ink)',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <footer
          style={{
            padding: '16px 20px',
            borderTop: '1px solid var(--line)',
            background: 'var(--paper)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={handleCloseModal}
            className="button button-small"
            style={{
              background: 'transparent',
              border: '1px solid var(--line)',
              color: 'var(--ink)',
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button button-primary button-small"
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            {isLoading ? 'Updating…' : 'Update Password'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
