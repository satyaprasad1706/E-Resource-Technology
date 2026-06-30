import React, { useState, useEffect } from 'react';
import { 
  getResources, addResource, deleteResource, incrementDownload 
} from '../firebase/database';
import ResourceCard from '../components/ResourceCard';
import { useAuth } from '../context/AuthContext';
import { Search, SlidersHorizontal, BookOpen, Download, X, Eye, FileText, Info, Plus } from 'lucide-react';
import { departments } from '../data/syllabus';

const Resources = () => {
  const { currentUser } = useAuth();
  const [resourceList, setResourceList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);

  // New Resource Form Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDept, setNewDept] = useState(departments[0] || 'Computer Science');
  const [newSem, setNewSem] = useState('4th Semester');
  const [newType, setNewType] = useState('Notes');
  const [newFormat, setNewFormat] = useState('PDF');
  const [newSize, setNewSize] = useState('2.5 MB');
  const [newDesc, setNewDesc] = useState('');

  // File Upload States
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState('');
  const [fileError, setFileError] = useState('');

  // Selected resource for preview modal
  const [previewResource, setPreviewResource] = useState(null);

  const canUpload = currentUser?.role === 'Admin' || currentUser?.role === 'Professor';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (Firestore document limit is 1MB)
    if (file.size > 1024 * 1024) {
      setFileError("⚠️ File is too large! Firestore documents must be under 1 MB. Please compress or select a smaller PDF.");
      setSelectedFile(null);
      setFileData('');
      return;
    }

    setFileError('');
    setSelectedFile(file);

    // Auto-fill Title if empty
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
    if (!newTitle) {
      setNewTitle(nameWithoutExt);
    }
    
    // Auto-calculate Size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB < 0.1) {
      setNewSize(`${(file.size / 1024).toFixed(1)} KB`);
    } else {
      setNewSize(`${sizeInMB.toFixed(2)} MB`);
    }

    // Auto-detect format from extension
    const ext = file.name.split('.').pop().toUpperCase();
    if (['PDF', 'PPTX', 'DOCX', 'PPT', 'DOC'].includes(ext)) {
      setNewFormat(ext);
    } else {
      setNewFormat('PDF');
    }

    // Read file as Base64 data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileData(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenLiveFile = (resource) => {
    if (!resource.fileData) return;
    
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(
        `<iframe src="${resource.fileData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
    } else {
      alert("Popup blocked! Please allow popups to view the file in your browser.");
    }
  };

  const fetchResources = async () => {
    try {
      const data = await getResources();
      setResourceList(data);
    } catch (e) {
      console.error("Resources fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Extract unique subjects for dropdown filter
  const subjects = ['All', ...new Set(resourceList.map(r => r.subject))];
  const types = ['All', 'Notes', 'E-book', 'PPTs', 'Previous Papers'];

  // Handle downloads
  const handleDownload = async (resource) => {
    try {
      await incrementDownload(resource.id);
      // Reflect count immediately in local state
      setResourceList(prev =>
        prev.map(r => r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r)
      );

      if (resource.fileData) {
        // Trigger browser download for base64 file
        const downloadLink = document.createElement("a");
        downloadLink.href = resource.fileData;
        
        let ext = resource.format ? resource.format.toLowerCase() : 'pdf';
        // Remove special characters for clean filename
        const safeName = resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        downloadLink.download = `${safeName}.${ext}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        alert(`📥 Downloading Outline: "${resource.title}" (${resource.size})\nFormat: ${resource.format}\n\nNote: This is a pre-seeded mock resource. Actual files uploaded by you will download directly!`);
      }
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download resource file.");
    }
  };

  // Handle deletions
  const handleDelete = async (id) => {
    await deleteResource(id);
    setResourceList(prev => prev.filter(r => r.id !== id));
    alert("🗑️ Resource deleted successfully!");
  };

  // Handle addition form submissions
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle || !newSubject || !newDesc) {
      alert("Please fill in all required fields!");
      return;
    }

    const payload = {
      title: newTitle,
      subject: newSubject,
      department: newDept,
      semester: newSem,
      type: newType,
      format: newFormat.toUpperCase(),
      size: newSize,
      description: newDesc,
      uploadedBy: currentUser?.name || 'Professor',
      fileData: fileData || null
    };

    try {
      const added = await addResource(payload);
      setResourceList(prev => [added, ...prev]);
      
      // Reset Form
      setNewTitle('');
      setNewSubject('');
      setNewDesc('');
      setSelectedFile(null);
      setFileData('');
      setFileError('');
      setShowAddModal(false);
      alert("🎉 New resource document successfully uploaded to database!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to add resource to database. Please try again.");
    }
  };

  const handleView = (resource) => {
    setPreviewResource(resource);
  };

  // Filtering Logic
  const filteredResources = resourceList.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubject === 'All' || resource.subject === selectedSubject;
    const matchesType = selectedType === 'All' || resource.type === selectedType;

    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
            E-Resource Library
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Browse official university lecture notes, textbook solutions, PPT slides, and solved papers.
          </p>
        </div>
        
        {/* Conditional floating add button for staffs */}
        {canUpload && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Upload New Resource</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-150 dark:border-slate-700/60 shadow-sm space-y-4 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-6">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              placeholder="Search by title, subject, or professor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
            />
          </div>

          {/* Subject Dropdown */}
          <div className="relative md:col-span-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="pl-10 block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 font-semibold"
              >
                <option value="All">All Subjects</option>
                {subjects.slice(1).map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters button */}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubject('All');
              setSelectedType('All');
            }}
            className="md:col-span-2 px-4 py-2 border border-slate-200 dark:border-slate-650 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-1"
          >
            Clear Filters
          </button>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-700/50 text-xs">
          <span className="font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wider mr-2">
            Material Type:
          </span>
          {types.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                selectedType === type
                  ? 'bg-primary border-primary text-white dark:bg-blue-600 dark:border-blue-600'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state indicator */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Fetching syllabus files...</p>
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onDownload={handleDownload}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <SlidersHorizontal className="h-10 w-10 text-slate-350 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No resources match your filters</h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search query, selecting "All Subjects", or toggling different material formats.
          </p>
        </div>
      )}

      {/* Details/Preview Modal Pop-up */}
      {previewResource && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-250 dark:border-slate-700 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 relative">
            <button
              onClick={() => setPreviewResource(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="bg-blue-50 text-primary dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {previewResource.type}
              </span>
              <span className="text-xs text-slate-400">
                {previewResource.format} • {previewResource.size}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100 pr-8">
                {previewResource.title}
              </h3>
              <p className="text-xs font-semibold text-primary dark:text-blue-400">
                Course: {previewResource.subject}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Full Description:
              </p>
              <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                {previewResource.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/60 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-slate-400">Uploaded By</p>
                <p className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{previewResource.uploadedBy}</p>
              </div>
              <div>
                <p className="text-slate-400">Downloads count</p>
                <p className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{previewResource.downloads} hits</p>
              </div>
            </div>

            {previewResource.fileData && (
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mt-3 h-[250px] relative">
                {previewResource.format === 'PDF' ? (
                  <iframe 
                    src={previewResource.fileData} 
                    className="w-full h-full" 
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-slate-900 text-slate-400 space-y-1">
                    <FileText className="h-8 w-8 text-primary dark:text-cyan-400 animate-pulse" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-205">Live Preview not available for {previewResource.format}</p>
                    <p className="text-[10px] text-slate-400">Please download the file to view its contents.</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
              >
                Close View
              </button>
              {previewResource.fileData && (
                <button
                  onClick={() => {
                    handleOpenLiveFile(previewResource);
                    setPreviewResource(null);
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>Open Fullscreen</span>
                </button>
              )}
              <button
                onClick={() => {
                  handleDownload(previewResource);
                  setPreviewResource(null);
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Download Asset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Resource Modal (Upload) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-250 dark:border-slate-700 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => {
                setNewTitle('');
                setNewSubject('');
                setNewDesc('');
                setSelectedFile(null);
                setFileData('');
                setFileError('');
                setShowAddModal(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Upload Asset Outlines
              </span>
              <h3 className="text-lg font-extrabold text-slate-850 dark:text-slate-100">
                Create New Resource Card
              </h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
              {/* File Upload Zone */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Upload Document File (PDF, PPTX, DOCX) *
                </label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer relative">
                  <input
                    type="file"
                    required
                    accept=".pdf,.docx,.pptx,.ppt,.doc"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="text-center space-y-1">
                    <Plus className="h-6 w-6 text-primary dark:text-cyan-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {selectedFile ? `📎 Selected: ${selectedFile.name}` : "Click to select a document file"}
                    </p>
                    <p className="text-[10px] text-slate-455 dark:text-slate-400">
                      Supports PDF, PPTX, DOCX (Max size: 1 MB)
                    </p>
                  </div>
                </div>
                {fileError && (
                  <p className="text-[10px] text-red-500 font-semibold">{fileError}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Operating Systems solved mid-semester paper"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Subject */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operating Systems"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                  />
                </div>

                {/* File size */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    File Size Estimate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4.5 MB"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {/* Dept */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="block w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Sem */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Semester</label>
                  <select
                    value={newSem}
                    onChange={(e) => setNewSem(e.target.value)}
                    className="block w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="3rd Semester">3rd Sem</option>
                    <option value="4th Semester">4th Sem</option>
                    <option value="5th Semester">5th Sem</option>
                  </select>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value)}
                    className="block w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="PPTX">Powerpoint slides</option>
                    <option value="DOCX">Word Sheet</option>
                  </select>
                </div>
              </div>

              {/* Resource Type */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Resource Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Notes">📝 Lecture Notes</option>
                  <option value="E-book">📚 Standard E-book</option>
                  <option value="PPTs">📊 Micro-Lecture PPTs</option>
                  <option value="Previous Papers">📂 Previous Solved Papers</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Description / Study Guidelines *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize what this resource covers to help students study..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewTitle('');
                    setNewSubject('');
                    setNewDesc('');
                    setSelectedFile(null);
                    setFileData('');
                    setFileError('');
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-650 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
export { Resources };
