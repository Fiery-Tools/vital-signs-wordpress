import React, { useState } from 'react';
import { AlertTriangle, Shield, ExternalLink, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Reusable table component
const VulnerabilityTable = ({ title, data, onAction, updatingItems = [], toast }) => {
  const getSeverityColor = (vulnerability) => {
    if (vulnerability.toLowerCase().includes('unauthenticated')) {
      return 'text-red-600 bg-red-50';
    } else if (vulnerability.toLowerCase().includes('authenticated')) {
      return 'text-orange-600 bg-orange-50';
    }
    return 'text-yellow-600 bg-yellow-50';
  };

  const getSeverityIcon = (vulnerability) => {
    if (vulnerability.toLowerCase().includes('unauthenticated')) {
      return <AlertTriangle className="w-4 h-4" />;
    } else if (vulnerability.toLowerCase().includes('authenticated')) {
      return <AlertCircle className="w-4 h-4" />;
    }
    return <Clock className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          {title}
        </h2>
      </div>

      {data.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-500">No vulnerabilities found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plugin/Theme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vulnerability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fixed In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.plugin}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.vulnerability)}`}>
                        {getSeverityIcon(item.vulnerability)}
                        {item.vulnerability.includes('Unauthenticated') ? 'Critical' :
                         item.vulnerability.includes('Authenticated') ? 'High' : 'Medium'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1 max-w-md">
                      {item.vulnerability}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">{item.version}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.fixed_in ? (
                      <span className="text-sm font-mono text-green-600">{item.fixed_in}</span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">No fix available</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">



                        {item.fixed_in && <a
                          href={`/wp-admin/plugins.php?s=${item.slug.replace(/.*\//, '')}&plugin_status=all`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Update plugin"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" />
                          {/* Update */}
                        </a>}

                        <button
                          onClick={() => onAction('deactivate', item, index)}
                          title="Deactivate plugin"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {/* Deactivate */}
                        </button>

                      {item.details_link && <a
                          href={item.details_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View details"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />

                      </a>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Main dashboard component
const VulnerabilityDashboard = ({ data }) => {
  const [actionLog, setActionLog] = useState([]);
  const [updatingItems, setUpdatingItems] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState(data);


  const deactivatePlugin = async (slug) => {
    try {

      const response = await fetch(VS_DATA.rest_url + '/deactivate', {
        method: 'POST',
        headers: {
          'X-WP-Nonce': VS_DATA.nonce,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slug }),
      })

      if (!response.ok) {
        throw new Error('Failed to deactivate plugin');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Deactivate failed: ${error.message}`);
    }
  };

  // Transform data for table display
  const pluginVulnerabilities = Object.entries(vulnerabilities.plugins).flatMap(([plugin, vulns]) =>
    vulns.map(vuln => ({ ...vuln, plugin }))
  );

  const themeVulnerabilities = vulnerabilities.themes.map(theme => ({ ...theme, plugin: theme.name }));

  // Handle action button clicks
  const handleAction = async (action, item, index) => {
    const timestamp = new Date().toLocaleTimeString();
    const itemKey = `${item.plugin}-${index}`;

    try {
      switch (action) {
        case 'update':
          // Add to updating items
          setUpdatingItems(prev => [...prev, itemKey]);

          toast.loading(`Updating ${item.plugin}...`, { id: itemKey });

          try {
            // Convert plugin name to slug (you might need to adjust this logic)

            await updatePlugin(item.slug, item.fixed_in);

            // Remove from vulnerabilities list
            setVulnerabilities(prev => ({
              ...prev,
              plugins: {
                ...prev.plugins,
                [item.plugin]: prev.plugins[item.plugin].filter((_, i) => i !== index)
              }
            }));

            // Remove empty plugin entries
            setVulnerabilities(prev => ({
              ...prev,
              plugins: Object.fromEntries(
                Object.entries(prev.plugins).filter(([_, vulns]) => vulns.length > 0)
              )
            }));

            toast.success(`Successfully updated ${item.plugin} to ${item.fixed_in}`, { id: itemKey });

            setActionLog(prev => [{
              timestamp,
              action,
              plugin: item.plugin,
              message: `Successfully updated ${item.plugin} to version ${item.fixed_in}`
            }, ...prev].slice(0, 10));

          } catch (error) {
            console.error('Update error:', error);
            toast.error(`Failed to update ${item.plugin}: ${error.message}`, { id: itemKey });

            setActionLog(prev => [{
              timestamp,
              action,
              plugin: item.plugin,
              message: `Failed to update ${item.plugin}: ${error.message}`
            }, ...prev].slice(0, 10));
          }
          break;

        case 'deactivate':
          const toastId = toast.loading(`De-activating ${item.plugin}...`);

          try {

            await deactivatePlugin(item.slug);

            // Remove from vulnerabilities list
            setVulnerabilities(prev => ({
              ...prev,
              plugins: {
                ...prev.plugins,
                [item.plugin]: prev.plugins[item.plugin].filter((_, i) => i !== index)
              }
            }));

            // Remove empty plugin entries
            setVulnerabilities(prev => ({
              ...prev,
              plugins: Object.fromEntries(
                Object.entries(prev.plugins).filter(([_, vulns]) => vulns.length > 0)
              )
            }));

            toast.success(`Successfully deactivated ${item.plugin}`, { id: toastId });

            setActionLog(prev => [{
              timestamp,
              action,
              plugin: item.plugin,
              message: `Successfully deactivated ${item.plugin} due to no available fix`
            }, ...prev].slice(0, 10));

          } catch (error) {
            console.error('Deactivate error:', error);
            toast.error(`Failed to deactivate ${item.plugin}: ${error.message}`, { id: toastId });

            setActionLog(prev => [{
              timestamp,
              action,
              plugin: item.plugin,
              message: `Failed to deactivate ${item.plugin}: ${error.message}`
            }, ...prev].slice(0, 10));
          }
          break;

        // case 'details':
        //   toast.success(`Opening vulnerability details for ${item.plugin}`);
        //   // Here you could open a modal, navigate to details page, or open external link
        //   setActionLog(prev => [{
        //     timestamp,
        //     action,
        //     plugin: item.plugin,
        //     message: `Opened vulnerability details for ${item.plugin}`
        //   }, ...prev].slice(0, 10));
        //   break;

        default:
          toast.error(`Unknown action: ${action}`);
      }
    } finally {
      // Remove from updating items
      setUpdatingItems(prev => prev.filter(key => key !== itemKey));
    }
  };

  const totalVulnerabilities = pluginVulnerabilities.length + themeVulnerabilities.length;
  const criticalCount = [...pluginVulnerabilities, ...themeVulnerabilities]
    .filter(item => item.vulnerability.toLowerCase().includes('unauthenticated')).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">WordPress Security Dashboard</h1>
          <p className="text-gray-600">Monitor and resolve plugin and theme vulnerabilities</p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Vulnerabilities</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVulnerabilities}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Critical Issues</p>
                  <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fixable Issues</p>
                  <p className="text-2xl font-bold text-green-600">
                    {[...pluginVulnerabilities, ...themeVulnerabilities].filter(item => item.fixed_in).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="space-y-8">
          <VulnerabilityTable
            title="Plugin Vulnerabilities"
            data={pluginVulnerabilities}
            onAction={handleAction}
            updatingItems={updatingItems}
            toast={toast}
          />

          <VulnerabilityTable
            title="Theme Vulnerabilities"
            data={themeVulnerabilities}
            onAction={handleAction}
            updatingItems={updatingItems}
            toast={toast}
          />
        </div>

        {/* Action Log */}
        {actionLog.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {actionLog.map((log, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-gray-600 p-2 bg-gray-50 rounded">
                    <span className="font-mono text-xs text-gray-500">{log.timestamp}</span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VulnerabilityDashboard;