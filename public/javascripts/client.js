
var socket = io('http://86.136.4.19:3000');

socket.on('QR', function (qr) {
    console.log(qr);
    document.getElementById('image').src=(qr);
    document.getElementById('name').innerHTML=(qr);
    document.getElementById("href").setAttribute("href",qr);
});





  


