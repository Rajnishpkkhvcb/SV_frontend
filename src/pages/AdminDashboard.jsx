import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../config/api';
import Logo from '../components/Logo';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const navigate = useNavigate();

  // Custom UI States
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  // Form State
  const [loadingForm, setLoadingForm] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '', location: '', projectType: 'Residential', status: 'Ongoing',
    totalUnits: '', description: '', shortDescription: '', possession: '',
    reraNo: '', featured: false, amenities: ''
  });
  const [files, setFiles] = useState({
    coverImage: null, layoutImage: [], brochure: null, galleryImages: []
  });

  const [existingCoverUrl, setExistingCoverUrl] = useState(null);
  const [existingBrochureUrl, setExistingBrochureUrl] = useState(null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState([]);
  const [existingLayoutUrls, setExistingLayoutUrls] = useState([]);
  const [existingLayoutNames, setExistingLayoutNames] = useState({});
  const [newLayoutNames, setNewLayoutNames] = useState([]);

  const getLayoutNameFromUrl = (url, fallback = '') => {
    try {
      const match = url.match(/[?&]name=([^&#]+)/);
      if (match) return decodeURIComponent(match[1]);
    } catch (e) {}
    return fallback;
  };

  const getLocalPreview = (file) => {
    try {
      return URL.createObjectURL(file);
    } catch (e) {
      return '';
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/admin');
    else if (activeTab === 'projects' || activeTab === 'enquiries') {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'projects') {
        const res = await api.get('/projects');
        setProjects(res.data.data);
      } else if (activeTab === 'enquiries') {
        const res = await api.get('/enquiries');
        setEnquiries(res.data.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const deleteProject = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Project',
      message: 'Are you sure you want to permanently delete this project? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.delete(`/projects/${id}`);
          fetchData();
          showToast('Project deleted successfully');
        } catch (err) {
          showToast('Failed to delete project', 'error');
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  const handleEdit = (project) => {
    setNewProject({
      name: project.name || '',
      location: project.location || '',
      projectType: project.projectType || 'Residential',
      status: project.status || 'Ongoing',
      totalUnits: project.totalUnits || '',
      description: project.description || '',
      shortDescription: project.shortDescription || '',
      possession: project.possession || '',
      reraNo: project.reraNo || '',
      featured: project.featured || false,
      amenities: project.amenities || ''
    });
    setEditProjectId(project.id);
    setFiles({ coverImage: null, layoutImage: [], brochure: null, galleryImages: [] });
    
    setExistingCoverUrl(project.coverImageUrl || null);
    setExistingBrochureUrl(project.brochureUrl || null);
    setExistingGalleryUrls(project.galleryImageUrls || []);
    setExistingLayoutUrls(project.layoutImageUrls || []);
    
    const names = {};
    (project.layoutImageUrls || []).forEach(url => {
      names[url] = getLayoutNameFromUrl(url);
    });
    setExistingLayoutNames(names);
    setNewLayoutNames([]);
    
    setActiveTab('addProject');
    setIsMobileMenuOpen(false);
  };

  const handleFileChange = (e, field) => {
    if (field === 'galleryImages' || field === 'layoutImage') {
      const newFiles = Array.from(e.target.files);
      const existing = files[field] || [];
      const merged = [...existing, ...newFiles];
      setFiles({ ...files, [field]: merged });
      if (field === 'layoutImage') {
        setNewLayoutNames(prev => [...prev, ...newFiles.map(() => '')]);
      }
    } else {
      setFiles({ ...files, [field]: e.target.files[0] });
    }
    // Reset the input so the same file can be re-selected
    e.target.value = '';
  };

  const handleNewLayoutNameChange = (index, value) => {
    const updated = [...newLayoutNames];
    updated[index] = value;
    setNewLayoutNames(updated);
  };

  const handleExistingLayoutNameChange = (url, value) => {
    setExistingLayoutNames({
      ...existingLayoutNames,
      [url]: value
    });
  };

  const handleRemoveExistingLayout = (urlToRemove) => {
    setExistingLayoutUrls(existingLayoutUrls.filter(url => url !== urlToRemove));
    const updatedNames = { ...existingLayoutNames };
    delete updatedNames[urlToRemove];
    setExistingLayoutNames(updatedNames);
  };

  const handleRemoveExistingGallery = (urlToRemove) => {
    setExistingGalleryUrls(existingGalleryUrls.filter(url => url !== urlToRemove));
  };

  const handleRemoveNewLayout = (indexToRemove) => {
    setFiles({ ...files, layoutImage: files.layoutImage.filter((_, i) => i !== indexToRemove) });
    setNewLayoutNames(newLayoutNames.filter((_, i) => i !== indexToRemove));
  };

  const handleRemoveNewGallery = (indexToRemove) => {
    setFiles({ ...files, galleryImages: files.galleryImages.filter((_, i) => i !== indexToRemove) });
  };

  const handleRemoveExistingCover = () => {
    setExistingCoverUrl(null);
  };

  const handleRemoveExistingBrochure = () => {
    setExistingBrochureUrl(null);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    
    const formData = new FormData();
    Object.keys(newProject).forEach(key => {
      if (newProject[key] !== '' && newProject[key] !== null) {
        formData.append(key, newProject[key]);
      }
    });

    if (editProjectId) {
      formData.append('coverImageUrl', existingCoverUrl || '');
      formData.append('brochureUrl', existingBrochureUrl || '');
      formData.append('existingGalleryImageUrls', JSON.stringify(existingGalleryUrls));
      
      const finalExistingLayoutUrls = existingLayoutUrls.map(url => {
        const cleanUrl = url.split('?')[0];
        const name = existingLayoutNames[url];
        if (name && name.trim()) {
          return `${cleanUrl}?name=${encodeURIComponent(name.trim())}`;
        }
        return cleanUrl;
      });
      formData.append('existingLayoutImageUrls', JSON.stringify(finalExistingLayoutUrls));
    }
    
    if (files.coverImage) formData.append('coverImage', files.coverImage);
    if (files.layoutImage && files.layoutImage.length > 0) {
      files.layoutImage.forEach(file => {
        formData.append('layoutImage', file);
      });
      formData.append('newLayoutNames', JSON.stringify(newLayoutNames));
    }
    if (files.brochure) formData.append('brochure', files.brochure);
    if (files.galleryImages && files.galleryImages.length > 0) {
      files.galleryImages.forEach(file => {
        formData.append('galleryImages', file);
      });
    }

    try {
      if (editProjectId) {
        await api.put(`/projects/${editProjectId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Project specifications updated successfully');
      } else {
        await api.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('New project published successfully');
      }
      
      setTimeout(() => {
        setNewProject({
          name: '', location: '', projectType: 'Residential', status: 'Ongoing',
          totalUnits: '', description: '', shortDescription: '', possession: '',
          reraNo: '', featured: false, amenities: ''
        });
        setFiles({ coverImage: null, layoutImage: [], brochure: null, galleryImages: [] });
        setEditProjectId(null);
        setExistingCoverUrl(null);
        setExistingBrochureUrl(null);
        setExistingGalleryUrls([]);
        setExistingLayoutUrls([]);
        setExistingLayoutNames({});
        setNewLayoutNames([]);
        setActiveTab('projects');
      }, 1000);
    } catch (err) {
      showToast(err.response?.data?.message || err.message, 'error');
    } finally {
      setLoadingForm(false);
    }
  };

  const featuredCount = projects.filter(p => p.featured).length;
  const isFeaturedDisabled = featuredCount >= 3 && !newProject.featured;

  const ORANGE = '#FF7043';
  const ORANGE_DARK = '#E64A19';
  const ORANGE_LIGHT = 'rgba(255, 112, 67, 0.08)';

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <style>{`
        .admin-layout { flex-direction: row; }
        .admin-sidebar { width: 280px; position: sticky; top: 0; z-index: 100; height: 100vh; background: white; border-right: 1px solid #E2E8F0; display: flex; flex-direction: column; }
        .mobile-nav-toggle { display: none; }
        .admin-main { flex: 1; padding: 2.5rem; overflow-y: auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .nav-btn {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 0.5rem;
          color: #64748B;
          background: transparent;
        }
        .nav-btn.active {
          background: ${ORANGE_LIGHT};
          color: ${ORANGE};
        }
        .nav-btn:hover:not(.active) {
          background: #F1F5F9;
          color: #334155;
          transform: translateX(4px);
        }

        .admin-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 25px rgba(0,0,0,0.03);
          border: 1px solid #E2E8F0;
          overflow: hidden;
        }

        .premium-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .premium-table th { background: #F8FAFC; color: #64748B; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 1.25rem 1.5rem; border-bottom: 1px solid #E2E8F0; text-align: left; }
        .premium-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #F1F5F9; color: #334155; font-size: 0.95rem; }
        .premium-table tr:last-child td { border-bottom: none; }
        .premium-table tr:hover td { background: #FDFDFD; }

        .orange-badge {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          background: ${ORANGE_LIGHT};
          color: ${ORANGE};
        }

        .btn-orange {
          background: ${ORANGE};
          color: white;
          border-radius: 12px;
          padding: 10px 20px;
          font-weight: 600;
          transition: 0.3s;
          box-shadow: 0 4px 12px rgba(255, 112, 67, 0.2);
        }
        .btn-orange:hover {
          background: ${ORANGE_DARK};
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(255, 112, 67, 0.3);
        }

        @media (max-width: 900px) {
          .admin-layout { flex-direction: column; }
          .admin-sidebar { 
             width: 100%; height: auto;
             position: fixed; top: 0; left: 0;
             transform: translateY(-100%); transition: transform 0.3s ease;
             box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .admin-sidebar.open { transform: translateY(0); }
          .mobile-nav-toggle { display: block; position: fixed; top: 1rem; right: 1rem; z-index: 101; background: white; border-radius: 10px; padding: 0.75rem 1.25rem; border: 1px solid #E2E8F0; cursor: pointer; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .admin-main { padding: 6rem 1.25rem 2rem 1.25rem !important; }
        }
      `}</style>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            style={{
              position: 'fixed',
              top: '2rem',
              right: '2rem',
              zIndex: 2000,
              background: toast.type === 'error' ? '#EF4444' : '#10B981',
              color: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}
          >
            <span>{toast.type === 'error' ? '❌' : '✅'}</span>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirm Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', maxWidth: '450px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'Playfair Display' }}>{confirmModal.title}</h3>
              <p style={{ color: '#64748B', marginBottom: '2rem', lineHeight: 1.6 }}>{confirmModal.message}</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                  style={{ padding: '12px 24px', borderRadius: '12px', background: '#F1F5F9', color: '#475569', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmModal.onConfirm}
                  style={{ padding: '12px 24px', borderRadius: '12px', background: '#EF4444', color: 'white', fontWeight: 600 }}
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <button className="mobile-nav-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? '✕ Close' : '☰ Menu'}
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ padding: '2.5rem 2rem', display: 'flex', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
          <Logo textStyle={{ transform: 'scale(0.9)', transformOrigin: 'left' }} />
        </div>
        
        <div style={{ padding: '2rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <button 
            onClick={() => { setActiveTab('projects'); setIsMobileMenuOpen(false); }}
            className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
          >
            <span>🏢</span> Manage Projects
          </button>
          <button 
            onClick={() => { 
              setEditProjectId(null); 
              setNewProject({name:'',location:'',projectType:'Residential',status:'Ongoing',totalUnits:'',description:'',shortDescription:'',possession:'',reraNo:'',featured:false,amenities:''});
              setFiles({coverImage:null,layoutImage:[],brochure:null,galleryImages:[]});
              setActiveTab('addProject'); 
              setIsMobileMenuOpen(false); 
            }}
            className={`nav-btn ${activeTab === 'addProject' ? 'active' : ''}`}
          >
            <span>➕</span> Add Project
          </button>
          <button 
            onClick={() => { setActiveTab('enquiries'); setIsMobileMenuOpen(false); }}
            className={`nav-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
          >
            <span>✉️</span> Enquiries
          </button>
        </div>

        <div style={{ padding: '1.5rem 1.25rem', borderTop: '1px solid #F1F5F9' }}>
          <button onClick={handleLogout} style={{ color: '#EF4444', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600, width: '100%', textAlign: 'left', background: '#FEF2F2', transition: '0.2s' }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        
        {/* VIEW: MANAGE PROJECTS OR ENQUIRIES */}
        {(activeTab === 'projects' || activeTab === 'enquiries') && (
          <div className="admin-card">
            <div style={{ padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderBottom: '1px solid #F1F5F9' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: '#1E293B' }}>{activeTab === 'projects' ? 'Project Portfolio' : 'Recent Enquiries'}</h2>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Comprehensive dashboard for site management</p>
              </div>
              {activeTab === 'projects' && (
                <button className="btn-orange" onClick={() => {
                  setEditProjectId(null); 
                  setNewProject({name:'',location:'',projectType:'Residential',status:'Ongoing',totalUnits:'',description:'',shortDescription:'',possession:'',reraNo:'',featured:false,amenities:''});
                  setFiles({coverImage:null,layoutImage:[],brochure:null,galleryImages:[]});
                  setActiveTab('addProject'); 
                }}>+ New Project</button>
              )}
            </div>

            <div style={{ overflowX: 'auto' }}>
              {activeTab === 'projects' ? (
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700, color: '#1E293B' }}>{p.name}</td>
                        <td style={{ color: '#64748B' }}>{p.location}</td>
                        <td style={{ color: '#64748B' }}>{p.projectType}</td>
                        <td>
                          <span className="orange-badge">{p.status}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button onClick={() => handleEdit(p)} style={{ background: '#F1F5F9', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#475569', cursor: 'pointer', transition: '0.2s' }}>Edit</button>
                            <button onClick={() => deleteProject(p.id)} style={{ color: '#EF4444', background: '#FEF2F2', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '5rem', color: '#94A3B8' }}>No project records available.</td></tr>}
                  </tbody>
                </table>
              ) : (
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Client Name</th>
                      <th>Contact</th>
                      <th>Project Interest</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((e) => (
                      <tr key={e.id}>
                        <td style={{ color: '#64748B', fontSize: '0.85rem' }}>{new Date(e.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td style={{ fontWeight: 700, color: '#1E293B' }}>{e.name}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem', color: '#334155' }}>{e.phone}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{e.email}</span>
                          </div>
                        </td>
                        <td><span className="orange-badge" style={{ background: '#F1F5F9', color: '#475569' }}>{e.project?.name || 'General Inquiry'}</span></td>
                        <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#64748B', fontStyle: 'italic' }} title={e.message}>"{e.message}"</td>
                      </tr>
                    ))}
                    {enquiries.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '5rem', color: '#94A3B8' }}>No inquiries received yet.</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* VIEW: ADD NEW PROJECT */}
        {activeTab === 'addProject' && (
          <div className="admin-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '3.5rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', color: '#1E293B' }}>{editProjectId ? 'Edit Project' : 'New Project'}</h2>
              <p style={{ color: '#64748B', fontSize: '1rem' }}>Enter project specifications and media assets below.</p>
            </div>

            <form onSubmit={handleAddProject}>
              <div style={{ marginBottom: '3.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: ORANGE, borderBottom: `2px solid ${ORANGE_LIGHT}`, paddingBottom: '0.75rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Identity & Location</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#475569' }}>Project Title *</label>
                    <input type="text" className="form-input" style={{ borderRadius: '12px' }} value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} required placeholder="e.g. SV Aarambh" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#475569' }}>City / Location *</label>
                    <input type="text" className="form-input" style={{ borderRadius: '12px' }} value={newProject.location} onChange={(e) => setNewProject({...newProject, location: e.target.value})} required placeholder="e.g. Navi Mumbai" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#475569' }}>Category *</label>
                    <select className="form-input" style={{ borderRadius: '12px' }} value={newProject.projectType} onChange={(e) => setNewProject({...newProject, projectType: e.target.value})}>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Township">Township</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#475569' }}>Development Status *</label>
                    <select className="form-input" style={{ borderRadius: '12px' }} value={newProject.status} onChange={(e) => setNewProject({...newProject, status: e.target.value})}>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '3.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: ORANGE, borderBottom: `2px solid ${ORANGE_LIGHT}`, paddingBottom: '0.75rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Detailed Overview</h3>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#475569' }}>Tagline / Short Intro</label>
                  <input type="text" className="form-input" style={{ borderRadius: '12px' }} value={newProject.shortDescription} onChange={(e) => setNewProject({...newProject, shortDescription: e.target.value})} placeholder="Exquisite 2BHK urban living..." />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#475569' }}>Narrative Description</label>
                  <textarea className="form-input" style={{ borderRadius: '12px' }} rows="5" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} placeholder="Elaborate on project features and vision..."></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#475569' }}>Amenities (Separated by commas)</label>
                  <input type="text" className="form-input" style={{ borderRadius: '12px' }} value={newProject.amenities} onChange={(e) => setNewProject({...newProject, amenities: e.target.value})} placeholder="e.g. Infinity Pool, Zen Garden, Sky Gym" />
                </div>
              </div>

              <div style={{ marginBottom: '3.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: ORANGE, borderBottom: `2px solid ${ORANGE_LIGHT}`, paddingBottom: '0.75rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#475569' }}>Config / Units</label>
                    <input type="text" className="form-input" style={{ borderRadius: '12px' }} value={newProject.totalUnits} onChange={(e) => setNewProject({...newProject, totalUnits: e.target.value})} placeholder="e.g. 150 Units" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#475569' }}>Timeline</label>
                    <input type="text" className="form-input" style={{ borderRadius: '12px' }} value={newProject.possession} onChange={(e) => setNewProject({...newProject, possession: e.target.value})} placeholder="e.g. Dec 2026" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#475569' }}>RERA ID</label>
                    <input type="text" className="form-input" style={{ borderRadius: '12px' }} value={newProject.reraNo} onChange={(e) => setNewProject({...newProject, reraNo: e.target.value})} placeholder="Registration #" />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '12px' }}>
                  <input 
                    type="checkbox" 
                    id="featured" 
                    checked={newProject.featured} 
                    disabled={isFeaturedDisabled}
                    onChange={(e) => setNewProject({...newProject, featured: e.target.checked})} 
                    style={{ width: '20px', height: '20px', accentColor: ORANGE, cursor: isFeaturedDisabled ? 'not-allowed' : 'pointer' }} 
                  />
                  <label htmlFor="featured" style={{ fontWeight: 600, cursor: isFeaturedDisabled ? 'not-allowed' : 'pointer', color: isFeaturedDisabled ? '#94A3B8' : '#334155' }}>
                    Promote on Homepage Showcase
                    {isFeaturedDisabled && (
                      <span style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: 500, marginLeft: '0.5rem', textTransform: 'none' }}>
                        (Max 3 featured projects reached)
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: ORANGE, borderBottom: `2px solid ${ORANGE_LIGHT}`, paddingBottom: '0.75rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Media Library</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  
                  {/* Cover Image */}
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#475569' }}>Primary Cover Image {editProjectId ? '(Optional)' : '*'}</label>
                    <input type="file" id="coverImageInput" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleFileChange(e, 'coverImage')} />
                    
                    {files.coverImage ? (
                      <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.5rem' }}>
                        <img src={getLocalPreview(files.coverImage)} alt="New Cover" style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                        <button type="button" onClick={() => { setFiles({...files, coverImage: null}); document.getElementById('coverImageInput').value = ''; }}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>✕</button>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginTop: '0.35rem' }}>New Cover Selected</span>
                      </div>
                    ) : existingCoverUrl ? (
                      <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.5rem' }}>
                        <img src={existingCoverUrl} alt="Cover Preview" style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                        <button type="button" onClick={handleRemoveExistingCover}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>✕</button>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', marginTop: '0.35rem' }}>Current Cover</span>
                      </div>
                    ) : null}

                    {(!files.coverImage && !existingCoverUrl) && (
                      <div onClick={() => document.getElementById('coverImageInput').click()}
                        style={{ marginTop: '0.5rem', border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: '0.2s', background: '#FAFBFC' }}>
                        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🖼️</span>
                        <span style={{ color: ORANGE, fontWeight: 600, fontSize: '0.9rem' }}>Click to upload cover image</span>
                        <span style={{ display: 'block', color: '#94A3B8', fontSize: '0.8rem', marginTop: '0.25rem' }}>PNG, JPG, WEBP supported</span>
                      </div>
                    )}
                    {(files.coverImage || existingCoverUrl) && (
                      <button type="button" onClick={() => document.getElementById('coverImageInput').click()}
                        style={{ marginTop: '0.5rem', background: ORANGE_LIGHT, color: ORANGE, border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                        Replace Cover
                      </button>
                    )}
                  </div>

                  {/* Brochure */}
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#475569' }}>Brochure (PDF Document)</label>
                    <input type="file" id="brochureInput" style={{ display: 'none' }} accept="application/pdf" onChange={(e) => handleFileChange(e, 'brochure')} />
                    
                    {files.brochure ? (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                        <span style={{ fontSize: '1.5rem' }}>📄</span>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <span style={{ fontSize: '0.85rem', color: '#16A34A', fontWeight: 600, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{files.brochure.name}</span>
                          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>New PDF selected</span>
                        </div>
                        <button type="button" onClick={() => { setFiles({...files, brochure: null}); document.getElementById('brochureInput').value = ''; }}
                          style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                      </div>
                    ) : existingBrochureUrl ? (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '1.5rem' }}>📄</span>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                          <a href={existingBrochureUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: ORANGE, fontWeight: 600, textDecoration: 'underline', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>View Current Brochure</a>
                          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>PDF Document</span>
                        </div>
                        <button type="button" onClick={handleRemoveExistingBrochure}
                          style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                      </div>
                    ) : null}

                    {(!files.brochure && !existingBrochureUrl) && (
                      <div onClick={() => document.getElementById('brochureInput').click()}
                        style={{ marginTop: '0.5rem', border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: '0.2s', background: '#FAFBFC' }}>
                        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📋</span>
                        <span style={{ color: ORANGE, fontWeight: 600, fontSize: '0.9rem' }}>Click to upload brochure</span>
                        <span style={{ display: 'block', color: '#94A3B8', fontSize: '0.8rem', marginTop: '0.25rem' }}>PDF files only</span>
                      </div>
                    )}
                    {(files.brochure || existingBrochureUrl) && (
                      <button type="button" onClick={() => document.getElementById('brochureInput').click()}
                        style={{ marginTop: '0.5rem', background: ORANGE_LIGHT, color: ORANGE, border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                        Replace Brochure
                      </button>
                    )}
                  </div>

                  {/* Layouts */}
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ color: '#475569' }}>Floor Plans & Layouts</label>
                    <input type="file" id="layoutImageInput" style={{ display: 'none' }} accept="image/*" multiple onChange={(e) => handleFileChange(e, 'layoutImage')} />
                    
                    {/* Existing layouts (edit mode) */}
                    {existingLayoutUrls.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.75rem' }}>
                          Current Layouts ({existingLayoutUrls.length})
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {existingLayoutUrls.map((url, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                              <img src={url.split('?')[0]} alt={`Layout ${index}`} style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #CBD5E1' }} />
                              <div style={{ flex: 1 }}>
                                <input type="text" className="form-input" 
                                  style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '0.85rem' }} 
                                  placeholder="e.g. 1 BHK Layout" 
                                  value={existingLayoutNames[url] || ''} 
                                  onChange={(e) => handleExistingLayoutNameChange(url, e.target.value)} />
                              </div>
                              <button type="button" onClick={() => handleRemoveExistingLayout(url)}
                                style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Newly selected layouts */}
                    {files.layoutImage && files.layoutImage.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: ORANGE, display: 'block', marginBottom: '0.75rem' }}>
                          New Layouts ({files.layoutImage.length})
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {files.layoutImage.map((file, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#FFF7ED', padding: '0.75rem', borderRadius: '12px', border: '1px solid #FED7AA' }}>
                              <img src={getLocalPreview(file)} alt={`New Layout ${index}`} style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #FFCCBC' }} />
                              <div style={{ flex: 1 }}>
                                <input type="text" className="form-input" 
                                  style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '0.85rem' }} 
                                  placeholder="e.g. 2 BHK Layout" 
                                  value={newLayoutNames[index] || ''} 
                                  onChange={(e) => handleNewLayoutNameChange(index, e.target.value)} />
                              </div>
                              <button type="button" onClick={() => handleRemoveNewLayout(index)}
                                style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div onClick={() => document.getElementById('layoutImageInput').click()}
                      style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', cursor: 'pointer', background: '#FAFBFC' }}>
                      <span style={{ color: ORANGE, fontWeight: 600, fontSize: '0.9rem' }}>+ Add Layout Images</span>
                      <span style={{ display: 'block', color: '#94A3B8', fontSize: '0.75rem', marginTop: '0.25rem' }}>Upload floor plans (multiple allowed)</span>
                    </div>
                  </div>

                  {/* Gallery */}
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ color: '#475569' }}>Gallery Showcase</label>
                    <input type="file" id="galleryImagesInput" style={{ display: 'none' }} accept="image/*" multiple onChange={(e) => handleFileChange(e, 'galleryImages')} />
                    
                    {/* Existing gallery (edit mode) */}
                    {existingGalleryUrls.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '0.75rem' }}>
                          Current Images ({existingGalleryUrls.length})
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                          {existingGalleryUrls.map((url, index) => (
                            <div key={index} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                              <img src={url} alt={`Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={() => handleRemoveExistingGallery(url)}
                                style={{ position: 'absolute', top: '4px', right: '4px', background: '#EF4444', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', cursor: 'pointer', border: '1.5px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Newly selected gallery images */}
                    {files.galleryImages && files.galleryImages.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: ORANGE, display: 'block', marginBottom: '0.75rem' }}>
                          New Images ({files.galleryImages.length})
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                          {files.galleryImages.map((file, index) => (
                            <div key={index} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '10px', overflow: 'hidden', border: '1px solid #FED7AA' }}>
                              <img src={getLocalPreview(file)} alt={`New Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={() => handleRemoveNewGallery(index)}
                                style={{ position: 'absolute', top: '4px', right: '4px', background: '#EF4444', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', cursor: 'pointer', border: '1.5px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div onClick={() => document.getElementById('galleryImagesInput').click()}
                      style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', cursor: 'pointer', background: '#FAFBFC' }}>
                      <span style={{ color: ORANGE, fontWeight: 600, fontSize: '0.9rem' }}>+ Add Gallery Images</span>
                      <span style={{ display: 'block', color: '#94A3B8', fontSize: '0.75rem', marginTop: '0.25rem' }}>Upload showcase photos (multiple allowed)</span>
                    </div>
                  </div>

                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', borderTop: '2px solid #F1F5F9', paddingTop: '2.5rem' }}>
                <button type="button" className="nav-btn" style={{ background: '#F1F5F9', margin: 0, padding: '14px 32px' }} onClick={() => { setActiveTab('projects'); setEditProjectId(null); }}>Discard Changes</button>
                <button type="submit" className="btn-orange" style={{ padding: '14px 48px', fontSize: '1rem', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }} disabled={loadingForm}>
                  {loadingForm && <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>}
                  {loadingForm ? (editProjectId ? 'Syncing...' : 'Publishing...') : (editProjectId ? 'Update Specifications' : 'Publish Project')}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
