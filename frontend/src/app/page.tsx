import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-nexus-bg flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-nexus-text-primary mb-4">
          NEXUS Admin Portal
        </h1>
        <p className="text-nexus-text-secondary mb-8">
          The operating system for modern business. Complete admin control over all platform features.
        </p>

        <div className="space-y-4">
          <Link
            href="/admin"
            className="btn btn-primary w-full block text-center"
          >
            Access Admin Dashboard
          </Link>

          <div className="text-sm text-nexus-text-tertiary">
            Phase 2: Admin Dashboard Complete ✅
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-2 gap-4 text-left">
          <div className="card p-4">
            <h3 className="font-semibold text-nexus-text-primary mb-2">
              User Management
            </h3>
            <p className="text-xs text-nexus-text-secondary">
              CRUD operations, impersonation, suspension, role management
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold text-nexus-text-primary mb-2">
              Module Control
            </h3>
            <p className="text-xs text-nexus-text-secondary">
              Per-plan feature toggles, dynamic module management
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold text-nexus-text-primary mb-2">
              White-Label
            </h3>
            <p className="text-xs text-nexus-text-secondary">
              Custom branding, domains, support emails, documentation
            </p>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold text-nexus-text-primary mb-2">
              Dynamic Models
            </h3>
            <p className="text-xs text-nexus-text-secondary">
              Auto-sync OpenRouter/Kie.ai models, no hardcoded lists
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}