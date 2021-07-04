var params = new URLSearchParams(window.location.search);

let nombre = params.get('nombre');
let sala = params.get('sala');


//Referencias HTML
let divUsuarios = document.querySelector('#divUsuarios');
let formEnviar = document.querySelector('#formEnviar');
let txtMensaje = document.querySelector('#txtMensaje');
let divChatbox = document.querySelector('#divChatbox');

//Funcione para renderizar los usuarios

function renderizarUsuarios( personas ){

    let html = `
    <li>
        <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>
    </li>

    `;


    for(let i = 0; i<personas.length; i++){
        html += `
        <li>
            <a data-id="${ personas[i].id}" href="javascript:void(chatClick('${ personas[i].id}'))"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> ${ personas[i].nombre } <small class="text-success">online</small></span></a>
        </li>
        `;
    }


    divUsuarios.innerHTML = html;


}

//listaners
function chatClick(id) {
    console.log(id);
}


formEnviar.addEventListener('submit', (e)=>{
    e.preventDefault();
    // console.log(txtMensaje);
    // console.log('Hola');
    if(txtMensaje.value.trim().length === 0){
        console.log('entre');
        return;
    }

    socket.emit('crear-mensaje', {
        nombre,
        mensaje: txtMensaje.value
    }, function(mensaje) {
        txtMensaje.value = '';
        txtMensaje.focus();
        console.log('mensaje');
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });


})



function renderizarMensajes(mensaje, yo){
    let html;
    let fecha = new Date(mensaje.fecha);
    let hora = fecha.getHours() + ':' + fecha.getMinutes();

    if(mensaje.nombre === 'Administrador'){
        html = `
        <li class="animated fadeIn">
            <div class="chat-content">
                <div class="box bg-light-inverse">${mensaje.mensaje}</div>
            </div>
            <div class="chat-time">${hora}</div>
        </li>
        `
    }
    else if(yo){

        html = `
        <li class="reverse animated fadeIn">
            <div class="chat-content">
                <h5>${mensaje.nombre}</h5>
                <div class="box bg-light-inverse">${mensaje.mensaje}</div>
            </div>
            <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
            <div class="chat-time">${hora}</div>
        </li>
        `
    }
    else{
        html =  `
        <li class="animated fadeIn">
            <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>
            <div class="chat-content">
                <h5>${mensaje.nombre}</h5>
                <div class="box bg-light-info">${mensaje.mensaje}</div>
            </div>
            <div class="chat-time">${hora}</div>
        </li>`
    }

    divChatbox.innerHTML += html;
    scroll('divChatbox', 'li');
    // divChatbox.append()

}


function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


function scroll(nombrePadre, nombreHijo) {
    var padre = $(`#${nombrePadre}`); //
    var totalHeight = 0;
    // console.log(padre.find(nombreHijo).length)
    padre.find(nombreHijo).each(function() {
        //console.log(`totalHeight: ${totalHeight} - $(this).outerHeight(): ${$(this).outerHeight()}`)
        totalHeight += $(this).outerHeight();
    });
 
    // padre.scrollTop(totalHeight); //el scroll siempre lleva al final del div
 
    $(`#${nombrePadre}`).animate({
        scrollTop: totalHeight
    }, 500); //animacion!
 
};