const { io } = require('../server');
const { Usuarios } = require('../classes/usuario');
const {crearMensaje } = require('../utils/utils');


const usuario = new Usuarios();


io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        //console.log(data);
        if(!data.nombre || !data.sala){
            return callback({
                error: true,
                mensaje: 'El nombre/sala es obligatorio'
            })
        }

        client.join(data.sala);

        usuario.agregarPersona(client.id, data.nombre, data.sala);
        
        client.broadcast.to(data.sala).emit('crear-mensaje', crearMensaje('Administrador', `${data.nombre} entró el chat`));

        client.broadcast.to(data.sala).emit('lista-personas', usuario.getPersonasPorSala(data.sala));

        callback(usuario.getPersonasPorSala(data.sala));

        // console.log(usuario);
    });
    
    client.on('disconnect', () => {
    
        // console.log(client);
        let personaBorrada = usuario.borrarPersona(client.id);
    
        client.broadcast.to(personaBorrada.sala).emit('crear-mensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`));
        client.broadcast.to(personaBorrada.sala).emit('lista-personas', usuario.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('crear-mensaje', (data, callback)=>{
        
        let persona = usuario.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje );
        client.broadcast.to(persona.sala).emit('crear-mensaje', mensaje);
        callback(mensaje)
    })

    client.on('mensaje-privado', (data)=>{
        let persona = usuario.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensaje-privado', crearMensaje(persona.id, data.mensaje))
    })

});
