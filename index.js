const http = require('http')
const fs = require('fs')
const url = require('url')

const server = http
    .createServer((req, res) => {
        if(req.url === '/') {
            res.setHeader('Content-Type', 'text/html')
            fs.readFile('index.html', 'utf8', (err, data) => {
                res.end(data)
            })
        }

        //Crear una ruta que reciba el nombre y precio de un deporte, lo persista en un archivo JSON

        if(req.url.includes('/agregar')) {
            const { nombre, precio } = url.parse(req.url, true).query
            const deporte = {
                nombre,
                precio,
            }

            const data = JSON.parse(fs.readFileSync('deportes.json', 'utf8'))
            data.deportes.push(deporte)

            fs.writeFile('deportes.json', JSON.stringify(data), (err) => {
                if(err) return res.end('Error al momento de intentar el registro 😢')
                res.end('Registro con exito 😎'  )
            })
        }

        //Crear una ruta que al consultarse devuelva en formato JSON todos los deportes registrados

        if(req.url === '/deportes') {
            fs.readFile('deportes.json', 'utf8', (err, data) => {
                if(err) return res.end('Error al momento de buscar el listado de deportes 😢')
                res.end(data)
            })
        }

        //Crear una ruta que edite el precio de un deporte registrado utilizando los parámetros de la consulta y persista este cambio

        if(req.url.includes('/editar')) {
            const { nombre, precio } = url.parse(req.url, true).query
            const data = JSON.parse(fs.readFileSync('deportes.json', 'utf8'))

            nuevoDeporte = data.deportes.map((dep) => {
                if(dep.nombre === nombre) {
                    dep.precio = precio
                }
                return dep
            })

            const nuevoDato = {
                deportes: nuevoDeporte,
              }

            fs.writeFile('deportes.json', JSON.stringify(nuevoDato), (err) => {
                if(err) return res.end('Error al momento de querer editar 😢')
                res.end('editado con exito 😎')
            })
        }

        //Crear una ruta que elimine un deporte desde el cliente y persista este cambio

        if(req.url.includes('/eliminar')) {
            const { nombre } = url.parse(req.url, true).query
            const data = JSON.parse(fs.readFileSync('deportes.json', 'utf8'))
            if(!nombre) return res.end('El nombre no es válido 😢')

            nuevoDeporte = data.deportes.filter((dep) => dep.nombre !== nombre)

            const nuevoDato = {
                deportes: nuevoDeporte,
              }

            fs.writeFile('deportes.json', JSON.stringify(nuevoDato), (err) => {
                if(err) return res.end('Error ala intentar eliminar 😢')
                res.end(`El deporte ${nombre} fue eliminado con éxito 😎`)
            }) 


        }
    })
    server.listen(3000, () => {
        console.log('🚀🚀🚀')
    })