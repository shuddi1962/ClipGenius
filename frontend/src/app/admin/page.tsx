import AdminLayout from './layout';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-nexus-text-primary">
            Admin Dashboard
          </h1>
          <p className="text-nexus-text-secondary mt-1">
            Manage users, settings, and platform configuration
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nexus-text-secondary">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-nexus-text-primary">
                  1,247
                </p>
              </div>
              <div className="h-8 w-8 bg-nexus-blue-light rounded-lg flex items-center justify-center">
                <span className="text-nexus-blue font-semibold">U</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nexus-text-secondary">
                  Organizations
                </p>
                <p className="text-2xl font-bold text-nexus-text-primary">
                  324
                </p>
              </div>
              <div className="h-8 w-8 bg-nexus-violet-light rounded-lg flex items-center justify-center">
                <span className="text-nexus-violet font-semibold">O</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nexus-text-secondary">
                  Active API Keys
                </p>
                <p className="text-2xl font-bold text-nexus-text-primary">
                  12
                </p>
              </div>
              <div className="h-8 w-8 bg-nexus-green rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">K</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-nexus-text-secondary">
                  System Health
                </p>
                <p className="text-2xl font-bold text-nexus-green">
                  99.9%
                </p>
              </div>
              <div className="h-8 w-8 bg-nexus-green rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-nexus-text-primary mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-nexus-bg-secondary rounded-lg">
              <div className="h-8 w-8 bg-nexus-blue rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-nexus-text-primary">
                  New user registered
                </p>
                <p className="text-xs text-nexus-text-secondary">
                  john.doe@example.com • 2 minutes ago
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-nexus-bg-secondary rounded-lg">
              <div className="h-8 w-8 bg-nexus-violet rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">K</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-nexus-text-primary">
                  API key added
                </p>
                <p className="text-xs text-nexus-text-secondary">
                  OpenRouter API key configured • 15 minutes ago
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-nexus-bg-secondary rounded-lg">
              <div className="h-8 w-8 bg-nexus-green rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">P</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-nexus-text-primary">
                  Plugin installed
                </p>
                <p className="text-xs text-nexus-text-secondary">
                  Custom analytics plugin enabled • 1 hour ago
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">
              User Management
            </h3>
            <p className="text-sm text-nexus-text-secondary mb-4">
              Manage users, roles, and permissions
            </p>
            <a
              href="/admin/users"
              className="btn btn-primary w-full"
            >
              Manage Users
            </a>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">
              API Keys Vault
            </h3>
            <p className="text-sm text-nexus-text-secondary mb-4">
              Configure third-party integrations
            </p>
            <a
              href="/admin/api-keys"
              className="btn btn-primary w-full"
            >
              Manage API Keys
            </a>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-nexus-text-primary mb-2">
              Platform Settings
            </h3>
            <p className="text-sm text-nexus-text-secondary mb-4">
              Configure system-wide settings
            </p>
            <a
              href="/admin/settings"
              className="btn btn-primary w-full"
            >
              System Settings
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}