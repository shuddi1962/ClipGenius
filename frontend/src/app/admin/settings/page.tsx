'use client';

import { useState } from 'react';
import AdminLayout from '../layout';
import { Save, Palette, Globe, Mail, Settings, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // Platform Settings
    maintenance_mode: false,
    maintenance_message: 'System is under maintenance. Please check back soon.',
    timezone: 'UTC',
    date_format: 'YYYY-MM-DD',
    time_format: 'HH:mm:ss',
    currency: 'USD',
    language: 'en',

    // Security
    session_timeout: 24,
    password_min_length: 8,
    two_fa_required: false,
    ip_whitelist: [],

    // Limits
    max_users_per_org: 100,
    max_orgs_per_user: 5,
    max_api_keys_per_org: 50,
    rate_limit_requests: 100,
    rate_limit_window: 60,
  });

  const [whiteLabel, setWhiteLabel] = useState({
    enabled: false,
    branding: {
      name: 'Nexus',
      logo_url: '',
      favicon_url: '',
      primary_color: '#1A1A2E',
      secondary_color: '#0652DD',
      custom_domain: '',
      custom_email_domain: '',
    },
    features: {
      remove_branding: false,
      custom_support_email: '',
      custom_docs_url: '',
      custom_privacy_policy_url: '',
      custom_terms_url: '',
    },
  });

  const handleSaveSettings = () => {
    // TODO: Save platform settings
    console.log('Saving settings:', settings);
  };

  const handleSaveWhiteLabel = () => {
    // TODO: Save white-label settings
    console.log('Saving white-label:', whiteLabel);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">
            Platform Settings
          </h1>
          <p className="text-nexus-text-secondary mt-1">
            Configure system-wide settings and white-label branding
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Settings */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="h-5 w-5 text-nexus-blue" />
              <h2 className="text-lg font-semibold text-nexus-text-primary">
                Platform Configuration
              </h2>
            </div>

            <div className="space-y-6">
              {/* Maintenance Mode */}
              <div>
                <label className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    checked={settings.maintenance_mode}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      maintenance_mode: e.target.checked
                    }))}
                    className="rounded border-nexus-border text-nexus-blue focus:ring-nexus-blue"
                  />
                  <span className="text-sm font-medium text-nexus-text-primary">
                    Maintenance Mode
                  </span>
                </label>
                {settings.maintenance_mode && (
                  <textarea
                    value={settings.maintenance_message}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      maintenance_message: e.target.value
                    }))}
                    className="input w-full mt-2"
                    rows={3}
                    placeholder="Maintenance message..."
                  />
                )}
              </div>

              {/* Timezone & Locale */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nexus-text-primary mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      timezone: e.target.value
                    }))}
                    className="input w-full"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-nexus-text-primary mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      currency: e.target.value
                    }))}
                    className="input w-full"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>

              {/* Security Settings */}
              <div>
                <h3 className="text-sm font-semibold text-nexus-text-primary mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-nexus-text-secondary mb-1">
                      Session Timeout (hours)
                    </label>
                    <input
                      type="number"
                      value={settings.session_timeout}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        session_timeout: parseInt(e.target.value)
                      }))}
                      className="input w-full"
                      min="1"
                      max="168"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-nexus-text-secondary mb-1">
                      Min Password Length
                    </label>
                    <input
                      type="number"
                      value={settings.password_min_length}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        password_min_length: parseInt(e.target.value)
                      }))}
                      className="input w-full"
                      min="6"
                      max="32"
                    />
                  </div>
                </div>
              </div>

              {/* Rate Limiting */}
              <div>
                <h3 className="text-sm font-semibold text-nexus-text-primary mb-3">
                  Rate Limiting
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-nexus-text-secondary mb-1">
                      Requests per window
                    </label>
                    <input
                      type="number"
                      value={settings.rate_limit_requests}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        rate_limit_requests: parseInt(e.target.value)
                      }))}
                      className="input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-nexus-text-secondary mb-1">
                      Window (seconds)
                    </label>
                    <input
                      type="number"
                      value={settings.rate_limit_window}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        rate_limit_window: parseInt(e.target.value)
                      }))}
                      className="input w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="btn btn-primary w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Platform Settings
              </button>
            </div>
          </div>

          {/* White-Label Settings */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-5 w-5 text-nexus-violet" />
              <h2 className="text-lg font-semibold text-nexus-text-primary">
                White-Label Branding
              </h2>
            </div>

            <div className="space-y-6">
              {/* Enable White-Label */}
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={whiteLabel.enabled}
                    onChange={(e) => setWhiteLabel(prev => ({
                      ...prev,
                      enabled: e.target.checked
                    }))}
                    className="rounded border-nexus-border text-nexus-violet focus:ring-nexus-violet"
                  />
                  <span className="text-sm font-medium text-nexus-text-primary">
                    Enable White-Label Mode
                  </span>
                </label>
              </div>

              {whiteLabel.enabled && (
                <>
                  {/* Branding */}
                  <div>
                    <h3 className="text-sm font-semibold text-nexus-text-primary mb-3">
                      Branding
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-nexus-text-secondary mb-1">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          value={whiteLabel.branding.name}
                          onChange={(e) => setWhiteLabel(prev => ({
                            ...prev,
                            branding: { ...prev.branding, name: e.target.value }
                          }))}
                          className="input w-full"
                          placeholder="Your Platform Name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-nexus-text-secondary mb-1">
                            Primary Color
                          </label>
                          <input
                            type="color"
                            value={whiteLabel.branding.primary_color}
                            onChange={(e) => setWhiteLabel(prev => ({
                              ...prev,
                              branding: { ...prev.branding, primary_color: e.target.value }
                            }))}
                            className="input w-full h-10"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-nexus-text-secondary mb-1">
                            Secondary Color
                          </label>
                          <input
                            type="color"
                            value={whiteLabel.branding.secondary_color}
                            onChange={(e) => setWhiteLabel(prev => ({
                              ...prev,
                              branding: { ...prev.branding, secondary_color: e.target.value }
                            }))}
                            className="input w-full h-10"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-nexus-text-secondary mb-1">
                          Logo URL
                        </label>
                        <input
                          type="url"
                          value={whiteLabel.branding.logo_url}
                          onChange={(e) => setWhiteLabel(prev => ({
                            ...prev,
                            branding: { ...prev.branding, logo_url: e.target.value }
                          }))}
                          className="input w-full"
                          placeholder="https://example.com/logo.png"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-nexus-text-secondary mb-1">
                          Custom Domain
                        </label>
                        <input
                          type="text"
                          value={whiteLabel.branding.custom_domain}
                          onChange={(e) => setWhiteLabel(prev => ({
                            ...prev,
                            branding: { ...prev.branding, custom_domain: e.target.value }
                          }))}
                          className="input w-full"
                          placeholder="yourplatform.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-sm font-semibold text-nexus-text-primary mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Custom Features
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-3 mb-2">
                          <input
                            type="checkbox"
                            checked={whiteLabel.features.remove_branding}
                            onChange={(e) => setWhiteLabel(prev => ({
                              ...prev,
                              features: { ...prev.features, remove_branding: e.target.checked }
                            }))}
                            className="rounded border-nexus-border text-nexus-violet focus:ring-nexus-violet"
                          />
                          <span className="text-sm font-medium text-nexus-text-primary">
                            Remove "Powered by Nexus" branding
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-nexus-text-secondary mb-1">
                          Support Email
                        </label>
                        <input
                          type="email"
                          value={whiteLabel.features.custom_support_email}
                          onChange={(e) => setWhiteLabel(prev => ({
                            ...prev,
                            features: { ...prev.features, custom_support_email: e.target.value }
                          }))}
                          className="input w-full"
                          placeholder="support@yourplatform.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-nexus-text-secondary mb-1">
                          Documentation URL
                        </label>
                        <input
                          type="url"
                          value={whiteLabel.features.custom_docs_url}
                          onChange={(e) => setWhiteLabel(prev => ({
                            ...prev,
                            features: { ...prev.features, custom_docs_url: e.target.value }
                          }))}
                          className="input w-full"
                          placeholder="https://docs.yourplatform.com"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveWhiteLabel}
                    className="btn btn-primary w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save White-Label Settings
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Module Toggle System */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-5 w-5 text-nexus-green" />
            <h2 className="text-lg font-semibold text-nexus-text-primary">
              Module Management
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-nexus-text-secondary">
              Control which features are available to different subscription plans. Changes take effect immediately.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Starter Plan */}
              <div className="border border-nexus-border rounded-lg p-4">
                <h3 className="font-semibold text-nexus-text-primary mb-3">Starter Plan</h3>
                <div className="space-y-2">
                  {[
                    { id: 'crm', name: 'CRM & Contacts', enabled: true },
                    { id: 'content_writer', name: 'Content Writer', enabled: true },
                    { id: 'email_marketing', name: 'Email Marketing', enabled: true },
                    { id: 'ads_manager', name: 'Ads Manager', enabled: false },
                    { id: 'design_studio', name: 'Design Studio', enabled: false },
                    { id: 'video_editor', name: 'Video Editor', enabled: false },
                  ].map((module) => (
                    <label key={module.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={module.enabled}
                        onChange={() => {
                          // TODO: Implement module toggle
                          console.log('Toggle module:', module.id);
                        }}
                        className="rounded border-nexus-border text-nexus-blue focus:ring-nexus-blue"
                      />
                      <span className="text-sm text-nexus-text-primary">{module.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pro Plan */}
              <div className="border border-nexus-border rounded-lg p-4">
                <h3 className="font-semibold text-nexus-text-primary mb-3">Pro Plan</h3>
                <div className="space-y-2">
                  {[
                    { id: 'crm', name: 'CRM & Contacts', enabled: true },
                    { id: 'content_writer', name: 'Content Writer', enabled: true },
                    { id: 'email_marketing', name: 'Email Marketing', enabled: true },
                    { id: 'ads_manager', name: 'Ads Manager', enabled: true },
                    { id: 'design_studio', name: 'Design Studio', enabled: true },
                    { id: 'video_editor', name: 'Video Editor', enabled: false },
                  ].map((module) => (
                    <label key={module.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={module.enabled}
                        onChange={() => {
                          // TODO: Implement module toggle
                          console.log('Toggle module:', module.id);
                        }}
                        className="rounded border-nexus-border text-nexus-blue focus:ring-nexus-blue"
                      />
                      <span className="text-sm text-nexus-text-primary">{module.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Agency Plan */}
              <div className="border border-nexus-border rounded-lg p-4">
                <h3 className="font-semibold text-nexus-text-primary mb-3">Agency Plan</h3>
                <div className="space-y-2">
                  {[
                    { id: 'crm', name: 'CRM & Contacts', enabled: true },
                    { id: 'content_writer', name: 'Content Writer', enabled: true },
                    { id: 'email_marketing', name: 'Email Marketing', enabled: true },
                    { id: 'ads_manager', name: 'Ads Manager', enabled: true },
                    { id: 'design_studio', name: 'Design Studio', enabled: true },
                    { id: 'video_editor', name: 'Video Editor', enabled: true },
                  ].map((module) => (
                    <label key={module.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={module.enabled}
                        onChange={() => {
                          // TODO: Implement module toggle
                          console.log('Toggle module:', module.id);
                        }}
                        className="rounded border-nexus-border text-nexus-blue focus:ring-nexus-blue"
                      />
                      <span className="text-sm text-nexus-text-primary">{module.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}