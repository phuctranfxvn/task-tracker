import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, BarChart2, List, 
  CheckCircle, AlertTriangle, Clock, 
  Briefcase, RefreshCw, WifiOff, LayoutDashboard, Menu,
  Zap, Star, PieChart, Edit, Settings, X, User, Calendar, LogOut, Lock, ArrowRight
} from 'lucide-react';

// --- CẤU HÌNH ---
const API_URL = "http://localhost:8000";
const APP_VERSION = "v2.0";

// --- UTILS ---
const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
};

const getDaysRemaining = (dueDate) => {
    if (!dueDate) return '';
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(dueDate);
    due.setHours(0,0,0,0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return <span className="text-danger fw-bold">Quá hạn {Math.abs(diffDays)} ngày</span>;
    if (diffDays === 0) return <span className="text-danger fw-bold">Hôm nay</span>;
    if (diffDays === 1) return <span className="text-warning fw-bold text-dark">Ngày mai</span>;
    return <span className={diffDays <= 7 ? "text-danger fw-bold" : "text-muted"}>{diffDays} ngày</span>;
};

// --- MOCK DATA ---
const today = new Date();
const addDays = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

const MOCK_CATEGORIES = ['Tài chính', 'Marketing', 'Nhân sự', 'Pháp chế', 'Hành chính', 'IT'];
const MOCK_OWNERS = ['Tôi', 'Phúc', 'Loan', 'Ngân', 'Hà'];
const MOCK_TASKS = [
  { id: 1, description: 'Làm báo cáo tài chính Q4', category_name: 'Tài chính', owner_name: 'Phúc', priority: 'High', status: 'In Progress', due_date: addDays(2), is_urgent: true, is_important: true, created_at: '2023-11-20T08:30:00' },
  { id: 2, description: 'Thiết kế Banner quảng cáo', category_name: 'Marketing', owner_name: 'Loan', priority: 'Normal', status: 'Not Started', due_date: addDays(5), is_urgent: false, is_important: true, created_at: '2023-11-21T09:00:00' },
  { id: 3, description: 'Tuyển dụng nhân sự mới', category_name: 'Nhân sự', owner_name: 'Ngân', priority: 'High', status: 'On Hold', due_date: addDays(10), is_urgent: true, is_important: false, created_at: '2023-11-22T10:15:00' },
  { id: 4, description: 'Họp team đầu tuần', category_name: 'Hành chính', owner_name: 'Tôi', priority: 'Low', status: 'Completed', due_date: addDays(-1), is_urgent: false, is_important: false, created_at: '2023-11-23T14:20:00' },
  { id: 5, description: 'Review hợp đồng đối tác A', category_name: 'Pháp chế', owner_name: 'Hà', priority: 'Normal', status: 'In Progress', due_date: addDays(1), is_urgent: true, is_important: true, created_at: '2023-11-24T09:00:00' },
];

// --- BOOTSTRAP LOADER ---
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
      .table-custom tr:hover td { background-color: #f8f9fa; }
      .auth-container { display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f0f2f5; position: fixed; top: 0; left: 0; width: 100%; z-index: 9999; }
      .auth-box { width: 100%; max-width: 400px; background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    `;
    document.head.appendChild(style);
    return () => { 
        document.head.removeChild(link); document.head.removeChild(font); document.head.removeChild(style);
    };
  }, []);
  return null;
};

// --- COLORS ---
const STATUS_BADGES = { 'Not Started': 'bg-secondary', 'In Progress': 'bg-primary', 'On Hold': 'bg-warning text-dark', 'Completed': 'bg-success' };
const PRIORITY_BADGES = { 'High': 'bg-danger', 'Normal': 'bg-info text-dark', 'Low': 'bg-light text-dark border' };

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [owners, setOwners] = useState([]);
  const [view, setView] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [newTask, setNewTask] = useState({ 
    description: '', category_name: '', owner_name: '', priority: 'Normal', status: 'Not Started', due_date: '', is_important: false, is_urgent: false
  });
  const [newCatName, setNewCatName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');

  // --- API HELPERS ---
  const authFetch = async (endpoint, options = {}) => {
    if (isDemoMode) throw new Error("Demo Mode");
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (response.status === 401) { logout(); throw new Error("Unauthorized"); }
    return response;
  };

  const logout = () => { localStorage.removeItem('access_token'); setToken(null); setIsDemoMode(false); setTasks([]); };

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

  useEffect(() => { if(token || isDemoMode) fetchData(); }, [token, isDemoMode]);

  // --- HANDLERS ---
  const handleSaveTask = async () => {
    if(!newTask.description) return alert("Nhập tên công việc!");
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
      } catch (err) { alert("Lỗi Server"); }
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if(!confirm("Xóa?")) return;
    if (isDemoMode) setTasks(tasks.filter(t => t.id !== id));
    else { await authFetch(`/tasks/${id}`, { method: 'DELETE' }); fetchData(); }
  };

  const handleAddCategory = async () => {
    if(!newCatName.trim()) return;
    if(isDemoMode) setCategories([...categories, newCatName]); 
    else { try { await authFetch(`/config/categories`, { method: 'POST', body: JSON.stringify({ name: newCatName }) }); fetchData(); } catch(e) {} }
    setNewCatName('');
  };
  const handleDeleteCategory = async (catName) => {
    if(!confirm(`Xóa?`)) return;
    if(isDemoMode) setCategories(categories.filter(c => c !== catName)); 
    else { try { await authFetch(`/config/categories/${encodeURIComponent(catName)}`, { method: 'DELETE' }); fetchData(); } catch(e) {} }
  };
  const handleAddOwner = async () => {
    if(!newOwnerName.trim()) return;
    if(isDemoMode) setOwners([...owners, newOwnerName]); 
    else { try { await authFetch(`/config/owners`, { method: 'POST', body: JSON.stringify({ name: newOwnerName }) }); fetchData(); } catch(e) {} }
    setNewOwnerName('');
  };
  const handleDeleteOwner = async (ownerName) => {
    if(!confirm(`Xóa?`)) return;
    if(isDemoMode) setOwners(owners.filter(o => o !== ownerName)); 
    else { try { await authFetch(`/config/owners/${encodeURIComponent(ownerName)}`, { method: 'DELETE' }); fetchData(); } catch(e) {} }
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewTask({ description: '', category_name: categories[0] || '', owner_name: owners[0] || '', priority: 'Normal', status: 'Not Started', due_date: '', is_important: false, is_urgent: false });
    setShowModal(true);
  };
  const openEditModal = (task) => {
    setEditingId(task.id);
    setNewTask({ description: task.description, category_name: task.category_name, owner_name: task.owner_name, priority: task.priority, status: task.status, due_date: task.due_date || '', is_important: task.is_important, is_urgent: task.is_urgent });
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

  // --- MAIN RENDER ---
  if (!token && !isDemoMode) {
      return (
        <>
            <BootstrapLoader />
            <AuthScreen onLogin={(t) => { localStorage.setItem('access_token', t); setToken(t); }} onDemo={() => setIsDemoMode(true)} />
        </>
      );
  }

  return (
    <div className="d-flex flex-column w-100 h-100 bg-light font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      <BootstrapLoader />
      
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm flex-shrink-0 w-100 px-3 py-2">
        <div className="container-fluid p-0">
          <a className="navbar-brand d-flex align-items-center gap-2 fw-bold" href="#">
            <LayoutDashboard size={22} className="text-success"/> 
            <span style={{fontSize: '1.2rem'}}>Task Tracker {APP_VERSION}</span>
          </a>
          <div className="d-flex gap-2 align-items-center">
             {isDemoMode && <span className="text-warning small d-none d-md-flex align-items-center me-3 border border-warning px-2 rounded"><WifiOff size={14} className="me-1"/> Demo Mode</span>}
            <div className="btn-group">
                <button className={`btn btn-sm px-3 ${view === 'dashboard' ? 'btn-primary' : 'btn-outline-secondary text-white'}`} onClick={() => setView('dashboard')}><BarChart2 size={18} className="me-1"/> Dashboard</button>
                <button className={`btn btn-sm px-3 ${view === 'list' ? 'btn-primary' : 'btn-outline-secondary text-white'}`} onClick={() => setView('list')}><List size={18} className="me-1"/> Danh sách</button>
                <button className={`btn btn-sm px-3 ${view === 'settings' ? 'btn-primary' : 'btn-outline-secondary text-white'}`} onClick={() => setView('settings')}><Settings size={18} className="me-1"/> Cấu hình</button>
            </div>
            <button className="btn btn-success btn-sm d-flex align-items-center gap-1 ms-2 px-3 py-1" onClick={openAddModal}><Plus size={18} /> <span style={{fontSize: '0.9rem'}}>Thêm</span></button>
            <button className="btn btn-outline-danger btn-sm ms-2" onClick={logout} title="Đăng xuất"><LogOut size={18}/></button>
          </div>
        </div>
      </nav>

      <div className="flex-grow-1 w-100 overflow-hidden position-relative">
        <div className="position-absolute top-0 start-0 w-100 h-100 overflow-auto custom-scrollbar p-3">
            {/* --- VIEW CONTENT --- */}
            {view !== 'settings' && (
              <div className="row g-3 mb-4">
                  <KpiCard title="Tổng số Task" value={stats.total} icon={<Briefcase size={22}/>} color="primary" />
                  <KpiCard title="Hoàn thành" value={stats.completed} sub={`(${stats.total > 0 ? Math.round(stats.completed/stats.total*100) : 0}%)`} icon={<CheckCircle size={22}/>} color="success" />
                  <KpiCard title="Đang xử lý" value={stats.pending} icon={<Clock size={22}/>} color="warning" />
                  <KpiCard title="Quá hạn" value={stats.overdue} icon={<AlertTriangle size={22}/>} color="danger" />
              </div>
            )}

            {view === 'dashboard' ? (
                <div className="row g-4 h-md-100 pb-3">
                    <div className="col-12 col-xl-4 d-flex flex-column">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header-excel text-danger"><Clock size={16}/> Công Việc Sắp Đến Hạn</div>
                            <div className="list-group list-group-flush overflow-auto custom-scrollbar" style={{maxHeight: '600px'}}>
                                {stats.upcomingTasks.length === 0 ? <div className="p-4 text-center text-muted fst-italic small">Không có công việc nào sắp đến hạn.</div> : 
                                    stats.upcomingTasks.map((t, index) => (
                                        <div key={t.id} className="list-group-item px-3 py-3 border-bottom d-flex align-items-center gap-2 cursor-pointer hover-bg-light" onClick={() => openEditModal(t)}>
                                            <span className="badge bg-light text-secondary border rounded-circle p-0 d-flex align-items-center justify-content-center" style={{width:'24px', height:'24px', fontSize:'12px'}}>{index+1}</span>
                                            <div className="flex-grow-1" style={{minWidth: 0}}>
                                                <div className="fw-bold text-dark text-truncate" style={{fontSize: '0.95rem'}} title={t.description}>{t.description}</div>
                                                <div className="text-muted" style={{fontSize: '0.85rem'}}><span className="fw-bold">{t.category_name}</span> • {t.owner_name}</div>
                                            </div>
                                            <div className="text-end flex-shrink-0"><div className="small mb-1">{getDaysRemaining(t.due_date)}</div><div className="text-muted small">{t.due_date}</div></div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    {/* Charts omitted for brevity, assuming standard dashboard layout */}
                    <div className="col-12 col-md-6 col-xl-4 d-flex flex-column gap-3">
                         <div className="card shadow-sm border-0 flex-fill">
                            <div className="card-header-excel">📊 Trạng Thái Theo Danh Mục</div>
                            <div className="card-body overflow-auto custom-scrollbar" style={{maxHeight: '350px'}}>
                                {categories.map(cat => {
                                    const ts = tasks.filter(t => t.category_name === cat); if(!ts.length) return null;
                                    const total = ts.length; const c = { done: ts.filter(t => t.status === 'Completed').length, wip: ts.filter(t => t.status === 'In Progress').length, hold: ts.filter(t => t.status === 'On Hold').length, new: ts.filter(t => t.status === 'Not Started').length };
                                    return (<div key={cat} className="mb-3"><div className="d-flex justify-content-between text-sm mb-1"><span className="fw-bold text-dark">{cat}</span> <span className="text-muted">{total}</span></div><div className="progress" style={{height: '10px'}}><div className="progress-bar bg-success" style={{width: `${c.done/total*100}%`}}></div><div className="progress-bar bg-primary" style={{width: `${c.wip/total*100}%`}}></div><div className="progress-bar bg-warning" style={{width: `${c.hold/total*100}%`}}></div><div className="progress-bar bg-secondary" style={{width: `${c.new/total*100}%`}}></div></div></div>)
                                })}
                            </div>
                        </div>
                        <div className="card shadow-sm border-0"><div className="card-header-excel text-danger">⚡ CÔNG VIỆC GẤP</div><div className="card-body d-flex align-items-center justify-content-between px-4 py-3"><SimplePieChart total={stats.total - stats.completed} value={stats.urgent} color="#dc3545" bg="#e9ecef"/><div className="text-end"><div className="display-6 fw-bold text-danger">{stats.urgent}</div><div className="text-muted" style={{fontSize: '0.9rem'}}>Khẩn cấp chưa xong</div></div></div></div>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4 d-flex flex-column gap-3">
                         <div className="card shadow-sm border-0 flex-fill">
                            <div className="card-header-excel">🔥 Tính Ưu Tiên Theo Danh Mục</div>
                            <div className="card-body overflow-auto custom-scrollbar" style={{maxHeight: '350px'}}>
                                {categories.map(cat => {
                                    const ts = tasks.filter(t => t.category_name === cat); if(!ts.length) return null;
                                    const total = ts.length; const p = { high: ts.filter(t => t.priority === 'High').length, norm: ts.filter(t => t.priority === 'Normal').length, low: ts.filter(t => t.priority === 'Low').length };
                                    return (<div key={cat} className="mb-3"><div className="d-flex justify-content-between text-sm mb-1"><span className="fw-bold text-dark">{cat}</span> <span className="text-muted">{total}</span></div><div className="progress" style={{height: '10px'}}><div className="progress-bar bg-danger" style={{width: `${p.high/total*100}%`}}></div><div className="progress-bar bg-info text-dark" style={{width: `${p.norm/total*100}%`}}></div><div className="progress-bar bg-light text-dark border" style={{width: `${p.low/total*100}%`}}></div></div></div>)
                                })}
                            </div>
                        </div>
                         <div className="card shadow-sm border-0"><div className="card-header-excel text-warning">⭐ CÔNG VIỆC QUAN TRỌNG</div><div className="card-body d-flex align-items-center justify-content-between px-4 py-3"><SimplePieChart total={stats.total - stats.completed} value={stats.important} color="#ffc107" bg="#e9ecef"/><div className="text-end"><div className="display-6 fw-bold text-warning-emphasis">{stats.important}</div><div className="text-muted" style={{fontSize: '0.9rem'}}>Quan trọng chưa xong</div></div></div></div>
                    </div>
                </div>
            ) : view === 'settings' ? (
                <div className="row g-4">
                    <div className="col-12 col-md-6">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header-excel text-primary"><List size={16}/> Quản lý Danh mục</div>
                            <div className="card-body"><div className="input-group mb-3"><input type="text" className="form-control" placeholder="Tên danh mục..." value={newCatName} onChange={e => setNewCatName(e.target.value)} /><button className="btn btn-primary" onClick={handleAddCategory}><Plus size={18}/></button></div><ul className="list-group list-group-flush border rounded custom-scrollbar" style={{maxHeight: '400px', overflowY: 'auto'}}>{categories.map((cat, idx) => (<li key={idx} className="list-group-item d-flex justify-content-between align-items-center py-3"><span style={{fontSize: '1rem'}}>{cat}</span><button className="btn btn-sm btn-light text-danger" onClick={() => handleDeleteCategory(cat)}><Trash2 size={16}/></button></li>))}</ul></div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header-excel text-success"><User size={16}/> Quản lý Người phụ trách</div>
                            <div className="card-body"><div className="input-group mb-3"><input type="text" className="form-control" placeholder="Tên người..." value={newOwnerName} onChange={e => setNewOwnerName(e.target.value)} /><button className="btn btn-success" onClick={handleAddOwner}><Plus size={18}/></button></div><ul className="list-group list-group-flush border rounded custom-scrollbar" style={{maxHeight: '400px', overflowY: 'auto'}}>{owners.map((owner, idx) => (<li key={idx} className="list-group-item d-flex justify-content-between align-items-center py-3"><span style={{fontSize: '1rem'}}>{owner}</span><button className="btn btn-sm btn-light text-danger" onClick={() => handleDeleteOwner(owner)}><Trash2 size={16}/></button></li>))}</ul></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card shadow-sm border-0 h-100 d-flex flex-column">
                    <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-bold text-uppercase text-muted" style={{fontSize: '0.9rem'}}>Danh sách công việc</h6>
                        <button className="btn btn-outline-secondary btn-sm py-1 px-2" onClick={fetchData}><RefreshCw size={16}/></button>
                    </div>
                    <div className="table-responsive flex-grow-1">
                        <table className="table table-custom table-hover mb-0 w-100">
                            <thead className="table-light sticky-top">
                                <tr>
                                    <th className="ps-4" style={{width: '12%'}}>Ngày tạo</th>
                                    <th style={{width: '28%'}}>Công việc</th>
                                    <th style={{width: '12%'}}>Danh mục</th>
                                    <th style={{width: '12%'}}>Phụ trách</th>
                                    <th style={{width: '10%'}}>Độ ưu tiên</th>
                                    <th style={{width: '10%'}}>Trạng thái</th>
                                    <th style={{width: '10%'}}>Hạn chót</th>
                                    <th style={{width: '6%'}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(t => (
                                    <tr key={t.id}>
                                        <td className="ps-4 text-muted small">{formatDateTime(t.created_at)}</td>
                                        <td>
                                            <div className="fw-bold text-dark text-truncate" style={{maxWidth: '300px', fontSize: '0.95rem'}} title={t.description}>{t.description}</div>
                                            <div className="d-flex gap-2 mt-1">
                                                {t.is_urgent && <span className="badge bg-danger rounded-pill" style={{fontSize:'0.7rem'}}>Gấp</span>}
                                                {t.is_important && <span className="badge bg-warning text-dark rounded-pill" style={{fontSize:'0.7rem'}}>Quan Trọng</span>}
                                            </div>
                                        </td>
                                        <td><span className="badge bg-light text-dark border px-2 py-1" style={{fontSize: '0.85rem', fontWeight: '500'}}>{t.category_name}</span></td>
                                        <td>{t.owner_name}</td>
                                        <td><span className={`badge rounded-pill px-2 py-1 ${PRIORITY_BADGES[t.priority]}`} style={{fontSize: '0.8rem'}}>{t.priority}</span></td>
                                        <td><span className={`badge px-2 py-1 ${STATUS_BADGES[t.status]}`} style={{fontSize: '0.8rem'}}>{t.status}</span></td>
                                        <td><span className={`fw-medium ${t.due_date && new Date(t.due_date)<new Date() && t.status!=='Completed' ? 'text-danger' : 'text-muted'}`} style={{fontSize: '0.9rem'}}>{t.due_date || '-'}</span></td>
                                        <td className="text-end pe-3"><button className="btn btn-link text-secondary p-1" onClick={()=>openEditModal(t)}><Edit size={18}/></button><button className="btn btn-link text-secondary p-1 hover-danger" onClick={()=>handleDelete(t.id)}><Trash2 size={18}/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* --- MODAL FIX: TÁCH RA KHỎI LUỒNG CHÍNH VÀ DÙNG POSITION FIXED --- */}
      {showModal && (
        <>
          {/* Lớp nền tối (Backdrop) */}
          <div 
            className="modal-backdrop fade show" 
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowModal(false)}
          ></div>

          {/* Hộp thoại Modal */}
          <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            role="dialog"
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, overflowY: 'auto' }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header py-3 bg-white border-bottom-0">
                  <h5 className="modal-title fw-bold text-primary">{editingId ? "Cập nhật Công Việc" : "Thêm Công Việc Mới"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-4">
                    <label className="form-label fw-bold text-secondary text-uppercase small">Tên công việc</label>
                    <input type="text" className="form-control form-control-lg border-light bg-light" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} autoFocus placeholder="Nhập tên công việc..."/>
                  </div>
                  <div className="row g-4 mb-4">
                    <div className="col-6">
                      <label className="form-label fw-bold text-secondary text-uppercase small">Danh mục</label>
                      <select className="form-select border-light bg-light" value={newTask.category_name} onChange={e => setNewTask({...newTask, category_name: e.target.value})}>
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold text-secondary text-uppercase small">Phụ trách</label>
                      <select className="form-select border-light bg-light" value={newTask.owner_name} onChange={e => setNewTask({...newTask, owner_name: e.target.value})}>
                        <option value="">-- Chọn người phụ trách --</option>
                        {owners.map((o, i) => <option key={i} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="row g-4 mb-4">
                    <div className="col-4">
                      <label className="form-label fw-bold text-secondary text-uppercase small">Độ ưu tiên</label>
                      <select className="form-select border-light bg-light" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                        <option value="High">Cao (High)</option> <option value="Normal">Trung bình (Normal)</option> <option value="Low">Thấp (Low)</option>
                      </select>
                    </div>
                    <div className="col-4">
                      <label className="form-label fw-bold text-secondary text-uppercase small">Trạng thái</label>
                      <select className="form-select border-light bg-light" value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})}>
                         {Object.keys(STATUS_BADGES).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-4">
                      <label className="form-label fw-bold text-secondary text-uppercase small">Hạn chót</label>
                      <input type="date" className="form-control border-light bg-light" value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})} />
                    </div>
                  </div>
                  <div className="d-flex gap-4 p-3 bg-light rounded-3 border border-light">
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="chkImp" checked={newTask.is_important} onChange={e => setNewTask({...newTask, is_important: e.target.checked})}/> 
                        <label className="form-check-label fw-bold ms-2" htmlFor="chkImp">Quan trọng (Important)</label>
                    </div>
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="chkUrg" checked={newTask.is_urgent} onChange={e => setNewTask({...newTask, is_urgent: e.target.checked})}/> 
                        <label className="form-check-label fw-bold ms-2" htmlFor="chkUrg">Khẩn cấp (Urgent)</label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer py-3 border-top-0">
                  <button className="btn btn-light px-4 text-secondary fw-bold" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                  <button className="btn btn-primary px-4 fw-bold" onClick={handleSaveTask}>{editingId ? "Cập nhật" : "Lưu công việc"}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AuthScreen({ onLogin, onDemo }) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isRegister ? '/register' : '/token';
        let body, headers;
        if (isRegister) { body = JSON.stringify({ username, password }); headers = { 'Content-Type': 'application/json' }; } 
        else { const f = new URLSearchParams(); f.append('username', username); f.append('password', password); body = f; headers = { 'Content-Type': 'application/x-www-form-urlencoded' }; }

        try {
            const res = await fetch(`${API_URL}${endpoint}`, { method: 'POST', headers, body });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Lỗi');
            if (data.access_token) onLogin(data.access_token);
        } catch (err) { setError(err.message === 'Failed to fetch' ? 'Lỗi kết nối Backend!' : err.message); }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="text-center mb-4"><div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width:'60px', height:'60px'}}><Lock size={30} /></div><h3 className="fw-bold">{isRegister ? 'Đăng Ký' : 'Đăng Nhập'}</h3><p className="text-muted">Quản Lý Công Việc {APP_VERSION}</p></div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3"><label className="form-label fw-bold">Tên đăng nhập</label><input type="text" className="form-control" required value={username} onChange={e => setUsername(e.target.value)} /></div>
                    <div className="mb-4"><label className="form-label fw-bold">Mật khẩu</label><input type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} /></div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3">{isRegister ? 'Đăng Ký' : 'Đăng Nhập'}</button>
                </form>
                <div className="text-center border-top pt-3"><button className="btn btn-outline-secondary w-100 mb-3 fw-bold d-flex align-items-center justify-content-center gap-2" onClick={onDemo}><WifiOff size={18} /> Dùng thử Demo (Offline)</button><button className="btn btn-link text-decoration-none" onClick={() => setIsRegister(!isRegister)}>{isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}</button></div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, sub, icon, color }) { return (<div className="col-12 col-sm-6 col-xl-3"><div className={`card shadow-sm border-0 border-start border-4 border-${color} h-100`}><div className="card-body py-3 px-4"><div className="d-flex justify-content-between align-items-center mb-2"><span className="text-muted text-uppercase fw-bold text-xs" style={{fontSize: '0.85rem'}}>{title}</span><div className={`bg-${color} bg-opacity-10 text-${color} rounded p-2`}>{icon}</div></div><h3 className="card-title fw-bold mb-0 text-dark" style={{fontSize: '1.8rem'}}>{value} {sub && <span className="fs-6 text-muted fw-normal ms-1">{sub}</span>}</h3></div></div></div>); }
function SimplePieChart({ total, value, color, bg }) { const percentage = total > 0 ? (value / total) * 100 : 0; return (<div className="pie-chart rounded-circle position-relative d-flex align-items-center justify-content-center" style={{background: `conic-gradient(${color} 0% ${percentage}%, ${bg} ${percentage}% 100%)`, width: '80px', height: '80px'}}><div className="bg-white rounded-circle position-absolute" style={{width: '60%', height: '60%'}}></div><span className="position-relative fw-bold small">{Math.round(percentage)}%</span></div>) }