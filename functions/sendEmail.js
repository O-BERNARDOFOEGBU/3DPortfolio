// functions/sendEmail.js
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const data = JSON.parse(event.body);

  // Replace these values with your actual email and credentials
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: import.meta.env.VITE_APP_EMAIL_ADDRESS,
      pass: import.meta.env.VITE_APP_EMAIL_PASS_KEY,
    },
  });

  const mailOptions = {
    from: form.email,
    to: "bernardofoegbu71@gmail.com", // Replace with your own email
    subject: "New Contact Form Submission",
    text: `
      Name: ${data.name}
      Email: ${data.email}
      Message: ${data.message}
    `,
  };
  console.log("Data:", data);
  console.log("Mail Options:", mailOptions);

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send email" }),
    };
  }
};
