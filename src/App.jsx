import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Plus, Trash2, BarChart2, List,
    CheckCircle, AlertTriangle, Clock,
    Briefcase, RefreshCw, WifiOff, LayoutDashboard, Menu,
    Zap, Star, PieChart, Edit, Settings, X, User, Calendar, LogOut, Lock, ArrowRight,
    Eye, EyeOff, Filter, XCircle, Globe, Bold, Italic, Underline, List as ListIcon,
    ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Shield, Key, CheckCheck, MoreVertical,
    Gift, Search, Grid, Calendar as CalendarIcon
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import bgBlueClouds from './assets/bg_blue_clouds_v2_1766206629794.png';
import bgGreenNature from './assets/bg_green_nature_v2_1766206645278.png';
import bgOrangeSun from './assets/bg_orange_sun_v2_1766206767841.png';
import bgPinkAbstract from './assets/bg_pink_abstract_v2_1766206671674.png';

// --- CẤU HÌNH ---
let API_URL = "http://localhost:8000";
const APP_VERSION = "v3.5.0"; // Updated version

try {
    if (import.meta && import.meta.env && import.meta.env.VITE_BACKEND_API_URL) {
        API_URL = import.meta.env.VITE_BACKEND_API_URL;
    }
} catch (e) {
    console.warn("Using default API URL.");
}

// --- LOCALIZATION ---
const PO_FILES = {
    en: {
        "app_name": "Task Tracker",
        "demo_mode": "Demo Mode",
        "loading": "Loading...",
        "error_server": "Server Error",
        "confirm_delete": "Are you sure you want to delete?",
        "save": "Save",
        "cancel": "Cancel",
        "update": "Update",
        "add": "Add",
        "delete": "Delete",
        "logout": "Logout",
        "login": "Login",
        "register": "Register",
        "username": "Username",
        "password": "Password",
        "confirm_password": "Confirm Password",
        "pass_mismatch": "Passwords do not match!",
        "security_code": "Security Code",
        "auth_error": "Connection Failed or Invalid Credentials",
        "demo_offline": "Try Demo (Offline)",
        "have_account": "Already have an account? Login",
        "no_account": "No account? Register now",
        "dashboard": "Dashboard",
        "list": "List",
        "calendar": "Calendar",
        "settings": "Settings",
        "total_tasks": "Total Tasks",
        "completed": "Completed",
        "pending": "In Progress",
        "overdue": "Overdue",
        "upcoming_tasks": "Upcoming Deadlines",
        "upcoming_birthdays": "Upcoming Birthdays",
        "no_upcoming": "No upcoming deadlines.",
        "no_upcoming_bday": "No upcoming birthdays.",
        "status_by_cat": "Status by Category",
        "priority_by_cat": "Priority by Category",
        "urgent_tasks": "Urgent Tasks",
        "urgent_desc": "Urgent & Not Done",
        "important_tasks": "Important Tasks",
        "important_desc": "Important & Not Done",
        "legend_done": "Done",
        "legend_wip": "WIP",
        "legend_hold": "Hold",
        "legend_new": "New",
        "legend_high": "High",
        "legend_med": "Med",
        "legend_low": "Low",
        "task_list": "Task List",
        "filter": "Filter",
        "clear_filter": "Clear",
        "show_completed": "Show Done",
        "hide_completed": "Hide Done",
        "col_created": "Created",
        "col_task": "Task",
        "col_cat": "Category",
        "col_owner": "Owner",
        "col_prio": "Priority",
        "col_status": "Status",
        "col_due": "Due Date",
        "no_tasks": "No tasks found matching criteria.",
        "manage_cat": "Manage Categories",
        "manage_owner": "Manage Owners",
        "manage_birthday": "Manage Birthdays",
        "manage_security": "Manage Security Codes",
        "placeholder_cat": "Category name...",
        "placeholder_owner": "Owner name...",
        "placeholder_code": "Enter new code...",
        "placeholder_name": "Name...",
        "placeholder_day": "Day",
        "placeholder_month": "Month",
        "placeholder_year": "Year (Optional)",
        "empty_cat": "No categories yet",
        "empty_owner": "No owners yet",
        "empty_birthday": "No birthdays yet",
        "modal_add_title": "Add New Task",
        "modal_edit_title": "Task Details",
        "lbl_desc": "Description",
        "lbl_details": "Detailed Content",
        "lbl_cat": "Category",
        "lbl_owner": "Owner",
        "lbl_prio": "Priority",
        "lbl_status": "Status",
        "lbl_due": "Due Date",
        "chk_imp": "Important",
        "chk_urg": "Urgent",
        "ph_desc": "Enter task description...",
        "sel_cat": "-- Select Category --",
        "sel_owner": "-- Select Owner --",
        "alert_desc_req": "Task description is required!",
        "days_remaining": "{days} days",
        "today": "Today",
        "tomorrow": "Tomorrow",
        "overdue_days": "Overdue {days} days",
        "weekdays": ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"], // Updated order
        "month_names": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "code_col_code": "Code",
        "code_col_user": "Registered User",
        "status_used": "Used",
        "status_unused": "Available",
        "bday_col_name": "Name",
        "bday_col_date": "Date",
        "days_left": "{days} days left",
        "turns_age": "Turns {age}",
        "showing_page": "Page {page} of {total}",
        "search_ph": "Search tasks...",
        "more_tasks": "+{count} more",
        "view_week": "Week",
        "view_month": "Month",
        "weather_clear": "Clear Sky",
        "weather_cloudy": "Cloudy",
        "weather_fog": "Fog / Drizzle",
        "weather_rain": "Rain",
        "weather_snow": "Snow",
        "weather_rain_showers": "Rain Showers",
        "weather_thunderstorm": "Thunderstorm",
        "weather_unknown": "Unknown",
        "weather_forecast": "Forecast"
    },
    vi: {
        "app_name": "Quản Lý Công Việc",
        "demo_mode": "Chế độ Demo",
        "loading": "Đang tải...",
        "error_server": "Lỗi máy chủ",
        "confirm_delete": "Bạn có chắc chắn muốn xóa?",
        "save": "Lưu lại",
        "cancel": "Hủy bỏ",
        "update": "Cập nhật",
        "add": "Thêm",
        "delete": "Xóa",
        "logout": "Đăng xuất",
        "login": "Đăng nhập",
        "register": "Đăng ký",
        "username": "Tên đăng nhập",
        "password": "Mật khẩu",
        "confirm_password": "Nhập lại mật khẩu",
        "pass_mismatch": "Mật khẩu không khớp!",
        "security_code": "Mã bảo mật",
        "auth_error": "Lỗi kết nối hoặc sai thông tin",
        "demo_offline": "Dùng thử Demo (Offline)",
        "have_account": "Đã có tài khoản? Đăng nhập",
        "no_account": "Chưa có tài khoản? Đăng ký ngay",
        "dashboard": "Bảng tin",
        "list": "Danh sách",
        "calendar": "Lịch",
        "settings": "Cấu hình",
        "total_tasks": "Tổng số Task",
        "completed": "Hoàn thành",
        "pending": "Đang xử lý",
        "overdue": "Quá hạn",
        "upcoming_tasks": "Sắp đến hạn",
        "upcoming_birthdays": "Sắp sinh nhật",
        "no_upcoming": "Không có công việc sắp đến hạn.",
        "no_upcoming_bday": "Không có sinh nhật sắp tới.",
        "status_by_cat": "Trạng thái theo Danh mục",
        "priority_by_cat": "Độ ưu tiên theo Danh mục",
        "urgent_tasks": "Việc Gấp",
        "urgent_desc": "Gấp & Chưa xong",
        "important_tasks": "Việc Quan Trọng",
        "important_desc": "Quan trọng & Chưa xong",
        "legend_done": "Xong",
        "legend_wip": "Đang làm",
        "legend_hold": "Tạm hoãn",
        "legend_new": "Mới",
        "legend_high": "Cao",
        "legend_med": "Vừa",
        "legend_low": "Thấp",
        "task_list": "Danh sách công việc",
        "filter": "Bộ lọc",
        "clear_filter": "Xóa lọc",
        "show_completed": "Hiện đã xong",
        "hide_completed": "Ẩn đã xong",
        "col_created": "Ngày tạo",
        "col_task": "Công việc",
        "col_cat": "Danh mục",
        "col_owner": "Phụ trách",
        "col_prio": "Độ ưu tiên",
        "col_status": "Trạng thái",
        "col_due": "Hạn chót",
        "no_tasks": "Không tìm thấy công việc phù hợp.",
        "manage_cat": "Quản lý Danh mục",
        "manage_owner": "Quản lý Người phụ trách",
        "manage_birthday": "Quản lý Sinh nhật",
        "manage_security": "Quản lý Mã bảo mật",
        "placeholder_cat": "Tên danh mục...",
        "placeholder_owner": "Tên nhân sự...",
        "placeholder_code": "Nhập mã mới...",
        "placeholder_name": "Tên...",
        "placeholder_day": "Ngày",
        "placeholder_month": "Tháng",
        "placeholder_year": "Năm (Tùy chọn)",
        "empty_cat": "Chưa có danh mục",
        "empty_owner": "Chưa có nhân sự",
        "empty_birthday": "Chưa có dữ liệu sinh nhật",
        "modal_add_title": "Thêm Công Việc Mới",
        "modal_edit_title": "Chi Tiết Công Việc",
        "lbl_desc": "Tên công việc",
        "lbl_details": "Nội dung chi tiết",
        "lbl_cat": "Danh mục",
        "lbl_owner": "Phụ trách",
        "lbl_prio": "Độ ưu tiên",
        "lbl_status": "Trạng thái",
        "lbl_due": "Hạn chót",
        "chk_imp": "Quan trọng (Important)",
        "chk_urg": "Khẩn cấp (Urgent)",
        "ph_desc": "Nhập tên công việc...",
        "sel_cat": "-- Chọn danh mục --",
        "sel_owner": "-- Chọn người --",
        "alert_desc_req": "Vui lòng nhập tên công việc!",
        "days_remaining": "Còn {days} ngày",
        "today": "Hôm nay",
        "tomorrow": "Ngày mai",
        "overdue_days": "Quá hạn {days} ngày",
        "weekdays": ["T2", "T3", "T4", "T5", "T6", "T7", "CN"], // Updated order
        "month_names": ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
        "code_col_code": "Mã bảo mật",
        "code_col_user": "Tài khoản đăng ký",
        "status_used": "Đã dùng",
        "status_unused": "Chưa dùng",
        "bday_col_name": "Họ tên",
        "bday_col_date": "Ngày sinh",
        "days_left": "Còn {days} ngày",
        "turns_age": "Sắp {age} tuổi",
        "showing_page": "Trang {page}/{total}",
        "search_ph": "Tìm kiếm công việc...",
        "more_tasks": "Thêm {count}",
        "view_week": "Tuần",
        "view_month": "Tháng",
        "weather_clear": "Trời quang",
        "weather_cloudy": "Có mây",
        "weather_fog": "Sương mù / Mưa phùn",
        "weather_rain": "Mưa",
        "weather_snow": "Tuyết rơi",
        "weather_rain_showers": "Mưa rào",
        "weather_thunderstorm": "Dông bão",
        "weather_unknown": "Không xác định",
        "weather_forecast": "Dự báo"
    }
};

const useTranslation = () => {
    const [lang, setLangState] = useState(localStorage.getItem('app_lang') || 'en');
    const setLang = (newLang) => {
        setLangState(newLang);
        localStorage.setItem('app_lang', newLang);
    };
    const t = (key, params = {}) => {
        let text = PO_FILES[lang]?.[key] || PO_FILES['en']?.[key] || key;
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    };
    return { t, lang, setLang };
};

// --- UTILS ---
const formatDateTime = (dateStr, lang) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        const locale = lang === 'vi' ? 'vi-VN' : 'en-US';
        return d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
};

const getDaysRemaining = (dueDate, t) => {
    if (!dueDate) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <span className="text-danger fw-bold">{t('overdue_days', { days: Math.abs(diffDays) })}</span>;
    if (diffDays === 0) return <span className="text-danger fw-bold">{t('today')}</span>;
    if (diffDays === 1) return <span className="text-warning fw-bold text-dark">{t('tomorrow')}</span>;
    return <span className={diffDays <= 7 ? "text-danger fw-bold" : "text-muted"}>{t('days_remaining', { days: diffDays })}</span>;
};

// --- RICH TEXT EDITOR COMPONENT ---
const SimpleRichTextEditor = ({ initialValue, onChange }) => {
    const contentRef = useRef(null);
    useEffect(() => {
        if (contentRef.current && (contentRef.current.innerHTML === '' || initialValue !== contentRef.current.innerHTML)) {
            if (initialValue && initialValue !== contentRef.current.innerHTML) {
                contentRef.current.innerHTML = initialValue;
            } else if (!initialValue) {
                contentRef.current.innerHTML = '';
            }
        }
    }, [initialValue]);
    const handleInput = () => { if (contentRef.current) onChange(contentRef.current.innerHTML); };
    const exec = (cmd) => { document.execCommand(cmd, false, null); if (contentRef.current) contentRef.current.focus(); };
    return (
        <div className="border rounded bg-white overflow-hidden d-flex flex-column" style={{ height: '250px' }}>
            <div className="bg-light border-bottom p-2 d-flex gap-2 align-items-center flex-wrap">
                <button type="button" className="btn btn-sm btn-light border" onClick={(e) => { e.preventDefault(); exec('bold'); }} title="Bold"><Bold size={16} /></button>
                <button type="button" className="btn btn-sm btn-light border" onClick={(e) => { e.preventDefault(); exec('italic'); }} title="Italic"><Italic size={16} /></button>
                <button type="button" className="btn btn-sm btn-light border" onClick={(e) => { e.preventDefault(); exec('underline'); }} title="Underline"><Underline size={16} /></button>
                <div className="vr mx-1"></div>
                <button type="button" className="btn btn-sm btn-light border" onClick={(e) => { e.preventDefault(); exec('insertUnorderedList'); }} title="List"><ListIcon size={16} /></button>
            </div>
            <div ref={contentRef} className="flex-grow-1 p-3 custom-scrollbar" style={{ outline: 'none', overflowY: 'auto' }} contentEditable={true} onInput={handleInput} />
        </div>
    );
};

// --- UPDATED CALENDAR VIEW (Supports Week/Month Toggle) ---
const CalendarView = ({ tasks, onEditTask, onAddToday, t, lang, onDateChange }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month'); // 'month' | 'week'

    // Auto-switch to Week view on Mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                if (viewMode !== 'week') setViewMode('week');
            }
        };
        // Initial check
        if (window.innerWidth < 768) {
            setViewMode('week');
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [viewMode]);

    useEffect(() => {
        if (onDateChange) {
            onDateChange(currentDate);
        }
    }, [currentDate]);

    // Helper: Get Start of Week (Monday)
    const getStartOfWeek = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(date.setDate(diff));
    };

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

    // Get first day relative to Monday (Mon=0, Tue=1, ... Sun=6)
    const getFirstDayOfMonthMonStart = (year, month) => {
        const day = new Date(year, month, 1).getDay();
        return (day === 0 ? 6 : day - 1);
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Navigation Logic
    const prev = () => {
        if (viewMode === 'month') {
            setCurrentDate(new Date(year, month - 1, 1));
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 7);
            setCurrentDate(newDate);
        }
    };

    const next = () => {
        if (viewMode === 'month') {
            setCurrentDate(new Date(year, month + 1, 1));
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 7);
            setCurrentDate(newDate);
        }
    };

    const weekDays = PO_FILES[lang]?.weekdays || PO_FILES['en'].weekdays;
    const monthNames = PO_FILES[lang]?.month_names || PO_FILES['en'].month_names;

    // Pastel Palette
    const PASTEL_COLORS = [
        { bg: '#E4DEFA', text: '#5D4F85', border: '#D0C4F5' }, // Purple
        { bg: '#F9EAC2', text: '#8A7130', border: '#F2DCA0' }, // Orange/Beige
        { bg: '#D8F1F8', text: '#3E7B91', border: '#B8E3F0' }, // Blue
        { bg: '#F8D8E8', text: '#9B456C', border: '#F0B8D4' }, // Pink
        { bg: '#E0F8D8', text: '#4F8552', border: '#C4F0B8' }, // Green
    ];

    const getTaskColor = (task) => {
        if (!task) return PASTEL_COLORS[0];
        const index = task.id % PASTEL_COLORS.length;
        return PASTEL_COLORS[index];
    };

    // --- CHECK FOR WEEKEND TASKS ---
    // In Week view, we check the displayed week. In Month view, checking entire month is okay.
    const hasWeekendTasks = useMemo(() => {
        if (viewMode === 'month') {
            const total = daysInMonth(year, month);
            for (let day = 1; day <= total; day++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const checkDate = new Date(year, month, day);
                const dayOfWeek = checkDate.getDay();
                if ((dayOfWeek === 0 || dayOfWeek === 6) && tasks.some(t => t.due_date === dateStr && t.status !== 'Completed')) return true;
            }
        } else {
            const startOfWeek = getStartOfWeek(currentDate);
            for (let i = 0; i < 7; i++) {
                const d = new Date(startOfWeek);
                d.setDate(startOfWeek.getDate() + i);
                const dayOfWeek = d.getDay();
                const dateStr = d.toISOString().split('T')[0];
                if ((dayOfWeek === 0 || dayOfWeek === 6) && tasks.some(t => t.due_date === dateStr && t.status !== 'Completed')) return true;
            }
        }
        return false;
    }, [tasks, year, month, viewMode, currentDate]);

    // Grid Template
    const gridTemplate = hasWeekendTasks
        ? 'repeat(7, minmax(0, 1fr))'
        : 'repeat(5, minmax(0, 1fr)) repeat(2, minmax(0, 0.2fr))';

    // Generate Cells
    const cells = [];
    let rowsCount = 0;

    if (viewMode === 'month') {
        const totalDays = daysInMonth(year, month);
        const startDay = getFirstDayOfMonthMonStart(year, month);
        const totalSlots = startDay + totalDays;
        rowsCount = Math.ceil(totalSlots / 7);

        // Empty slots
        for (let i = 0; i < startDay; i++) {
            const colIndex = i % 7;
            const isWeekendCol = colIndex === 5 || colIndex === 6;
            cells.push(<div key={`empty-${i}`} className={isWeekendCol ? "calendar-weekend-stripe" : ""} style={{ borderRadius: '16px' }}></div>);
        }
        // Month Days
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            cells.push(renderDayCell(dateStr, day, startDay + day - 1));
        }
    } else {
        // Week View
        rowsCount = 1;
        const startOfWeek = getStartOfWeek(currentDate);
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            cells.push(renderDayCell(dateStr, d.getDate(), i));
        }
    }

    function renderDayCell(dateStr, dayNumber, indexForWeekendCheck) {
        const dayTasks = tasks.filter(t => t.due_date === dateStr && t.status !== 'Completed');
        const isToday = new Date().toISOString().split('T')[0] === dateStr;
        const colIndex = indexForWeekendCheck % 7;
        const isWeekend = colIndex === 5 || colIndex === 6;

        return (
            <div
                key={dateStr}
                className={`calendar-day-card d-flex flex-column gap-1 ${isWeekend ? 'calendar-weekend-stripe' : ''}`}
                style={{
                    backgroundColor: isWeekend ? '#f8f9fa' : '#FFFFFF',
                    minHeight: '0',
                    height: '100%',
                    borderRadius: '16px',
                    padding: '8px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                    border: isToday ? '2px solid #0d6efd' : '1px solid transparent',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    overflow: 'hidden'
                }}
                onDoubleClick={() => onAddToday(dateStr)}
                onClick={() => onAddToday(dateStr)}
            >
                <div className={`fw-bold text-center d-flex align-items-center justify-content-center ${isToday ? 'bg-primary text-white rounded-circle shadow-sm' : 'text-secondary'}`} style={{ width: '28px', height: '28px', fontSize: '0.9rem', flexShrink: 0 }}>
                    {dayNumber}
                </div>

                <div className="d-flex flex-column gap-1 flex-grow-1 overflow-hidden" style={{ opacity: (!hasWeekendTasks && isWeekend) ? 0.5 : 1 }}>
                    {dayTasks.slice(0, viewMode === 'week' ? 10 : 3).map((task) => { // Show more items in week view
                        const colors = getTaskColor(task);
                        return (
                            <div
                                key={task.id}
                                className="px-2 py-1 rounded shadow-sm d-flex align-items-center"
                                style={{
                                    backgroundColor: colors.bg,
                                    color: colors.text,
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    borderLeft: `3px solid ${colors.border}`
                                }}
                                onClick={(e) => { e.stopPropagation(); onEditTask(task); }}
                                title={task.description}
                            >
                                <span className="text-truncate w-100">{task.description}</span>
                            </div>
                        );
                    })}

                    {dayTasks.length > (viewMode === 'week' ? 10 : 3) && (
                        <div className="text-center text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                            {t('more_tasks', { count: dayTasks.length - (viewMode === 'week' ? 10 : 3) })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const titleDate = viewMode === 'month' ? currentDate : getStartOfWeek(currentDate);

    return (
        <div className="h-100 d-flex flex-column" style={{ backgroundColor: '#FDFBF7', fontFamily: "'Inter', sans-serif" }}>
            <div className="px-4 py-2 d-flex flex-wrap justify-content-between align-items-end flex-shrink-0 gap-2">
                <div>
                    <h1 className="display-7 fw-bold text-dark text-uppercase m-0" style={{ letterSpacing: '-2px' }}>
                        {monthNames[titleDate.getMonth()]} / {titleDate.getFullYear()}
                    </h1>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <div className="btn-group me-2" role="group">
                        <button type="button" className={`btn btn-sm ${viewMode === 'month' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setViewMode('month')}><Grid size={16} className="me-1" /> {t('view_month')}</button>
                        <button type="button" className={`btn btn-sm ${viewMode === 'week' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setViewMode('week')}><CalendarIcon size={16} className="me-1" /> {t('view_week')}</button>
                    </div>
                    <button className="btn btn-outline-dark border-0 rounded-circle p-2" onClick={prev}><ChevronLeft size={24} /></button>
                    <button className="btn btn-outline-dark border-0 rounded-circle p-2" onClick={next}><ChevronRight size={24} /></button>
                </div>
            </div>

            <div className="flex-grow-1 px-4 pb-4 overflow-hidden">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: gridTemplate,
                    gridTemplateRows: `auto repeat(${rowsCount}, 1fr)`,
                    height: '100%',
                    gap: '8px',
                    minWidth: '100%',
                    transition: 'all 0.3s ease'
                }}>
                    {weekDays.map((d, i) => (
                        <div key={i} className="text-center text-secondary fw-bold mb-2 text-uppercase" style={{ fontSize: '1rem', letterSpacing: '1px' }}>
                            {d}
                        </div>
                    ))}
                    {cells}
                </div>
            </div>
        </div>
    );
};

const BootstrapLoader = () => {
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        const font = document.createElement("link");
        font.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
        font.rel = "stylesheet";
        document.head.appendChild(font);
        const style = document.createElement("style");
        style.innerHTML = `
      html, body, #root { width: 100%; margin: 0; padding: 0; font-size: 15px; }
      @media (min-width: 768px) { html, body, #root { height: 100%; overflow: hidden; } .responsive-height { height: 100%; overflow: hidden; } }
      @media (max-width: 767.98px) { html, body, #root { height: auto; overflow-x: hidden; } .responsive-height { height: auto; min-height: 100vh; } .navbar-brand { font-size: 1rem !important; } .kpi-card-col { margin-bottom: 1rem; } }
      .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #ced4da; border-radius: 3px; }
      .card-header-excel { background-color: #f8f9fa; border-bottom: 1px solid #dee2e6; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px; color: #555; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.5rem; }
      .pie-chart { width: 100px; height: 100px; border-radius: 50%; }
      .table-custom th { padding-top: 14px; padding-bottom: 14px; font-size: 0.85rem; text-transform: uppercase; color: #6c757d; background-color: #f8f9fa; border-bottom: 2px solid #dee2e6; }
      .table-custom td { padding-top: 16px; padding-bottom: 16px; vertical-align: middle; border-bottom: 1px solid #f0f0f0; }
      .table-custom tr { transition: background-color 0.2s; }
      .table-custom tr:hover td { background-color: #f1f3f5; cursor: pointer; }
      .auth-container { display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f0f2f5; position: fixed; top: 0; left: 0; width: 100%; z-index: 9999; }
      .auth-box { width: 100%; max-width: 400px; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin: 1rem; }
      .filter-badge { cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
      .filter-badge.active { border-color: currentColor; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .filter-badge:hover { opacity: 0.8; }
      .lang-flag { transition: all 0.2s; border-radius: 2px; }
      .lang-flag:hover { transform: scale(1.1); }
      .cursor-pointer { cursor: pointer; }
      .sort-icon { display: inline-block; margin-left: 4px; opacity: 0.5; }
      .th-hover:hover { background-color: #e9ecef; }
      .transition-hover:hover { background-color: #f8f9fa; }
      .mobile-scroll-nav { overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
      .mobile-scroll-nav::-webkit-scrollbar { display: none; }
      .hover-danger:hover { color: #dc3545 !important; background-color: rgba(220, 53, 69, 0.1); border-radius: 4px; }
      
      /* Calendar Specific Styles */
      .calendar-day-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important; z-index: 10; }
      
      /* Weekend Stripe Pattern - Clearer Visibility */
      .calendar-weekend-stripe {
        background-color: #f8f9fa;
        background-image: repeating-linear-gradient(
          45deg,
          #dee2e6,
          #dee2e6 1px,
          transparent 1px,
          transparent 10px
        );
      }
    `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(link); document.head.removeChild(font); document.head.removeChild(style);
        };
    }, []);
    return null;
};

const STATUS_BADGES = { 'Not Started': 'bg-secondary', 'In Progress': 'bg-primary', 'On Hold': 'bg-warning text-dark', 'Completed': 'bg-success' };
const PRIORITY_BADGES = { 'High': 'bg-danger', 'Normal': 'bg-info text-dark', 'Low': 'bg-light text-dark border' };

export default function App() {
    const { t, lang, setLang } = useTranslation();
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('is_admin') === 'true');


    // --- STATE ---
    const [tasks, setTasks] = useState([]); // Now only current page tasks
    const [dashboardStats, setDashboardStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0, urgent: 0, important: 0, category_stats: [] }); // New Stats State
    const [upcomingTasks, setUpcomingTasks] = useState([]); // New Separate State for Upcoming
    const [categories, setCategories] = useState([]);
    const [owners, setOwners] = useState([]);
    const [birthdays, setBirthdays] = useState([]);
    const [securityCodes, setSecurityCodes] = useState([]);
    const [view, setView] = useState('dashboard');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    // --- FILTER & PAGINATION STATE ---
    const [showCompleted, setShowCompleted] = useState(false);
    const [filterCats, setFilterCats] = useState([]);
    const [filterOwners, setFilterOwners] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' });

    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        total: 0,
        pages: 1
    });

    // State for Calendar View
    const [calendarDateRange, setCalendarDateRange] = useState({ start: null, end: null });

    const [newTask, setNewTask] = useState({
        description: '', notes: '', category_name: '', owner_name: '', priority: 'Normal', status: 'Not Started', due_date: '', is_important: false, is_urgent: false
    });
    const [newCatName, setNewCatName] = useState('');
    const [newOwnerName, setNewOwnerName] = useState('');
    const [newSecurityCode, setNewSecurityCode] = useState('');
    const [newBdayName, setNewBdayName] = useState('');
    const [newBdayDay, setNewBdayDay] = useState('');
    const [newBdayMonth, setNewBdayMonth] = useState('');
    const [newBdayYear, setNewBdayYear] = useState('');

    // --- HANDLE ESC KEY ---
    useEffect(() => {
        const handleEsc = (event) => { if (event.key === 'Escape') setShowModal(false); };
        if (showModal) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showModal]);

    const authFetch = async (endpoint, options = {}) => {

        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        if (response.status === 401) { logout(); throw new Error("Unauthorized"); }
        return response;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('is_admin');
        setToken(null);
        setIsAdmin(false);

        setTasks([]);
        setBirthdays([]);
        setCategories([]);
        setOwners([]);
        setDashboardStats({ total: 0, completed: 0, pending: 0, overdue: 0, urgent: 0, important: 0, category_stats: [] });
        setUpcomingTasks([]);
        setSecurityCodes([]);
    };

    // --- MAIN FETCH DATA ---
    const fetchConfigAndBdays = async () => {
        try {
            const resConfig = await authFetch('/config');
            if (resConfig.ok) {
                const config = await resConfig.json();
                setCategories(config.categories);
                setOwners(config.owners);
                if (config.categories.length) setNewTask(p => ({ ...p, category_name: config.categories[0] }));
                if (config.owners.length) setNewTask(p => ({ ...p, owner_name: config.owners[0] }));
            }
            const resBdays = await authFetch('/birthdays');
            if (resBdays.ok) setBirthdays(await resBdays.json());
            if (isAdmin) {
                const resCodes = await authFetch('/config/security-codes');
                if (resCodes.ok) setSecurityCodes(await resCodes.json());
            }
        } catch (e) { }
    };

    const fetchDashboardData = async () => {
        try {
            const resStats = await authFetch('/dashboard/stats');
            if (resStats.ok) setDashboardStats(await resStats.json());

            // Upcoming Tasks (Limit 5, Sort by Due Date)
            const params = new URLSearchParams({
                page: 1, size: 5, sort_by: 'due_date', sort_desc: false, show_completed: false
            });
            const resUpcoming = await authFetch(`/tasks?${params}`);
            if (resUpcoming.ok) {
                const data = await resUpcoming.json();
                setUpcomingTasks(data.items.filter(t => t.due_date)); // Ensure due_date exists
            }
        } catch (e) { }
    };

    // FETCH TASKS (Handles both List and Calendar modes)
    const fetchTasks = async (resetPage = false) => {
        if (!token) return;
        setLoading(true);
        try {
            const currentPage = resetPage ? 1 : pagination.page;

            // Build Query Params
            const params = new URLSearchParams();

            if (view === 'calendar' && calendarDateRange.start && calendarDateRange.end) {
                // Calendar Mode: Fetch All for Month
                params.append('size', 0); // Special flag for all
                params.append('start_date', calendarDateRange.start);
                params.append('end_date', calendarDateRange.end);
            } else {
                // List Mode: Pagination
                params.append('page', currentPage);
                params.append('size', pagination.size);
                params.append('sort_by', sortConfig.key);
                params.append('sort_desc', sortConfig.direction === 'descending');
            }

            params.append('show_completed', showCompleted);
            if (searchTerm) params.append('search', searchTerm);

            filterCats.forEach(cat => params.append('categories', cat));
            filterOwners.forEach(own => params.append('owners', own));

            const resTasks = await authFetch(`/tasks?${params}`);
            if (resTasks.ok) {
                const data = await resTasks.json();
                setTasks(data.items);
                if (view !== 'calendar') {
                    setPagination(prev => ({ ...prev, total: data.total, pages: data.pages, page: currentPage }));
                }
            }

            // Also fetch config/stats if first load
            if (categories.length === 0) await fetchConfigAndBdays();

        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    };

    // Trigger fetch when these dependencies change
    useEffect(() => {
        if (token) {
            fetchTasks();
        }
    }, [token, pagination.page, pagination.size, sortConfig, showCompleted, filterCats, filterOwners, view, calendarDateRange]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => { if (token && view === 'list') fetchTasks(true); }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch Dashboard data separately when in Dashboard view
    useEffect(() => {
        if (token && view === 'dashboard') {
            fetchDashboardData();
        }
    }, [view, token]);

    const handleCalendarDateChange = (dateObj) => {
        // Calculate start and end of month for fetching
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Format YYYY-MM-DD
        const formatDate = (d) => d.toISOString().split('T')[0];

        setCalendarDateRange({
            start: formatDate(firstDay),
            end: formatDate(lastDay)
        });
    };

    // Handle Sort Request
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ArrowUp size={14} className="sort-icon text-primary" /> : <ArrowDown size={14} className="sort-icon text-primary" />;
    };

    const toggleFilterCat = (cat) => setFilterCats(prev => {
        const next = prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat];
        setPagination(p => ({ ...p, page: 1 })); // Reset to page 1
        return next;
    });
    const toggleFilterOwner = (owner) => setFilterOwners(prev => {
        const next = prev.includes(owner) ? prev.filter(o => o !== owner) : [...prev, owner];
        setPagination(p => ({ ...p, page: 1 }));
        return next;
    });

    const clearFilters = () => { setFilterCats([]); setFilterOwners([]); setSearchTerm(''); setPagination(p => ({ ...p, page: 1 })); };

    const handleSaveTask = async () => {
        if (!newTask.description) return alert(t('alert_desc_req'));
        const payload = { ...newTask, due_date: newTask.due_date === '' ? null : newTask.due_date };
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/tasks/${editingId}` : `/tasks`;
            await authFetch(url, { method, body: JSON.stringify(payload) });
            fetchTasks();
            if (view === 'dashboard') fetchDashboardData();
        } catch (err) { alert(t('error_server')); }
        setShowModal(false);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm(t('confirm_delete'))) return;
        try { await authFetch(`/tasks/${id}`, { method: 'DELETE' }); fetchTasks(); if (view === 'dashboard') fetchDashboardData(); } catch (e) { }
    };

    // Helper CRUD wrappers that refresh data
    const handleAddCategory = async () => { if (!newCatName.trim()) return; try { await authFetch(`/config/categories`, { method: 'POST', body: JSON.stringify({ name: newCatName }) }); fetchConfigAndBdays(); } catch (e) { } setNewCatName(''); };
    const handleDeleteCategory = async (catName) => { if (!confirm(t('confirm_delete'))) return; try { await authFetch(`/config/categories/${encodeURIComponent(catName)}`, { method: 'DELETE' }); fetchConfigAndBdays(); } catch (e) { } };

    const handleAddOwner = async () => { if (!newOwnerName.trim()) return; try { await authFetch(`/config/owners`, { method: 'POST', body: JSON.stringify({ name: newOwnerName }) }); fetchConfigAndBdays(); } catch (e) { } setNewOwnerName(''); };
    const handleDeleteOwner = async (name) => { if (!confirm(t('confirm_delete'))) return; try { await authFetch(`/config/owners/${encodeURIComponent(name)}`, { method: 'DELETE' }); fetchConfigAndBdays(); } catch (e) { } };

    const handleAddBirthday = async () => { if (!newBdayName.trim()) return; try { await authFetch(`/birthdays`, { method: 'POST', body: JSON.stringify({ name: newBdayName, day: parseInt(newBdayDay), month: parseInt(newBdayMonth), year: newBdayYear ? parseInt(newBdayYear) : null }) }); fetchConfigAndBdays(); } catch (e) { } setNewBdayName(''); setNewBdayDay(''); setNewBdayMonth(''); setNewBdayYear(''); };
    const handleDeleteBirthday = async (id) => { if (!confirm(t('confirm_delete'))) return; try { await authFetch(`/birthdays/${id}`, { method: 'DELETE' }); fetchConfigAndBdays(); } catch (e) { } };

    const handleAddSecurityCode = async () => { if (!newSecurityCode.trim()) return; try { await authFetch(`/config/security-codes`, { method: 'POST', body: JSON.stringify({ code: newSecurityCode }) }); fetchConfigAndBdays(); } catch (e) { } setNewSecurityCode(''); };
    const handleDeleteSecurityCode = async (c) => { if (!confirm("Delete?")) return; try { await authFetch(`/config/security-codes/${encodeURIComponent(c)}`, { method: 'DELETE' }); fetchConfigAndBdays(); } catch (e) { } };

    const openAddModal = (initialDate = '') => {
        const validDate = typeof initialDate === 'string' ? initialDate : '';
        setEditingId(null);
        setNewTask({ description: '', notes: '', category_name: categories[0] || '', owner_name: owners[0] || '', priority: 'Normal', status: 'Not Started', due_date: validDate, is_important: false, is_urgent: false });
        setShowModal(true);
    };
    const openEditModal = (task) => { setEditingId(task.id); setNewTask({ description: task.description, notes: task.notes || '', category_name: task.category_name, owner_name: task.owner_name, priority: task.priority, status: task.status, due_date: task.due_date || '', is_important: task.is_important, is_urgent: task.is_urgent }); setShowModal(true); };

    // Calculate stats for Birthday (using client-side logic on fetched birthdays)
    const calculateBirthdayCountdown = (day, month, birthYear) => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const currentYear = today.getFullYear();
        let nextBday = new Date(currentYear, month - 1, day);
        if (nextBday < today) nextBday.setFullYear(currentYear + 1);
        const diffTime = nextBday - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let age = null; if (birthYear) age = nextBday.getFullYear() - birthYear;
        return { diffDays, date: nextBday, age };
    };

    const processedBirthdays = useMemo(() => {
        return birthdays.map(b => {
            const { diffDays, date, age } = calculateBirthdayCountdown(b.day, b.month, b.year);
            return { ...b, diffDays, nextDate: date, age };
        }).sort((a, b) => a.diffDays - b.diffDays);
    }, [birthdays]);

    if (!token) {
        return (<> <BootstrapLoader /> <AuthScreen onLogin={(t, isAdmin) => { localStorage.setItem('access_token', t); localStorage.setItem('is_admin', isAdmin); setToken(t); setIsAdmin(isAdmin); }} t={t} /> </>);
    }

    return (
        <div className="d-flex w-100 h-100 font-sans overflow-hidden" style={{ backgroundColor: '#F3F6FD' }}>
            <BootstrapLoader />

            {/* Sidebar - Desktop */}
            <div className="d-none d-lg-block h-100 flex-shrink-0">
                <Sidebar
                    view={view}
                    setView={setView}
                    t={t}
                    lang={lang}
                    setLang={setLang}
                    logout={logout}

                    openAddModal={() => openAddModal()}
                />
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 h-100 d-flex flex-column position-relative overflow-hidden">
                {/* Mobile Header */}
                <div className="d-lg-none p-3 bg-white shadow-sm d-flex justify-content-between align-items-center z-3">
                    <div className="d-flex align-items-center gap-2 font-weight-bold"><LayoutDashboard size={20} className="text-primary" /> <span className="fw-bold">Task Tracker</span></div>
                    <button className="btn btn-sm btn-light" onClick={() => setView(view === 'dashboard' ? 'list' : 'dashboard')}><Menu size={20} /></button>
                </div>

                {/* Scrollable Area */}
                <div className="flex-grow-1 overflow-auto custom-scrollbar p-3 p-md-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                        <div>
                            <h2 className="fw-bold text-dark mb-1" style={{ fontSize: '1.75rem' }}>{t(view)}</h2>

                        </div>

                        <div className="d-flex align-items-center gap-3 flex-wrap">
                            <div className="d-none d-md-flex input-group border-0 bg-white rounded-pill shadow-sm px-3 py-2 align-items-center" style={{ width: '300px' }}>
                                <Search size={18} className="text-muted" />
                                <input type="text" className="form-control border-0 shadow-none bg-transparent" placeholder={t('search_ph')} value={searchTerm} onChange={e => { setSearchTerm(e.target.value); if (view !== 'list') setView('list'); }} />
                            </div>
                            <button className="btn btn-primary text-white bg-theme rounded-circle shadow-soft p-0 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }} onClick={() => openAddModal()}>
                                <Plus size={24} />
                            </button>

                        </div>
                    </div>

                    {/* KPI CARDS */}
                    {view !== 'settings' && view !== 'calendar' && (
                        <div className="row g-3 mb-4">
                            <KpiCard title={t('total_tasks')} value={dashboardStats.total} icon={<Briefcase size={22} />} bg="pastel-blue" bgImage={bgBlueClouds} />
                            <KpiCard title={t('completed')} value={dashboardStats.completed} icon={<CheckCircle size={22} />} bg="pastel-green" bgImage={bgGreenNature} />
                            <KpiCard title={t('pending')} value={dashboardStats.pending} icon={<Clock size={22} />} bg="pastel-orange" bgImage={bgOrangeSun} />
                            <KpiCard title={t('overdue')} value={dashboardStats.overdue} icon={<AlertTriangle size={22} />} bg="pastel-pink" bgImage={bgPinkAbstract} />
                        </div>
                    )}

                    {/* VIEWS */}
                    {view === 'dashboard' ? (
                        <div className="row g-4 pb-3">
                            {/* Stats Charts */}
                            <div className="col-12 col-md-8 d-flex flex-column gap-4">
                                {/* Charts Row */}
                                <div className="row g-4 h-100">
                                    <div className="col-12 col-lg-6">
                                        <div className="card-custom h-100">
                                            <h6 className="fw-bold mb-3">{t('status_by_cat')}</h6>
                                            <div className="d-flex flex-column gap-3">
                                                {dashboardStats.category_stats && dashboardStats.category_stats.map(stat => {
                                                    const total = stat.total;
                                                    const percentage = total > 0 ? Math.round(stat.completed / total * 100) : 0;
                                                    return (
                                                        <div key={stat.name}>
                                                            <div className="d-flex justify-content-between small mb-1">
                                                                <span className="fw-bold">{stat.name}</span>
                                                                <span className="text-muted">{percentage}%</span>
                                                            </div>
                                                            <div className="progress" style={{ height: '8px', borderRadius: '4px', backgroundColor: '#f0f0f0' }}>
                                                                <div className="progress-bar bg-primary" style={{ width: `${percentage}%`, borderRadius: '4px' }}></div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                {(!dashboardStats.category_stats || dashboardStats.category_stats.length === 0) && (
                                                    <div className="text-center text-muted small py-3">{t('no_tasks')}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="card-custom h-100 d-flex flex-column justify-content-between">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <h6 className="fw-bold">{t('urgent_tasks')}</h6>
                                                <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2 py-1 small">High Priority</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-4 my-3">
                                                <SimplePieChart total={dashboardStats.total - dashboardStats.completed} value={dashboardStats.urgent} color="#dc3545" bg="#ffe6e6" />
                                                <div>
                                                    <div className="display-4 fw-bold text-dark">{dashboardStats.urgent}</div>
                                                    <div className="text-muted small">Tasks require attention</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* UPCOMING BIRTHDAYS */}
                                    <div className="col-12">
                                        <div className="card-custom">
                                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Gift size={18} className="text-info" /> {t('upcoming_birthdays')}</h6>
                                            <div className="d-flex flex-wrap gap-3">
                                                {processedBirthdays.length === 0 ? <div className="text-muted fst-italic small w-100">{t('no_upcoming_bday')}</div> :
                                                    processedBirthdays.slice(0, 4).map(bday => (
                                                        <div key={bday.id} className="d-flex align-items-center gap-2 bg-light rounded-pill pe-3 p-1 border">
                                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm text-info" style={{ width: '32px', height: '32px' }}><Gift size={14} /></div>
                                                            <div>
                                                                <div className="fw-bold text-dark small">{bday.name}</div>
                                                                <div className="text-muted extra-small" style={{ fontSize: '0.7rem' }}>{bday.day}/{bday.month} • {bday.diffDays === 0 ? t('today') : t('days_left', { days: bday.diffDays })}</div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : view === 'settings' ? (
                        <div className="row g-4">
                            <div className="col-12 col-lg-4">
                                <div className="card-custom h-100">
                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><List size={18} className="text-primary" /> {t('manage_cat')}</h6>
                                    <div className="input-group mb-3"><input type="text" className="form-control border-light bg-light" placeholder={t('placeholder_cat')} value={newCatName} onChange={e => setNewCatName(e.target.value)} /><button className="btn btn-primary" onClick={handleAddCategory}><Plus size={18} /></button></div>
                                    <ul className="list-group list-group-flush custom-scrollbar" style={{ maxHeight: '300px', overflowY: 'auto' }}>{categories.map((cat, idx) => (<li key={idx} className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center"><span className="fw-medium">{cat}</span><button className="btn btn-sm btn-light text-danger rounded-circle p-1" onClick={() => handleDeleteCategory(cat)}><Trash2 size={16} /></button></li>))}</ul>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4">
                                <div className="card-custom h-100">
                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><User size={18} className="text-success" /> {t('manage_owner')}</h6>
                                    <div className="input-group mb-3"><input type="text" className="form-control border-light bg-light" placeholder={t('placeholder_owner')} value={newOwnerName} onChange={e => setNewOwnerName(e.target.value)} /><button className="btn btn-primary" onClick={handleAddOwner}><Plus size={18} /></button></div>
                                    <ul className="list-group list-group-flush custom-scrollbar" style={{ maxHeight: '300px', overflowY: 'auto' }}>{owners.map((owner, idx) => (<li key={idx} className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center"><span className="fw-medium">{owner}</span><button className="btn btn-sm btn-light text-danger rounded-circle p-1" onClick={() => handleDeleteOwner(owner)}><Trash2 size={16} /></button></li>))}</ul>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4">
                                <div className="card-custom h-100">
                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Gift size={18} className="text-info" /> {t('manage_birthday')}</h6>
                                    <div className="d-flex flex-column gap-2 mb-3">
                                        <input type="text" className="form-control border-light bg-light" placeholder={t('placeholder_name')} value={newBdayName} onChange={e => setNewBdayName(e.target.value)} />
                                        <div className="d-flex gap-1">
                                            <input type="number" className="form-control border-light bg-light" placeholder={t('placeholder_day')} value={newBdayDay} onChange={e => setNewBdayDay(e.target.value)} style={{ width: '30%' }} />
                                            <input type="number" className="form-control border-light bg-light" placeholder={t('placeholder_month')} value={newBdayMonth} onChange={e => setNewBdayMonth(e.target.value)} style={{ width: '30%' }} />
                                            <input type="number" className="form-control border-light bg-light" placeholder={t('placeholder_year')} value={newBdayYear} onChange={e => setNewBdayYear(e.target.value)} style={{ width: '40%' }} />
                                        </div>
                                        <button className="btn btn-primary w-100 rounded-lg" onClick={handleAddBirthday}><Plus size={18} /> {t('add')}</button>
                                    </div>
                                    <ul className="list-group list-group-flush custom-scrollbar" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {birthdays.map((bday, idx) => (
                                            <li key={idx} className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                                                <div><div className="fw-bold small">{bday.name}</div><div className="text-muted extra-small">{bday.day}/{bday.month}</div></div>
                                                <button className="btn btn-sm btn-light text-danger rounded-circle p-1" onClick={() => handleDeleteBirthday(bday.id)}><Trash2 size={16} /></button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                    ) : view === 'calendar' ? (
                        <div className="h-100 card-custom p-0 overflow-hidden">
                            <CalendarView
                                tasks={tasks}
                                onEditTask={openEditModal}
                                onAddToday={openAddModal}
                                t={t}
                                lang={lang}
                                onDateChange={handleCalendarDateChange}
                            />
                        </div>
                    ) : (
                        <div className="card-custom d-flex flex-column p-0 overflow-hidden">
                            <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top">
                                <div className="d-flex align-items-center gap-3">
                                    <h5 className="mb-0 fw-bold">{t('task_list')}</h5>
                                    <button className={`btn btn-sm btn-light border rounded-pill px-3 ${showFilters ? 'bg-primary text-white border-primary' : ''}`} onClick={() => setShowFilters(!showFilters)}><Filter size={14} className="me-1" /> {t('filter')}</button>
                                    <button className={`btn btn-sm btn-light border rounded-pill px-3 ${showCompleted ? 'bg-success text-white border-success' : ''}`} onClick={() => setShowCompleted(!showCompleted)}>{showCompleted ? <Eye size={14} className="me-1" /> : <EyeOff size={14} className="me-1" />} {showCompleted ? 'Show Done' : 'Hide Done'}</button>
                                </div>
                            </div>
                            {showFilters && (
                                <div className="p-3 bg-light border-bottom">
                                    <div className="row g-3">
                                        <div className="col-md-6"><div className="small fw-bold text-muted mb-2">{t('lbl_cat')}</div><div className="d-flex flex-wrap gap-2">{categories.map(c => (<span key={c} onClick={() => toggleFilterCat(c)} className={`badge rounded-pill cursor-pointer px-3 py-2 ${filterCats.includes(c) ? 'bg-primary' : 'bg-white text-dark border'}`}>{c}</span>))}</div></div>
                                        <div className="col-md-6"><div className="small fw-bold text-muted mb-2">{t('lbl_owner')}</div><div className="d-flex flex-wrap gap-2">{owners.map(o => (<span key={o} onClick={() => toggleFilterOwner(o)} className={`badge rounded-pill cursor-pointer px-3 py-2 ${filterOwners.includes(o) ? 'bg-success' : 'bg-white text-dark border'}`}>{o}</span>))}</div></div>
                                    </div>
                                </div>
                            )}

                            <div className="flex-grow-1 overflow-auto custom-scrollbar">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light sticky-top">
                                        <tr>
                                            <th className="ps-4 py-3 text-muted text-uppercase small" onClick={() => requestSort('description')}>{t('col_task')}</th>
                                            <th className="py-3 text-muted text-uppercase small" onClick={() => requestSort('category_name')}>{t('col_cat')}</th>
                                            <th className="py-3 text-muted text-uppercase small" onClick={() => requestSort('owner_name')}>{t('col_owner')}</th>
                                            <th className="py-3 text-muted text-uppercase small" onClick={() => requestSort('priority')}>{t('col_prio')}</th>
                                            <th className="py-3 text-muted text-uppercase small" onClick={() => requestSort('status')}>{t('col_status')}</th>
                                            <th className="py-3 text-muted text-uppercase small" onClick={() => requestSort('due_date')}>{t('col_due')}</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map(task => (
                                            <tr key={task.id} className="cursor-pointer" onClick={() => openEditModal(task)}>
                                                <td className="ps-4">
                                                    <div className="fw-bold text-dark">{task.description}</div>
                                                    {task.is_urgent && <span className="badge bg-danger rounded-pill shadow-sm mt-1" style={{ fontSize: '0.65rem' }}>URGENT</span>}
                                                </td>
                                                <td><span className="badge bg-light text-dark border">{task.category_name}</span></td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '10px' }}>{task.owner_name.charAt(0)}</div>
                                                        <span className="small">{task.owner_name}</span>
                                                    </div>
                                                </td>
                                                <td><span className={`badge rounded-pill ${task.priority === 'High' ? 'bg-danger' : task.priority === 'Normal' ? 'bg-info text-dark' : 'bg-secondary'}`}>{task.priority}</span></td>
                                                <td><span className={`badge rounded-pill ${task.status === 'Completed' ? 'bg-success' : task.status === 'In Progress' ? 'bg-primary' : typeof task.status === 'undefined' ? 'bg-secondary' : 'bg-warning text-dark'}`}>{task.status}</span></td>
                                                <td><div className="small fw-bold text-muted">{task.due_date || '-'}</div></td>
                                                <td className="text-end pe-4"><button className="btn btn-sm btn-white text-danger border-0" onClick={(e) => handleDelete(e, task.id)}><Trash2 size={16} /></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* PAGINATION */}
                            {view !== 'calendar' && (
                                <div className="p-3 border-top bg-white d-flex justify-content-between align-items-center">
                                    <span className="text-muted small">Page {pagination.page} of {pagination.pages}</span>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-light border rounded-circle p-2" disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}><ChevronLeft size={16} /></button>
                                        <button className="btn btn-sm btn-light border rounded-circle p-2" disabled={pagination.page >= pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}><ChevronRight size={16} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel - Desktop (XL only) */}
            {
                view !== 'calendar' && (
                    <div className="d-none d-xl-block h-100 flex-shrink-0">
                        <RightPanel
                            t={t}
                            upcomingTasks={upcomingTasks}
                            processedBirthdays={processedBirthdays}
                            lang={lang}
                            openEditModal={openEditModal}
                        />
                    </div>
                )
            }

            {/* MODAL */}
            {showModal && (<><div className="modal-backdrop fade show" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}></div><div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, overflowY: 'auto' }}><div className="modal-dialog modal-xl modal-fullscreen-md-down modal-dialog-centered" role="document"><div className="modal-content shadow-lg border-0"><div className="modal-header py-3 bg-white border-bottom-0"><h5 className="modal-title fw-bold text-primary">{editingId ? t('modal_edit_title') : t('modal_add_title')}</h5><button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button></div><div className="modal-body p-3 p-md-4"><div className="row g-4"><div className="col-12 col-lg-5"><div className="mb-3"><label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_desc')}</label><input type="text" className="form-control form-control-lg border-light bg-light" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} autoFocus placeholder={t('ph_desc')} /></div><div className="row g-3 mb-3"><div className="col-6"><label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_cat')}</label><select className="form-select border-light bg-light" value={newTask.category_name} onChange={e => setNewTask({ ...newTask, category_name: e.target.value })}><option value="">{t('sel_cat')}</option>{categories.map((c, i) => <option key={i} value={c}>{c}</option>)}</select></div><div className="col-6"><label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_owner')}</label><select className="form-select border-light bg-light" value={newTask.owner_name} onChange={e => setNewTask({ ...newTask, owner_name: e.target.value })}><option value="">{t('sel_owner')}</option>{owners.map((o, i) => <option key={i} value={o}>{o}</option>)}</select></div></div><div className="row g-3 mb-3"><div className="col-6"><label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_prio')}</label><select className="form-select border-light bg-light" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}><option value="High">High</option> <option value="Normal">Normal</option> <option value="Low">Low</option></select></div><div className="col-6"><label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_status')}</label><select className="form-select border-light bg-light" value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}>{Object.keys(STATUS_BADGES).map(s => <option key={s} value={s}>{s}</option>)}</select></div></div><div className="mb-3"><label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_due')}</label><input type="date" className="form-control border-light bg-light" value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} /></div><div className="d-flex flex-column gap-2 p-3 bg-light rounded-3 border border-light"><div className="form-check form-switch"><input className="form-check-input" type="checkbox" id="chkImp" checked={newTask.is_important} onChange={e => setNewTask({ ...newTask, is_important: e.target.checked })} /> <label className="form-check-label fw-bold ms-2" htmlFor="chkImp">{t('chk_imp')}</label></div><div className="form-check form-switch"><input className="form-check-input" type="checkbox" id="chkUrg" checked={newTask.is_urgent} onChange={e => setNewTask({ ...newTask, is_urgent: e.target.checked })} /> <label className="form-check-label fw-bold ms-2" htmlFor="chkUrg">{t('chk_urg')}</label></div></div></div><div className="col-12 col-lg-7 d-flex flex-column"><label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_details')}</label><div className="flex-grow-1"><SimpleRichTextEditor initialValue={newTask.notes} onChange={(html) => setNewTask(prev => ({ ...prev, notes: html }))} /></div></div></div></div><div className="modal-footer py-3 border-top-0 bg-white sticky-bottom"><button className="btn btn-light px-4 text-secondary fw-bold" onClick={() => setShowModal(false)}>{t('cancel')}</button><button className="btn btn-primary px-4 fw-bold" onClick={handleSaveTask}>{editingId ? t('update') : t('save')}</button></div></div></div></div></>)}
        </div >
    );

}

function AuthScreen({ onLogin, t }) { const [isRegister, setIsRegister] = useState(false); const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [securityCode, setSecurityCode] = useState(''); const [error, setError] = useState(''); const [hasUsers, setHasUsers] = useState(true); useEffect(() => { const checkSystem = async () => { try { const res = await fetch(`${API_URL}/system/status`); if (res.ok) { const data = await res.json(); setHasUsers(data.has_users); } } catch (e) { } }; checkSystem(); }, []); const handleSubmit = async (e) => { e.preventDefault(); setError(''); if (isRegister && password !== confirmPassword) { setError(t('pass_mismatch')); return; } const endpoint = isRegister ? '/register' : '/token'; let body, headers; if (isRegister) { const payload = { username, password }; if (hasUsers) { if (!securityCode) { setError("Vui lòng nhập mã bảo mật"); return; } payload.security_code = securityCode; } body = JSON.stringify(payload); headers = { 'Content-Type': 'application/json' }; } else { const f = new URLSearchParams(); f.append('username', username); f.append('password', password); body = f; headers = { 'Content-Type': 'application/x-www-form-urlencoded' }; } try { const res = await fetch(`${API_URL}${endpoint}`, { method: 'POST', headers, body }); const data = await res.json(); if (!res.ok) throw new Error(data.detail || 'Lỗi'); if (data.access_token) onLogin(data.access_token, data.is_admin); } catch (err) { setError(err.message === 'Failed to fetch' ? t('auth_error') : err.message); } }; return (<div className="auth-container"><div className="auth-box"><div className="text-center mb-4"><div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px' }}><Lock size={30} /></div><h3 className="fw-bold">{isRegister ? t('register') : t('login')}</h3><p className="text-muted">{t('app_name')} {APP_VERSION}</p></div>{error && <div className="alert alert-danger">{error}</div>}<form onSubmit={handleSubmit}><div className="mb-3"><label className="form-label fw-bold">{t('username')}</label><input type="text" className="form-control" required value={username} onChange={e => setUsername(e.target.value)} /></div><div className="mb-3"><label className="form-label fw-bold">{t('password')}</label><input type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} /></div>{isRegister && (<div className="mb-3"><label className="form-label fw-bold">{t('confirm_password')}</label><div className="input-group"><span className="input-group-text bg-white"><CheckCheck size={18} /></span><input type="password" className={`form-control ${confirmPassword && password !== confirmPassword ? 'is-invalid' : ''}`} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={t('confirm_password')} />{confirmPassword && password !== confirmPassword && (<div className="invalid-feedback">{t('pass_mismatch')}</div>)}</div></div>)}{isRegister && hasUsers && (<div className="mb-4"><label className="form-label fw-bold">{t('security_code')}</label><div className="input-group"><span className="input-group-text bg-white"><Key size={18} /></span><input type="text" className="form-control" required value={securityCode} onChange={e => setSecurityCode(e.target.value)} placeholder="Nhập mã được cấp..." /></div><div className="form-text text-muted small fst-italic">Liên hệ Admin để nhận mã kích hoạt.</div></div>)}<button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3">{isRegister ? t('register') : t('login')}</button></form><div className="text-center border-top pt-3"><button className="btn btn-link text-decoration-none" onClick={() => setIsRegister(!isRegister)}>{isRegister ? t('have_account') : t('no_account')}</button></div></div></div>); }
function KpiCard({ title, value, sub, icon, bg, bgImage }) {
    const bgVar = `var(--${bg || 'bg-secondary'})`;
    // Force darker text contrast if image is present, or use default
    const textVar = bgImage ? '#333' : `var(--${bg}-text)`;

    // Override padding to 0 to allow full-bleed background, then add inner padding
    const cardStyle = {
        backgroundColor: bgVar,
        color: textVar || 'inherit',
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 0,
    };

    return (
        <div className="col-12 col-sm-6 col-md-3">
            <div className="card-custom h-100 position-relative overflow-hidden" style={cardStyle}>
                {bgImage && (
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', zIndex: 0 }}></div>
                )}

                {/* Inner Content Wrapper with Padding */}
                <div className="d-flex flex-row align-items-center justify-content-between h-100 w-100 position-relative z-1" style={{ padding: '24px' }}>
                    <div>
                        <div className="text-uppercase fw-bold small mb-1" style={{ letterSpacing: '0.5px' }}>{title}</div>
                        <div className="display-6 fw-bold mb-1">{value}</div>
                        {sub && <div className="small fw-medium">{sub}</div>}
                    </div>
                    <div className="opacity-75" style={{ transform: 'scale(1.5)' }}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SimplePieChart({ total, value, color, bg }) { const percentage = total > 0 ? (value / total) * 100 : 0; return (<div className="pie-chart rounded-circle position-relative d-flex align-items-center justify-content-center" style={{ background: `conic-gradient(${color} 0% ${percentage}%, ${bg} ${percentage}% 100%)`, width: '80px', height: '80px' }}><div className="bg-white rounded-circle position-absolute" style={{ width: '60%', height: '60%' }}></div><span className="position-relative fw-bold small">{Math.round(percentage)}%</span></div>); }