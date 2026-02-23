
async function updateOrCreate (model, where, newItem) {
    // First try to find the record
   const foundItem = await model.findOne({where});
   if (!foundItem) {
        // Item not found, create a new one
        const item = await model.create(newItem)
        return  {item, created: true};
    }
    // Found an item, update it
    const item = await model.update(newItem, {where});
    return {item, created: false};
}



// DELETE: Deleting multiple records


app.delete('/owners/bulk', (req, res) => {
    const ids = req.body.ids;
    db.owners.findAll({
      where: { id: { $in: ids } }
    })
      .then(owners => {
        const deletePromises = owners.map(owner => {
          return owner.destroy();
        });
        return db.Sequelize.Promise.all(deletePromises)
      })
      .then(deletedOwners => {
        res.json(deletedOwners);
      });
  });



  // UPDATE: Updating multiple records

  app.patch('/owners/bulk', (req, res) => {
    const ids = req.body.ids;
    const updates = req.body.updates;
  
    db.owners.findAll({
      where: { id: { $in: ids } }
    })
    .then(owners => {
      const updatePromises = owners.map(owner => {
        // the line below creates a new item/promise for
        // the updatePromises array
        return owner.updateAttributes(updates);
      });
      return db.Sequelize.Promise.all(updatePromises)
    })
    .then(updatedOwners => {
      res.json(updatedOwners);
    });
  })

  // CREATE: Create multiple records

  app.post('/owners/bulk', (req, res) => {
    const ownerList = req.body.owners;
    db.owners.bulkCreate(ownerList)
      .then(newOwners => {
        res.json(newOwners);
      })
  });





  const Tokens = db.define('tokens', {
    token: {
        type: sequelize.STRING
    }
});
// Update tokens table where id
Tokens.update(
          { token: 'new token' },
          { where: {id: idVar} }
     ).then(tokens => {
          console.log(tokens);
     }).catch(err => console.log('error: ' + err));

  




     // update column with find sequelize

     Project.find({ where: { title: 'aProject' } });
 
    // Check if record exists in db
    if (project) {
        Project.update(
            { title: 'a very different title now' },
            { where: { _id: 1 } }
          )
            .success(result =>
              handleResult(result)
            )
            .error(err =>
                handleError(err)
                )
    
  }



  try {
    const result = await Project.update(
      { title: 'a very different title now' },
      { where: { _id: 1 } }
    )
    handleResult(result)
  } catch (err) {
    handleError(err)
  }