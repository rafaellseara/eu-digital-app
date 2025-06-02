// api/middleware/checkAdmin.js
const admins = ['ricardo']; // Lista de usernames de admins

function checkAdminFlag(req, res, next) {
  const username = req.user?.username || req.body.username || req.query.username
  console.log('Verificando se o utilizador é admin:', username)
  req.user = { username, isAdmin: admins.includes(username) }
  next()
}

module.exports = checkAdminFlag;