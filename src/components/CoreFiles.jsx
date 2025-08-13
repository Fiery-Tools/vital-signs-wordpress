import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CircleDot, Loader2, Play, RefreshCw, Shield, Zap, FileX, HelpCircle } from 'lucide-react';
import { CheckCircle, FileCheck, Clock } from 'lucide-react';

const CHUNK_SIZE = 25; // How many files to scan per "API call"
const SCAN_DELAY_MS = 250; // Delay per chunk to simulate network/processing time

// --- UI Components ---

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

const FileTable = ({ files }) => (
  <div className="mt-6 border border-slate-200 rounded-lg bg-white overflow-hidden">
    <div className="h-96 overflow-y-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 sticky top-0">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {files.map((file) => (
            <tr key={file.name}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono">{file.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusDisplay status={file.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main Scanner Component ---

const CoreFileScanner = ({ toast }) => {
  const [isLoadingFileList, setIsLoadingFileList] = useState(true);
  const [scanStatus, setScanStatus] = useState('idle'); // 'idle', 'scanning', 'complete'
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  // const [issuesFound, setIssuesFound] = useState(0);
  let issuesFound = files.filter(file => !['verified', 'pending'].includes(file.status)).length;

  // 1. Fetch the initial list of files when the component mounts
  useEffect(() => {
    fetch(VS_DATA.rest_url + '/checksums', {
      headers: {
        'X-WP-Nonce': VS_DATA.nonce,
      }
    }).then(res => res.json())
      .then(checksums => {

        setFiles(Object.keys(checksums).map(name => ({ name, status: 'pending' })));
        setIsLoadingFileList(false);
        toast.success('Successfully loaded checksums');
      })
      .catch(err => {
        toast.error('Error fetching file list');
        console.error('Error fetching file list:', err);
        setIsLoadingFileList(false);
        setFiles([]);
      });


  }, []);

  // 2. The main function to handle the scan process
  const handleStartScan = async () => {
    setScanStatus('scanning');
    setProgress(0);

    let currentIssues = 0;
    let processedFiles = files.map(f => ({ ...f, status: 'pending' }));

    for (let i = 0; i < processedFiles.length; i += CHUNK_SIZE) {
      const chunk = processedFiles.slice(i, i + CHUNK_SIZE);

      // Simulate API call to scan a chunk
      await new Promise(resolve => setTimeout(resolve, SCAN_DELAY_MS));

      // Update status for the processed chunk
      const processedChunk = await fetch(VS_DATA.rest_url + `/checksum_chunk`, {
        method: 'POST',
        headers: {
          'X-WP-Nonce': VS_DATA.nonce,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chunk }),
      }).then(res => res.json())



      // Update the main files array
      processedFiles.splice(i, processedChunk.length, ...processedChunk);
      setFiles([...processedFiles]);

      // Update progress
      const newProgress = Math.min(100, ((i + CHUNK_SIZE) / files.length) * 100);
      setProgress(newProgress);
    }

    setScanStatus('complete');
  };

  if (isLoadingFileList) {
    return <FullPageLoader />;
  }

  const scanButtonText = scanStatus === 'idle' ? 'Start Scan' : scanStatus === 'scanning' ? 'Scanning...' : 'Scan Again';
  const ScanButtonIcon = scanStatus === 'complete' ? RefreshCw : Play;

  return (
    <div>


      <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Core File Integrity Scanner</h2>
        <p className="mt-1 text-slate-600">Compares your WordPress core files against official checksums to detect unauthorized changes.</p>

        <button
          onClick={handleStartScan}
          disabled={scanStatus === 'scanning'}
          className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-wait"
        >
          <ScanButtonIcon className={`h-5 w-5 ${scanStatus === 'scanning' ? 'animate-spin' : ''}`} />
          {scanButtonText}
        </button>

        {/* Progress Bar and Status */}
        {scanStatus === 'scanning' && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-blue-700">Scanning in progress...</span>
              <div className="flex items-center gap-3">

                <span className={`text-sm font-medium ${issuesFound > 0 ? 'text-red-600' : 'text-green-600'}`}>{issuesFound} issues found</span>

                <span className="text-sm font-medium text-blue-700">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {/* Scan Completion Summary */}
        {scanStatus === 'complete' && (
          <div className={`mt-4 p-4 rounded-md font-medium text-center ${issuesFound > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
            Scan complete. {issuesFound > 0 ? `${issuesFound} issue(s) found.` : 'All files verified successfully!'}
          </div>
        )}
      </div>

      <FileTable files={files} />
    </div>
  );
};

export default CoreFileScanner;