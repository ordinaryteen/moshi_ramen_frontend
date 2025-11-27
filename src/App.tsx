function App() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center gap-8">
      
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl tracking-wide">Hari-Hari</h1>
        <p className="text-secondary font-serif italic text-xl">Resto & Snack</p>
      </div>

      {/* Card Simulation */}
      <div className="max-w-md w-full bg-white shadow-xl border-t-4 border-primary p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl mb-1">Spicy Beef Ramen</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Resep klasik dengan kuah kaldu sapi yang dimasak 12 jam.
            </p>
          </div>
          <span className="text-lg font-bold font-serif text-primary">35K</span>
        </div>

        <button className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-serif py-3 px-4 uppercase tracking-wider transition-colors">
          Add to Order
        </button>
      </div>

    </div>
  )
}

export default App