Java.perform(function () {
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
  Java.enumerateClassLoaders({
    onMatch: function (loader) {
      console.log("", loader);
      try {
        loader.findClass("com.android.server.wifi.WifiServiceImpl");
        console.log("FOUND");
        Java.classFactory.loader = loader;
        console.log("Set the classloader to the correct one"); // Now you can use Java.use
      } catch (err) {}
    },
    onComplete: function () {
      console.log("end");
    //   wifiService = Java.use("com.android.server.wifi.WifiService")
      hookAllMethods("com.android.server.wifi.WifiServiceImpl")
    },
  });
});
