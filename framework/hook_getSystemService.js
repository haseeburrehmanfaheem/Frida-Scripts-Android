Java.perform(function () {
    var Context = Java.use("android.content.Context");

    function hookAllMethods(targetClass) {
        var clazz = Java.use(targetClass);
        var methods = clazz.class.getDeclaredMethods();
        methods.forEach(element => {
            var method_name = element.getName();
            var overloads = clazz[element.getName()].overloads;
            // console.log("Method: " + method_name, "Overloads: " + overload);
            console.log("Hooking " + targetClass + "." + method_name);
            overloads.forEach(overload => {
                overload.implementation = function (){
                    console.log("called " + targetClass + "." + method_name);
                    console.log("Arguments: " + arguments);
                    var result = this[element.getName()].apply(this, arguments);
                    console.log("Result: " + result);
                    return result;
                }

            })
            
            
        });
    }



    
    Context.getSystemService.overload('java.lang.String').implementation = function (serviceName) {
        console.log("getSystemService called with String: " + serviceName);
        return this.getSystemService.overload('java.lang.String').call(this, serviceName);
    };

    
    Context.getSystemService.overload('java.lang.Class').implementation = function (serviceClass) {
        console.log("getSystemService called with Class: " + serviceClass);
        // if(serviceClass.getName().includes("LocationManager")) {
        //     hookAllMethods(serviceClass.getName());
        // }
        
        return this.getSystemService.overload('java.lang.Class').call(this, serviceClass);
        
    };
});
