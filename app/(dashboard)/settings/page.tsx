export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Gestiona tu cuenta y preferencias</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <nav className="lg:col-span-1">
            <ul className="space-y-1">
              <li>
                <button className="w-full text-left px-4 py-2 rounded-lg bg-primary-50 text-primary-700 font-medium">
                  Perfil
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                  Empresa
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                  Integraciones
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                  API & Webhooks
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                  Facturación
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                  Usuarios
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
                  Notificaciones
                </button>
              </li>
            </ul>
          </nav>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
                <p className="text-sm text-gray-600 mt-1">Actualiza tu información de perfil</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-2xl font-medium text-primary-600">U</span>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Cambiar foto
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPG, GIF o PNG. Máximo 2MB.</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ej: Director de Ventas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+52 123 456 7890"
                    />
                  </div>
                </div>

                {/* Email Settings for Agents */}
                <div className="border-t pt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Configuración de Email para Agentes</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del remitente
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Tu nombre en los emails"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Firma de email
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Tu firma personalizada..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link de calendario
                      </label>
                      <input
                        type="url"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://calendly.com/tu-usuario"
                      />
                      <p className="text-xs text-gray-500 mt-1">Los agentes usarán este link para agendar reuniones</p>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t">
                  <button className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>

            {/* Timezone Settings */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Zona Horaria</h3>
              <div>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>America/Mexico_City (GMT-6)</option>
                  <option>America/Bogota (GMT-5)</option>
                  <option>America/Lima (GMT-5)</option>
                  <option>America/Santiago (GMT-3)</option>
                  <option>America/Buenos_Aires (GMT-3)</option>
                  <option>America/Sao_Paulo (GMT-3)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

