
exports.createData = (model, newItem) => {
  const item = model.create(newItem);
  if (item) {
    return item;

  } else {
    return {};
  }

}

exports.getByPk = (req, model) => {
  let get_id = model.findByPk(req);
  if (get_id == null) {
    return {};
  } else {
    return get_id;
  }

}

exports.getAll = (model, attributes) => {
  let get_id = model.findAll(attributes);
  if (get_id == null) {
    return {};
  } else {
    return get_id;
  }
}

exports.updateData = (req, model, oldItem, where, t) => {
  if (req.params.id) {
    const item = model.update(oldItem, where, t);
    return item;
  } else {
    return {};
  }
}

exports.deleteData = (model, where) => {
  let get_id = model.destroy(where);
  if (get_id == null) {
    return {};
  } else {
    return get_id;
  }

}

exports.excludeUsersData = function () {
  return [
    "createdAt",
    "updatedAt",
    "password",
  ];
};


exports.excludeData = function () {
  return [
    "createdAt",
    "updatedAt"
  ];
};

