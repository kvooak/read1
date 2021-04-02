const nodemailer = require('nodemailer');
const print = require('../../_utils/print');

const sendVerificationCodeViaEmail = async (code, email) => {
  const transporter = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // port: 465,
    // secure: true,
    // auth: {
    //   type: 'OAuth2',
    //   user: '',
    //   pass: '',
    // }

    service: 'gmail',
    auth: {
      user: 'hoangducquang1993@gmail.com',
      pass: 'thismakesnosense@1'
    }
  });

  const mailOptions = {
    from: 'hoangducquang1993@gmail.com',
    to: email,
    subject: 'Your verification code',
    text: code,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      print.log(error);
    } else {
      print.log('Verification email sent: ' + info.response);
    }
  });
};

module.exports = sendVerificationCodeViaEmail;
