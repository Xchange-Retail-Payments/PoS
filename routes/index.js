//TODO: add lib nfc to rasberry pi zero
//TODO: add pm2 to rasberry pi zero
//TODO: Fail page
//TODO: 

var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require ('fs');
let dotenv = require('dotenv');

dotenv.config();
const app = express();
var generate = require('../generate.js');
//var Remove = require('../rm.js');

var W3CWebSocket = require('websocket').w3cwebsocket;
const { Console } = require('console');
var apikey = process.env.apikey;
var apisecret = process.env.apisecret; 
var Address = process.env.address;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {  });
});

/* GET config page. */
router.get('/config', function(req, res, next) {
  res.render('config.ejs', { });
});

/* GET payment page. */
router.get('/payment', function(req, res, next) {
  res.render('payment.ejs', { });
});

 /*Post Payload Details */
 router.post('/PostPayload', function(req, res) {
	var Amount = req.body.amount;

	/*Pass received data to Generate Payload Route*/
	req.session.result = {
		Amount: Amount
	};
	res.redirect('/GeneratePayload');
	});

  /*Display QR Code*/
  router.get('/payloadCheck', function(req, res, next) {
    res.render('payloadCheck.ejs', { title: 'Express' });
  });

//Generate a payment Transaction
router.get('/GeneratePayload', async function(req, res, next) {
 
  var result = req.session.result;
  var Amount = result.Amount;	
	var Memo = "Transaction through Xumm Console Hub";

console.log(Amount)
	DestinationAddress = String(Address)
	
  var options = {
    method: 'POST',
    url: 'https://xumm.app/api/v1/platform/payload',
    headers: {
    'content-type': 'application/json',
    'x-api-key': apikey,
    'x-api-secret': apisecret,
    authorization: 'Bearer' + apisecret
    },
    body: {
      "options": {
        "submit": true,
        "return_url": {
          "web": "http://localhost:3000/payloadCheck",
          "app": ""
            }    
          },
        "txjson": {
          "TransactionType": "Payment",
          "Destination": Address, 
          "Amount": Amount,
          "Fee": "12",
          "Memos": [
            {
              "Memo": {
              "MemoType": Buffer.from('HUB', 'utf8').toString('hex').toUpperCase(),
              "MemoData": Buffer.from(Memo, 'utf8').toString('hex').toUpperCase()
              }
            }
            ]
        }
        
      },
    json: true,
    jar: 'JAR'
  };

  request(options, async function (error, response, body) {
    if (error) throw new Error(error);

    var UUID = body.uuid;
    var Web = body.websocket_status;
    var qr = body.refs.qr_png;
    var next = body.next.always;
await next;

/*Pass received data to Generate Payload Route*/
req.session.result = {
  Uuid: UUID
};
 var NFCPayload = Buffer.from(UUID, 'utf-8')
 .toString('hex')
 .match(/.{2}/g).map(r => {
   return '0x' + r
 }).join(', ')
 await NFCPayload;
 //console.log("XUMM Payload Created : "+NFCPayload)

 //TODO: uncomment to pass NFC payload, currently not making file?? check and compare PoC
generate.makefile(NFCPayload)

res.redirect(next)

    });
});
 
/*Check Payload Status*/
router.get('/CheckPayload', async function(req, res, next) {
  var result = req.session.result;
  var UUID = result.Uuid;	
  console.log("im uuid", UUID)

/*Get Xumm Payload Status */
 var data = String(UUID);
   var options = {
     method: 'GET',
     url: 'https://xumm.app/api/v1/platform/payload/' + data,
     headers: {
       'x-api-key': apikey,
       'x-api-secret': apisecret,
       'content-type': 'application/json',
       authorization: 'Bearer' + apisecret
     },
   };

   request(options, async function (error, response, body) {
     if (error) throw new Error(error);

     var jsonBody = JSON.parse(body)
     success = jsonBody.meta.resolved;
     receivedAmount = jsonBody.payload.request_json.Amount.value;
     tx = jsonBody.response.txid;
//COMMENT Further works can be added from here, check it wasnt declined check transaction for correct amount, print receipt. 
//Remove;
     res.redirect('/')

   })
  
});
/*Post Payload Details */
router.post('/PostClientDetail', function(req, res) {

	var APK =  "apikey="+req.body.key;
var APS = "apisecret="+req.body.secret;
var ADD = "address="+req.body.address;

fs.writeFile('.env', APK+"\n"+APS+"\n"+ADD, finished)

function finished(err){
	reply = "Added Xumm Secret & Key"
	console.log(reply)
}
	res.redirect('/');
	});
module.exports = router;
