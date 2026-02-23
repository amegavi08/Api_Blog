// const { model_aliases } = require("./models");
const {User,Category} = require('../db/models')
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const res_status = {
  ERROR: "error",
  SUCCESS: "success",
  FAILED: "fail",
};

const sys_msgs = {
  error: "There was an error processing the request",
  success: "Request processed successfully",
  failed: "There was a system failure",
};

const userCreationFields = [
  "id"
];

const REC_POLY_TYPES = {
  User: "User",
  Admin: "Admin",
  Supervisor: 'Supervisor'
};

const ROLES = {
  User: "User",
  Admin: "Admin",
  Supervisor: 'Supervisor'
};

const seqFnMdl = {
  FINDONE: "findOne",
  FINDANDCOUNT: "findAndCountAll"
}

const project_statuses = {
  INITIATED: "INITIATED",
  ON_GOING: "ON_GOING",
  PAUSED: "PAUSED",
  COMPLETED: "COMPLETED",
  OVERDUE: "OVERDUE",
  CANCELLED: "CANCELLED"
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const generic_sys_err = "There was an error with the transaction (CODE: 9)";

exports.userCreationFields = userCreationFields;
exports.generic_sys_err = generic_sys_err;
exports.sys_msgs = sys_msgs;
exports.res_status = res_status;
exports.REC_POLY_TYPES = REC_POLY_TYPES;
exports.paginateLimit = 10;
exports.seqFnMdl = seqFnMdl;
exports.months = months;
exports.project_statuses = project_statuses;

const seqErrParser = (errobjArr) => {
  let errorBag = [],
    field = null;

  if (errobjArr) {
    if (errobjArr.length) {
      errorBag = errobjArr
        .filter(function (errobj) {
          if (errobj.path === field) {
            return false;
          }
          field = errobj.path;
          return true;
        })
        .map(function (errobj) {
          return {
            message: errobj.message,
            field: errobj.path,
            type: errobj.type,
          };
        });
    }
  }
  let errorBagFilted = errorBag.filter((eb) => eb.type == "unique violation");
  if (errorBagFilted.length == errorBag.length && errorBag.length > 0) {
    let errBagFields = errorBag.map((ebg) => ebg.field);
    return {
      ...errorBag[0],
      message: `${errBagFields.join(" & ")} must be unique`,
    };
  }
  return errorBag[0];
};

exports.seqErrParser = seqErrParser;

exports.buildUpdateModel = (oldModel, newData, model) => {
  if (!oldModel) {
    throw new Error(`${model.name} record not found`);
  }
  let modelObject = oldModel;
  for (const key in newData) {
    if (newData.hasOwnProperty(key)) {
      modelObject[key] = newData[key];
    }
  }
  return modelObject;
};

exports.handleTryCatchError = (error, res) => {
  error = error?.errors ? error.errors : error;
  let msg = parseSqlMsg(
    seqErrParser(error) ? seqErrParser(error).message : error?.message
  );
  return res.status(400).json({
    status_code: 400,
    status_messsage: res_status.ERROR,
    message: msg,
  });
};

exports.handleSuccessReponse = (response, res) => {
  return res.status(200).json({
    status_code: 200,
    status_messsage: res_status.SUCCESS,
    message: "Request processed succesfully",
  });
};

exports.handleSuccessForgetPassworsReponse = (response, res) => {
  return res.status(200).json({
    status_code: 200,
    status_messsage: res_status.SUCCESS,
    message: "We have e-mailed your password reset link!",
  });
};

exports.handleSuccessResetPassworsReponse = (response, res) => {
  return res.status(200).json({
    status_code: 200,
    status_messsage: res_status.SUCCESS,
    message: "Your password has been changed successfully.",
  });
};


exports.handleNoTokenResponse = (response, res, msg = "Access denied. No token provided!") => {
  return res.status(400).json({
    status_code: 400,
    status_messsage: res_status.ERROR,
    message: msg,
  });
};


exports.handleInvalidTokenResponse = (response, res, msg = "Invalid Token") => {
  return res.status(400).json({
    status_code: 400,
    status_messsage: res_status.ERROR,
    message: msg,
  });
};


exports.handleExpiredTokenResponse = (response, res, msg = "Token Expired. Try again later") => {
  return res.status(400).json({
    status_code: 400,
    status_messsage: res_status.ERROR,
    message: msg,
  });
};




// exports.handleFailResponse = (response, res, msg = "Something went wrong!") => {
//   return res.status(400).json({
//     status_code: 400,
//     status_messsage: res_status.ERROR,
//     message: msg,
//   });
// };


exports.handleInvalidPasswordResponse = (response, res, msg = "Invalid user password!") => {
  return res.status(400).json({
    status_code: 400,
    status_messsage: res_status.ERROR,
    message: msg,
  });
};


exports.handleLoginErrorResponse = (response, res, msg = "Invalid user credentials!") => {
  return res.status(400).json({
    status_code: 400,
    status_messsage: res_status.ERROR,
    message: msg,
  });
};




exports.handleSuccessRecordNotFound = (response, res, msg = "Record not found") => {
  return res.status(400).json({
    status_code: 400,
    status_messsage: res_status.ERROR,
    message: msg,
  });
};

exports.handleErrorResponse = (response, res) => {
  return res.status(400).json({
    status_code: 400,
    status_messsage: res_status.ERROR,
    message: "There was an error processing the request",
  });
};

exports.hasAnyErrorBag = (errorBag) => {
  let hasErr = false;
  errorBag.forEach((bag) => {
    if (bag.length > 0) {
      hasErr = true;
    }
  });
  return hasErr;
};

exports.removeId = (obj) => {
  if (typeof yourVariable === "object" && yourVariable !== null) {
    throw new Error("Object expected in removeId");
  }
  let { id, ...y } = obj;
  return y;
};

exports.uppercaseFirst = (str) => {
  str = str.toLowerCase();
  return `${str[0].toUpperCase()}${str.substr(1)}`;
};

exports.reduceErrorBag = (arr) => {
  if (!Array.isArray(arr)) throw new Error("Array required for reduceErrorBag");
  return arr.filter((ar) => ar.length > 0);
};

exports.extractDocsFromParams = (params, requiredDocTypes, model) => {
  let reqDocuments = [];
  requiredDocTypes
    .filter((doc) => (doc.model = model))
    .forEach((reqDoc) => {
      let newDoc = {};
      reqDoc.fields.forEach((fld) => {
        if (fld.field_name in params) {
          newDoc[fld.column] = params[fld.field_name];
          newDoc["type"] = reqDoc.name;
        }
      });
      if (Object.keys(newDoc).length > 0) reqDocuments.push(newDoc);
    });
  return reqDocuments;
};


exports.findOrAbort = async (fields) => {
  let modelsInstances = {};

  if (fields.length) {
    for (let index = 0; index < fields.length; index++) {
      const fild = fields[index];

      if (Object.keys(objectHasEmptyFields(fild)).length > 0) {
        throw new Error(objectHasEmptyFields(fild));
      }
      const record = await fild.model.findOne({
        where: {
          ...fild.queryFields,
        },
      });
      if (record === null && !fild.notRequired) {
        throw new Error(`${fild.alias || fild.model.name} not found`);
      }
      modelsInstances[fild.model.name] = record;
    }
  }

  return modelsInstances;
};

exports.structureQuery = async (params, Sequelize) => {
  let black_list = ["page", "size"];
  let queryArr = [];
  for (const key in params) {
    if (!black_list.includes(key)) {
      if (params.hasOwnProperty(key)) {
        if (isNaN(params[key])) {
          queryArr[key] = {
            [Sequelize.Op.iLike]: `%${params[key]}%`,
          };
        } else {
          queryArr[key] = {
            [Sequelize.Op.eq]: params[key],
          };
        }
      }
    }
  }
  return queryArr;
};

const objectHasEmptyFields = (obj) => {
  let errorBag = [];
  if (Object.keys(obj.queryFields).length) {
    for (const key in obj.queryFields) {
      if (obj.queryFields.hasOwnProperty(key)) {
        if (!obj.notRequired) {
          if (!obj.queryFields[key]) {
            let fld_nme = obj.alias || obj.model.name;
            errorBag.push(`${fld_nme} ${key} is required`);
          }
        }
      }
    }
  }
  if (errorBag.length) {
    return errorBag[0];
  }
  return {};
};

exports.userCreation = function (req) {
  if (req.params.id) {
    return {
      user_updated_id: 1,
      branch_id: 1,
    };
  } else {
    return {
      user_created_id: 1,
      user_updated_id: 1,
      branch_id: 1,
    };
  }
};

exports.userUpdating = function (req) {
  return {
    user_updated_id: req.profile.id,
    branch_id: 1,
  };
};

exports.userCreationNoRq = function (req, data) {
  if (data.id) {
    return {
      user_updated_id: req.profile.id,
      branch_id: req.profile.branch_id,
    };
  } else {
    return {
      user_created_id: req.profile.id,
      user_updated_id: req.profile.id,
      branch_id: req.profile.branch_id,
    };
  }
};

exports.handleTransactionSuccess = (
  modelInstance = null,
  res,
  data = null,
  action = null,
  msg = sys_msgs[res_status.SUCCESS]
) => {
  if (modelInstance) {
    let msgAction = modelInstance._options.isNewRecord ? "created" : "updated";
    msgAction = action || msgAction;
    let model =
      model_aliases[modelInstance.constructor.name] ||
      modelInstance.constructor.name;
    msg = `${model} was ${msgAction} successfully`;
  }
  if (data === null) {
    return res.status(200).json({
      status_code: 200,
      status_message: res_status.SUCCESS,
      message: msg,
    });
  } else {
    if (!data.hasOwnProperty("items")) {
      data = {
        items: data,
      };
    }
    return res.status(200).json({
      status_code: 200,
      status_message: res_status.SUCCESS,
      message: msg,
      data: data,
    });
  }
};


exports.mapPrmsToQuery = (query, where = true) => {
  let _cnt = 0;
  let _qCntrct = "";
  if (Object.keys(query).length) _qCntrct = where ? `WHERE ` : '';
  for (const param in query) {
    _cnt++;
    if (Object.hasOwnProperty.call(query, param)) {
      const _parm = query[param];
      if (Object.keys(query).length == _cnt) {
        _qCntrct += `${param} = '${_parm}'`;
      } else {
        _qCntrct += `${param} = '${_parm}' AND `;
      }
    }
  }
  return _qCntrct;
};

exports.mapPrmsToPagination = (query) => {
  let _cnt = 0;
  let _qCntrct = "";
  if (Object.keys(query).length) _qCntrct = ``;
  for (const param in query) {
    _cnt++;
    if (Object.hasOwnProperty.call(query, param)) {
      const _parm = query[param];
      _qCntrct += `${param}  ${_parm} `;
    }
  }
  return _qCntrct;
};


exports.handleTransactionError = (response, res) => {
  console.log(response);
  let msg = parseSqlMsg(
    seqErrParser(response.errors)
      ? seqErrParser(response.errors).message
      : response.message
  );
  return res.status(400).json({
    status_code: 400,
    status_message: res_status.ERROR,
    message: msg,
  });
};

exports.appendCreator = async (data) => {
  const isFindOne = !data?.length;
  if (isFindOne) {
    data = [data];
  }

  let vlntion = isFindOne ? [data] : data;
  if (vlntion?.length) {
    for (let index = 0; index < data.length; index++) {
      const dta = data[index];
      dta.created_by = await dta.getCreatedBy({
        attributes: userCreationFields,
      });
      dta.updated_by = await dta.getUpdatedBy({
        attributes: userCreationFields,
      });
    }
  }
  return isFindOne ? data[0] : data;
};

let parseSqlMsg = (msg) => {
  let nMsg = msg;
  if (msg) {
    let part1 = msg.split("lower(");
    if (part1[1]) {
      let txtNew = part1[1].split("text)");
      let unquTxt = txtNew[1];
      let fieldName = txtNew[0].split("::")[0];
      if (fieldName) {
        nMsg = `${fieldName}${unquTxt}`;
      }
    }
  }
  nMsg = nMsg ? nMsg.split("_").join(" ") : nMsg;
  nMsg = nMsg
    ? nMsg.replace("must be unique", "already exists")
    : "Sorry, something went wrong";
  nMsg = nMsg.replace("cannot be null", "is required");
  nMsg = nMsg.replace(".", " ");
  return nMsg;
};


exports.searchObject = (reqDocoument, value) => {
  return reqDocoument.filter((field) => field.name == value)[0];
};

exports.extractParams = async (body, requiredParams) => {
  const params = requiredParams.reduce(
    (result, key) => ({
      ...result,
      [key]: body[key],
    }),
    {}
  );

  return params;
};

exports.padNumber = function (num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
};

exports.toSnakeCase = function (str) {
  let snake_case = "_";
  if (str) {
    snake_case = str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.toLowerCase())
      .join("_");
  }
  return snake_case;
};

exports.camelize = function (str) {
  if (str) {
    str = str.toLowerCase();
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

exports.getPagingData = (data, page, limit) => {
  let { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  items = items || [];
  return { totalItems, items, totalPages, currentPage };
};

exports.Checknegative = (number) => {
  return !Object.is(Math.abs(number), + number)
}

exports.searchUsers = async (username) => {
  
  return await User.findOne({
    attributes: {exclude:['createdAt','updatedAt']},
    where: { username },
  });
} 

exports.searchStatus = async (status) => {
  
  return await Category.findOne({
    attributes: {exclude:['user_Id','status','createdAt','updatedAt']},
    where: { status },
  });
} 


exports.rmSubFrmUrl = (fullUrl = "") => {
  const regex = {
    protocol: new RegExp(/http(s)*:\/\//),
    subdomain: new RegExp(/^[^.]*\.(?=\w+\.\w+$)/),
  };
  let newUrl = fullUrl;
  let protocol = regex.protocol.exec(fullUrl);
  if (protocol && protocol.length) {
    newUrl = fullUrl.replace(regex.subdomain, protocol[0]);
  }
  return newUrl;
};
