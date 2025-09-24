import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheckIcon, 
  CogIcon, 
  DevicePhoneMobileIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  ScaleIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user, logout } = useAuth();
  
  // Privacy & Security State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [dataSharing, setDataSharing] = useState({
    analytics: true,
    marketing: false,
    research: true,
    thirdParty: false
  });
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    goalAchievements: true,
    weeklyReports: true,
    socialUpdates: false,
    emailDigest: true,
    pushNotifications: true,
    smsAlerts: false
  });

  // App Customization State
  const [theme, setTheme] = useState('system');
  const [units, setUnits] = useState('metric');
  const [language, setLanguage] = useState('en');

  // Connected Devices State
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: 'Apple Watch Series 9', type: 'smartwatch', status: 'connected', lastSync: '2 hours ago' },
    { id: 2, name: 'Strava', type: 'app', status: 'connected', lastSync: '1 day ago' },
    { id: 3, name: 'MyFitnessPal', type: 'app', status: 'disconnected', lastSync: '1 week ago' }
  ]);

  // Form Handlers
  const handleNotificationToggle = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleDataSharingToggle = (setting) => {
    setDataSharing(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleDeviceToggle = (deviceId) => {
    setConnectedDevices(prev => 
      prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: device.status === 'connected' ? 'disconnected' : 'connected' }
          : device
      )
    );
  };

  const handleRemoveDevice = (deviceId) => {
    setConnectedDevices(prev => prev.filter(device => device.id !== deviceId));
  };

  const handleLogout = () => {
    logout();
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
  ];

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        className={`${
          enabled ? 'bg-indigo-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
        onClick={onChange}
      >
        <span
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your privacy and app preferences</p>
      </div>

      {/* Privacy & Security Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <ShieldCheckIcon className="h-6 w-6 text-indigo-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
        </div>

        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="border-b border-gray-200 pb-6">
            <ToggleSwitch
              enabled={twoFactorEnabled}
              onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
            />
          </div>

          {/* Data Sharing Preferences */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Data Sharing Preferences</h3>
            <div className="space-y-4">
              <ToggleSwitch
                enabled={dataSharing.analytics}
                onChange={() => handleDataSharingToggle('analytics')}
                label="Analytics Data"
                description="Help improve the app by sharing anonymous usage data"
              />
              <ToggleSwitch
                enabled={dataSharing.marketing}
                onChange={() => handleDataSharingToggle('marketing')}
                label="Marketing Communications"
                description="Receive promotional emails and product updates"
              />
              <ToggleSwitch
                enabled={dataSharing.research}
                onChange={() => handleDataSharingToggle('research')}
                label="Research Studies"
                description="Participate in fitness and health research studies"
              />
              <ToggleSwitch
                enabled={dataSharing.thirdParty}
                onChange={() => handleDataSharingToggle('thirdParty')}
                label="Third-Party Sharing"
                description="Allow sharing data with connected fitness apps"
              />
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <ToggleSwitch
                enabled={notifications.workoutReminders}
                onChange={() => handleNotificationToggle('workoutReminders')}
                label="Workout Reminders"
                description="Get notified about scheduled workouts"
              />
              <ToggleSwitch
                enabled={notifications.goalAchievements}
                onChange={() => handleNotificationToggle('goalAchievements')}
                label="Goal Achievements"
                description="Celebrate when you reach your fitness goals"
              />
              <ToggleSwitch
                enabled={notifications.weeklyReports}
                onChange={() => handleNotificationToggle('weeklyReports')}
                label="Weekly Reports"
                description="Receive weekly progress summaries"
              />
              <ToggleSwitch
                enabled={notifications.socialUpdates}
                onChange={() => handleNotificationToggle('socialUpdates')}
                label="Social Updates"
                description="Notifications from friends and community"
              />
              <ToggleSwitch
                enabled={notifications.emailDigest}
                onChange={() => handleNotificationToggle('emailDigest')}
                label="Email Digest"
                description="Weekly email with your fitness highlights"
              />
              <ToggleSwitch
                enabled={notifications.pushNotifications}
                onChange={() => handleNotificationToggle('pushNotifications')}
                label="Push Notifications"
                description="Receive notifications on your device"
              />
              <ToggleSwitch
                enabled={notifications.smsAlerts}
                onChange={() => handleNotificationToggle('smsAlerts')}
                label="SMS Alerts"
                description="Get important updates via text message"
              />
            </div>
          </div>
        </div>
      </div>

      {/* App Customization Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <CogIcon className="h-6 w-6 text-indigo-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">App Customization</h2>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Light', icon: SunIcon },
                { value: 'dark', label: 'Dark', icon: MoonIcon },
                { value: 'system', label: 'System', icon: ComputerDesktopIcon }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${
                    theme === value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Units of Measurement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Units of Measurement</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'metric', label: 'Metric (kg, cm, km)' },
                { value: 'imperial', label: 'Imperial (lb, ft, mi)' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setUnits(value)}
                  className={`flex items-center justify-center p-4 border-2 rounded-lg transition-colors ${
                    units === value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ScaleIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Connected Devices Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <DevicePhoneMobileIcon className="h-6 w-6 text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Connected Devices & Apps</h2>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Device
          </button>
        </div>

        <div className="space-y-4">
          {connectedDevices.map(device => (
            <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-3 ${
                  device.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <div>
                  <h4 className="font-medium text-gray-900">{device.name}</h4>
                  <p className="text-sm text-gray-500">
                    {device.type === 'smartwatch' ? '⌚ Smartwatch' : '📱 App'} • 
                    Last synced: {device.lastSync}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDeviceToggle(device.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    device.status === 'connected'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {device.status === 'connected' ? 'Disconnect' : 'Connect'}
                </button>
                <button
                  onClick={() => handleRemoveDevice(device.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help & Support Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <QuestionMarkCircleIcon className="h-6 w-6 text-indigo-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Help & Support</h2>
        </div>

        <div className="space-y-4">
          {[
            { title: 'Help Center', description: 'Browse articles and tutorials', link: '#' },
            { title: 'Contact Support', description: 'Get help from our support team', link: '#' },
            { title: 'Community Forum', description: 'Connect with other users', link: '#' },
            { title: 'Feature Requests', description: 'Suggest new features', link: '#' },
            { title: 'Privacy Policy', description: 'Learn how we protect your data', link: '#' },
            { title: 'Terms of Service', description: 'Review our terms and conditions', link: '#' }
          ].map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </a>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              {
                question: "How do I sync my fitness tracker?",
                answer: "Go to Connected Devices and click 'Add Device' to connect your fitness tracker."
              },
              {
                question: "Can I export my fitness data?",
                answer: "Yes, you can export your data from the Progress page using the export feature."
              },
              {
                question: "How do I change my fitness goals?",
                answer: "Visit your Profile page and update your fitness goals in the Goals section."
              }
            ].map((faq, index) => (
              <details key={index} className="border border-gray-200 rounded-lg p-4">
                <summary className="font-medium text-gray-900 cursor-pointer hover:text-indigo-600">
                  {faq.question}
                </summary>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Sign Out</h3>
            <p className="text-sm text-gray-500">Sign out of your account on this device</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
          <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-red-900">Delete Account</h4>
              <p className="text-sm text-red-700">Permanently delete your account and all data</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;