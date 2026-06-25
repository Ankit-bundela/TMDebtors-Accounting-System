function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard
      </h1>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition">
          <h2 className="text-xl font-semibold text-blue-600">Customers</h2>
          <p className="text-gray-600 mt-2">Manage all customers</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition">
          <h2 className="text-xl font-semibold text-green-600">Invoices</h2>
          <p className="text-gray-600 mt-2">Track all invoices</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition">
          <h2 className="text-xl font-semibold text-red-500">Payments</h2>
          <p className="text-gray-600 mt-2">View payment history</p>
        </div>

      </div>
    </div>
  );
}

export default Home;