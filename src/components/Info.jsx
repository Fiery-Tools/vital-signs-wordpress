import React from 'react';
import { Server, Globe, Database, Shield, Clock, Users, FileText, MessageCircle, Cpu, HardDrive } from '@/lib/icons';

// Sample TopCard component
const TopCard = ({ title, subtitle }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <p className="text-gray-600 mt-1">{subtitle}</p>
  </div>
);

// Helper function to get icon and color for each metric
const getMetricStyle = (key) => {
  const styles = {
    // WordPress Environment
    "WordPress Version": { icon: Globe, color: "text-blue-600", bg: "bg-blue-50", accent: "border-blue-200" },
    "Site URL": { icon: Globe, color: "text-blue-600", bg: "bg-blue-50", accent: "border-blue-200" },
    "Home URL": { icon: Globe, color: "text-blue-600", bg: "bg-blue-50", accent: "border-blue-200" },
    "Multisite": { icon: Globe, color: "text-purple-600", bg: "bg-purple-50", accent: "border-purple-200" },
    "Active Theme": { icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50", accent: "border-indigo-200" },
    "Theme Version": { icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50", accent: "border-indigo-200" },
    "Debug Mode": { icon: Shield, color: "text-orange-600", bg: "bg-orange-50", accent: "border-orange-200" },
    "Memory Limit": { icon: Cpu, color: "text-green-600", bg: "bg-green-50", accent: "border-green-200" },
    "SSL Enabled": { icon: Shield, color: "text-green-600", bg: "bg-green-50", accent: "border-green-200" },

    // Server Environment
    "PHP Version": { icon: Server, color: "text-purple-600", bg: "bg-purple-50", accent: "border-purple-200" },
    "Web Server": { icon: Server, color: "text-blue-600", bg: "bg-blue-50", accent: "border-blue-200" },
    "MySQL Version": { icon: Database, color: "text-orange-600", bg: "bg-orange-50", accent: "border-orange-200" },
    "PHP Memory Limit": { icon: Cpu, color: "text-green-600", bg: "bg-green-50", accent: "border-green-200" },
    "PHP Max Execution Time": { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", accent: "border-yellow-200" },
    "PHP Post Max Size": { icon: HardDrive, color: "text-blue-600", bg: "bg-blue-50", accent: "border-blue-200" },
    "PHP Upload Max Filesize": { icon: HardDrive, color: "text-blue-600", bg: "bg-blue-50", accent: "border-blue-200" },
    "Timezone": { icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50", accent: "border-indigo-200" },
    "Timestamp (UTC)": { icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50", accent: "border-indigo-200" },

    // Content & Data
    "Total Plugins": { icon: FileText, color: "text-purple-600", bg: "bg-purple-50", accent: "border-purple-200" },
    "Active Plugins": { icon: FileText, color: "text-green-600", bg: "bg-green-50", accent: "border-green-200" },
    "User Count": { icon: Users, color: "text-blue-600", bg: "bg-blue-50", accent: "border-blue-200" },
    "Published Posts": { icon: FileText, color: "text-orange-600", bg: "bg-orange-50", accent: "border-orange-200" },
    "Published Pages": { icon: FileText, color: "text-yellow-600", bg: "bg-yellow-50", accent: "border-yellow-200" },
    "Total Comments": { icon: MessageCircle, color: "text-pink-600", bg: "bg-pink-50", accent: "border-pink-200" },
    "Database Prefix": { icon: Database, color: "text-gray-600", bg: "bg-gray-50", accent: "border-gray-200" },
  };

  return styles[key] || { icon: FileText, color: "text-gray-600", bg: "bg-gray-50", accent: "border-gray-200" };
};

// Helper function to format values with badges for certain types
const formatValue = (key, value) => {
  const strValue = String(value);

  // Add badges for certain status values
  if (key === "SSL Enabled" && strValue === "Yes") {
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Enabled</span>;
  }

  if (key === "Debug Mode") {
    if (strValue === "Yes") {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">⚠ Active</span>;
    } else {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Disabled</span>;
    }
  }

  if (key === "Multisite") {
    if (strValue === "Yes") {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">✓ Active</span>;
    } else {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Standard</span>;
    }
  }

  // Format URLs
  if (key.includes("URL")) {
    return <span className="text-blue-600 font-mono text-sm break-all">{strValue}</span>;
  }

  // Format versions
  if (key.includes("Version")) {
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-mono">{strValue}</span>;
  }

  // Format memory/size values
  if (key.includes("Memory") || key.includes("Size") || key.includes("Limit")) {
    return <span className="font-semibold text-green-700">{strValue}</span>;
  }

  // Format counts
  if (typeof value === 'number' || /^\d+$/.test(strValue)) {
    return <span className="font-bold text-lg">{strValue}</span>;
  }

  return strValue;
};

const SectionTable = ({ title, data, headerColor, headerIcon: HeaderIcon }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
    {/* Card Header with color and icon */}
    <div className={`px-6 py-4 ${headerColor} border-b`}>
      <div className="flex items-center gap-3">
        <HeaderIcon className="w-5 h-5 text-white" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
    </div>

    {/* Table Body */}
    <div className="divide-y divide-gray-100">
      {data.map((item, index) => {
        const style = getMetricStyle(item.key);
        const Icon = style.icon;

        return (
          <div key={index} className={`px-6 py-4 hover:${style.bg} transition-colors duration-150 ${style.accent} border-l-4 border-l-transparent hover:border-l-current hover:${style.color.replace('text-', 'border-')}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${style.bg}`}>
                  <Icon className={`w-4 h-4 ${style.color}`} />
                </div>
                <p className="font-medium text-gray-700">{item.key}</p>
              </div>
              <div className="text-right">
                {formatValue(item.key, item.value)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const WpStatusGrid = ({ statusData }) => {
  const sections = [
    {
      title: "WordPress Environment",
      headerColor: "bg-gradient-to-r from-blue-600 to-purple-600",
      headerIcon: Globe
    },
    {
      title: "Server Environment",
      headerColor: "bg-gradient-to-r from-green-600 to-teal-600",
      headerIcon: Server
    },
    {
      title: "Content & Data",
      headerColor: "bg-gradient-to-r from-orange-600 to-pink-600",
      headerIcon: Database
    }
  ];

  // Ensure statusData is an array before mapping
  if (!Array.isArray(statusData) || statusData.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Server className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">Loading status information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 -mt-2">
      {statusData.map((sectionData, index) => (
        <SectionTable
          key={index}
          title={sections[index].title}
          headerColor={sections[index].headerColor}
          headerIcon={sections[index].headerIcon}
          data={sectionData}
        />
      ))}
    </div>
  );
};

// How to use the component in your app
const Info = ({ status }) => {
  // In a real app, this data would be fetched from your WordPress REST API
  const data = status

  return (
    <div className="w-full bg-secondary p-4">
      <TopCard title="Vital Signs | Info" subtitle="Information about your WordPress site" />
      <WpStatusGrid statusData={data} />
    </div>
  );
};

export default Info;