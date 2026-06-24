const otpTemplate = (title, description, otp) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; overflow:hidden;">
        
        <div style="background:teal; color:#fff; padding:20px; text-align:center;">
            <h1>sMv|Blog</h1>
        </div>

        <div style="padding:30px;">
            <h2>${title}</h2>

            <p>${description}</p>

            <div style="
                margin:30px 0;
                text-align:center;
                font-size:32px;
                font-weight:bold;
                letter-spacing:8px;
                color:#2563eb;
                background:#f8fafc;
                padding:15px;
                border-radius:8px;
            ">
                ${otp}
            </div>

            <p>This OTP is valid for <strong>5 minutes</strong>.</p>

            <p>
                If you did not request this action, you can safely ignore this email.
            </p>

            <br>

            <p>
                Regards,<br>
                <strong>sMv|Blog Team</strong>
            </p>
        </div>
    </div>
</body>
</html>
`;

export default otpTemplate;