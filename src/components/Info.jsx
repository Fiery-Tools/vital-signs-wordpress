import React from 'react';

// This is a sample data structure. In a real app, you would fetch this from your API.
// const [statusData, setStatusData] = useState([]);
// useEffect(() => { fetch('/wp-json/my-plugin/v1/status').then(res => res.json()).then(data => setStatusData(data)) }, []);
const sampleStatusData = [
  [
    {"key":"WordPress Version","value":"6.4.3"},{"key":"Site URL","value":"https://example.com"},{"key":"Home URL","value":"https://example.com"},{"key":"Multisite","value":"No"},{"key":"Active Theme","value":"Astra"},{"key":"Theme Version","value":"4.6.8"},{"key":"Debug Mode","value":"No"},{"key":"Memory Limit","value":"256M"},{"key":"SSL Enabled","value":"Yes"}
  ],
  [
    {"key":"PHP Version","value":"8.2.11"},{"key":"Web Server","value":"Apache/2.4.57"},{"key":"MySQL Version","value":"8.0.35"},{"key":"PHP Memory Limit","value":"512M"},{"key":"PHP Max Execution Time","value":"300"},{"key":"PHP Post Max Size","value":"128M"},{"key":"PHP Upload Max Filesize","value":"128M"},{"key":"Timezone","value":"UTC"},{"key":"Timestamp (UTC)","value":"2025-08-13 23:42:00"}
  ],
  [
    {"key":"Total Plugins","value":25},{"key":"Active Plugins","value":22},{"key":"User Count","value":15},{"key":"Published Posts","value":150},{"key":"Published Pages","value":25},{"key":"Total Comments","value":842},{"key":"Database Prefix","value":"wp_a1b2c3_"}
  ]
];

const SectionTable = ({ title, data }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden ring-1 ring-black ring-opacity-5">
    {/* Card Header */}
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>

    {/* Table Body */}
    <div className="divide-y divide-gray-200">
      {data.map((item, index) => (
        <div key={index} className="px-4 py-3 flex justify-between items-center text-sm">
          <p className="font-medium text-gray-600">{item.key}</p>
          <p className="text-gray-800 text-right">{String(item.value)}</p>
        </div>
      ))}
    </div>
  </div>
);

const WpStatusGrid = ({ statusData }) => {
  const titles = ["WordPress Environment", "Server Environment", "Content & Data"];

  // Ensure statusData is an array before mapping
  if (!Array.isArray(statusData) || statusData.length === 0) {
    return <p className="text-center text-gray-500">Loading status information...</p>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statusData.map((sectionData, index) => (
          <SectionTable
            key={index}
            title={titles[index]}
            data={sectionData}
          />
        ))}
      </div>
    </div>
  );
};


// How to use the component in your app
const Info = ({status}) => {
  // In a real app, this data would be fetched from your WordPress REST API
  const data = sampleStatusData;

  return (
    <div>
      <WpStatusGrid statusData={status} />
    </div>
  );
};

export default Info;