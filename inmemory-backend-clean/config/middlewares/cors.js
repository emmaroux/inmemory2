module.exports = {
  enabled: true,
  origin: ['http://localhost:3000'], // URL de votre front Next.js
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  keepHeaderOnError: true,
}; 