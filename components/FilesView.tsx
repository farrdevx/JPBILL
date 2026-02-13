
import React, { useState, useRef } from 'react';
import { 
  Folder, 
  File, 
  MoreVertical, 
  Download, 
  Trash2, 
  Upload, 
  Plus, 
  ChevronRight,
  FileText,
  Search,
  ArrowLeft,
  AlertTriangle,
  X,
  Loader2,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';

interface FileItem {
  name: string;
  size: string;
  modified: string;
  isFolder: boolean;
}

interface UploadStatus {
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const INITIAL_MOCK_FILES: Record<string, FileItem[]> = {
  '/': [
    { name: 'logs', size: '-', modified: '2 hours ago', isFolder: true },
    { name: 'world', size: '-', modified: '5 mins ago', isFolder: true },
    { name: 'plugins', size: '-', modified: '1 day ago', isFolder: true },
    { name: 'server.jar', size: '34.5 MB', modified: 'Mar 12, 2024', isFolder: false },
    { name: 'eula.txt', size: '128 B', modified: 'Mar 10, 2024', isFolder: false },
    { name: 'server.properties', size: '2.4 KB', modified: 'Mar 11, 2024', isFolder: false },
    { name: 'spigot.yml', size: '4.1 KB', modified: 'Mar 11, 2024', isFolder: false },
    { name: 'whitelist.json', size: '12 B', modified: 'Mar 08, 2024', isFolder: false },
  ],
  '/logs': [
    { name: 'latest.log', size: '45 KB', modified: 'Just now', isFolder: false },
    { name: '2024-03-11-1.log.gz', size: '120 KB', modified: '1 day ago', isFolder: false },
  ],
  '/world': [
    { name: 'region', size: '-', modified: '5 mins ago', isFolder: true },
    { name: 'level.dat', size: '1.2 KB', modified: '5 mins ago', isFolder: false },
  ],
  '/plugins': [],
  '/world/region': []
};

const FilesView: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [fileSystem, setFileSystem] = useState(INITIAL_MOCK_FILES);
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

  const files = fileSystem[currentPath] || [];
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

  const confirmDelete = () => {
    setFileSystem(prev => {
      const updatedList = prev[currentPath].filter(f => !itemsToDelete.includes(f.name));
      const newState = { ...prev, [currentPath]: updatedList };
      // Also cleanup sub-paths if we deleted a folder (mock only)
      return newState;
    });
    setSelectedFiles(prev => prev.filter(name => !itemsToDelete.includes(name)));
    setShowConfirm(false);
    setItemsToDelete([]);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const folderName = newFolderName.trim();
    const subPath = currentPath === '/' ? `/${folderName}` : `${currentPath}/${folderName}`;

    const newFolder: FileItem = {
      name: folderName,
      size: '-',
      modified: 'Just now',
      isFolder: true
    };

    setFileSystem(prev => ({
      ...prev,
      [currentPath]: [newFolder, ...prev[currentPath]],
      [subPath]: [] // Initialize empty directory key for navigation
    }));

    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      simulateUpload(file.name);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const simulateUpload = (fileName: string) => {
    const newUpload: UploadStatus = { name: fileName, progress: 0, status: 'uploading' };
    setActiveUploads(prev => [...prev, newUpload]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 20;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setActiveUploads(prev => prev.map(u => 
          u.name === fileName ? { ...u, progress: 100, status: 'completed' } : u
        ));
        
        // Add to local state when finished
        setFileSystem(prev => ({
          ...prev,
          [currentPath]: [
            { name: fileName, size: 'Auto', modified: 'Just now', isFolder: false },
            ...prev[currentPath]
          ]
        }));

        setTimeout(() => {
          setActiveUploads(prev => prev.filter(u => u.name !== fileName || u.status !== 'completed'));
        }, 2000);
      } else {
        setActiveUploads(prev => prev.map(u => 
          u.name === fileName ? { ...u, progress: currentProgress } : u
        ));
      }
    }, 300);
  };

  const pathParts = currentPath.split('/').filter(Boolean);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple 
        onChange={handleFileUpload}
      />

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowConfirm(false)}
          />
          <div className="surface w-full max-w-md rounded-[2.5rem] border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.1)] relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-rose-500/10 rounded-[1.25rem] flex items-center justify-center text-rose-500 shadow-inner">
                  <AlertTriangle size={28} />
                </div>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Confirm Deletion</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                You are about to permanently remove <span className="text-rose-400 font-bold">{itemsToDelete.length}</span> selected items. This action cannot be undone and will erase all data within these files or directories.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-rose-600/30 active:scale-95"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowNewFolderModal(false)}
          />
          <div className="surface w-full max-w-md rounded-[2.5rem] border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.1)] relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-purple-500/10 rounded-[1.25rem] flex items-center justify-center text-purple-500 shadow-inner">
                  <FolderPlus size={28} />
                </div>
                <button 
                  onClick={() => setShowNewFolderModal(false)}
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">New Directory</h3>
              <p className="text-sm text-zinc-500 mb-8 font-medium">Provide a identifier for your new storage node.</p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Directory Name</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  placeholder="e.g. storage-cluster"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-600 text-zinc-100 transition-all font-mono"
                />
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowNewFolderModal(false)}
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
                >
                  Abort
                </button>
                <button 
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-purple-600/30 active:scale-95"
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Notification */}
      {activeUploads.length > 0 && (
        <div className="fixed bottom-24 right-8 z-[60] w-80 space-y-3">
          {activeUploads.map((upload, idx) => (
            <div key={idx} className="surface p-5 rounded-[1.5rem] border-indigo-500/30 shadow-2xl animate-in slide-in-from-right-10 duration-300 bg-zinc-900/90 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${upload.status === 'uploading' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {upload.status === 'uploading' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  </div>
                  <span className="text-xs font-bold text-zinc-100 truncate">{upload.name}</span>
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  {upload.status === 'uploading' ? `${Math.round(upload.progress)}%` : 'COMPLETE'}
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className={`h-full transition-all duration-300 ${upload.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800/50">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <button 
            onClick={() => setCurrentPath('/')}
            className="text-[10px] font-black text-zinc-500 hover:text-indigo-400 transition-colors uppercase tracking-[0.2em] whitespace-nowrap"
          >
            Container
          </button>
          {pathParts.map((part, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={14} className="text-zinc-700 shrink-0" />
              <button 
                onClick={() => {
                  const newPath = '/' + pathParts.slice(0, i + 1).join('/');
                  setCurrentPath(newPath);
                }}
                className="text-[10px] font-black text-zinc-100 hover:text-indigo-400 transition-colors uppercase tracking-[0.2em] whitespace-nowrap"
              >
                {part}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search jpshop registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 transition-all w-full sm:w-64 font-medium"
            />
          </div>
          <button 
            onClick={() => setShowNewFolderModal(true)}
            className="flex items-center gap-2.5 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-all border border-zinc-700 hover:border-purple-500/50 active:scale-95 shadow-lg shadow-black/20"
          >
            <FolderPlus size={16} className="text-purple-400" />
            <span className="hidden sm:inline">New Folder</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            <Upload size={16} />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      {/* Primary Files Interface */}
      <div className="surface rounded-[2rem] overflow-hidden border-zinc-800/50 shadow-sm bg-zinc-900/10">
        <div className="bg-black/20 border-b border-zinc-800 px-8 py-4 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-7 flex items-center gap-6">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                onChange={() => setSelectedFiles(selectedFiles.length === filteredFiles.length ? [] : filteredFiles.map(f => f.name))}
                className="w-4 h-4 rounded-md border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-zinc-900 transition-all cursor-pointer"
              />
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Asset Identity</span>
          </div>
          <div className="col-span-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Size</div>
          <div className="col-span-3 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Synchronization</div>
        </div>

        <div className="divide-y divide-zinc-800/40 min-h-[480px]">
          {currentPath !== '/' && (
            <div 
              onClick={goBack}
              className="px-8 py-5 flex items-center gap-6 hover:bg-indigo-500/5 cursor-pointer transition-colors group"
            >
              <div className="w-4 h-4" /> {/* Spacer */}
              <div className="flex items-center gap-4 text-zinc-500 group-hover:text-indigo-400 transition-colors">
                <ArrowLeft size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">Parent Directory</span>
              </div>
            </div>
          )}

          {filteredFiles.map((file) => (
            <div 
              key={file.name}
              className={`px-8 py-4 grid grid-cols-12 gap-4 items-center hover:bg-zinc-800/30 transition-all group ${selectedFiles.includes(file.name) ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}
            >
              <div className="col-span-7 flex items-center gap-6">
                <input 
                  type="checkbox" 
                  checked={selectedFiles.includes(file.name)}
                  onChange={() => toggleSelect(file.name)}
                  className="w-4 h-4 rounded-md border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-zinc-900 transition-all cursor-pointer"
                />
                <div 
                  className="flex items-center gap-4 cursor-pointer min-w-0"
                  onClick={() => file.isFolder ? navigateTo(file.name) : null}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${file.isFolder ? 'text-amber-500 bg-amber-500/10 shadow-inner group-hover:scale-110' : 'text-indigo-400 bg-indigo-500/10 shadow-inner group-hover:scale-110'}`}>
                    {file.isFolder ? <Folder size={20} /> : <FileText size={20} />}
                  </div>
                  <span className="text-sm font-bold text-zinc-200 truncate group-hover:text-indigo-400 transition-colors tracking-tight">{file.name}</span>
                </div>
              </div>
              <div className="col-span-2 text-xs font-mono text-zinc-500">{file.size}</div>
              <div className="col-span-3 flex items-center justify-end gap-5">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter hidden sm:block">{file.modified}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-zinc-500 hover:text-indigo-400 transition-all hover:bg-indigo-500/10 rounded-lg" title="Download Asset">
                    <Download size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteInitiated([file.name])}
                    className="p-2 text-zinc-500 hover:text-rose-400 transition-all hover:bg-rose-500/10 rounded-lg"
                    title="Purge Asset"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="p-2 text-zinc-600 hover:text-zinc-200 transition-all" title="Asset Metadata">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center p-32 text-center animate-in fade-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-[2rem] flex items-center justify-center text-zinc-800 mb-8 shadow-inner">
                <Folder size={48} />
              </div>
              <h4 className="text-xl font-black text-white tracking-tight">Zero Assets Detected</h4>
              <p className="text-sm text-zinc-600 mt-2 max-w-xs font-medium uppercase tracking-widest text-[10px]">Registry is currently offline or empty. Initialize directory or sync files to continue.</p>
              <button 
                onClick={() => setShowNewFolderModal(true)}
                className="mt-8 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all border border-zinc-700"
              >
                Initialize Directory
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Selection Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-8 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center gap-10 animate-in slide-in-from-bottom-10 duration-500 z-50 border border-indigo-400/30">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200/60">Selected Registry</span>
            <span className="text-sm font-black">{selectedFiles.length} Object{selectedFiles.length > 1 ? 's' : ''} Active</span>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white/80 transition-colors">
              <Download size={16} /> Download
            </button>
            <button 
              onClick={() => handleDeleteInitiated(selectedFiles)}
              className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] hover:text-rose-200 transition-colors text-rose-100"
            >
              <Trash2 size={16} /> Purge
            </button>
            <button 
              onClick={() => setSelectedFiles([])} 
              className="px-6 py-2 bg-black/20 hover:bg-black/40 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesView;
