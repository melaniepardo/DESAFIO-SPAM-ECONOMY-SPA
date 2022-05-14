const nodemailer = require('nodemailer')
// Paso 1
function enviar(to, subject, html) {
    let transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
            user: 'palomaconbotas@yahoo.com',
            pass: 'kddpoixqhfdwfoqj',
        },
    })
    let mailOptions = {
        from: 'palomaconbotas@yahoo.com',
        to,
        subject,
        html,
    }
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) console.log(err)
        if (data) console.log(data)
    })
}
// Paso 2
module.exports = enviar
