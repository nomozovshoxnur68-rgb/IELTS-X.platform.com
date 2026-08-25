// Server-side admin owner configuration
// Keep this value on the server and enforce it in every admin API route.
module.exports = {
  ADMIN_OWNER_EMAIL: process.env.ADMIN_OWNER_EMAIL || 'nomozovshoxnur@gmail.com'
};
