'use client';

import { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Mail, 
  Palette,
  Database,
  Cloud,
  Save
} from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  browserNotifications: boolean;
  newCourseNotifications: boolean;
  marketingEmails: boolean;
}

interface AppearanceSettings {
  theme: 'dark' | 'light' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    browserNotifications: true,
    newCourseNotifications: true,
    marketingEmails: false,
  });

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'dark',
    fontSize: 'medium',
    reducedMotion: false,
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simula salvamento das configurações
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Aqui você implementaria a chamada real à API
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-4">Informações da Plataforma</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome da Plataforma
                  </label>
                  <input
                    type="text"
                    defaultValue="EduPlataforma"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL da Plataforma
                  </label>
                  <input
                    type="url"
                    defaultValue="https://eduplataforma.com"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Plataforma de cursos online"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-4">Configurações de Contato</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email de Suporte
                  </label>
                  <input
                    type="email"
                    defaultValue="suporte@eduplataforma.com"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefone de Contato
                  </label>
                  <input
                    type="tel"
                    defaultValue="+55 (11) 99999-9999"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-6">Configurações de Notificações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Notificações por Email</p>
                  <p className="text-sm text-gray-400">Receba atualizações por email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      emailNotifications: e.target.checked
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Notificações do Navegador</p>
                  <p className="text-sm text-gray-400">Receba notificações push</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.browserNotifications}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      browserNotifications: e.target.checked
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Novos Cursos</p>
                  <p className="text-sm text-gray-400">Notificações sobre novos cursos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.newCourseNotifications}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      newCourseNotifications: e.target.checked
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-6">Aparência</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tema
                </label>
                <select
                  value={appearanceSettings.theme}
                  onChange={(e) => setAppearanceSettings(prev => ({
                    ...prev,
                    theme: e.target.value as 'dark' | 'light' | 'system'
                  }))}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dark">Escuro</option>
                  <option value="light">Claro</option>
                  <option value="system">Sistema</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tamanho da Fonte
                </label>
                <select
                  value={appearanceSettings.fontSize}
                  onChange={(e) => setAppearanceSettings(prev => ({
                    ...prev,
                    fontSize: e.target.value as 'small' | 'medium' | 'large'
                  }))}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Pequena</option>
                  <option value="medium">Média</option>
                  <option value="large">Grande</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Reduzir Animações</p>
                  <p className="text-sm text-gray-400">Minimizar efeitos visuais</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appearanceSettings.reducedMotion}
                    onChange={(e) => setAppearanceSettings(prev => ({
                      ...prev,
                      reducedMotion: e.target.checked
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Settings className="mr-2" />
            Configurações
          </h1>
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Save className="mr-2 h-5 w-5" />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar de Navegação */}
          <div className="w-64 space-y-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'general'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Globe className="mr-3 h-5 w-5" />
              Geral
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Bell className="mr-3 h-5 w-5" />
              Notificações
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'appearance'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Palette className="mr-3 h-5 w-5" />
              Aparência
            </button>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 