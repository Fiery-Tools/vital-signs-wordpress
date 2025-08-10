import React, { useState, useEffect } from 'react';

const VitalSignsHeader = () => {
  const currentTime = new Date().toLocaleString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/,/, '');

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Plugin Name */}
        <div className="flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            WP Vital Signs
          </h2>
        </div>

        {/* Vital Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
          <div className="text-center lg:text-left">
            <div className="text-xs sm:text-sm text-gray-500 font-medium mb-1">PHP Version</div>
            <div className="text-sm sm:text-base font-semibold text-gray-800">7.4.33</div>
          </div>

          <div className="text-center lg:text-left">
            <div className="text-xs sm:text-sm text-gray-500 font-medium mb-1">WordPress</div>
            <div className="text-sm sm:text-base font-semibold text-gray-800">6.8.2</div>
          </div>

          <div className="text-center lg:text-left">
            <div className="text-xs sm:text-sm text-gray-500 font-medium mb-1">Active Plugins</div>
            <div className="text-sm sm:text-base font-semibold text-gray-800">11</div>
          </div>

          <div className="text-center lg:text-left">
            <div className="text-xs sm:text-sm text-gray-500 font-medium mb-1">Last Update</div>
            <div className="text-xs sm:text-sm font-mono text-gray-700">{currentTime}</div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">System monitoring active</span>
          </div>
          <div className="text-xs text-gray-500">
            Auto-refresh: 3s
          </div>
        </div>
      </div>
    </div>
  );
};

const CircularGauge = ({
  value,
  maxValue = 100,
  title,
  subtitle,
  unit = '%',
  backgroundColor = 'bg-white',
  accentColor = 'stroke-slate-600',
  dangerThreshold = 80,
  warningThreshold = 60,
  size = 'auto',
  onClick,
  detailData
}) => {
  // Responsive sizing - auto adjusts based on screen size
  const getResponsiveSize = () => {
    if (size === 'small') return { radius: 30, strokeWidth: 5 };
    if (size === 'large') return { radius: 50, strokeWidth: 8 };
    return { radius: 40, strokeWidth: 6 }; // auto/medium
  };

  const { radius, strokeWidth } = getResponsiveSize();
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percentage = Math.min((value / maxValue) * 100, 100);
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  // Determine color based on thresholds - subdued colors
  let progressColor = accentColor;
  if (percentage >= dangerThreshold) {
    progressColor = 'stroke-rose-500';
  } else if (percentage >= warningThreshold) {
    progressColor = 'stroke-amber-500';
  }

  // Light mode responsive classes
  const containerClasses = `${backgroundColor} rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 h-full min-h-[180px] sm:min-h-[200px] cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1`;
  const svgClasses = 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32';
  const textClasses = 'text-lg sm:text-xl md:text-2xl font-semibold text-gray-800';
  const subtitleClasses = 'text-xs sm:text-sm text-gray-500 mt-1';
  const titleClasses = 'text-gray-700 font-medium text-xs sm:text-sm text-center px-2';

  const handleClick = () => {
    if (onClick && detailData) {
      onClick(detailData);
    }
  };

  return (
    <div className={containerClasses} onClick={handleClick}>
      <div className="flex flex-col items-center justify-center h-full space-y-2 sm:space-y-3">
        <div className="relative flex-shrink-0">
          <svg className={svgClasses} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
            {/* Background circle */}
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset="0"
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className={progressColor}
              transform={`rotate(-90 ${radius} ${radius})`}
              style={{
                transition: 'stroke-dasharray 0.3s ease-in-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-1">
              <div className={textClasses}>
                <span className="block sm:inline">{value}</span>
                <span className="text-sm sm:text-base">{unit}</span>
              </div>
              {subtitle && (
                <div className={subtitleClasses}>
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-full">
          <h3 className={titleClasses}>{title}</h3>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  unit = '',
  backgroundColor = 'bg-white',
  icon,
  trend,
  subtitle,
  onClick,
  detailData
}) => {
  const handleClick = () => {
    if (onClick && detailData) {
      onClick(detailData);
    }
  };

  return (
    <div
      className={`${backgroundColor} rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300 h-full min-h-[120px] sm:min-h-[140px] cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-600 text-xs sm:text-sm font-medium truncate">{title}</h3>
          <div className="flex items-baseline space-x-1 sm:space-x-2 mt-1 sm:mt-2">
            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 leading-tight break-all">
              {value}
            </span>
            {unit && (
              <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{unit}</span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 sm:mt-3">
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                trend.type === 'up' ? 'bg-emerald-150 text-emerald-700' :
                trend.type === 'down' ? 'bg-rose-150 text-rose-700' :
                'bg-gray-150 text-gray-600'
              }`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-gray-400 flex-shrink-0 ml-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FullScreenModal = ({ isOpen, onClose, data, title }) => {
  if (!isOpen || !data) return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-500 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 ${
          isOpen ? 'opacity-30' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full h-full bg-gray-50 transform transition-all duration-500 ease-out ${
          isOpen
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 translate-y-8 opacity-0'
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h1>
                <p className="text-gray-600 mt-1">Detailed analysis and monitoring</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.items?.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                    isOpen
                      ? 'animate-in fade-in slide-in-from-bottom-4'
                      : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'active' ? 'bg-emerald-150 text-emerald-700' :
                      item.status === 'warning' ? 'bg-amber-150 text-amber-700' :
                      item.status === 'error' ? 'bg-rose-150 text-rose-700' :
                      'bg-gray-150 text-gray-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Version</span>
                      <span className="text-sm font-medium">{item.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Load Time</span>
                      <span className="text-sm font-medium">{item.loadTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Memory Usage</span>
                      <span className="text-sm font-medium">{item.memory}MB</span>
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Performance</span>
                      <span>{item.performance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          item.performance >= 80 ? 'bg-emerald-500' :
                          item.performance >= 60 ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`}
                        style={{
                          width: `${item.performance}%`,
                          transitionDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SystemHealthDashboard = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 12,
    memoryUsage: 68,
    diskUsage: 45,
    networkSpeed: 85,
    activeUsers: 147,
    pageViews: 2847,
    responseTime: 245,
    uptime: 99.8
  });

  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for detailed views
  const detailData = {
    plugins: {
      title: "Plugin Performance Details",
      items: [
        { name: "WooCommerce", version: "7.8.2", loadTime: 145, memory: 12.5, status: "active", performance: 92 },
        { name: "Yoast SEO", version: "20.8", loadTime: 89, memory: 8.2, status: "active", performance: 88 },
        { name: "Contact Form 7", version: "5.7.7", loadTime: 34, memory: 3.1, status: "active", performance: 95 },
        { name: "Akismet", version: "5.1", loadTime: 67, memory: 4.8, status: "warning", performance: 72 },
        { name: "Jetpack", version: "12.2", loadTime: 198, memory: 15.3, status: "error", performance: 45 },
        { name: "WP Rocket", version: "3.13.1", loadTime: 23, memory: 2.1, status: "active", performance: 97 }
      ]
    },
    database: {
      title: "Database Health Details",
      items: [
        { name: "Posts Table", version: "5.2", loadTime: 12, memory: 45.2, status: "active", performance: 94 },
        { name: "Users Table", version: "5.2", loadTime: 8, memory: 12.8, status: "active", performance: 96 },
        { name: "Options Table", version: "5.2", loadTime: 23, memory: 8.9, status: "warning", performance: 78 },
        { name: "Comments Table", version: "5.2", loadTime: 15, memory: 32.1, status: "active", performance: 89 },
        { name: "Meta Tables", version: "5.2", loadTime: 34, memory: 67.4, status: "active", performance: 85 }
      ]
    },
    cache: {
      title: "Cache Performance Details",
      items: [
        { name: "Object Cache", version: "Redis 7.0", loadTime: 5, memory: 128, status: "active", performance: 98 },
        { name: "Page Cache", version: "WP Rocket", loadTime: 12, memory: 45, status: "active", performance: 92 },
        { name: "Database Cache", version: "Built-in", loadTime: 8, memory: 23, status: "active", performance: 87 },
        { name: "Image Cache", version: "WebP", loadTime: 18, memory: 67, status: "warning", performance: 74 }
      ]
    }
  };

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalData(null), 500); // Wait for animation
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(5, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        networkSpeed: Math.max(20, Math.min(100, prev.networkSpeed + (Math.random() - 0.5) * 8)),
        responseTime: Math.max(100, Math.min(500, prev.responseTime + (Math.random() - 0.5) * 50)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <VitalSignsHeader/>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
            WordPress System Health
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Real-time monitoring of your WordPress installation
          </p>
        </div>

        {/* Main Gauges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <CircularGauge
            value={Math.round(systemMetrics.cpuUsage)}
            title="CPU Usage"
            backgroundColor="bg-gradient-to-br from-blue-100 to-blue-200"
            accentColor="stroke-blue-600"
            dangerThreshold={85}
            warningThreshold={70}
          />
          <CircularGauge
            value={Math.round(systemMetrics.memoryUsage)}
            title="Memory Usage"
            backgroundColor="bg-gradient-to-br from-emerald-100 to-emerald-200"
            accentColor="stroke-emerald-600"
            dangerThreshold={90}
            warningThreshold={75}
          />
          <CircularGauge
            value={Math.round(systemMetrics.diskUsage)}
            title="Disk Usage"
            backgroundColor="bg-gradient-to-br from-purple-100 to-purple-200"
            accentColor="stroke-purple-600"
            dangerThreshold={85}
            warningThreshold={70}
          />
          <CircularGauge
            value={Math.round(systemMetrics.networkSpeed)}
            title="Network Speed"
            subtitle="Mbps"
            backgroundColor="bg-gradient-to-br from-orange-100 to-orange-200"
            accentColor="stroke-orange-600"
            maxValue={100}
            unit=""
            dangerThreshold={20}
            warningThreshold={50}
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <MetricCard
            title="Active Users"
            value={systemMetrics.activeUsers}
            backgroundColor="bg-gradient-to-br from-sky-100 to-sky-200"
            trend={{ type: 'up', value: '+12%' }}
          />
          <MetricCard
            title="Page Views"
            value={systemMetrics.pageViews.toLocaleString()}
            backgroundColor="bg-gradient-to-br from-green-100 to-green-200"
            subtitle="Today"
            trend={{ type: 'up', value: '+8.2%' }}
          />
          <MetricCard
            title="Response Time"
            value={Math.round(systemMetrics.responseTime)}
            unit="ms"
            backgroundColor="bg-gradient-to-br from-red-100 to-red-200"
            trend={{ type: 'down', value: '-15ms' }}
          />
          <MetricCard
            title="Uptime"
            value={systemMetrics.uptime}
            unit="%"
            backgroundColor="bg-gradient-to-br from-indigo-100 to-indigo-200"
            subtitle="30 days"
          />
        </div>

        {/* WordPress Specific Metrics - Clickable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <CircularGauge
            value={78}
            title="Plugin Performance"
            backgroundColor="bg-gradient-to-br from-teal-100 to-teal-200"
            accentColor="stroke-teal-600"
            size="small"
            dangerThreshold={90}
            warningThreshold={80}
            onClick={openModal}
            detailData={detailData.plugins}
          />
          <CircularGauge
            value={92}
            title="Database Health"
            backgroundColor="bg-gradient-to-br from-cyan-100 to-cyan-200"
            accentColor="stroke-cyan-600"
            size="small"
            dangerThreshold={95}
            warningThreshold={85}
            onClick={openModal}
            detailData={detailData.database}
          />
          <div className="sm:col-span-2 lg:col-span-1">
            <CircularGauge
              value={65}
              title="Cache Hit Rate"
              backgroundColor="bg-gradient-to-br from-pink-100 to-pink-200"
              accentColor="stroke-pink-600"
              size="small"
              dangerThreshold={30}
              warningThreshold={50}
              onClick={openModal}
              detailData={detailData.cache}
            />
          </div>
        </div>

        {/* Mobile-friendly status bar */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">System Status:</span>
              <span className="text-emerald-600 font-medium">Healthy</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            Last updated: {new Date().toLocaleTimeString()} | Auto-refresh every 3 seconds
          </p>
        </div>
      </div>

      {/* Full Screen Modal */}
      <FullScreenModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={modalData}
        title={modalData?.title || ''}
      />
    </div>
  );
};

export default SystemHealthDashboard;