import { Save, Database, Mail, Shield, Globe } from 'lucide-react';

export default function SystemSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2 text-purple-600" />
          Database Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention (days)</label>
            <input type="number" defaultValue="365" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <Mail className="h-5 w-5 mr-2 text-purple-600" />
          Email Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
            <input type="text" placeholder="smtp.example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
              <input type="number" defaultValue="587" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
              <input type="email" placeholder="noreply@hotel.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-purple-600" />
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Require 2FA for admin access</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Session Timeout</p>
              <p className="text-sm text-gray-600">Auto logout after inactivity</p>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600">
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>Never</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-purple-600" />
          Platform Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
            <input type="text" defaultValue="Hotel SaaS Platform" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
            <input type="email" defaultValue="support@hotel.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-600">Disable public access temporarily</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center font-medium">
          <Save className="h-5 w-5 mr-2" />
          Save All Settings
        </button>
      </div>
    </div>
  );
}
