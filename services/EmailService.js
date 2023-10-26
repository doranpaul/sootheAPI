const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'appsoothe@gmail.com',
    pass: 'NoahJack11'
  }
});

function sendConfirmationEmail(email, token) {
  const link = `http://192.168.1.156:8080/confirm-email?token=${token}`;
  const mailOptions = {
    from: 'appsoothe@gmail.com',
    to: email,
    subject: 'Confirm Your Email',
    text: `Click on the following link to confirm your email: ${link}`,
    html: `<p>Click on the following link to confirm your email: <a href="${link}">${link}</a></p>`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = sendConfirmationEmail;

