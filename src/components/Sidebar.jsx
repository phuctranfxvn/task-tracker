import {
    LayoutDashboard, List, Calendar, Settings,
    LogOut, Plus, WifiOff, User
} from 'lucide-react';

import logo from '../assets/logo.svg';
const Sidebar = ({ view, setView, t, lang, setLang, logout, openAddModal, openProfile, userProfile }) => {

    const navItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: t('dashboard') },
        { id: 'list', icon: <List size={18} />, label: t('list') },
        { id: 'calendar', icon: <Calendar size={18} />, label: t('calendar') },
        { id: 'settings', icon: <Settings size={18} />, label: t('settings') },
    ];

    return (
        <div className="d-flex flex-column h-100 bg-white shadow-soft align-items-center py-4" style={{ width: '80px', borderRadius: '0 24px 24px 0', zIndex: 10 }}>
            {/* Logo / Brand */}
            <div className="d-flex flex-column align-items-center gap-2 mb-5">
                <div className="d-flex align-items-center justify-content-center p-0 rounded-circle" style={{ width: '40px', height: '40px' }}>
                    <img src={logo} alt="Logo" style={{ width: '100%', height: '100%' }} />
                </div>
                <h5 className="fw-bold mb-0 text-dark text-center" style={{ fontSize: '0.7rem', letterSpacing: '0.5px', marginTop: '4px' }}>TASK</h5>
            </div>

            {/* Navigation */}
            <div className="d-flex flex-column gap-3 flex-grow-1 w-100 align-items-center">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`btn p-0 d-flex align-items-center justify-content-center border-0 ${view === item.id ? 'active-nav-item shadow-soft' : 'text-secondary hover-scale'}`}
                        style={{ width: '42px', height: '42px', borderRadius: '12px', transition: 'all 0.2s' }}
                        onClick={() => setView(item.id)}
                        title={item.label}
                    >
                        {item.icon}
                    </button>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto d-flex flex-column gap-3 align-items-center w-100 pb-2">

                {/* Profile Trigger */}
                <div className="d-flex align-items-center justify-content-center cursor-pointer rounded-circle bg-light text-primary shadow-sm hover-scale transition-all"
                    style={{ width: '40px', height: '40px' }}
                    onClick={openProfile}
                    title={userProfile?.full_name || "Profile"}>
                    <span className="fw-bold small">{userProfile?.full_name ? userProfile.full_name.charAt(0).toUpperCase() : <User size={20} />}</span>
                </div>

                {/* Lang */}
                <div className="d-flex flex-column gap-1 mb-2 align-items-center">
                    <button
                        className="btn p-0 border-0 fw-bold text-secondary hover-text-theme"
                        style={{ fontSize: '14px', transition: 'all 0.2s', letterSpacing: '1px' }}
                        onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
                    >
                        {lang === 'en' ? 'EN' : 'VI'}
                    </button>
                </div>

                {/* Logout */}
                <button className="btn btn-light text-secondary rounded-circle p-2 mt-2 hover-bg-danger hover-text-white transition-colors" onClick={logout} title={t('logout')} style={{ width: '40px', height: '40px' }}>
                    <LogOut size={20} />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
