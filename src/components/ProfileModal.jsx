import React, { useState, useEffect } from 'react';
import { User, MapPin, Lock, Save, X } from 'lucide-react';

const ProfileModal = ({ show, onClose, t, authFetch, userProfile, onUpdateProfile, lang, logout }) => {
    const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'
    const [fullName, setFullName] = useState('');
    const [location, setLocation] = useState('Ho Chi Minh');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Password State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (show && userProfile) {
            setFullName(userProfile.full_name || '');
            setLocation(userProfile.location || 'Ho Chi Minh');
            setError('');
            setSuccess('');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [show, userProfile]);

    if (!show) return null;

    const locations = ["Ho Chi Minh", "Ha Noi", "Da Nang", "Can Tho"];

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await authFetch('/me', {
                method: 'PUT',
                body: JSON.stringify({ full_name: fullName, location })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Failed to update profile');

            setSuccess(t('update_success') || 'Profile updated successfully!');
            onUpdateProfile({ ...userProfile, full_name: fullName, location });
            setTimeout(() => onClose(), 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError(t('pass_mismatch'));
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await authFetch('/me/password', {
                method: 'PUT',
                body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Failed to change password');

            setSuccess(t('password_changed') || 'Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                onClose();
                if (logout) logout();
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-xl shadow border-0">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                            <User className="text-primary" size={24} /> {t('profile_settings') || 'Profile Settings'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Tabs */}
                        <ul className="nav nav-pills mb-4 nav-fill bg-light rounded p-1">
                            <li className="nav-item">
                                <button className={`nav-link rounded border-0 fw-bold ${activeTab === 'info' ? 'active bg-white text-primary shadow-sm' : 'text-muted'}`} onClick={() => setActiveTab('info')}>
                                    {t('personal_info') || 'Personal Info'}
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link rounded border-0 fw-bold ${activeTab === 'password' ? 'active bg-white text-primary shadow-sm' : 'text-muted'}`} onClick={() => setActiveTab('password')}>
                                    {t('change_password') || 'Change Password'}
                                </button>
                            </li>
                        </ul>

                        {error && <div className="alert alert-danger py-2 small">{error}</div>}
                        {success && <div className="alert alert-success py-2 small">{success}</div>}

                        {activeTab === 'info' ? (
                            <form onSubmit={handleUpdateInfo}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">{t('lbl_fullname') || 'Full Name'}</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0"><User size={18} className="text-muted" /></span>
                                        <input type="text" className="form-control border-start-0 ps-0" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-muted">{t('lbl_location') || 'Location'}</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0"><MapPin size={18} className="text-muted" /></span>
                                        <select className="form-select border-start-0 ps-0" value={location} onChange={e => setLocation(e.target.value)}>
                                            {locations.map(loc => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-text small">{t('location_hint') || 'Used for weather forecast'}</div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm"></span> : <Save size={18} />}
                                    {t('save_changes') || 'Save Changes'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleChangePassword}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">{t('old_password') || 'Current Password'}</label>
                                    <input type="password" className="form-control" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-muted">{t('new_password') || 'New Password'}</label>
                                    <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={4} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-muted">{t('confirm_password') || 'Confirm Password'}</label>
                                    <input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={4} />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm"></span> : <Lock size={18} />}
                                    {t('update_password') || 'Update Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
