export default function SellerDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Dashboard content will go here */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-gray-800">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-800">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-gray-800">$0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-gray-800">0</p>
        </div>
      </div>
    </div>
  );
}
