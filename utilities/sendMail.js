const nodemailer = require('nodemailer');

module.exports.mailHandler = async (options) => {
  /** Creating the nodemailer transport configuration */
  const transpoter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const message = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    message: options.message,
    url: options.url,
    attachment: options.attachment,
  };

  await transpoter.sendMail(message);
};
