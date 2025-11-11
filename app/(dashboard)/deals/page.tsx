export default function DealsPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tratos</h1>
            <p className="text-gray-600 mt-1">Gestiona tu pipeline de ventas</p>
          </div>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo trato
          </button>
        </div>

        {/* Pipeline View Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <button className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-md text-sm font-medium">
                Vista Pipeline
              </button>
              <button className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium">
                Vista Tabla
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Total: $0</span>
              <span className="text-gray-400">•</span>
              <span>0 tratos</span>
            </div>
          </div>

          {/* Pipeline Stages */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {['Prospecto', 'Calificación', 'Propuesta', 'Negociación', 'Cerrado'].map((stage) => (
              <div key={stage} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{stage}</h3>
                <p className="text-sm text-gray-500 mb-4">$0 • 0 tratos</p>
                <div className="space-y-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-sm text-gray-400">Sin tratos</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State for table view */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-16 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tratos aún</h3>
            <p className="text-gray-600 mb-6">Crea tu primer trato para comenzar a gestionar tu pipeline de ventas.</p>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Crear trato
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

