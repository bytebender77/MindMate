import { useState, useEffect } from 'react';
import { Download, Trash2, Shield, Bell, Globe, Database, Sparkles, Brain } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useJournal } from '../hooks/useJournal';
import { settingsAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SettingsPage = () => {
  const { entries } = useJournal();
  const [notifications, setNotifications] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [aiProvider, setAiProvider] = useState('gemini');
  const [availableProviders, setAvailableProviders] = useState([]);
  const [loadingProvider, setLoadingProvider] = useState(false);
  const [loadingSwitch, setLoadingSwitch] = useState(false);

  useEffect(() => {
    // Fetch current provider on mount
    const fetchProvider = async () => {
      setLoadingProvider(true);
      const result = await settingsAPI.getProvider();
      if (result.success) {
        setAiProvider(result.current_provider);
        setAvailableProviders(result.available_providers || []);
      } else {
        toast.error('Failed to load AI provider settings');
      }
      setLoadingProvider(false);
    };

    fetchProvider();
  }, []);

  const handleProviderSwitch = async (newProvider) => {
    if (newProvider === aiProvider) return;
    
    setLoadingSwitch(true);
    const result = await settingsAPI.setProvider(newProvider);
    
    if (result.success) {
      setAiProvider(result.current_provider);
      const mode = result.current_provider === 'gemini' ? 'Testing' : 'Production';
      toast.success(`Switched to ${result.current_provider.toUpperCase()} (${mode} Mode)`);
    } else {
      toast.error(result.error || 'Failed to switch provider');
    }
    setLoadingSwitch(false);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindmate-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success('Data exported successfully!');
  };

  const handleDeleteAllData = () => {
    const confirmed = window.confirm(
      'Are you absolutely sure you want to delete ALL your journal entries? This action cannot be undone.'
    );

    if (confirmed) {
      const doubleCheck = window.prompt(
        'Type "DELETE" in capital letters to confirm:'
      );

      if (doubleCheck === 'DELETE') {
        toast.success('This is a demo - no data was actually deleted');
      } else {
        toast.error('Deletion cancelled');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Manage your preferences and data
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Privacy & Security</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Your data is stored securely and privately. We never share your personal information.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="text-gray-600 dark:text-gray-400" size={20} />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">Cloud Sync</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sync your data across devices</p>
                  </div>
                </div>
                <button
                  onClick={() => setDataSync(!dataSync)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    dataSync ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      dataSync ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>End-to-end encryption:</strong> Your journal entries are encrypted and only you can read them.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Preferences</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Customize your MindMate experience
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="text-gray-600 dark:text-gray-400" size={20} />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">Daily Reminders</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get reminded to journal each day</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    notifications ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="text-gray-600 dark:text-gray-400" size={20} />
                  <p className="font-medium text-gray-800 dark:text-gray-200">Language</p>
                </div>
                <select className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">AI Provider</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Switch between Gemini (Testing) and OpenAI (Production) for reflections
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {loadingProvider ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner size="md" />
                </div>
              ) : (
                <>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Sparkles className="text-purple-600 dark:text-purple-400" size={20} />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">Current Provider</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {aiProvider === 'gemini' 
                              ? 'Gemini 2.5 Flash (Testing Mode)' 
                              : 'OpenAI GPT-4o-mini (Production Mode)'}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        aiProvider === 'gemini' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}>
                        {aiProvider === 'gemini' ? 'TESTING' : 'PRODUCTION'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleProviderSwitch('gemini')}
                        disabled={loadingSwitch || !availableProviders.includes('gemini') || aiProvider === 'gemini'}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          aiProvider === 'gemini'
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        } ${loadingSwitch || !availableProviders.includes('gemini') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Sparkles className="text-white" size={16} />
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">Gemini</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-left">Testing Mode</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 text-left mt-1">Fast & Free</p>
                      </button>

                      <button
                        onClick={() => handleProviderSwitch('openai')}
                        disabled={loadingSwitch || !availableProviders.includes('openai') || aiProvider === 'openai'}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          aiProvider === 'openai'
                            ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                        } ${loadingSwitch || !availableProviders.includes('openai') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Brain className="text-white" size={16} />
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">OpenAI</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-left">Production Mode</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 text-left mt-1">Best Quality</p>
                      </button>
                    </div>

                    {availableProviders.length === 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          ⚠️ No AI providers available. Please add API keys in your backend configuration.
                        </p>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <strong>Tip:</strong> Use Gemini for testing and development. Switch to OpenAI for production use with real users.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Data Management</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Export or delete your journal data
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Export Your Data</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Download all your journal entries as JSON
                    </p>
                  </div>
                  <Button onClick={handleExportData} variant="secondary">
                    <Download size={18} />
                    Export
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-300 mb-1">Delete All Data</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Permanently delete all your journal entries
                    </p>
                  </div>
                  <Button onClick={handleDeleteAllData} variant="danger">
                    <Trash2 size={18} />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-100 dark:border-primary-800/30">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">About MindMate</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Version 1.0.0 • Built for LuminHacks 2025
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Privacy Policy
                </a>
                <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Terms of Service
                </a>
                <a href="#" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Support
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
