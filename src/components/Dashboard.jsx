import React from 'react';
import { Shield, FileCheck, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = ({ vulnerabilities, coreFileScan }) => {
  // Mock data for demonstration - replace with your actual props
  const mockVulnerabilities = vulnerabilities || {
    lastScanned: '2024-01-15T10:30:00Z',
    totalIssues: 6,
    criticalIssues: 1,
    pluginIssues: 5,
    themeIssues: 1
  };

  const mockCoreFiles = coreFileScan || {
    lastScanned: '2024-01-14T14:22:00Z',
    totalFiles: 2847,
    verifiedFiles: 2845,
    failedFiles: 2,
    status: 'issues_found' // 'clean', 'issues_found', or null for never scanned
  };

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

  const VulnerabilityCard = () => {
    const hasData = mockVulnerabilities?.lastScanned;

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
                {hasData ? `Last scanned ${formatLastScanned(mockVulnerabilities.lastScanned)}` : 'Never scanned'}
              </p>
            </div>
          </div>
          <Link
          to="/vulnerabilities"

            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {hasData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Total Issues Found</span>
              <span className={`text-lg font-bold ${mockVulnerabilities.totalIssues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {mockVulnerabilities.totalIssues}
              </span>
            </div>

            {mockVulnerabilities.totalIssues > 0 && (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{mockVulnerabilities.criticalIssues}</div>
                  <div className="text-xs text-slate-600">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{mockVulnerabilities.pluginIssues}</div>
                  <div className="text-xs text-slate-600">Plugins</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{mockVulnerabilities.themeIssues}</div>
                  <div className="text-xs text-slate-600">Themes</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500 mb-4">No vulnerability scans performed yet</p>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Shield className="h-4 w-4" />
              Run First Scan
            </a>
          </div>
        )}
      </div>
    );
  };

  const CoreFilesCard = () => {
    const hasData = mockCoreFiles?.lastScanned;
    const hasIssues = mockCoreFiles?.status === 'issues_found';

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
                {hasData ? `Last scanned ${formatLastScanned(mockCoreFiles.lastScanned)}` : 'Never scanned'}
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
          <div className="space-y-4">
            {hasIssues ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{mockCoreFiles.verifiedFiles}</div>
                  <div className="text-xs text-green-700">Verified</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">{mockCoreFiles.failedFiles}</div>
                  <div className="text-xs text-red-700">Failed</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">All files verified</span>
              </div>
            )}
          </div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Security Dashboard</h1>
        <p className="mt-1 text-slate-600">Monitor your WordPress site's security status and scan history</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm text-slate-600">Active Vulnerabilities</p>
              <p className="text-2xl font-bold text-red-600">
                {mockVulnerabilities?.totalIssues || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <FileCheck className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-slate-600">Core File Issues</p>
              <p className="text-2xl font-bold text-orange-600">
                {(mockCoreFiles?.modifiedFiles || 0) + (mockCoreFiles?.missingFiles || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-slate-600">Last Scan</p>
              <p className="text-sm font-medium text-slate-800">
                {mockVulnerabilities?.lastScanned ?
                  formatLastScanned(mockVulnerabilities.lastScanned) :
                  'Never'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VulnerabilityCard />
        <CoreFilesCard />
      </div>
    </div>
  );
};

export default Dashboard;