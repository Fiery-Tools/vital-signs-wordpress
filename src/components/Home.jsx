import React, { useState, useEffect } from 'react';
import { Shield, FileCheck, AlertTriangle, CheckCircle, Clock, ArrowRight, Trash2 } from '@/lib/icons';
import { Link } from 'react-router-dom';
import TopCard from './TopCard';
import Loading from './home/Loading';

const formatLastScanned = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
};

const VulnerabilityCard = ({ data }) => {
  // Process data to get statistics
  let {results, lastScan} = data || {}
  let {plugins, themes} = results || {}
  if (!lastScan) {
    return <div className="text-center py-8">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <Shield className="h-8 w-8 text-slate-400" />
      </div>
      <p className="text-slate-500 mb-4">No vulnerability scans performed yet</p>
      <Link
        to="/vulnerabilities"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer">
          <Shield className="h-4 w-4" />
          Run First Scan
        </div>
      </Link>
    </div>
  }
  const processData = () => {
    let totalVulns = 0;
    let criticalCount = 0;
    let pluginCount = 0;
    let themeCount = 0;

    // Process plugins
    Object.values(plugins || {}).forEach(pluginVulns => {
      pluginVulns.forEach(vuln => {
        totalVulns++;
        pluginCount++;
        if (vuln.severity === 'Critical') criticalCount++;
      });
    });

    // Process themes
    Object.values(themes || {}).forEach(themeVulns => {
      themeVulns.forEach(vuln => {
        totalVulns++;
        themeCount++;
        if (vuln.severity === 'Critical') criticalCount++;
      });
    });

    return {
      total: totalVulns,
      critical: criticalCount,
      plugins: pluginCount,
      themes: themeCount
    };
  };

  const stats = processData();
  const hasData = stats.total > 0;

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Vulnerability Scan</h3>
            <p className="text-sm text-slate-600">
              {hasData ? `Last scanned ${formatLastScanned(lastScan)}` : 'Never scanned'}
            </p>
          </div>
        </div>
        <Link to="/vulnerabilities" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
          View Details <ArrowRight className="h-4 w-4" />
        </Link>
      </div>


      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm font-medium text-slate-700">Total Issues Found</span>
          <span className={`text-lg font-bold ${stats.total > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {stats.total}
          </span>
        </div>

        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{stats.total}</div>
              <div className="text-xs text-slate-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{stats.plugins}</div>
              <div className="text-xs text-slate-600">Plugins</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.themes}</div>
              <div className="text-xs text-slate-600">Themes</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CoreFilesCard = ({ data }) => {
  // let mockCoreFiles = data;
  const hasData = data?.scanDate;
  const hasIssues = data?.issuesFound > 0;

  if (!data) {
    return <div className="text-center py-8">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <FileCheck className="h-8 w-8 text-slate-400" />
      </div>
      <p className="text-slate-500 mb-4">No core file scans performed yet</p>
      <Link
        to="/core-files"
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        <FileCheck className="h-4 w-4" />
        Run First Scan
      </Link>
    </div>
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${hasIssues ? 'bg-orange-50' : 'bg-green-50'}`}>
            <FileCheck className={`h-6 w-6 ${hasIssues ? 'text-orange-600' : 'text-green-600'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Core Files Scan</h3>
            <p className="text-sm text-slate-600">
              {hasData ? `Last scanned ${formatLastScanned(data?.scanDate)}` : 'Never scanned'}
            </p>
          </div>
        </div>
        <Link to="/core-files"

          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View Details <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {hasData ? (
        <>


          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Total Issues Found</span>
              <span className={`text-lg font-bold ${data.issuesFound > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {data.issuesFound}
              </span>
            </div>

            {data.issuesFound > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{data.issuesFound}</div>
                  <div className="text-xs text-slate-600">Issues Found</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{data.totalFiles - data.issuesFound}</div>
                  <div className="text-xs text-slate-600">Verified Filess</div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileCheck className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-500 mb-4">No core file scans performed yet</p>
          <Link
            to="/core-files"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <FileCheck className="h-4 w-4" />
            Run First Scan
          </Link>
        </div>
      )}
    </div>
  );
};


const Home = ({ vulnerabilities, coreFileScan, status, toast }) => {
  // Mock data for demonstration - replace with your actual props
  let [lastChecks, setLastChecks] = useState({ loading: true })




  const handleClearSettings = async () => {
    // CRITICAL: Always ask for confirmation before a destructive action.
    if (!window.confirm("Are you sure you want to clear all settings and cached data for WP Vital Signs? This action cannot be undone.")) {
      return;
    }

    const toastId = toast.loading('Clearing settings...');

    try {
      const response = await fetch('/wp-json/vital-signs/v1/clear-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': VS_DATA.nonce, // Your global nonce
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An unknown error occurred.');
      }

      toast.success('Settings cleared successfully. The page will now reload.', { id: toastId });

      setLastChecks({})

    } catch (error) {
      toast.error(`Error: ${error.message}`, { id: toastId });
      console.error('Failed to clear settings:', error);
    }
  };












  useEffect(() => {
    fetch('/wp-json/vital-signs/v1/last-checks', {
      headers: { 'X-WP-Nonce': VS_DATA.nonce }
    }).then(res => res.json())
      .then(setLastChecks);
  }, []);

  let { last_vulnerability_check, last_core_files_check } = lastChecks || {}
  let showClearButton = last_vulnerability_check || last_core_files_check

  return (
    <div className="w-full bg-secondary p-4">
      <TopCard title="WP Vital Signs | Home" subtitle="An overview of your site's health and security" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {lastChecks?.loading ? <Loading /> : <VulnerabilityCard data={lastChecks.last_vulnerability_check} />}
        {lastChecks?.loading ? <Loading /> : <CoreFilesCard data={lastChecks.last_core_files_check} />}
      </div>

      {showClearButton && <div className="mt-6">
        <button
          onClick={handleClearSettings}
          className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 className="h-5 w-5" />
          Clear All Plugin Settings & Data
        </button>
      </div>}
    </div>
  );
};




export default Home;