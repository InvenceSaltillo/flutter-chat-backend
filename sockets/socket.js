const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


// Mensajes de Sockets
io.on('connection', client => {

    // console.log(client);

    const [valido, uid] = comprobarJWT(client.handshake.query['x-token'] || client.handshake.headers['x-token']);
    console.log('Valido', valido, uid);

    // Verificar autenticacion
    if (!valido) return client.disconnect();

    // Cliente autenticado
    usuarioConectado(uid);

    // Ingresar al usuario a una sala especifica
    // Sala global
    client.join(uid);

    client.on('usuario-conectado', async(payload) => {

        console.log('Usuario conectado', payload);

        io.emit('usuario-conectado', payload);
    });

    // Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async(payload) => {

        console.log(payload);

        await grabarMensaje(payload);

        io.to(payload.para).emit('mensaje-personal', payload);
    });

    client.on('disconnect', () => {
        console.log('Cliente desconectado', uid);
        usuarioDesconectado(uid);

        io.emit('usuario-desconectado', uid);
    });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    // });


});