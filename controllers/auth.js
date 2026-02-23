require("dotenv").config();
const {
    User, sequelize
} = require('../db/models');
const { haspassword, createToken, comparepassword, makeid, reseetpassToken, verifyToken, verifyUserToken } = require('../utils/');
const
    {
        handleErrorResponse,
        handleTryCatchError,
        handleSuccessReponse,
        handleTransactionSuccess,
        handleSuccessForgetPassworsReponse,
        handleSuccessResetPassworsReponse,
        handleFailResponse,
        handleInvalidPasswordResponse,
        handleLoginErrorResponse,
        handleSuccessRecordNotFound,
    } = require("../utils/transactions-response");

// const { handleRegisteredMailer, handleMailerForgetPasswordReset } = require("../mailer/index")




exports.ForgetPassword = async (req, res) => {

    try {
        const { email } = req.body;
        User.findOne({ where: { email } }).then((response) => {
            if (response) {
                const token = reseetpassToken(response)
                const link = `${req.protocol}://${req.host}:${process.env.PORT}/reset-password/${token}`
                handleSuccessForgetPassworsReponse(response, res);
                handleMailerForgetPasswordReset(response.email, response.name, link)
            } else {
                handleSuccessRecordNotFound(response, res);
            }
        })
            .catch((response) => {

                handleErrorResponse(response, res);
            });
    }
    catch (error) {
        handleTryCatchError(error, res);
    }

}

exports.ResetPassword = async (req, res) => {

    try {
        const { password } = req.body;
        const { token } = req.params;
        const decode = verifyToken(token)
        const hash = haspassword(password);
        await User.update({ password: hash }, { where: { id: decode.userId } }).then((response) => {
            if (response) {
                handleSuccessResetPassworsReponse(response, res);
            } else {
                handleFailResponse(response, res);
            }
        }).catch((response) => {

            handleErrorResponse(response, res);
        });
    }
    catch (error) {
        handleTryCatchError(error, res);

    }

}

exports.ChangePassword = async (req, res) => {

    try {
        const { old_password, password } = req.body;
        const id = req.params.id;
        const hash = haspassword(password);
        const user = await User.findByPk(id);
        if (user && comparepassword(old_password, user.password)) {
            await User.update({ password: hash }, { where: { id } }).then((response) => {
                if (response) {

                    handleSuccessResetPassworsReponse(response, res);
                } else {
                    handleFailResponse(response, res);
                }
            }).catch((response) => {
                handleErrorResponse(response, res);
            });
        } else {
            handleInvalidPasswordResponse(user, res);
        }
    }
    catch (error) {
        handleTryCatchError(error, res);
    }

}



