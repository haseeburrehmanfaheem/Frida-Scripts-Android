Java.perform(function () {
    // var Context = Java.use("android.content.Context");
    
    // Context.getSystemService.overload('java.lang.String').implementation = function (serviceName) {
    //     console.log("getSystemService called with String: " + serviceName);
    //     return this.getSystemService.overload('java.lang.String').call(this, serviceName);
    // };

    
    // Context.getSystemService.overload('java.lang.Class').implementation = function (serviceClass) {
    //     console.log("getSystemService called with Class: " + serviceClass);
    //     if(serviceClass.getName().includes("LocationManager")) {
    //         hookAllMethods(serviceClass.getName());
    //     }
        
    //     return this.getSystemService.overload('java.lang.Class').call(this, serviceClass);
        
    // };


    // hookAllMethods("android.location.LocationManager");    
    // hookAllMethods("android.location.LocationProvider");
    // hookAllMethods("android.location.Location");
    hookAllMethods("android.bluetooth.BluetoothManager")
    hookAllMethods("android.bluetooth.BluetoothAdapter")
    hookAllMethods("com.android.server.telecom.bluetooth.BluetoothDeviceManager")
    hookAllMethods("android.bluetooth.BluetoothProvider")
    hookAllMethods("android.bluetooth.Bluetooth")
    
    // hookAllMethods("com.android.server.midi.MidiService")
    // hookAllMethods("com.android.server.audio.AudioService")


// configuration file for server cs.android se linux policy configuration attributes 
// contact, try to look for how to open contacts 
//                  

    // hookAllMethods("com.android.server.bluetooth.BluetoothManager")
    // hookAllMethods("android.os.BluetoothServiceManager")
    // hookAllMethods("com.android.server.media.MediaRouterService")
    function hookAllMethods(targetClass) {
        try{
        var clazz = Java.use(targetClass);
        var methods = clazz.class.getDeclaredMethods();
        
        methods.forEach(element => {
            
            var method_name = element.getName();
            console.log("Hooking " + targetClass + "." + method_name);

            try {
            var overloads = clazz[element.getName()].overloads;
            // console.log("Method: " + method_name, "Overloads: " + overload);
           
            overloads.forEach(overload => {
                overload.implementation = function (){
                    console.log("called " + targetClass + "." + method_name);
                    // console.log("Arguments: " + arguments);
                    var result = this[element.getName()].apply(this, arguments);
                    // console.log("Result: " + result);
                    return result;
                }
            })} catch (error) {
                console.log("Error: " + error);
            }
            
            
        });
    } catch (error) {
        console.log("Error: " + error);
    }
    }
    

});



// frida -D 16051JECB02154 -l hookLocationService.js "system_server"