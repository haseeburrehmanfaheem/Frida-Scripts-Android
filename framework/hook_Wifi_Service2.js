// com.android.server.wifi

Java.perform(function () {

    hookAllMethods("com.android.server.wifi.WifiService")

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
                    console.log("Arguments: " + arguments);
                    var result = this[element.getName()].apply(this, arguments);
                    console.log("Result: " + result);
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