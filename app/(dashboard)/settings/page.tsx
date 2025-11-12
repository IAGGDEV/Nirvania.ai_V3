'use client'

import { useState } from 'react'
import { User, Building2, Settings as SettingsIcon, Database, Plug, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

type SettingsSection = 'personal' | 'organization' | 'system' | 'data' | 'integrations' | 'billing'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('personal')
  const [saved, setSaved] = useState(true)

  const sections = [
    { id: 'personal' as const, label: 'Personal Settings', icon: User },
    { id: 'organization' as const, label: 'Organization Settings', icon: Building2 },
    { id: 'system' as const, label: 'System Settings', icon: SettingsIcon },
    { id: 'data' as const, label: 'Data Objects', icon: Database },
    { id: 'integrations' as const, label: 'Integrations', icon: Plug },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
  ]

  const handleChange = () => {
    setSaved(false)
    // Simulate auto-save
    setTimeout(() => setSaved(true), 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="px-12 py-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[280px] border-r border-gray-100 min-h-screen px-6 py-8">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon size={18} strokeWidth={2} />
                  {section.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 px-12 py-8">
          <div className="max-w-3xl">
            {activeSection === 'personal' && <PersonalSettings onChange={handleChange} />}
            {activeSection === 'organization' && <OrganizationSettings onChange={handleChange} />}
            {activeSection === 'system' && <SystemSettings onChange={handleChange} />}
            {activeSection === 'data' && <DataObjectsSettings />}
            {activeSection === 'integrations' && <IntegrationsSettings />}
            {activeSection === 'billing' && <BillingSettings />}
          </div>

          {/* Auto-save indicator */}
          {!saved && (
            <div className="fixed bottom-8 right-8 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
              Saving...
            </div>
          )}
          {saved && activeSection !== 'integrations' && activeSection !== 'billing' && (
            <div className="fixed bottom-8 right-8 px-4 py-2 bg-green-600 text-white text-sm rounded-lg shadow-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Saved
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function PersonalSettings({ onChange }: { onChange: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Personal Settings</h2>
        <p className="text-sm text-gray-500">
          Settings used by items workers that are specific to you.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Sender Name</label>
          <input
            type="text"
            placeholder="Irving Garcia"
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Sender Role</label>
          <input
            type="text"
            placeholder="CEO"
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Calendar Link</label>
          <input
            type="url"
            placeholder="https://cal.com/michaelscott"
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Signature</label>
          <textarea
            rows={6}
            placeholder="Michael Scott&#10;Regional Manager, Dunder Mifflin Paper Company&#10;dundermifflin.com"
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Pacific Time (PT)</option>
            <option>Mountain Time (MT)</option>
            <option>Central Time (CT)</option>
            <option>Eastern Time (ET)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function OrganizationSettings({ onChange }: { onChange: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Company Settings</h2>
        <p className="text-sm text-gray-500">
          Settings used by items workers to inform them about your company. These changes will affect everyone using item at your company.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            placeholder="Nirvaniaconsulting"
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
          <input
            type="url"
            placeholder="nirvaniaconsulting.com"
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
          <textarea
            rows={4}
            placeholder="We sell paper, ink and more office supplies"
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}

function SystemSettings({ onChange }: { onChange: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">System Settings</h2>
        <p className="text-sm text-gray-500">
          Configure system-wide settings and API access.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">API Key</h3>
          <p className="text-sm text-gray-500 mb-4">
            Use this API key to authenticate requests to the item API.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value="sk_live_B4r1•••••••••••••••••••••I3rL"
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
            />
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DataObjectsSettings() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Data Objects</h2>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
          + Create Object
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Object Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Records</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fields</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { name: 'Company', type: 'Standard', records: 0, fields: 10 },
              { name: 'Contact', type: 'Standard', records: 0, fields: 8 },
              { name: 'Corporation', type: 'Custom', records: 0, fields: 0 },
              { name: 'Deal', type: 'Custom', records: 0, fields: 5 },
            ].map((obj) => (
              <tr key={obj.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{obj.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{obj.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{obj.records}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{obj.fields}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function IntegrationsSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Integrations</h2>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Active</h3>
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white font-semibold text-xs">
                M
              </div>
              <span className="font-medium text-gray-900">Microsoft</span>
            </div>
            <span className="text-xs font-medium text-green-600">Active •</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">item has access to your Outlook Mail and Calendar.</p>
          <button className="mt-4 text-sm text-gray-700 hover:text-gray-900 font-medium">Edit Connection</button>
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-4">Not Connected</h3>
        <div className="space-y-3">
          {['Slack', 'Google', 'Stripe', 'Intercom', 'LinkedIn'].map((integration) => (
            <div key={integration} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <span className="font-medium text-gray-900">{integration}</span>
              <button className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BillingSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Billing Settings</h2>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Autonomous Pro (Launch)</h3>
            <div className="mt-2 space-y-1 text-sm">
              <p className="text-gray-600">
                <span className="text-gray-400">× Status:</span> <span className="text-red-600 font-medium">Canceled</span>
              </p>
              <p className="text-gray-600">
                <span className="text-gray-400">$ Amount:</span> $650.00/month
              </p>
              <p className="text-gray-600">
                <span className="text-gray-400">📅 Expires on:</span> November 15, 2025
              </p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Manage Subscription
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Need help?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Schedule a call with our team to discuss your needs or get assistance with your subscription.
        </p>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          📅 Book a call
        </button>
      </div>
    </div>
  )
}




