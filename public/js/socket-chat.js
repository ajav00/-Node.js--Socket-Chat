let socket = io();

let params = new URLSearchParams(window.location.search);

if( !params.has('nombre') || !params.has('sala')){
    // console.log('ENtre');
    window.location = 'index.html';
    throw new Error('El nombre/sala es obligatorio');
}

let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, (resp)=>{
        console.log('Usuarios Conectados', resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crear-mensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});


// Escuchar cambios de uusarios entrar y salir
socket.on('lista-personas', function(personas) {

    console.log(personas);

});


//Mensajes privados 
socket.on('mensaje-privado', function(mensaje){
    console.log('Mensaje Privado: ', mensaje);
});


