const knex = require('knex');

const router = require('express').Router();

// install knex and driver
// configure knex and get a connectoin to the db

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/rolex.db3'
  },
  useNullAsDefault: true,
  debug: true
}

const db = knex(knexConfig);



router.get('/', (req, res) => {
    db('roles')
    .then(roles => {
      res.status(200).json(roles)
    })
    .catch(error => {
      res.status(500).json(error)
    })
});

router.get('/:id', (req, res) => {
    db('roles').where({ id: req.params.id })
    .first()     //get roles back as 1 object, not a collection in an array
    .then(roles => {
      if (roles){
        res.status(200).json(roles)
      } else {
        res.status(404).json({ error: "ID not found." })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
});

router.post('/', (req, res) => {
   db('roles').insert(req.body, 'id')
   .then(ids => {
      res.status(201).json(ids)
   })
   .catch(error => {
     res.status(500).json(error)
   })
});

router.put('/:id', (req, res) => {
  const changes = req.body
   db('roles').where({ id: req.params.id })
   .update(changes)
   .then(count => {
     if (count > 0) {
       res.status(200).json({ message: `${count} records updated.` })
     } else {
       res.status(404).json({ error: "No records found." })
     }
   })
   .catch(error => {
     res.status(500).json(error)
   })
});

router.delete('/:id', (req, res) => {
  db('roles').where({ id: req.params.id })
  .delete()
  .then(count => {
    if (count > 0) {
      const unit = count > 1 ? 'records' : 'record' 
      res.status(200).json({ message: `${count} ${unit} deleted.` })
    } else {
      res.status(404).json({ error: "No records found." })
    }
  })
  .catch(error => {
    res.status(500).json(error)
  })
});

module.exports = router;
