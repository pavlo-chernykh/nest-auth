const mailConfirmTemplate = (url: string): string => {
  return `
    <html>
      <head>
        <style>
          p {
            font-size: 24px;
          }
          button {
            background-color: #4CAF50;
            border: 1x solid black;
            color: white;
            padding: 15px 32px;
            text-align: center;
            margin-bottom: 10px;
          }
          button>a {
            text-decoration: none;
            color: #fff;
            font-size: 14px;
          }
          button>a>font {
            color: #fff;
          }
        </style>
      </head>
      <body>
        <p>Please click below to confirm your email</p>
        <button><a href="${url}" target="_blank"><font>Continue</font></a></button>
        <p>If you did not request this email you can safely ignore it.</p>
      </body>
    </html>
  `;
};

export default mailConfirmTemplate;
