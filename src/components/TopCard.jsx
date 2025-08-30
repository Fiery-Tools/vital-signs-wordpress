const TopCard = ({ title, subtitle }) => {
  return (
    <>
      <div className="bg-white shadow-md rounded-lg px-4 py-2 mb-4">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>
    </>
  );
}

export default TopCard;