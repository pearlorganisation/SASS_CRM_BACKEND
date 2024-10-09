import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PWD,
  },
});

// solo customer mail

export const sendMailToCustomer = async (userData, images) => {
  const body = JSON.parse(userData.body);
  const selectedPlan = JSON.parse(body.selectedPlan);

  let imgTableRows = "";
  images?.forEach((item, idx) => {
    imgTableRows += `<a href=${item.url}>Image ${idx + 1}</a><br>`;
  });

  let typeInfo = "";
  let customizeData;
  switch (body.generationType) {
    case "individual":
      typeInfo = `<tr>
                <td><strong>Headshot Type</strong></td>
                <td>${body.headshotType}</td>
            </tr>
                  `;
      break;
    case "customize":
      customizeData = JSON.parse(body.customizeData);

      typeInfo = `
            <tr>
                <td><strong>Custom Section</strong></td>
                <td>${customizeData.section}</td>
            </tr>
            <tr class="bd">
                <td><strong>Custom Sub-Section</strong></td>
                <td>${customizeData.subSection}</td>
            </tr>
    
                    `;
      break;
    case "prompt":
      typeInfo = `
            <tr>
                <td><strong>Prompt</strong></td>
                <td>${body.prompData}</td>
            </tr>`;
      break;
    case "individualDating":
      typeInfo = ` <tr>
                <td><strong>Headshot Type</strong></td>
                <td>${body.prompData}</td>
            </tr>
                    `;
      break;
    case "datingCustomize":
      customizeData = JSON.parse(body.customizeData);
      typeInfo = `<tr>
                <td><strong>Custom Section</strong></td>
                <td>${customizeData.section}</td>
            </tr>
            <tr class="bd">
                <td><strong>Custom Sub-Section</strong></td>
                <td>${customizeData.subSection}</td>
            </tr>
                      `;
      break;
    case "datingPrompt":
      typeInfo = `<tr>
                <td><strong>Headshot Type</strong></td>
                <td>${body.prompData}</td>
            </tr>
                    `;
      break;
  }

  const htmlContent = `
  
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">
    <title>Customer Receipt</title>
    <style>
        body {
            background-color: #000000;
            color: #ffffff;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: 'Oswald', sans-serif;
        }
        .imgB {
            border-radius: 12px;
        }
        .container {
            width: 650px;
            border: 5px solid #204CC6;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            background: linear-gradient(135deg, #000000, #000b3b);
            border-radius: 15px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            width: 150px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        td {
            padding: 10px;
            color: #ffffff;
        }
        .bd {
            border-bottom: 3px solid #ffffff;
        }
        .total {
            font-size: 24px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #00ADEF;
        }
        .fHeading {
            font-size: 18px;
            font-weight: bold;
        }
        a {
            color: #0000FF;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"></div>
        <table>
            <tr>
                <td><a href="https://headgen.ai"><img class="imgB" src="https://drive.google.com/thumbnail?id=1yKWwejv6nsy1uH5-KiXK3y3qsPhvKsoe&sz=s200" alt="HeadGen.ai"/></a></td>
                    <div class="title">CUSTOMER RECEIPT</div>
                    <span>Your Headshot generation has been confirmed</span>
                </td>
            </tr>
            <tr>
                <td style="width: 50%;"><strong>E-Mail</strong></td>
                <td style="width: 50%;">${body.email}</td>
            </tr>
            <tr>
                <td><strong>Gender</strong></td>
                <td>${body.gender}</td>
            </tr>
            ${typeInfo}
           <tr>
              <td><strong>Pack name</strong></td>
              <td>${selectedPlan.packName}</td>
          </tr>
            <tr>
                <td><strong>Original Price</strong></td>
                <td>${selectedPlan.originalPrice}</td>
            </tr>
            <tr>
                <td><strong>Final Price</strong></td>
                <td>${selectedPlan.price}</td>
            </tr>
            <tr class="bd">
                <td><strong>Images</strong></td>
                <td>
                    ${imgTableRows}
                </td>
            </tr>
            <tr class="total">
                <td><strong>Total</strong></td>
                <td>${selectedPlan.price}</td>
            </tr>
        </table>
        <div class="footer">
            <span class="fHeading">AI HEADSHOT GENERATOR</span><br>
            <br>
            <a href="mailto:support@headgen.ai">Playcloud Technologies Limited support@headgen.ai | +91 9820442749</a> 
        </div>
    </div>
</body>
</html>

  `;
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.MAIL_ID, // sender address
    to: body.email, // list of receivers
    subject: "Order confirmed - Headgen AI", // Subject line
    html: htmlContent, // html body
  });

  // send mail to seller

  await transporter.sendMail({
    from: process.env.MAIL_ID, // sender address
    to: process.env.SELLER_MAIL, // list of receivers
    subject: `Order by ${body.email}`, // Subject line
    html: htmlContent, // html body
  });
};

// teams customer mail
export const sendMailToTeamsCustomer = async (userData) => {
  const data = JSON.parse(userData.body);

  let customerData = {
    teamName: data?.companyName,
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    phone: data?.whatsappNumber,
    role: data?.Role.value,
    teamCount: data?.users,
    totalPrice: Number(data?.price) * Number(data?.users),
    price: Number(data?.price),
    website: data?.website || "",
  };

  const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">
    <title>Customer Receipt</title>
    <style>
        body {
            background-color: #000000;
            color: #ffffff;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: 'Oswald', sans-serif;
        }
        .imgB {
            border-radius: 12px;
        }
        .container {
            width: 650px;
            border: 5px solid #204CC6;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            background: linear-gradient(135deg, #000000, #000b3b);
            border-radius: 15px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            width: 150px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        td {
            padding: 10px;
            color: #ffffff;
        }
        .bd {
            border-bottom: 3px solid #ffffff;
        }
        .total {
            font-size: 24px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #00ADEF;
        }
        .fHeading {
            font-size: 18px;
            font-weight: bold;
        }
        a {
            color: #0000FF;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"></div>
        <table>
            <tr>
                <td><a href="https://headgen.ai"><img class="imgB" src="https://drive.google.com/thumbnail?id=1yKWwejv6nsy1uH5-KiXK3y3qsPhvKsoe&sz=s200" alt="HeadGen.ai"/></a></td>
                    <div class="title">CUSTOMER RECEIPT</div>
                    <span>Your Headshot Request has been confirmed, we will contact you soon.</span>
                    <span>Or contact us at support@headgen.ai | +91 9820442749</span>
                </td>
            </tr>
            <tr>
                <td style="width: 50%;"><strong>E-Mail</strong></td>
                <td style="width: 50%;">${customerData.email} </td>
            </tr>
            <tr>
                <td><strong>Company/Team Name</strong></td>
                <td>${customerData.teamName}</td>
            </tr>
             ${
               customerData?.website?.length > 0 ?
               `
              <tr>
                <td><strong>Website</strong></td>
                <td>${customerData.website}</td>
              </tr>              
              ` : ``
             }

            <tr>
                <td><strong>First Name</strong></td>
                <td>${customerData.firstName}</td>
            </tr>
      
            <tr>
                <td><strong>Last Name</strong></td>
                <td>${customerData.lastName}</td>
            </tr>
        
           <tr>
              <td><strong>Team Count</strong></td>
              <td>${Number(customerData.teamCount).toLocaleString()}</td>
          </tr>
            <tr>
                <td><strong>Price</strong></td>
                <td>${Number(customerData.price).toLocaleString()}</td>
            </tr>
            
            <tr class="total">
                <td><strong>Total</strong></td>
                <td>${Number(customerData.totalPrice).toLocaleString()}</td>
            </tr>
        </table>
        <div class="footer">
            <span class="fHeading">AI HEADSHOT GENERATOR</span><br>
            <br>
            <a href="mailto:support@headgen.ai">Playcloud Technologies Limited support@headgen.ai | +91 9820442749</a> 
        </div>
    </div>
</body>
</html>
`;


  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: process.env.MAIL_ID, // sender address
    to: customerData.email, // list of receivers
    subject: "Order confirmed - Headgen AI", // Subject line
    html: htmlContent, // html body
  });
  // console.log(info)

  // send mail to seller

  await transporter.sendMail({
    from: process.env.MAIL_ID, // sender address
    to: process.env.SELLER_MAIL, // list of receivers
    subject: `Teams Order by ${customerData.email}`, // Subject line
    html: htmlContent, // html body
  });
};



// Free headshot 

export const sendMailToFreeCustomer = async (userData, images) => {
    const body = JSON.parse(userData.body);
  
    let imgTableRows = "";
    images?.forEach((item, idx) => {
      imgTableRows += `<a href=${item.url}>Image ${idx + 1}</a><br>`;
    });
  
     
    const htmlContent = `
    
    <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">
      <title>Customer Receipt</title>
      <style>
          body {
              background-color: #000000;
              color: #ffffff;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-family: 'Oswald', sans-serif;
          }
          .imgB {
              border-radius: 12px;
          }
          .container {
              width: 650px;
              border: 5px solid #204CC6;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
              background: linear-gradient(135deg, #000000, #000b3b);
              border-radius: 15px;
          }
          .header {
              text-align: center;
              margin-bottom: 20px;
          }
          .header img {
              width: 150px;
          }
          .title {
              font-size: 24px;
              font-weight: bold;
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          td {
              padding: 10px;
              color: #ffffff;
          }
          .bd {
              border-bottom: 3px solid #ffffff;
          }
          .total {
              font-size: 24px;
              font-weight: bold;
          }
          .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #00ADEF;
          }
          .fHeading {
              font-size: 18px;
              font-weight: bold;
          }
          a {
              color: #0000FF;
              text-decoration: none;
              font-weight: bold;
          }
      </style>
    </head>
  <body>
      <div class="container">
          <div class="header"></div>
          <table>
              <tr>
                  <td><a href="https://headgen.ai"><img class="imgB" src="https://drive.google.com/thumbnail?id=1yKWwejv6nsy1uH5-KiXK3y3qsPhvKsoe&sz=s200" alt="HeadGen.ai"/></a></td>
                  <td>
                      <div class="title">CUSTOMER RECEIPT</div>
                      <span>Your Free Headshot generation has been confirmed</span>
                  </td>
              </tr>
              <tr>
                  <td style="width: 50%;"><strong>E-Mail</strong></td>
                  <td style="width: 50%;">${body.email}</td>
              </tr>
              <tr>
                  <td><strong>Gender</strong></td>
                  <td>${body.gender}</td>
              </tr>
             <tr>
                  <td><strong>Pack Type</strong></td>
                  <td>Free Headshot</td>
              </tr>
        
              <tr>
                  <td><strong>Final Price</strong></td>
                  <td>0</td>
              </tr>
              <tr class="bd">
                  <td><strong>Images</strong></td>
                  <td>
                      ${imgTableRows}
                  </td>
              </tr>
              <tr class="total">
                  <td><strong>Total</strong></td>
                  <td>0</td>
              </tr>
          </table>
          <div class="footer">
              <span class="fHeading">AI HEADSHOT GENERATOR</span><br>
              <br>
              <a href="mailto:support@headgen.ai">Playcloud Technologies Limited support@headgen.ai | +91 9820442749</a> 
          </div>
      </div>
  </body>
  </html>
  
    `;
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.MAIL_ID, // sender address
      to: body.email, // list of receivers
      subject: "Order confirmed - Headgen AI", // Subject line
      html: htmlContent, // html body
    });
  
    // send mail to seller
  
    await transporter.sendMail({
      from: process.env.MAIL_ID, // sender address
      to: process.env.SELLER_MAIL, // list of receivers
      subject: `Free Order by ${body.email}`, // Subject line
      html: htmlContent, // html body
    });
  };