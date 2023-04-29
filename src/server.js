const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const { createServer } = require('http');
const { dbConnection } = require('./database/config');

const { socketController } = require('./sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server)

        this.paths = {
            auth: '/api/auth',
            event: '/api/events',
            category: '/api/categories',
            user: '/api/users',
            typeUser: '/api/typeusers',
            permision: '/api/permisions',
            rol: '/api/roles',
            student: '/api/students',
            guests: '/api/guests',
            careers: '/api/careers',
            dashboard: '/api/dashboard',
            reports: '/api/reports'
        }


        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Headers', 'x-token');
            next();
        });
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        const publicPath = path.resolve(__dirname, './../public');
        this.app.use(express.static(publicPath));
        // this.app.use(express.static('./../public'));
        // this.app.use('/image', express.static(__dirname + './../assets'));
        // Fileupload - Carga de archivos
        // this.app.use(fileUpload({
        //     useTempFiles: true,
        //     tempFileDir: '/tmp/',
        //     createParentPath: true
        // }));

    }

    routes() {

        this.app.use(this.paths.auth, require('./routes/auth'));
        this.app.use(this.paths.event, require('./routes/events'));
        this.app.use(this.paths.category, require('./routes/categories'));
        this.app.use(this.paths.user, require('./routes/users'));
        this.app.use(this.paths.typeUser, require('./routes/type_users'));
        this.app.use(this.paths.permision, require('./routes/permisions'));
        this.app.use(this.paths.rol, require('./routes/roles'));
        this.app.use(this.paths.student, require('./routes/students'));
        this.app.use(this.paths.guests, require('./routes/guests'));
        this.app.use(this.paths.careers, require('./routes/careers'));
        this.app.use(this.paths.dashboard, require('./routes/dashboard'));
        this.app.use(this.paths.reports, require('./routes/reports'))

    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io))
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
    // listen() {
    //     this.app.listen(this.port, () => {
    //         console.log('Servidor corriendo en puerto', this.port);
    //     });
    // }

}




module.exports = Server;
