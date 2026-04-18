// Demo account creation script for InsForge
// This script creates demo accounts programmatically

async function createDemoAccounts() {
  console.log('🚀 Creating ClipGenius Demo Accounts...')
  console.log('=======================================')

  // Note: This is a placeholder script. In a real implementation,
  // you would use the InsForge SDK to create accounts programmatically.
  // Since we can't directly access the InsForge API from this environment,
  // please create these accounts manually in the InsForge dashboard.

  console.log('')
  console.log('📋 MANUAL ACCOUNT CREATION REQUIRED')
  console.log('====================================')
  console.log('')
  console.log('Visit: https://wk49fyqm.us-east.insforge.app')
  console.log('Go to: Authentication → Users')
  console.log('')

  console.log('👤 CREATE CLIENT ACCOUNT:')
  console.log('─────────────────────────')
  console.log('Email: client@clipgenius.ai')
  console.log('Password: demo123!')
  console.log('Full Name: John Smith')
  console.log('Business Name: Smith Marketing Agency')
  console.log('Country: United States')
  console.log('Plan: pro')
  console.log('')

  console.log('👑 CREATE ADMIN ACCOUNT:')
  console.log('────────────────────────')
  console.log('Email: admin@clipgenius.ai')
  console.log('Password: admin123!')
  console.log('Full Name: Admin User')
  console.log('Role: admin')
  console.log('')

  console.log('📊 AFTER CREATION:')
  console.log('──────────────────')
  console.log('1. Go to Workspaces in InsForge')
  console.log('2. Create a workspace for the client account:')
  console.log('   - Business Name: Smith Marketing Agency')
  console.log('   - User ID: Link to client@clipgenius.ai')
  console.log('   - Plan: pro')
  console.log('')

  console.log('✅ READY TO TEST:')
  console.log('─────────────────')
  console.log('Homepage: https://clip-genius-sigma.vercel.app/')
  console.log('Login: https://clip-genius-sigma.vercel.app/login')
  console.log('')
  console.log('Use the credentials above to test the application!')

  // In a real implementation, this would be:
  /*
  const { createClient } = require('@insforge/sdk')

  const insforge = createClient({
    url: process.env.INSFORGE_URL,
    anonKey: process.env.INSFORGE_ANON_KEY
  })

  // Create client account
  const { data: clientData, error: clientError } = await insforge.auth.signUp({
    email: 'client@clipgenius.ai',
    password: 'demo123!',
    user_metadata: {
      full_name: 'John Smith',
      business_name: 'Smith Marketing Agency',
      country: 'United States',
      plan: 'pro'
    }
  })

  // Create admin account
  const { data: adminData, error: adminError } = await insforge.auth.signUp({
    email: 'admin@clipgenius.ai',
    password: 'admin123!',
    user_metadata: {
      full_name: 'Admin User',
      role: 'admin'
    }
  })

  console.log('Accounts created successfully!')
  */
}

createDemoAccounts()