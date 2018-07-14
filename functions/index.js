const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendNotifications = functions.database
.ref('/notifications/{user_id}')
.onWrite( (snapshot , context )=>{

    if(!snapshot.after.val()){
        return;
    }
    var id       = context.params.user_id;
    const device_token = snapshot.after.child('device_token').val();
    var name     = snapshot.after.child('name').val();
    var age      = snapshot.after.child('age').val();
    var address  = snapshot.after.child('address').val();
    
    console.log("device_token:\""+ device_token +"\", user_id :\"" + id + "\", user:"  + name + " , " + age + " , " + address );
    const payload = {
        data:{
            id        : id,
            name      : name,
            age       : age ,
            address   : address
        }
    };

    return admin.messaging().sendToDevice(device_token,payload)
    .then(response =>{
        console.log("Sucessfully sent message",response); 
        return ;    
    })
    .catch(error =>{
        console.log("error sending message",error); 
    });

});