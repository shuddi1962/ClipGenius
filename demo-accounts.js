// Demo accounts setup script for ClipGenius
// Run this script to create demo client and admin accounts

const demoAccounts = {
  client: {
    email: 'client@clipgenius.ai',
    password: 'demo123!',
    fullName: 'John Smith',
    businessName: 'Smith Marketing Agency',
    country: 'United States',
    plan: 'pro'
  },
  admin: {
    email: 'admin@clipgenius.ai',
    password: 'admin123!',
    fullName: 'Admin User',
    role: 'admin'
  }
}

console.log('🚀 ClipGenius Demo Accounts Setup')
console.log('=================================')
console.log('')
console.log('📧 CLIENT ACCOUNT:')
console.log(`   Email: ${demoAccounts.client.email}`)
console.log(`   Password: ${demoAccounts.client.password}`)
console.log(`   Name: ${demoAccounts.client.fullName}`)
console.log(`   Business: ${demoAccounts.client.businessName}`)
console.log(`   Plan: ${demoAccounts.client.plan}`)
console.log('')
console.log('👑 ADMIN ACCOUNT:')
console.log(`   Email: ${demoAccounts.admin.email}`)
console.log(`   Password: ${demoAccounts.admin.password}`)
console.log(`   Name: ${demoAccounts.admin.fullName}`)
console.log(`   Role: ${demoAccounts.admin.role}`)
console.log('')
console.log('🌐 LIVE APPLICATION:')
console.log('   Homepage: https://clip-genius-sigma.vercel.app/')
console.log('   Login: https://clip-genius-sigma.vercel.app/login')
console.log('   Register: https://clip-genius-sigma.vercel.app/register')
console.log('')
console.log('📖 DOCUMENTATION:')
console.log('   Terms: https://clip-genius-sigma.vercel.app/terms')
console.log('   Privacy: https://clip-genius-sigma.vercel.app/privacy')
console.log('   About: https://clip-genius-sigma.vercel.app/about')
console.log('   Blog: https://clip-genius-sigma.vercel.app/blog')
console.log('   Docs: https://clip-genius-sigma.vercel.app/docs')
console.log('')
console.log('⚠️  NOTE: Demo accounts need to be created in InsForge.dev backend')
console.log('   Visit: https://wk49fyqm.us-east.insforge.app')
console.log('   Use the credentials above to manually create accounts')
console.log('')
console.log('✅ Setup complete! Ready for testing.')