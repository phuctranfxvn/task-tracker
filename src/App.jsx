import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, Trash2, BarChart2, List, 
  CheckCircle, AlertTriangle, Clock, 
  Briefcase, RefreshCw, WifiOff, LayoutDashboard, Menu,
  Zap, Star, PieChart, Edit, Settings, X, User, Calendar, LogOut, Lock, ArrowRight,
  Eye, EyeOff, Filter, XCircle, Globe, Bold, Italic, Underline, List as ListIcon,
  ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Shield, Key, CheckCheck
} from 'lucide-react';

// --- CẤU HÌNH ---
let API_URL = "http://localhost:8000";
const APP_VERSION = "v3.0.2"; // Updated version

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
        "no_upcoming": "No upcoming deadlines.",
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
        "manage_security": "Manage Security Codes",
        "placeholder_cat": "Category name...",
        "placeholder_owner": "Owner name...",
        "placeholder_code": "Enter new code...",
        "empty_cat": "No categories yet",
        "empty_owner": "No owners yet",
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
        "weekdays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "month_names": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        "code_col_code": "Code",
        "code_col_user": "Registered User",
        "status_used": "Used",
        "status_unused": "Available",
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
        "no_upcoming": "Không có công việc sắp đến hạn.",
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
        "manage_security": "Quản lý Mã bảo mật",
        "placeholder_cat": "Tên danh mục...",
        "placeholder_owner": "Tên nhân sự...",
        "placeholder_code": "Nhập mã mới...",
        "empty_cat": "Chưa có danh mục",
        "empty_owner": "Chưa có nhân sự",
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
        "weekdays": ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
        "month_names": ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
        "code_col_code": "Mã bảo mật",
        "code_col_user": "Tài khoản đăng ký",
        "status_used": "Đã dùng",
        "status_unused": "Chưa dùng",
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
    today.setHours(0,0,0,0);
    const due = new Date(dueDate);
    due.setHours(0,0,0,0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return <span className="text-danger fw-bold">{t('overdue_days', {days: Math.abs(diffDays)})}</span>;
    if (diffDays === 0) return <span className="text-danger fw-bold">{t('today')}</span>;
    if (diffDays === 1) return <span className="text-warning fw-bold text-dark">{t('tomorrow')}</span>;
    return <span className={diffDays <= 7 ? "text-danger fw-bold" : "text-muted"}>{t('days_remaining', {days: diffDays})}</span>;
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
    const exec = (cmd) => { document.execCommand(cmd, false, null); if(contentRef.current) contentRef.current.focus(); };
    return (
        <div className="border rounded bg-white overflow-hidden d-flex flex-column" style={{height: '250px'}}>
            <div className="bg-light border-bottom p-2 d-flex gap-2 align-items-center">
                <button type="button" className="btn btn-sm btn-light border" onClick={(e) => {e.preventDefault(); exec('bold');}} title="Bold"><Bold size={16}/></button>
                <button type="button" className="btn btn-sm btn-light border" onClick={(e) => {e.preventDefault(); exec('italic');}} title="Italic"><Italic size={16}/></button>
                <button type="button" className="btn btn-sm btn-light border" onClick={(e) => {e.preventDefault(); exec('underline');}} title="Underline"><Underline size={16}/></button>
                <div className="vr mx-1"></div>
                <button type="button" className="btn btn-sm btn-light border" onClick={(e) => {e.preventDefault(); exec('insertUnorderedList');}} title="List"><ListIcon size={16}/></button>
            </div>
            <div ref={contentRef} className="flex-grow-1 p-3 custom-scrollbar" style={{outline: 'none', overflowY: 'auto'}} contentEditable={true} onInput={handleInput} />
        </div>
    );
};

// --- CALENDAR COMPONENT ---
const CalendarView = ({ tasks, onEditTask, onAddToday, t, lang }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    
    // Logic: Thứ 2 = 0, CN = 6
    const getFirstDayOfMonthMonStart = (year, month) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = getFirstDayOfMonthMonStart(year, month);

    const totalSlots = startDay + totalDays;
    const numRows = Math.ceil(totalSlots / 7);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // const monthValue = `${year}-${String(month + 1).padStart(2, '0')}`; // Removed used for input
    const weekDays = PO_FILES[lang]?.weekdays || PO_FILES['en'].weekdays;
    const monthNames = PO_FILES[lang]?.month_names || PO_FILES['en'].month_names;

    // Generate Calendar Cells
    const cells = [];
    
    // 1. Ô trống đầu tháng
    for (let i = 0; i < startDay; i++) {
        cells.push(<div key={`empty-${i}`} className="border-end border-bottom bg-light bg-opacity-10"></div>);
    }
    
    // 2. Ô ngày trong tháng
    for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // FILTER: Ẩn task đã hoàn thành (Completed)
        const dayTasks = tasks.filter(t => t.due_date === dateStr && t.status !== 'Completed');
        const isToday = new Date().toISOString().split('T')[0] === dateStr;

        cells.push(
            <div key={day} 
                 className={`border-end border-bottom p-1 sm:p-2 d-flex flex-column gap-1 position-relative transition-hover ${isToday ? '' : 'bg-white'}`} 
                 style={{
                     overflow: 'hidden', 
                     cursor: 'pointer',
                     backgroundColor: isToday ? '#e3f2fd' : '#fff' // Màu xanh nhạt (Light Blue) cho ngày hôm nay
                 }} 
                 onDoubleClick={() => onAddToday(dateStr)}
                 title="Double click to add task"
            >
                <div className="d-flex justify-content-between align-items-start">
                    <span className={`fw-bold small d-flex align-items-center justify-content-center ${isToday ? 'bg-primary text-white shadow-sm rounded-circle' : 'text-secondary'}`} 
                          style={{width: '24px', height: '24px'}}>
                        {day}
                    </span>
                    {dayTasks.length > 0 && <span className="badge bg-light text-secondary border rounded-pill d-none d-sm-inline-block" style={{fontSize: '0.6rem'}}>{dayTasks.length}</span>}
                </div>
                
                <div className="d-flex flex-column gap-1 mt-1 overflow-hidden">
                    {dayTasks.map((task, idx) => {
                        if (idx > 3) return null; 
                        
                        let bgClass = 'bg-light text-dark border'; 
                        if (task.priority === 'High') bgClass = 'bg-danger text-white border-danger';
                        else if (task.priority === 'Normal') bgClass = 'bg-primary text-white border-primary';
                        else if (task.priority === 'Low') bgClass = 'bg-secondary text-white border-secondary';
                        
                        return (
                            <div key={task.id} 
                                 className={`badge ${bgClass} text-truncate cursor-pointer shadow-sm rounded px-1 py-1`} 
                                 style={{
                                    maxWidth: '100%', 
                                    textAlign: 'left', 
                                    fontWeight: '500',
                                 }}
                                 onClick={(e) => { e.stopPropagation(); onEditTask(task); }}
                                 title={`${task.description} (${task.priority})`}
                            >
                                <span style={{fontSize: '0.7rem'}} className="d-block text-truncate">{task.description}</span>
                            </div>
                        );
                    })}
                    {dayTasks.length > 4 && (
                        <div className="text-center text-primary small fw-bold mt-1" style={{fontSize: '0.65rem'}}>
                            +{dayTasks.length - 4}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 3. Ô trống cuối tháng
    const remainingSlots = (numRows * 7) - totalSlots;
    for (let i = 0; i < remainingSlots; i++) {
        cells.push(<div key={`empty-end-${i}`} className="border-end border-bottom bg-light bg-opacity-10"></div>);
    }

    return (
        <div className="card shadow-sm border-0 h-100 d-flex flex-column">
            {/* Header Responsive: Flex column on mobile, row on desktop */}
            <div className="card-header bg-white py-3 border-bottom d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-light btn-sm border rounded-circle p-2" onClick={prevMonth}><ChevronLeft size={18}/></button>
                    <h5 className="mb-0 fw-bold text-dark text-capitalize text-center" style={{minWidth: '160px'}}>
                        {monthNames[month]} <span className="fw-light text-muted">{year}</span>
                    </h5>
                    <button className="btn btn-light btn-sm border rounded-circle p-2" onClick={nextMonth}><ChevronRight size={18}/></button>
                </div>
                {/* Ẩn input chọn tháng/năm theo yêu cầu */}
                <div className="d-flex gap-2 w-100 w-sm-auto justify-content-center">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => setCurrentDate(new Date())}>{t('today')}</button>
                </div>
            </div>
            
            <div className="flex-grow-1 d-flex flex-column overflow-hidden bg-white">
                {/* Header Weekdays */}
                <div className="d-grid border-bottom border-start bg-light" style={{gridTemplateColumns: 'repeat(7, 1fr)'}}>
                    {weekDays.map((d, i) => (
                        <div key={i} className={`py-2 text-center text-uppercase fw-bold small border-end ${i >= 5 ? 'text-danger' : 'text-secondary'}`} style={{fontSize: '0.75rem'}}>{d}</div>
                    ))}
                </div>
                {/* Calendar Grid */}
                <div className="flex-grow-1 d-grid border-start border-top" style={{
                    gridTemplateColumns: 'repeat(7, 1fr)', 
                    gridTemplateRows: `repeat(${numRows}, 1fr)`, 
                }}>
                    {cells}
                </div>
            </div>
        </div>
    );
};

// --- MOCK DATA ---
const today = new Date();
const addDays = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

const MOCK_CATEGORIES = ['Finance', 'Marketing', 'HR', 'Legal', 'Admin', 'IT'];
const MOCK_OWNERS = ['Me', 'John', 'Alice', 'Bob', 'Sarah'];
const MOCK_TASKS = [
  { id: 1, description: 'Prepare Q4 Financial Report', notes: '<b>Requirements:</b><ul><li>Include P&L sheet</li><li>Review budget variance</li></ul>', category_name: 'Finance', owner_name: 'John', priority: 'High', status: 'In Progress', due_date: addDays(2), is_urgent: true, is_important: true, created_at: '2023-11-20T08:30:00' },
  { id: 2, description: 'Design Ad Banners', notes: 'Use brand colors #FF5733', category_name: 'Marketing', owner_name: 'Alice', priority: 'Normal', status: 'Not Started', due_date: addDays(5), is_urgent: false, is_important: true, created_at: '2023-11-21T09:00:00' },
  { id: 3, description: 'Recruit new developer', notes: '', category_name: 'HR', owner_name: 'Bob', priority: 'High', status: 'On Hold', due_date: addDays(10), is_urgent: true, is_important: false, created_at: '2023-11-22T10:15:00' },
  { id: 4, description: 'Weekly Team Meeting', notes: '', category_name: 'Admin', owner_name: 'Me', priority: 'Low', status: 'Completed', due_date: addDays(-1), is_urgent: false, is_important: false, created_at: '2023-11-23T14:20:00' },
];

const BootstrapLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const font = document.createElement("link");
    font.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    font.rel = "stylesheet";
    document.head.appendChild(font);
    const style = document.createElement("style");
    style.innerHTML = `
      html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden; font-size: 15px; }
      .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #ced4da; border-radius: 3px; }
      .card-header-excel { background-color: #f8f9fa; border-bottom: 1px solid #dee2e6; font-weight: 700; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px; color: #555; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.5rem; }
      .pie-chart { width: 100px; height: 100px; border-radius: 50%; }
      .table-custom th { padding-top: 14px; padding-bottom: 14px; font-size: 0.85rem; text-transform: uppercase; color: #6c757d; background-color: #f8f9fa; border-bottom: 2px solid #dee2e6; }
      .table-custom td { padding-top: 16px; padding-bottom: 16px; vertical-align: middle; border-bottom: 1px solid #f0f0f0; }
      .table-custom tr { transition: background-color 0.2s; }
      .table-custom tr:hover td { background-color: #f1f3f5; cursor: pointer; }
      .auth-container { display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f0f2f5; position: fixed; top: 0; left: 0; width: 100%; z-index: 9999; }
      .auth-box { width: 100%; max-width: 400px; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
      .filter-badge { cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
      .filter-badge.active { border-color: currentColor; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .filter-badge:hover { opacity: 0.8; }
      .legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; }
      .lang-flag { transition: all 0.2s; border-radius: 2px; }
      .lang-flag:hover { transform: scale(1.1); }
      .cursor-pointer { cursor: pointer; }
      .sort-icon { display: inline-block; margin-left: 4px; opacity: 0.5; }
      .th-hover:hover { background-color: #e9ecef; }
      .transition-hover:hover { background-color: #f8f9fa; }
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
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('is_admin') === 'true'); // State cho admin
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [owners, setOwners] = useState([]);
  const [securityCodes, setSecurityCodes] = useState([]); // State cho mã bảo mật
  const [view, setView] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [showCompleted, setShowCompleted] = useState(false);
  const [filterCats, setFilterCats] = useState([]); 
  const [filterOwners, setFilterOwners] = useState([]); 
  const [showFilters, setShowFilters] = useState(false);
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const [newTask, setNewTask] = useState({ 
    description: '', notes: '', category_name: '', owner_name: '', priority: 'Normal', status: 'Not Started', due_date: '', is_important: false, is_urgent: false
  });
  const [newCatName, setNewCatName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newSecurityCode, setNewSecurityCode] = useState(''); // State form nhập mã mới

  // --- HANDLE ESC KEY TO CLOSE MODAL ---
  useEffect(() => {
    const handleEsc = (event) => {
        if (event.key === 'Escape') {
            setShowModal(false);
        }
    };

    if (showModal) {
        window.addEventListener('keydown', handleEsc);
    }

    return () => {
        window.removeEventListener('keydown', handleEsc);
    };
  }, [showModal]);

  const authFetch = async (endpoint, options = {}) => {
    if (isDemoMode) throw new Error("Demo Mode");
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
      setIsDemoMode(false); 
      setTasks([]); 
  };

  const fetchData = async () => {
    if (!token && !isDemoMode) return;
    setLoading(true);
    try {
      const resTasks = await authFetch('/tasks');
      if(resTasks.ok) setTasks(await resTasks.json());
      
      const resConfig = await authFetch('/config');
      if(resConfig.ok) {
        const config = await resConfig.json();
        setCategories(config.categories);
        setOwners(config.owners);
        if(config.categories.length) setNewTask(p => ({...p, category_name: config.categories[0]}));
        if(config.owners.length) setNewTask(p => ({...p, owner_name: config.owners[0]}));
      }

      // Fetch Security Codes if Admin
      if (isAdmin) {
          const resCodes = await authFetch('/config/security-codes');
          if (resCodes.ok) setSecurityCodes(await resCodes.json());
      }

    } catch (err) {
      if (isDemoMode || err.message === "Demo Mode" || err.message.includes("Failed to fetch")) {
          if (!isDemoMode) setIsDemoMode(true);
          setTasks(MOCK_TASKS);
          setCategories(MOCK_CATEGORIES);
          setOwners(MOCK_OWNERS);
          setNewTask(p => ({...p, category_name: MOCK_CATEGORIES[0], owner_name: MOCK_OWNERS[0]}));
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { if(token || isDemoMode) fetchData(); }, [token, isDemoMode, isAdmin]);

  const processedTasks = useMemo(() => {
    let data = [...tasks];
    
    if (!showCompleted) data = data.filter(t => t.status !== 'Completed');
    if (filterCats.length > 0) data = data.filter(t => filterCats.includes(t.category_name));
    if (filterOwners.length > 0) data = data.filter(t => filterOwners.includes(t.owner_name));

    if (sortConfig.key) {
        data.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'priority') {
                const order = { 'High': 3, 'Normal': 2, 'Low': 1 };
                aValue = order[a.priority] || 0;
                bValue = order[b.priority] || 0;
            } 
            else if (sortConfig.key === 'status') {
                const order = { 'In Progress': 2, 'Not Started': 1, 'On Hold': 3, 'Completed': 4 };
                aValue = order[a.status] || 0;
                bValue = order[b.status] || 0;
            }
            else if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
    } else {
        const statusOrder = { 'In Progress': 1, 'Not Started': 2, 'On Hold': 3, 'Completed': 4 };
        data.sort((a, b) => {
            const scoreA = statusOrder[a.status] || 99;
            const scoreB = statusOrder[b.status] || 99;
            if (scoreA !== scoreB) return scoreA - scoreB;
            if (a.due_date && b.due_date) return new Date(a.due_date) - new Date(b.due_date);
            if (a.due_date && !b.due_date) return -1;
            if (!a.due_date && b.due_date) return 1;
            return 0;
        });
    }
    
    return data;
  }, [tasks, showCompleted, filterCats, filterOwners, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
      if (sortConfig.key !== key) return null;
      return sortConfig.direction === 'ascending' ? <ArrowUp size={14} className="sort-icon text-primary"/> : <ArrowDown size={14} className="sort-icon text-primary"/>;
  };

  const toggleFilterCat = (cat) => setFilterCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  const toggleFilterOwner = (owner) => setFilterOwners(prev => prev.includes(owner) ? prev.filter(o => o !== owner) : [...prev, owner]);
  const clearFilters = () => { setFilterCats([]); setFilterOwners([]); };

  const handleSaveTask = async () => {
    if(!newTask.description) return alert(t('alert_desc_req'));
    const payload = { ...newTask, due_date: newTask.due_date === '' ? null : newTask.due_date };
    if (isDemoMode) { 
        if (editingId) setTasks(tasks.map(t => t.id === editingId ? { ...payload, id: editingId, created_at: t.created_at } : t));
        else setTasks([{ ...payload, id: Date.now(), created_at: new Date().toISOString() }, ...tasks]); 
    } else {
      try { 
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/tasks/${editingId}` : `/tasks`;
        await authFetch(url, { method, body: JSON.stringify(payload) });
        fetchData();
      } catch (err) { alert(t('error_server')); }
    }
    setShowModal(false);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(!confirm(t('confirm_delete'))) return;
    if (isDemoMode) setTasks(tasks.filter(t => t.id !== id));
    else { await authFetch(`/tasks/${id}`, { method: 'DELETE' }); fetchData(); }
  };

  const handleAddCategory = async () => { if(!newCatName.trim()) return; if(isDemoMode) setCategories([...categories, newCatName]); else { try { await authFetch(`/config/categories`, { method: 'POST', body: JSON.stringify({ name: newCatName }) }); fetchData(); } catch(e) {} } setNewCatName(''); };
  const handleDeleteCategory = async (catName) => { if(!confirm(t('confirm_delete'))) return; if(isDemoMode) setCategories(categories.filter(c => c !== catName)); else { try { await authFetch(`/config/categories/${encodeURIComponent(catName)}`, { method: 'DELETE' }); fetchData(); } catch(e) {} } };
  const handleAddOwner = async () => { if(!newOwnerName.trim()) return; if(isDemoMode) setOwners([...owners, newOwnerName]); else { try { await authFetch(`/config/owners`, { method: 'POST', body: JSON.stringify({ name: newOwnerName }) }); fetchData(); } catch(e) {} } setNewOwnerName(''); };
  const handleDeleteOwner = async (ownerName) => { if(!confirm(t('confirm_delete'))) return; if(isDemoMode) setOwners(owners.filter(o => o !== ownerName)); else { try { await authFetch(`/config/owners/${encodeURIComponent(ownerName)}`, { method: 'DELETE' }); fetchData(); } catch(e) {} } };

  // --- SECURITY CODE HANDLERS ---
  const handleAddSecurityCode = async () => {
      if (!newSecurityCode.trim()) return;
      try {
          await authFetch(`/config/security-codes`, { method: 'POST', body: JSON.stringify({ code: newSecurityCode }) });
          fetchData(); // Refresh list
          setNewSecurityCode('');
      } catch (e) { alert("Code Exists or Error"); }
  };

  const handleDeleteSecurityCode = async (code) => {
      if (!confirm("Delete?")) return;
      try {
          await authFetch(`/config/security-codes/${encodeURIComponent(code)}`, { method: 'DELETE' });
          fetchData();
      } catch (e) { alert("Error"); }
  };

  const openAddModal = (initialDate = '') => { 
      setEditingId(null); 
      setNewTask({ 
          description: '', 
          notes: '', 
          category_name: categories[0] || '', 
          owner_name: owners[0] || '', 
          priority: 'Normal', 
          status: 'Not Started', 
          due_date: initialDate, 
          is_important: false, 
          is_urgent: false 
      }); 
      setShowModal(true); 
  };
  
  const openEditModal = (task) => { 
      setEditingId(task.id); 
      setNewTask({ 
          description: task.description, 
          notes: task.notes || '', 
          category_name: task.category_name, 
          owner_name: task.owner_name, 
          priority: task.priority, 
          status: task.status, 
          due_date: task.due_date || '', 
          is_important: task.is_important, 
          is_urgent: task.is_urgent 
      }); 
      setShowModal(true); 
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    const overdue = tasks.filter(t => t.status !== 'Completed' && t.due_date && new Date(t.due_date) < new Date().setHours(0,0,0,0)).length;
    const urgent = tasks.filter(t => t.is_urgent && t.status !== 'Completed').length;
    const important = tasks.filter(t => t.is_important && t.status !== 'Completed').length;
    const upcomingTasks = tasks.filter(t => t.status !== 'Completed' && t.due_date).sort((a,b) => new Date(a.due_date) - new Date(b.due_date));
    return { total, completed, pending, overdue, upcomingTasks, urgent, important };
  }, [tasks]);

  if (!token && !isDemoMode) {
      return (<> <BootstrapLoader /> <AuthScreen onLogin={(t, isAdmin) => { 
          localStorage.setItem('access_token', t); 
          localStorage.setItem('is_admin', isAdmin); 
          setToken(t); 
          setIsAdmin(isAdmin);
      }} onDemo={() => setIsDemoMode(true)} t={t} /> </>);
  }

  return (
    <div className="d-flex flex-column w-100 h-100 bg-light font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      <BootstrapLoader />
      
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm flex-shrink-0 w-100 px-3 py-2">
        <div className="container-fluid p-0">
          <a className="navbar-brand d-flex align-items-center gap-2 fw-bold" href="#">
            <LayoutDashboard size={22} className="text-success"/> 
            <span style={{fontSize: '1.2rem'}}>{t('app_name')} {APP_VERSION}</span>
          </a>
          <div className="d-flex gap-2 align-items-center">
             {isDemoMode && <span className="text-warning small d-none d-md-flex align-items-center me-2 border border-warning px-2 rounded"><WifiOff size={14} className="me-1"/> {t('demo_mode')}</span>}
            
            <div className="btn-group">
                <button className={`btn btn-sm px-3 ${view === 'dashboard' ? 'btn-primary' : 'btn-outline-secondary text-white'}`} onClick={() => setView('dashboard')}><BarChart2 size={18} className="me-1"/> {t('dashboard')}</button>
                <button className={`btn btn-sm px-3 ${view === 'list' ? 'btn-primary' : 'btn-outline-secondary text-white'}`} onClick={() => setView('list')}><List size={18} className="me-1"/> {t('list')}</button>
                <button className={`btn btn-sm px-3 ${view === 'calendar' ? 'btn-primary' : 'btn-outline-secondary text-white'}`} onClick={() => setView('calendar')}><Calendar size={18} className="me-1"/> {t('calendar')}</button>
                <button className={`btn btn-sm px-3 ${view === 'settings' ? 'btn-primary' : 'btn-outline-secondary text-white'}`} onClick={() => setView('settings')}><Settings size={18} className="me-1"/> {t('settings')}</button>
            </div>
            
            <button className="btn btn-success btn-sm d-flex align-items-center gap-1 ms-2 px-3 py-1" onClick={() => openAddModal()}><Plus size={18} /> <span style={{fontSize: '0.9rem'}}>{t('add')}</span></button>

            <div className="d-flex align-items-center gap-2 mx-2">
                <img src="https://flagcdn.com/28x21/gb.png" alt="English" className={`lang-flag cursor-pointer ${lang === 'en' ? 'opacity-100 border border-light' : 'opacity-50'}`} style={{width: '26px', height: '19px', filter: lang === 'en' ? 'none' : 'grayscale(100%)', cursor: 'pointer'}} onClick={() => setLang('en')} title="English"/>
                <img src="https://flagcdn.com/28x21/vn.png" alt="Tiếng Việt" className={`lang-flag cursor-pointer ${lang === 'vi' ? 'opacity-100 border border-light' : 'opacity-50'}`} style={{width: '26px', height: '19px', filter: lang === 'vi' ? 'none' : 'grayscale(100%)', cursor: 'pointer'}} onClick={() => setLang('vi')} title="Tiếng Việt"/>
            </div>

            <button className="btn btn-outline-danger btn-sm ms-2" onClick={logout} title={t('logout')}><LogOut size={18}/></button>
          </div>
        </div>
      </nav>

      <div className="flex-grow-1 w-100 overflow-hidden position-relative">
        <div className="position-absolute top-0 start-0 w-100 h-100 overflow-auto custom-scrollbar p-3">
            {/* KPI CARDS */}
            {view !== 'settings' && view !== 'calendar' && (
              <div className="row g-3 mb-4">
                  <KpiCard title={t('total_tasks')} value={stats.total} icon={<Briefcase size={22}/>} color="primary" />
                  <KpiCard title={t('completed')} value={stats.completed} sub={`(${stats.total > 0 ? Math.round(stats.completed/stats.total*100) : 0}%)`} icon={<CheckCircle size={22}/>} color="success" />
                  <KpiCard title={t('pending')} value={stats.pending} icon={<Clock size={22}/>} color="warning" />
                  <KpiCard title={t('overdue')} value={stats.overdue} icon={<AlertTriangle size={22}/>} color="danger" />
              </div>
            )}

            {view === 'dashboard' ? (
                // --- DASHBOARD VIEW ---
                <div className="row g-4 h-md-100 pb-3">
                    <div className="col-12 col-xl-4 d-flex flex-column">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header-excel text-danger"><Clock size={16}/> {t('upcoming_tasks')}</div>
                            <div className="list-group list-group-flush overflow-auto custom-scrollbar" style={{maxHeight: '600px'}}>
                                {stats.upcomingTasks.length === 0 ? <div className="p-4 text-center text-muted fst-italic small">{t('no_upcoming')}</div> : 
                                    stats.upcomingTasks.map((task, index) => (
                                        <div key={task.id} className="list-group-item px-3 py-3 border-bottom d-flex align-items-center gap-2 cursor-pointer hover-bg-light" onClick={() => openEditModal(task)}>
                                            <span className="badge bg-light text-secondary border rounded-circle p-0 d-flex align-items-center justify-content-center" style={{width:'24px', height:'24px', fontSize:'12px'}}>{index+1}</span>
                                            <div className="flex-grow-1" style={{minWidth: 0}}>
                                                <div className="fw-bold text-dark text-truncate" style={{fontSize: '0.95rem'}} title={task.description}>{task.description}</div>
                                                <div className="text-muted" style={{fontSize: '0.85rem'}}><span className="fw-bold">{task.category_name}</span> • {task.owner_name}</div>
                                            </div>
                                            <div className="text-end flex-shrink-0"><div className="small mb-1">{getDaysRemaining(task.due_date, t)}</div><div className="text-muted small">{formatDateTime(task.due_date, lang).split(' ')[0]}</div></div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    {/* ... Charts ... */}
                    <div className="col-12 col-md-6 col-xl-4 d-flex flex-column gap-3">
                         <div className="card shadow-sm border-0 flex-fill">
                            <div className="card-header-excel">📊 {t('status_by_cat')}</div>
                            <div className="card-body overflow-auto custom-scrollbar" style={{maxHeight: '350px'}}>
                                <div className="d-flex flex-wrap gap-3 mb-3 small text-muted">
                                    <div className="d-flex align-items-center"><span className="legend-dot bg-success"></span> {t('legend_done')}</div>
                                    <div className="d-flex align-items-center"><span className="legend-dot bg-primary"></span> {t('legend_wip')}</div>
                                    <div className="d-flex align-items-center"><span className="legend-dot bg-warning"></span> {t('legend_hold')}</div>
                                    <div className="d-flex align-items-center"><span className="legend-dot bg-secondary"></span> {t('legend_new')}</div>
                                </div>
                                {categories.map(cat => {
                                    const ts = tasks.filter(t => t.category_name === cat); if(!ts.length) return null;
                                    const total = ts.length; const c = { done: ts.filter(t => t.status === 'Completed').length, wip: ts.filter(t => t.status === 'In Progress').length, hold: ts.filter(t => t.status === 'On Hold').length, new: ts.filter(t => t.status === 'Not Started').length };
                                    return (<div key={cat} className="mb-3"><div className="d-flex justify-content-between text-sm mb-1"><span className="fw-bold text-dark">{cat}</span> <span className="text-muted">{total}</span></div><div className="progress" style={{height: '10px'}}><div className="progress-bar bg-success" style={{width: `${c.done/total*100}%`}}></div><div className="progress-bar bg-primary" style={{width: `${c.wip/total*100}%`}}></div><div className="progress-bar bg-warning" style={{width: `${c.hold/total*100}%`}}></div><div className="progress-bar bg-secondary" style={{width: `${c.new/total*100}%`}}></div></div></div>)
                                })}
                            </div>
                        </div>
                        <div className="card shadow-sm border-0"><div className="card-header-excel text-danger">⚡ {t('urgent_tasks')}</div><div className="card-body d-flex align-items-center justify-content-between px-4 py-3"><SimplePieChart total={stats.total - stats.completed} value={stats.urgent} color="#dc3545" bg="#e9ecef"/><div className="text-end"><div className="display-6 fw-bold text-danger">{stats.urgent}</div><div className="text-muted" style={{fontSize: '0.9rem'}}>{t('urgent_desc')}</div></div></div></div>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4 d-flex flex-column gap-3">
                         <div className="card shadow-sm border-0 flex-fill">
                            <div className="card-header-excel">🔥 {t('priority_by_cat')}</div>
                            <div className="card-body overflow-auto custom-scrollbar" style={{maxHeight: '350px'}}>
                                <div className="d-flex flex-wrap gap-3 mb-3 small text-muted">
                                    <div className="d-flex align-items-center"><span className="legend-dot bg-danger"></span> {t('legend_high')}</div>
                                    <div className="d-flex align-items-center"><span className="legend-dot bg-info"></span> {t('legend_med')}</div>
                                    <div className="d-flex align-items-center"><span className="legend-dot bg-light border"></span> {t('legend_low')}</div>
                                </div>
                                {categories.map(cat => {
                                    const ts = tasks.filter(t => t.category_name === cat); if(!ts.length) return null;
                                    const total = ts.length; const p = { high: ts.filter(t => t.priority === 'High').length, norm: ts.filter(t => t.priority === 'Normal').length, low: ts.filter(t => t.priority === 'Low').length };
                                    return (<div key={cat} className="mb-3"><div className="d-flex justify-content-between text-sm mb-1"><span className="fw-bold text-dark">{cat}</span> <span className="text-muted">{total}</span></div><div className="progress" style={{height: '10px'}}><div className="progress-bar bg-danger" style={{width: `${p.high/total*100}%`}}></div><div className="progress-bar bg-info text-dark" style={{width: `${p.norm/total*100}%`}}></div><div className="progress-bar bg-light text-dark border" style={{width: `${p.low/total*100}%`}}></div></div></div>)
                                })}
                            </div>
                        </div>
                         <div className="card shadow-sm border-0"><div className="card-header-excel text-warning">⭐ {t('important_tasks')}</div><div className="card-body d-flex align-items-center justify-content-between px-4 py-3"><SimplePieChart total={stats.total - stats.completed} value={stats.important} color="#ffc107" bg="#e9ecef"/><div className="text-end"><div className="display-6 fw-bold text-warning-emphasis">{stats.important}</div><div className="text-muted" style={{fontSize: '0.9rem'}}>{t('important_desc')}</div></div></div></div>
                    </div>
                </div>
            ) : view === 'settings' ? (
                // --- SETTINGS VIEW ---
                <div className="row g-4">
                    <div className="col-12 col-md-6">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header-excel text-primary"><List size={16}/> {t('manage_cat')}</div>
                            <div className="card-body"><div className="input-group mb-3"><input type="text" className="form-control" placeholder={t('placeholder_cat')} value={newCatName} onChange={e => setNewCatName(e.target.value)} /><button className="btn btn-primary" onClick={handleAddCategory}><Plus size={18}/></button></div><ul className="list-group list-group-flush border rounded custom-scrollbar" style={{maxHeight: '400px', overflowY: 'auto'}}>{categories.length === 0 ? <li className="list-group-item text-muted fst-italic">{t('empty_cat')}</li> : categories.map((cat, idx) => (<li key={idx} className="list-group-item d-flex justify-content-between align-items-center py-3"><span style={{fontSize: '1rem'}}>{cat}</span><button className="btn btn-sm btn-light text-danger" onClick={() => handleDeleteCategory(cat)}><Trash2 size={16}/></button></li>))}</ul></div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header-excel text-success"><User size={16}/> {t('manage_owner')}</div>
                            <div className="card-body"><div className="input-group mb-3"><input type="text" className="form-control" placeholder={t('placeholder_owner')} value={newOwnerName} onChange={e => setNewOwnerName(e.target.value)} /><button className="btn btn-success" onClick={handleAddOwner}><Plus size={18}/></button></div><ul className="list-group list-group-flush border rounded custom-scrollbar" style={{maxHeight: '400px', overflowY: 'auto'}}>{owners.length === 0 ? <li className="list-group-item text-muted fst-italic">{t('empty_owner')}</li> : owners.map((owner, idx) => (<li key={idx} className="list-group-item d-flex justify-content-between align-items-center py-3"><span style={{fontSize: '1rem'}}>{owner}</span><button className="btn btn-sm btn-light text-danger" onClick={() => handleDeleteOwner(owner)}><Trash2 size={16}/></button></li>))}</ul></div>
                        </div>
                    </div>
                    
                    {/* ADMIN: SECURITY CODES PANEL */}
                    {isAdmin && (
                        <div className="col-12">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-header-excel text-dark"><Shield size={16}/> {t('manage_security')}</div>
                                <div className="card-body">
                                    <div className="input-group mb-3" style={{maxWidth: '400px'}}>
                                        <span className="input-group-text bg-white"><Key size={16}/></span>
                                        <input type="text" className="form-control" placeholder={t('placeholder_code')} value={newSecurityCode} onChange={e => setNewSecurityCode(e.target.value)} />
                                        <button className="btn btn-dark" onClick={handleAddSecurityCode}><Plus size={18}/></button>
                                    </div>
                                    <div className="table-responsive border rounded">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>{t('code_col_code')}</th>
                                                    <th>{t('lbl_status')}</th>
                                                    <th>{t('code_col_user')}</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {securityCodes.map((sc, idx) => (
                                                    <tr key={idx}>
                                                        <td className="fw-bold font-monospace">{sc.code}</td>
                                                        <td>
                                                            {sc.is_used 
                                                                ? <span className="badge bg-secondary">{t('status_used')}</span> 
                                                                : <span className="badge bg-success">{t('status_unused')}</span>
                                                            }
                                                        </td>
                                                        <td>{sc.used_by_username || '-'}</td>
                                                        <td className="text-end">
                                                            <button className="btn btn-sm btn-light text-danger" onClick={() => handleDeleteSecurityCode(sc.code)}><Trash2 size={16}/></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {securityCodes.length === 0 && <tr><td colSpan="4" className="text-center text-muted fst-italic py-3">No codes generated</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : view === 'calendar' ? (
                <div className="h-100">
                    <CalendarView tasks={tasks} onEditTask={openEditModal} onAddToday={openAddModal} t={t} lang={lang} />
                </div>
            ) : (
                <div className="card shadow-sm border-0 h-100 d-flex flex-column">
                    <div className="card-header bg-white py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-3">
                            <h6 className="mb-0 fw-bold text-uppercase text-muted" style={{fontSize: '0.9rem'}}>{t('task_list')}</h6>
                             <button 
                                className={`btn btn-sm d-flex align-items-center gap-1 border px-2 ${showFilters ? 'btn-primary' : 'btn-white text-secondary'}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={14} />
                                <span className="small fw-bold">{t('filter')} {(filterCats.length + filterOwners.length) > 0 && `(${filterCats.length + filterOwners.length})`}</span>
                            </button>
                        </div>

                         <div className="d-flex align-items-center gap-2">
                            <button 
                                className={`btn btn-sm d-flex align-items-center gap-1 border px-2 ${showCompleted ? 'btn-light text-primary border-primary' : 'btn-white text-muted'}`}
                                onClick={() => setShowCompleted(!showCompleted)}
                                title={showCompleted ? t('show_completed') : t('hide_completed')}
                            >
                                {showCompleted ? <Eye size={16} /> : <EyeOff size={16} />}
                                <span className="small fw-bold d-none d-sm-inline">{showCompleted ? t('show_completed') : t('hide_completed')}</span>
                            </button>
                            <button className="btn btn-outline-secondary btn-sm py-1 px-2" onClick={fetchData}><RefreshCw size={16}/></button>
                         </div>
                    </div>
                    
                    {showFilters && (
                        <div className="bg-light border-bottom p-3">
                             <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-bold text-secondary small text-uppercase">{t('filter')} Options</span>
                                {(filterCats.length > 0 || filterOwners.length > 0) && (
                                    <button className="btn btn-link btn-sm text-danger text-decoration-none p-0 d-flex align-items-center gap-1" onClick={clearFilters}>
                                        <XCircle size={14}/> {t('clear_filter')}
                                    </button>
                                )}
                             </div>
                             
                             <div className="row g-3">
                                 <div className="col-12 col-md-6">
                                     <div className="small text-muted mb-1 fw-bold">{t('lbl_cat')}:</div>
                                     <div className="d-flex flex-wrap gap-2">
                                         {categories.map(c => {
                                             const isActive = filterCats.includes(c);
                                             return (
                                                 <span key={c} onClick={() => toggleFilterCat(c)} className={`badge filter-badge px-3 py-2 rounded-pill ${isActive ? 'bg-primary text-white active' : 'bg-white text-dark border-secondary'}`}>
                                                     {c} {isActive && <X size={12} className="ms-1 inline"/>}
                                                 </span>
                                             )
                                         })}
                                         {categories.length === 0 && <span className="text-muted fst-italic small">{t('empty_cat')}</span>}
                                     </div>
                                 </div>
                                 <div className="col-12 col-md-6">
                                     <div className="small text-muted mb-1 fw-bold">{t('lbl_owner')}:</div>
                                     <div className="d-flex flex-wrap gap-2">
                                         {owners.map(o => {
                                             const isActive = filterOwners.includes(o);
                                             return (
                                                 <span key={o} onClick={() => toggleFilterOwner(o)} className={`badge filter-badge px-3 py-2 rounded-pill ${isActive ? 'bg-success text-white active' : 'bg-white text-dark border-secondary'}`}>
                                                     {o} {isActive && <X size={12} className="ms-1 inline"/>}
                                                 </span>
                                             )
                                         })}
                                         {owners.length === 0 && <span className="text-muted fst-italic small">{t('empty_owner')}</span>}
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    <div className="table-responsive flex-grow-1">
                        <table className="table table-custom table-hover mb-0 w-100">
                            <thead className="table-light sticky-top">
                                <tr>
                                    <th className="ps-4 cursor-pointer th-hover" style={{width: '12%'}} onClick={() => requestSort('created_at')}>
                                        <div className="d-flex align-items-center">{t('col_created')} {getSortIcon('created_at')}</div>
                                    </th>
                                    <th style={{width: '28%'}} className="cursor-pointer th-hover" onClick={() => requestSort('description')}>
                                        <div className="d-flex align-items-center">{t('col_task')} {getSortIcon('description')}</div>
                                    </th>
                                    <th style={{width: '12%'}} className="cursor-pointer th-hover" onClick={() => requestSort('category_name')}>
                                        <div className="d-flex align-items-center">{t('col_cat')} {getSortIcon('category_name')}</div>
                                    </th>
                                    <th style={{width: '12%'}} className="cursor-pointer th-hover" onClick={() => requestSort('owner_name')}>
                                        <div className="d-flex align-items-center">{t('col_owner')} {getSortIcon('owner_name')}</div>
                                    </th>
                                    <th style={{width: '10%'}} className="cursor-pointer th-hover" onClick={() => requestSort('priority')}>
                                        <div className="d-flex align-items-center">{t('col_prio')} {getSortIcon('priority')}</div>
                                    </th>
                                    <th style={{width: '10%'}} className="cursor-pointer th-hover" onClick={() => requestSort('status')}>
                                        <div className="d-flex align-items-center">{t('col_status')} {getSortIcon('status')}</div>
                                    </th>
                                    <th style={{width: '10%'}} className="cursor-pointer th-hover" onClick={() => requestSort('due_date')}>
                                        <div className="d-flex align-items-center">{t('col_due')} {getSortIcon('due_date')}</div>
                                    </th>
                                    <th style={{width: '6%'}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedTasks.length === 0 ? (
                                    <tr><td colSpan="8" className="text-center py-5 text-muted fst-italic">{t('no_tasks')}</td></tr>
                                ) : (
                                    processedTasks.map(task => (
                                        <tr key={task.id} onClick={() => openEditModal(task)}>
                                            <td className="ps-4 text-muted small">{formatDateTime(task.created_at, lang)}</td>
                                            <td>
                                                <div className="fw-bold text-dark text-truncate" style={{maxWidth: '300px', fontSize: '0.95rem'}} title={task.description}>{task.description}</div>
                                                <div className="d-flex gap-2 mt-1">
                                                    {task.is_urgent && <span className="badge bg-danger rounded-pill" style={{fontSize:'0.7rem'}}>Urgent</span>}
                                                    {task.is_important && <span className="badge bg-warning text-dark rounded-pill" style={{fontSize:'0.7rem'}}>Important</span>}
                                                </div>
                                            </td>
                                            <td><span className="badge bg-light text-dark border px-2 py-1" style={{fontSize: '0.85rem', fontWeight: '500'}}>{task.category_name}</span></td>
                                            <td>{task.owner_name}</td>
                                            <td><span className={`badge rounded-pill px-2 py-1 ${PRIORITY_BADGES[task.priority]}`} style={{fontSize: '0.8rem'}}>{task.priority}</span></td>
                                            <td><span className={`badge px-2 py-1 ${STATUS_BADGES[task.status]}`} style={{fontSize: '0.8rem'}}>{task.status}</span></td>
                                            <td><span className={`fw-medium ${task.due_date && new Date(task.due_date)<new Date() && task.status!=='Completed' ? 'text-danger' : 'text-muted'}`} style={{fontSize: '0.9rem'}}>{task.due_date || '-'}</span></td>
                                            <td className="text-end pe-3">
                                                <button className="btn btn-link text-secondary p-1 hover-danger" onClick={(e)=>handleDelete(e, task.id)} title="Delete"><Trash2 size={18}/></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </div>

      {showModal && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowModal(false)}
          ></div>
          <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            role="dialog"
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, overflowY: 'auto' }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header py-3 bg-white border-bottom-0">
                  <h5 className="modal-title fw-bold text-primary">{editingId ? t('modal_edit_title') : t('modal_add_title')}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-4">
                      {/* Cột trái: Thông tin chính */}
                      <div className="col-12 col-lg-5">
                          <div className="mb-4">
                            <label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_desc')}</label>
                            <input type="text" className="form-control form-control-lg border-light bg-light" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} autoFocus placeholder={t('ph_desc')}/>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_cat')}</label>
                              <select className="form-select border-light bg-light" value={newTask.category_name} onChange={e => setNewTask({...newTask, category_name: e.target.value})}>
                                <option value="">{t('sel_cat')}</option>
                                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                              </select>
                            </div>
                            <div className="col-6">
                              <label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_owner')}</label>
                              <select className="form-select border-light bg-light" value={newTask.owner_name} onChange={e => setNewTask({...newTask, owner_name: e.target.value})}>
                                <option value="">{t('sel_owner')}</option>
                                {owners.map((o, i) => <option key={i} value={o}>{o}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-6">
                              <label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_prio')}</label>
                              <select className="form-select border-light bg-light" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                                <option value="High">High</option> <option value="Normal">Normal</option> <option value="Low">Low</option>
                              </select>
                            </div>
                            <div className="col-6">
                              <label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_status')}</label>
                              <select className="form-select border-light bg-light" value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})}>
                                 {Object.keys(STATUS_BADGES).map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="mb-4">
                              <label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_due')}</label>
                              <input type="date" className="form-control border-light bg-light" value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})} />
                          </div>
                          <div className="d-flex flex-column gap-2 p-3 bg-light rounded-3 border border-light">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="chkImp" checked={newTask.is_important} onChange={e => setNewTask({...newTask, is_important: e.target.checked})}/> 
                                <label className="form-check-label fw-bold ms-2" htmlFor="chkImp">{t('chk_imp')}</label>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="chkUrg" checked={newTask.is_urgent} onChange={e => setNewTask({...newTask, is_urgent: e.target.checked})}/> 
                                <label className="form-check-label fw-bold ms-2" htmlFor="chkUrg">{t('chk_urg')}</label>
                            </div>
                          </div>
                      </div>

                      {/* Cột phải: Rich Text Editor */}
                      <div className="col-12 col-lg-7 d-flex flex-column">
                          <label className="form-label fw-bold text-secondary text-uppercase small">{t('lbl_details')}</label>
                          <div className="flex-grow-1">
                              <SimpleRichTextEditor 
                                  initialValue={newTask.notes} 
                                  onChange={(html) => setNewTask(prev => ({...prev, notes: html}))} 
                              />
                          </div>
                      </div>
                  </div>
                </div>
                <div className="modal-footer py-3 border-top-0">
                  <button className="btn btn-light px-4 text-secondary fw-bold" onClick={() => setShowModal(false)}>{t('cancel')}</button>
                  <button className="btn btn-primary px-4 fw-bold" onClick={handleSaveTask}>{editingId ? t('update') : t('save')}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AuthScreen({ onLogin, onDemo, t }) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // NEW STATE
    const [securityCode, setSecurityCode] = useState(''); 
    const [error, setError] = useState('');
    const [hasUsers, setHasUsers] = useState(true); 

    // Kiểm tra trạng thái hệ thống khi load
    useEffect(() => {
        const checkSystem = async () => {
            try {
                const res = await fetch(`${API_URL}/system/status`);
                if (res.ok) {
                    const data = await res.json();
                    setHasUsers(data.has_users);
                } else {
                    console.warn("System status endpoint not reachable.");
                }
            } catch (e) {
                console.error("Check system status failed", e);
            }
        };
        checkSystem();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // --- NEW VALIDATION ---
        if (isRegister && password !== confirmPassword) {
            setError(t('pass_mismatch'));
            return;
        }
        // ----------------------

        const endpoint = isRegister ? '/register' : '/token';
        
        let body, headers;
        
        if (isRegister) {
            // Payload đăng ký
            const payload = { username, password };
            // Chỉ gửi security_code nếu hệ thống đã có user
            if (hasUsers) {
                if (!securityCode) {
                    setError("Vui lòng nhập mã bảo mật"); // Nên localize text này nếu cần
                    return;
                }
                payload.security_code = securityCode;
            }
            
            body = JSON.stringify(payload); 
            headers = { 'Content-Type': 'application/json' }; 
        } else { 
            // Payload đăng nhập (form-urlencoded)
            const f = new URLSearchParams(); 
            f.append('username', username); 
            f.append('password', password); 
            body = f; 
            headers = { 'Content-Type': 'application/x-www-form-urlencoded' }; 
        }

        try {
            const res = await fetch(`${API_URL}${endpoint}`, { method: 'POST', headers, body });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Lỗi');
            if (data.access_token) onLogin(data.access_token, data.is_admin);
        } catch (err) { setError(err.message === 'Failed to fetch' ? t('auth_error') : err.message); }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="text-center mb-4"><div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width:'60px', height:'60px'}}><Lock size={30} /></div><h3 className="fw-bold">{isRegister ? t('register') : t('login')}</h3><p className="text-muted">{t('app_name')} {APP_VERSION}</p></div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3"><label className="form-label fw-bold">{t('username')}</label><input type="text" className="form-control" required value={username} onChange={e => setUsername(e.target.value)} /></div>
                    <div className="mb-3"><label className="form-label fw-bold">{t('password')}</label><input type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} /></div>
                    
                    {/* --- CONFIRM PASSWORD FIELD (Chỉ hiện khi Đăng ký) --- */}
                    {isRegister && (
                         <div className="mb-3">
                            <label className="form-label fw-bold">{t('confirm_password')}</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white"><CheckCheck size={18}/></span>
                                <input 
                                    type="password" 
                                    className={`form-control ${confirmPassword && password !== confirmPassword ? 'is-invalid' : ''}`}
                                    required 
                                    value={confirmPassword} 
                                    onChange={e => setConfirmPassword(e.target.value)} 
                                    placeholder={t('confirm_password')}
                                />
                                {confirmPassword && password !== confirmPassword && (
                                    <div className="invalid-feedback">
                                        {t('pass_mismatch')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Input Mã bảo mật: Chỉ hiện khi Đăng ký VÀ Hệ thống đã có user */}
                    {isRegister && hasUsers && (
                        <div className="mb-4">
                            <label className="form-label fw-bold">{t('security_code')}</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white"><Key size={18}/></span>
                                <input type="text" className="form-control" required value={securityCode} onChange={e => setSecurityCode(e.target.value)} placeholder="Nhập mã được cấp..." />
                            </div>
                            <div className="form-text text-muted small fst-italic">Liên hệ Admin để nhận mã kích hoạt.</div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3">{isRegister ? t('register') : t('login')}</button>
                </form>
                <div className="text-center border-top pt-3"><button className="btn btn-outline-secondary w-100 mb-3 fw-bold d-flex align-items-center justify-content-center gap-2" onClick={onDemo}><WifiOff size={18} /> {t('demo_offline')}</button><button className="btn btn-link text-decoration-none" onClick={() => setIsRegister(!isRegister)}>{isRegister ? t('have_account') : t('no_account')}</button></div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, sub, icon, color }) { 
    return (
        <div className="col-12 col-sm-6 col-xl-3">
            <div className={`card shadow-sm border-0 border-start border-4 border-${color} h-100`}>
                <div className="card-body py-3 px-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted text-uppercase fw-bold text-xs" style={{fontSize: '0.85rem'}}>{title}</span>
                        <div className={`bg-${color} bg-opacity-10 text-${color} rounded p-2`}>{icon}</div>
                    </div>
                    <h3 className="card-title fw-bold mb-0 text-dark" style={{fontSize: '1.8rem'}}>
                        {value} {sub && <span className="fs-6 text-muted fw-normal ms-1">{sub}</span>}
                    </h3>
                </div>
            </div>
        </div>
    ); 
}

function SimplePieChart({ total, value, color, bg }) { 
    const percentage = total > 0 ? (value / total) * 100 : 0; 
    return (
        <div className="pie-chart rounded-circle position-relative d-flex align-items-center justify-content-center" style={{background: `conic-gradient(${color} 0% ${percentage}%, ${bg} ${percentage}% 100%)`, width: '80px', height: '80px'}}>
            <div className="bg-white rounded-circle position-absolute" style={{width: '60%', height: '60%'}}></div>
            <span className="position-relative fw-bold small">{Math.round(percentage)}%</span>
        </div>
    );
}