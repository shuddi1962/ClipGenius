import { createClient } from '@insforge/sdk';

class ApiClient {
  private client: any;

  constructor() {
    this.client = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://wk49fyqm.us-east.insforge.app',
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'ik_1234567890abcdef',
    });
  }

  // Auth methods
  async login(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      user: data.user,
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
    };
  }

  async logout() {
    const { error } = await this.client.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.client.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }

    // Get additional user data from our users table
    let userProfile = null;
    if (user?.id) {
      const { data: profile } = await this.client
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      userProfile = profile;
    }

    return {
      user: {
        ...user,
        ...userProfile,
        name: userProfile?.full_name || user.email?.split('@')[0] || 'User'
      }
    };
  }

  async register(email: string, password: string, metadata?: any) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Database query methods
  async getUsers() {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getOrganizations() {
    const { data, error } = await this.client
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getContacts() {
    const { data, error } = await this.client
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getArticles() {
    const { data, error } = await this.client
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getAdAccounts() {
    const { data, error } = await this.client
      .from('ad_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getAdCampaigns() {
    const { data, error } = await this.client
      .from('ad_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Content & SEO
  async getContentSources() {
    const { data, error } = await this.client
      .from('content_sources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // API Keys (stored in database)
  async getApiKeys() {
    const { data, error } = await this.client
      .from('api_keys_vault')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

export const apiClient = new ApiClient();