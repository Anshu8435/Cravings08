import React, { useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { LuLoaderCircle } from 'react-icons/lu';
import { FaEnvelope, FaKey, FaShieldAlt, FaLockOpen } from 'react-icons/fa';
import api from '../../config/ApiConfig';
import toast from 'react-hot-toast';

const ForgotPasswordModal = ({ open = true, isOpen = true, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const isModalOpen = open !== undefined ? open : isOpen;

  const handleCloseModal = () => {
    onClose();
    setFormData({
      email: '',
      otp: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setIsOtpSent(false);
    setIsOtpVerified(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      if (!isOtpSent) {
        if (!formData.email || !formData.email.trim()) {
          toast.error('Please enter your email address');
          return;
        }
        const res = await api.post('/auth/send-otp', formData);
        toast.success(res.data.message);
        setIsOtpSent(true);
      } else if (!isOtpVerified) {
        if (!formData.otp || formData.otp.trim().length !== 6) {
          toast.error('Please enter a valid 6-digit OTP');
          return;
        }
        const res = await api.post('/auth/verify-otp', formData);
        toast.success(res.data.message);
        if (res.data.token) {
          sessionStorage.setItem('cravingToken', res.data.token);
        }
        setIsOtpVerified(true);
      } else {
        // Check if both passwords match
        if (formData.newPassword !== formData.confirmNewPassword) {
          toast.error('New Password and Confirm Password do not match.');
          return;
        }
        if (!formData.newPassword || formData.newPassword.length < 6) {
          toast.error('Password must be at least 6 characters.');
          return;
        }

        const res = await api.post('/auth/reset-password', formData);

        toast.success(res.data.message);

        handleCloseModal();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Unknown error occurred during password reset. Please try again.',
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
            ACCOUNT SECURITY
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: '1.4rem',
              fontFamily: "'Fraunces', Georgia, serif",
              color: 'var(--ink)',
            }}
          >
            Forgot Password?
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--muted)' }}>
            {!isOtpSent
              ? 'Enter your email to receive a secure OTP.'
              : !isOtpVerified
                ? 'Enter the 6-digit OTP sent to your email.'
                : 'Create a new strong password.'}
          </p>
        </header>

        {/* Form Body */}
        <div
          style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* Email Step */}
          <div>
            <label
              htmlFor="email"
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
              Registered Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
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
              disabled={isLoading || isOtpSent}
            />
          </div>

          {/* OTP Step */}
          {isOtpSent && (
            <div>
              <label
                htmlFor="otp"
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
                Verification OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--line)',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  fontSize: '1rem',
                  letterSpacing: '0.2em',
                  textAlign: 'center',
                  fontWeight: '700',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                disabled={isLoading || isOtpVerified}
              />
            </div>
          )}

          {/* New Password Step */}
          {isOtpSent && isOtpVerified && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
          )}
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
            onClick={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading
              ? 'Processing…'
              : isOtpSent
                ? isOtpVerified
                  ? 'Reset Password'
                  : 'Verify OTP'
                : 'Send OTP'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
