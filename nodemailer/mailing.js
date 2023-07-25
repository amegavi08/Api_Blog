// Importing modules
const nodemailer = require("nodemailer");


// Function to send email to the User
module.exports.sendingMail = async({firstname,email,setToken}) =>{
console.log(email)
    try {
        var mailOptions = {
            from: process.env.email,
            to: `${email}`,
            subject: "Testing My Nodemailer",
            text: "Testing My Nodemailer",
            html: `Hello ${firstname}, click this link for verification:
            http://localhost:3005/user/verify-email/${setToken}`,
          };

          const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                  user: process.env.email,
                  pass: process.env.emailpassword,
                },
              });
            
        
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        
    

   //asign createTransport method in nodemailer to a variable
  //service: to determine which email platform to use
  //auth contains the senders email and password which are all saved in the .env
        

      //return the Transporter variable which has the sendMail method to send the mail
      //which is within the mailOptions

      return await transporter.sendMail(mailOptions) 
    } catch (error) {
      console.log(error)
    }

}