//1. Usar el paquete nodemailer para el envío de correos electrónicos.

//2. Crear una función que reciba la lista de correos, asunto y contenido a enviar.Esta
//función debe retornar una promesa.


//3. Realizar una petición a la api de mindicador.cl y preparar un template que incluya los
//valores del dólar, euro, uf y utm.Este template debe ser concatenado al contenido
//descrito por el usuario en el formulario HTML.

//4. Enviar un contenido de éxito o error por cada intento de envío de correos electrónicos.



//5. Cada correo debe ser almacenado como un archivo con un nombre identificador
//único en una carpeta “correos”. Usar el paquete UUID para esto.

const enviar = require('./mailer')
const url = require('url')
const http = require('http')
const fs = require('fs')
const getData = require('./getData')
const { v4: uuidv4 } = require('uuid')

const datosMail = (req) => {
    const { correos, asunto, contenido } = url.parse(req.url, true).query
    return { correos, asunto, contenido }
}

http
    .createServer(async function (req, res) {
        // let { correos, asunto, contenido } = url.parse(req.url, true).query
        if (req.url == '/') {
            res.setHeader('content-type', 'text/html')
            fs.readFile('index.html', 'utf8', (err, data) => {
                res.end(data)
            })
        }
        if (req.url.startsWith('/mailing')) {
            const data = await getData()
            const { correos, asunto, contenido } = await datosMail(req)
            const dolar = data.dolar.valor
            const euro = data.euro.valor
            const uf = data.uf.valor
            const utm = data.utm.valor
            const mensaje = `El valor del dolar el día de hoy es: ${dolar} <br> El valor del euro el día de hoy es: ${euro} <br> El valor del uf el día de hoy es: ${uf} <br> El valor del utm el día de hoy es: ${utm}`
            if (correos !== '' && asunto !== '' && contenido !== '') {
                enviar(correos.split(','), asunto, contenido + mensaje)
                fs.writeFile(`./correos/${uuidv4()}.txt`, `${contenido + mensaje}`, (err) => { //./correos/ sirve para guardar los archivos creados en carpeta correos
                    if (err) console.log(err)
                    else console.log('Archivo creado')
                })
                res.end('E-mails enviados')
            } else {
                res.end('Faltan campos por llenar')
            }

        }
    })
    .listen(3000)
