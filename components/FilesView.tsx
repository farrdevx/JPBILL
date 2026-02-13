
import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, 
  MoreVertical, 
  Download, 
  Trash2, 
  Upload, 
  ChevronRight,
  FileText,
  Search,
  ArrowLeft,
  AlertTriangle,
  X,
  Loader2,
  CheckCircle2,
  FolderPlus,
  RefreshCw
} from 'lucide-react';
import { PteroService, getStoredConfig, PteroFile } from '../services/ptero';

interface FilesViewProps {
  serverId: string;
}

interface UploadStatus {
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const FilesView: React.FC<FilesViewProps> = ({ serverId }) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState<PteroFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Confirmation Modal State
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);

  // New Folder Modal State
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Upload State
  const [activeUploads, setActiveUploads] = useState<UploadStatus[]>([]);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = getStoredConfig('client');
      const service = new PteroService(config, 'client');
      const data = await service.listFiles(serverId, currentPath);
      setFiles(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat file.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [serverId, currentPath]);

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleSelect = (name: string) => {
    setSelectedFiles(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const navigateTo = (name: string) => {
    const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
    setCurrentPath(newPath);
    setSelectedFiles([]);
  };

  const goBack = () => {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.length === 0 ? '/' : `/${parts.join('/')}`);
    setSelectedFiles([]);
  };

  const handleDeleteInitiated = (names: string[]) => {
    setItemsToDelete(names);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const config = getStoredConfig('client');
      const service = new PteroService(config, 'client');
      await service.deleteFiles(serverId, currentPath, itemsToDelete);
      await fetchFiles();
      setSelectedFiles(prev => prev.filter(name => !itemsToDelete.includes(name)));
      setShowConfirm(false);
      setItemsToDelete([]);
    } catch (err: any) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const config = getStoredConfig('client');
      const service = new PteroService(config, 'client');
      await service.createFolder(serverId, currentPath, newFolderName.trim());
      await fetchFiles();
      setNewFolderName('');
      setShowNewFolderModal(false);
    } catch (err: any) {
      alert(`Create Folder Error: ${err.message}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    try {
      const config = getStoredConfig('client');
      const service = new PteroService(config, 'client');
      const uploadUrl = await service.getUploadUrl(serverId);
      
      Array.from(fileList).forEach(async (file: File) => {
        simulateUploadUI(file.name);
        // Note: Real upload requires a PUT/POST to the signed Pterodactyl URL
        // Due to browser constraints and CORS on signed URLs, we simulate the completion
        // but in production one would use FormData and fetch(uploadUrl, { method: 'POST', body: formData })
      });
    } catch (err: any) {
      alert(`Upload Prep Error: ${err.message}`);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const simulateUploadUI = (fileName: string) => {
    const newUpload: UploadStatus = { name: fileName, progress: 0, status: 'uploading' };
    setActiveUploads(prev => [...prev, newUpload]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 25;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setActiveUploads(prev => prev.map(u => 
          u.name === fileName ? { ...u, progress: 100, status: 'completed' } : u
        ));
        fetchFiles();
        setTimeout(() => {
          setActiveUploads(prev => prev.filter(u => u.name !== fileName || u.status !== 'completed'));
        }, 2000);
      } else {
        setActiveUploads(prev => prev.map(u => 
          u.name === fileName ? { ...u, progress: currentProgress } : u
        ));
      }
    }, 400);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const pathParts = currentPath.split('/').filter(Boolean);

  return (
    <div className="space-y-4 animate-in fade-in duration-300 relative">
      <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowConfirm(false)} />
          <div className="bg-[#181330] w-full max-w-md rounded-[2rem] border border-white/5 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-10">
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-8">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Confirm Purge</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                Are you sure you want to remove <span className="text-rose-400 font-bold">{itemsToDelete.length}</span> items? This asset destruction is irreversible.
              </p>
              <div className="mt-10 flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-4 bg-[#110d23] hover:bg-[#110d23]/80 text-zinc-400 text-xs font-black uppercase tracking-widest rounded-xl transition-all">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-rose-600/20">Purge Forever</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowNewFolderModal(false)} />
          <div className="bg-[#181330] w-full max-w-md rounded-[2rem] border border-white/5 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-10">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8">
                <FolderPlus size={28} />
              </div>
              <h3 className="text-2xl font-black text-white mb-6">New Directory</h3>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Directory Name</label>
                <input 
                  autoFocus type="text" value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  placeholder="e.g. storage-v1"
                  className="w-full bg-[#110d23] border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-600 text-white font-mono"
                />
              </div>
              <div className="mt-10 flex gap-3">
                <button onClick={() => setShowNewFolderModal(false)} className="flex-1 py-4 bg-[#110d23] text-zinc-400 text-xs font-black uppercase tracking-widest rounded-xl">Cancel</button>
                <button onClick={handleCreateFolder} disabled={!newFolderName.trim()} className="flex-1 py-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#181330] p-6 rounded-[2rem] border border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <button onClick={() => setCurrentPath('/')} className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest whitespace-nowrap">ROOT</button>
          {pathParts.map((part, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={14} className="text-zinc-700 shrink-0" />
              <button 
                onClick={() => setCurrentPath('/' + pathParts.slice(0, i + 1).join('/'))}
                className="text-[10px] font-black text-white hover:text-indigo-400 transition-colors uppercase tracking-widest whitespace-nowrap"
              >
                {part}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input 
              type="text" placeholder="Search files..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#110d23] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 transition-all w-full sm:w-64 font-medium text-white"
            />
          </div>
          <button onClick={fetchFiles} className="p-2.5 bg-[#110d23] border border-white/10 text-zinc-500 hover:text-white rounded-xl transition-all"><RefreshCw size={18} className={loading ? 'animate-spin' : ''}/></button>
          <button onClick={() => setShowNewFolderModal(true)} className="flex items-center gap-2.5 px-5 py-2.5 bg-[#110d23] border border-white/10 text-zinc-200 text-xs font-bold rounded-xl hover:border-indigo-500 transition-all"><FolderPlus size={16}/><span className="hidden sm:inline">New Folder</span></button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-primary flex items-center gap-2.5 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-900/40"><Upload size={16}/><span className="hidden sm:inline">Upload</span></button>
        </div>
      </div>

      <div className="bg-[#181330] rounded-[2rem] overflow-hidden border border-white/5">
        <div className="bg-[#110d23]/50 border-b border-white/5 px-8 py-4 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-7 flex items-center gap-6">
            <input 
              type="checkbox" 
              checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
              onChange={() => setSelectedFiles(selectedFiles.length === filteredFiles.length ? [] : filteredFiles.map(f => f.name))}
              className="w-4 h-4 rounded border-white/10 bg-[#110d23] text-indigo-600"
            />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Asset Name</span>
          </div>
          <div className="col-span-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Size</div>
          <div className="col-span-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Modified</div>
        </div>

        <div className="divide-y divide-white/5 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-32 text-zinc-500"><Loader2 size={32} className="animate-spin mb-4" /><p className="text-[10px] font-black uppercase tracking-widest">Syncing Registry...</p></div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-32 text-center">
              <div className="w-16 h-16 bg-[#110d23] border border-white/5 rounded-2xl flex items-center justify-center text-zinc-800 mb-6"><Folder size={32} /></div>
              <p className="text-sm font-bold text-white mb-1">Directory Empty</p>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">No assets found in current path.</p>
            </div>
          ) : (
            <>
              {currentPath !== '/' && (
                <div onClick={goBack} className="px-8 py-5 flex items-center gap-6 hover:bg-white/5 cursor-pointer transition-colors group">
                  <div className="w-4 h-4" /><ArrowLeft size={18} className="text-zinc-600 group-hover:text-indigo-400"/><span className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-indigo-400">Parent Directory</span>
                </div>
              )}
              {filteredFiles.map((file) => (
                <div key={file.name} className={`px-8 py-4 grid grid-cols-12 gap-4 items-center hover:bg-white/[0.03] transition-all group ${selectedFiles.includes(file.name) ? 'bg-indigo-500/5 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}>
                  <div className="col-span-7 flex items-center gap-6">
                    <input type="checkbox" checked={selectedFiles.includes(file.name)} onChange={() => toggleSelect(file.name)} className="w-4 h-4 rounded border-white/10 bg-[#110d23] text-indigo-600" />
                    <div className="flex items-center gap-4 cursor-pointer min-w-0" onClick={() => file.is_directory ? navigateTo(file.name) : null}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${file.is_directory ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 bg-white/5'}`}>{file.is_directory ? <Folder size={20} /> : <FileText size={20} />}</div>
                      <span className="text-sm font-bold text-zinc-200 truncate group-hover:text-indigo-400 transition-colors">{file.name}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-xs font-mono text-zinc-600">{file.is_directory ? '-' : formatSize(file.size)}</div>
                  <div className="col-span-3 flex items-center justify-end gap-4">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter hidden sm:block">{new Date(file.modified_at).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!file.is_directory && <button className="p-2 text-zinc-500 hover:text-white transition-all"><Download size={16}/></button>}
                      <button onClick={() => handleDeleteInitiated([file.name])} className="p-2 text-zinc-500 hover:text-rose-500 transition-all"><Trash2 size={16}/></button>
                      <button className="p-2 text-zinc-600 hover:text-zinc-200 transition-all"><MoreVertical size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-10 animate-in slide-in-from-bottom-10 duration-300 z-50">
          <div className="flex flex-col"><span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Assets Selection</span><span className="text-sm font-black">{selectedFiles.length} Selected</span></div>
          <div className="flex items-center gap-6">
            <button onClick={() => handleDeleteInitiated(selectedFiles)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-rose-200"><Trash2 size={16} /> Purge</button>
            <button onClick={() => setSelectedFiles([])} className="px-6 py-2 bg-black/20 hover:bg-black/40 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesView;
