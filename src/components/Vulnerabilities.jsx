import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, ExternalLink, AlertCircle } from '@/lib/icons';
import { FullPageLoader } from '../lib/utils';
import TopCard from './TopCard';


// Severity component
const Severity = ({ severity }) => {
  const severityConfig = {
    'Critical': { color: 'bg-red-600', textColor: 'text-red-600', icon: AlertTriangle },
    'High': { color: 'bg-red-500', textColor: 'text-red-500', icon: AlertTriangle },
    'Medium': { color: 'bg-orange-500', textColor: 'text-orange-500', icon: AlertCircle },
    'Low': { color: 'bg-yellow-500', textColor: 'text-yellow-500', icon: AlertCircle }
  };

  const config = severityConfig[severity] || severityConfig['Medium'];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
        <Icon className="w-3 h-3" />
        {severity}
      </span>
    </div>
  );
};

// Summary Stats Component
const SummaryStats = ({ data }) => {
  // Process data to get statistics
  const processData = () => {
    let totalVulns = 0;
    let criticalCount = 0;
    let highCount = 0;
    let fixableCount = 0;
    let unfixableCount = 0;

    // Process plugins
    Object.values(data.plugins || {}).forEach(pluginVulns => {
      pluginVulns.forEach(vuln => {
        totalVulns++;
        if (vuln.severity === 'Critical') criticalCount++;
        if (vuln.severity === 'High') highCount++;
        if (vuln.fixed_in) {
          fixableCount++;
        } else {
          unfixableCount++;
        }
      });
    });

    // Process themes (similar structure)
    Object.values(data.themes || {}).forEach(themeVulns => {
      themeVulns.forEach(vuln => {
        totalVulns++;
        if (vuln.severity === 'Critical') criticalCount++;
        if (vuln.severity === 'High') highCount++;
        if (vuln.fixed_in) {
          fixableCount++;
        } else {
          unfixableCount++;
        }
      });
    });

    return {
      total: totalVulns,
      critical: criticalCount,
      high: highCount,
      fixable: fixableCount,
      unfixable: unfixableCount
    };
  };

  const stats = processData();

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8 w-full">
      {/* Total Vulnerabilities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Vulnerabilities</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">
                {stats.total === 1 ? 'issue found' : 'issues found'}
              </p>
            </div>
          </div>
          <div className="p-3 bg-red-50 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Critical Issues</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
              <p className="text-xs text-gray-500">immediate attention</p>
            </div>
          </div>
          <div className="p-3 bg-red-50 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div> */}

      {/* High Severity Issues */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">High Severity</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-bold text-orange-600">{stats.high}</p>
              <p className="text-xs text-gray-500">address soon</p>
            </div>
          </div>
          <div className="p-3 bg-orange-50 rounded-full">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Fixable Issues */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Fixable Issues</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-bold text-green-600">{stats.fixable}</p>
              <p className="text-xs text-gray-500">updates available</p>
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const VulnerabilityTable = ({ title, data, onAction }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden -mt-4">
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
                    <div className="flex items-start gap-2 mb-2">
                      <Severity severity={item.severity} />
                    </div>
                    <div className="text-sm text-gray-600 max-w-md">
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
                      {item.fixed_in && (
                        <a
                          href={`/wp-admin/plugins.php?s=${item.slug.replace(/.*\//, '')}&plugin_status=all`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Update plugin"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Update
                        </a>
                      )}

                      <button
                        onClick={() => onAction('deactivate', item, index)}
                        title="Deactivate plugin"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        Deactivate
                      </button>

                      {item.details_link && (
                        <a
                          href={item.details_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View vulnerability details"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Details
                        </a>
                      )}
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

// Main Dashboard Component
const VulnerabilityDashboard = ({ toast }) => {
  const [actionLog, setActionLog] = useState([]);
  const [updatingItems, setUpdatingItems] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/wp-json/vital-signs/v1/vulnerabilities', {
      headers: { 'X-WP-Nonce': VS_DATA.nonce }
    })
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <FullPageLoader section="vulnerabilities" />;


  const deactivatePlugin = async (slug) => {
    try {

      const response = await fetch('/wp-json/vital-signs/v1/deactivate', {
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

  // Convert data structure to flat array for table
  const processDataForTable = (data) => {
    const tableData = [];

    // Process plugins
    Object.entries(data.plugins || {}).forEach(([pluginName, vulnerabilities]) => {
      vulnerabilities.forEach(vuln => {
        tableData.push({
          plugin: pluginName,
          ...vuln
        });
      });
    });

    // Process themes
    Object.entries(data.themes || {}).forEach(([themeName, vulnerabilities]) => {
      vulnerabilities.forEach(vuln => {
        tableData.push({
          plugin: themeName,
          ...vuln
        });
      });
    });

    return tableData;
  };

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

  const tableData = processDataForTable(data);

  return (
        <div className="w-full bg-secondary p-4">

        <TopCard
          title="WP Vital Signs | Vulnerabilities"
          subtitle="Monitor and resolve plugin and theme vulnerabilities"
        />


        <SummaryStats data={data} />

        <VulnerabilityTable
          title="Plugin Vulnerabilities"
          data={tableData}
          onAction={handleAction}
        />
      </div>

  );
};

export default VulnerabilityDashboard;