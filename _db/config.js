const pgp = require('pg-promise')();

const db = pgp(process.env.DATABASE_URL);
db.connect({ direct: true })
  .then(sco => {
    sco.client.on('notification', data => {
      console.log(data);
    });
    return sco.none('LISTEN $1~', 'users'), sco.none('LISTEN $1~', 'projects');
  })
  .catch(error => {
    console.error('Error:', error);
  });

module.exports = db;
