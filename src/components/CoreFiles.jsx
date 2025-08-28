import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// import { ShieldCheck, AlertTriangle, CircleDot, Loader2, Play, RefreshCw, Shield, Zap, FileX, HelpCircle, CheckCircle, FileCheck, Clock } from '@/lib/icons'
import { ShieldCheck, AlertTriangle, CircleDot, Loader2, Play, RefreshCw, Zap, FileX, HelpCircle, CheckCircle, Pause, Download } from '@/lib/icons';
import { useVirtualizer } from '@tanstack/react-virtual';

import TopCard from './TopCard';

const CHUNK_SIZE = 25; // How many files to scan per "API call"
const SCAN_DELAY_MS = 1000; // Delay to not overload the server

const saveCoreFileScanResults = async (scanData) => {
  try {
    const response = await fetch('/wp-json/vital-signs/v1/core-files-scan-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // VS_DATA.nonce should be available globally from your wp_localize_script call
        'X-WP-Nonce': VS_DATA.nonce,
      },
      body: JSON.stringify(scanData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save scan results.');
    }

    const result = await response.json();
    console.log('Core file scan results saved successfully:', result.message);
    // You could optionally return true here on success
    return true;

  } catch (error) {
    console.error('Error saving core file scan results:', error);
    // You could optionally return false here on failure
    return false;
  }
};

const FullPageLoader = () => (
  <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-lg">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    <p className="mt-4 text-lg font-medium text-slate-700">Fetching core file list...</p>
    <p className="text-slate-500">Please wait a moment.</p>
  </div>
);

const StatusDisplay = ({ status }) => {
  const statusConfig = {
    pending: { Icon: CircleDot, color: 'text-slate-400', text: 'Pending' },
    verified: { Icon: ShieldCheck, color: 'text-green-600', text: 'Verified' },
    failed: { Icon: AlertTriangle, color: 'text-red-600', text: 'Failed' },
    missing: { Icon: FileX, color: 'text-orange-600', text: 'Missing' },
    unknown: { Icon: HelpCircle, color: 'text-slate-500', text: 'Unknown' },
  };
  const { Icon, color, text } = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <Icon className="h-4 w-4" />
      <span className="font-medium text-sm">{text}</span>
    </div>
  );
};

const FileTable = ({ files }) => {
  // A ref for the scrolling container
  const parentRef = useRef();

  // The virtualizer hook
  const rowVirtualizer = useVirtualizer({
    count: files.length, // Total number of items in the list
    getScrollElement: () => parentRef.current, // The element that scrolls
    estimateSize: () => 49, // The estimated height of a single row in pixels
    overscan: 5, // Render 5 extra items above and below the viewport
  });

  return (
    <div className="mt-4 border border-slate-200 rounded-lg bg-white overflow-hidden">
      {/* 1. The main scrollable container */}
      <div
        ref={parentRef}
        // className="h-96 overflow-y-auto" // Must have a fixed height and be scrollable
        className="overflow-y-auto h-[calc(100vh-30rem)] min-h-64" // Dynamic, calculated height
      >
        {/* 2. An inner container with the total height of all rows combined */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* 3. Render only the virtual items */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const file = files[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="flex items-center border-b border-slate-200"
              >
                <div className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono flex-1">
                  {file.name}
                </div>
                <div className="px-6 py-4 whitespace-nowrap">
                  <StatusDisplay status={file.status} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Main Scanner Component ---

const CoreFileScanner = ({ toast }) => {
  // --- All hooks are defined at the top level ---
  const [isLoadingFileList, setIsLoadingFileList] = useState(true);
  const [scanStatus, setScanStatus] = useState('idle');
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scanIndexRef = useRef(0);
  const isCancelledRef = useRef(false);

  const filesWithIssues = useMemo(() => files.filter(f => f.status !== 'verified'), [files]);
  const issuesFound = filesWithIssues.length;

  useEffect(() => {
    isCancelledRef.current = false;
    fetch('/wp-json/vital-signs/v1/checksums', { headers: { 'X-WP-Nonce': VS_DATA.nonce } })
      .then(res => res.json())
      .then(({ checksums }) => {
        if (!isCancelledRef.current) {
          setFiles(Object.keys(checksums).map(name => ({ name, status: 'pending', checksum: checksums[name] })));
          setIsLoadingFileList(false);
          toast.success('Ready to scan core files.');
        }
      })
      .catch(err => {
        if (!isCancelledRef.current) {
          toast.error('Error fetching file list.');
          setIsLoadingFileList(false);
        }
      });

    return () => { isCancelledRef.current = true; };
  }, [toast]);

  const handleStartScan = useCallback(async () => {
    setScanStatus('scanning');
    setIsPaused(false);

    if (scanIndexRef.current === 0) {
      setProgress(0);
      setFiles(prevFiles => prevFiles.map(f => ({ ...f, status: 'pending' })));
    }

    let processedFiles = [...files];

    while (scanIndexRef.current < processedFiles.length && !isCancelledRef.current) {
      if (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 250));
        continue;
      }

      const chunk = processedFiles.slice(scanIndexRef.current, scanIndexRef.current + CHUNK_SIZE);
      const processedChunk = await fetch(`/wp-json/vital-signs/v1/checksum_chunk`, {
        method: 'POST',
        headers: { 'X-WP-Nonce': VS_DATA.nonce, 'Content-Type': 'application/json' },
        body: JSON.stringify({ chunk }),
      }).then(res => res.json());

      if (isCancelledRef.current) break;

      processedFiles.splice(scanIndexRef.current, processedChunk.length, ...processedChunk);
      setFiles([...processedFiles]);
      scanIndexRef.current += chunk.length;
      setProgress(Math.min(100, (scanIndexRef.current / files.length) * 100));
    }

    if (!isCancelledRef.current) {
      setScanStatus('complete');
      setIsPaused(false);
      scanIndexRef.current = 0;
    }
  }, [files, isPaused]);

  const handlePause = useCallback(() => setIsPaused(true), []);
  const handleResume = useCallback(() => setIsPaused(false), []);
  const handleReset = useCallback(() => {
    setScanStatus('idle');
    setProgress(0);
    scanIndexRef.current = 0;
    setFiles(files.map(f => ({ ...f, status: 'pending' })));
  }, [files]);

  const handleExportCSV = useCallback(() => {
    if (filesWithIssues.length === 0) {
      toast.info("No issues to export.");
      return;
    }

    const header = '"File Path","Status"\n';
    const rows = filesWithIssues.map(file => `"${file.name}","${file.status}"`).join('\n');
    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'wp-core-file-issues.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Issues exported to CSV.");
  }, [filesWithIssues, toast]);

  // --- JSX Rendering ---
  if (isLoadingFileList) return <FullPageLoader />;

  return (
    <div className="w-full bg-secondary p-4">
      <TopCard title="WP Vital Signs | Core Files Scanner" subtitle="Compares your WordPress core files against official checksums to detect unauthorized changes." />
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          {scanStatus === 'scanning' ? (
            isPaused ? (
              <button onClick={handleResume} className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700">
                <Play className="h-5 w-5" /> Resume Scan
              </button>
            ) : (
              <button onClick={handlePause} className="inline-flex items-center gap-2 bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-600">
                <Pause className="h-5 w-5" /> Pause Scan
              </button>
            )
          ) : (
            <button onClick={scanStatus === 'complete' ? handleReset : handleStartScan} className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700">
              <RefreshCw className="h-5 w-5" />
              {scanStatus === 'complete' ? 'Scan Again' : 'Start Scan'}
            </button>
          )}
        </div>

  {scanStatus === 'scanning' && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-blue-700">Scanning in progress...</span>
              <div className="flex items-center gap-3">

                {files.filter(f => f.status === 'verified').length} files verified / <span className={`text-sm font-medium ${issuesFound > 0 ? 'text-red-600' : 'text-green-600'}`}>{issuesFound} issues found</span>

                <span className="text-sm font-medium text-blue-700">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{
                width: `${progress}%`,
                transition: 'width 0.5s ease-in-out', // This is the line you need to add
              }}></div>
            </div>
          </div>
        )}


        {/* --- Conditional rendering in JSX is perfectly fine --- */}
        {scanStatus === 'complete' && (
          <div className="mt-4 p-4 rounded-md flex items-center justify-between font-medium bg-green-100 text-green-800">
            <span>Scan complete. {issuesFound > 0 ? `${issuesFound} issue(s) found.` : 'All files verified!'}</span>
            {issuesFound > 0 && (
              <button onClick={handleExportCSV} className="inline-flex items-center gap-2 bg-slate-600 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-slate-700">
                <Download className="h-4 w-4" />
                Export Issues
              </button>
            )}
          </div>
        )}
      </div>
      <FileTable files={filesWithIssues} />
    </div>
  );
};

export default CoreFileScanner;