$(function () {

    $("#start").click(function(){
        
        var sid = $("#sid").val();      
        var topic1 = "/iot/" + sid + "/temp"
        var topic2 = "/iot/" + sid + "/humid"
        client.subscribe(topic1);
        client.subscribe(topic2);

        $("#selectedSID").text(sid);

    });

    $("#on").click(function(){
        
        var sid = $("#sid").val();      
        var topic = "/iot/" + sid + "/led"
        message = new Paho.MQTT.Message("1");
        message.destinationName = topic;
        client.send(message);
        
    });

    $("#off").click(function(){
        
        var sid = $("#sid").val();      
        var topic = "/iot/" + sid + "/led"
        message = new Paho.MQTT.Message("0");
        message.destinationName = topic;
        client.send(message);
        
    });

    var temp = new JustGage({
        id: "gTemp",
        value: 0,
        min: 0,
        max: 100,
        title: "Temperature"
    });

    var humid = new JustGage({
        id: "gHumid",
        value: 0,
        min: 0,
        max: 100,
        title: "Humidity"
    });

    // Create a client instance
    var host = "iot.eclipse.org";
    var port = 80;
    client = new Paho.MQTT.Client(host, Number(port), "/ws", "140-390mqttdashboard");

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({
        onSuccess: onConnect
    });


    // called when the client connects
    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
        var topic1 = "/iot/+/temp"
        var topic2 = "/iot/+/humid"
        client.subscribe(topic1);
        client.subscribe(topic2);
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        var topic = message.destinationName;
        var payload = message.payloadString;
        var sid = topic.substring(5, 15);
        console.log(topic);
        console.log(payload);
        console.log(sid);

        if(topic.indexOf("temp") !== -1){
            temp.refresh(payload);
        }
        if(topic.indexOf("humid") !== -1){
            humid.refresh(payload);
        }        
    }

});