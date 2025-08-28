const TopCard = ({ title, subtitle }) => {
  return (
    <div className="bg-white shadow-md rounded-lg px-4 py-2 mb-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="mt-2 text-gray-600">{subtitle}</p>
    </div>
  );
}

export default TopCard;