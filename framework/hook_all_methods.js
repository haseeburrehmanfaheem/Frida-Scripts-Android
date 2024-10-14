Java.perform(function () {


  Java.enumerateClassLoaders({
    onMatch: function (loader) {
      Java.classFactory.loader = loader;
      var TestClass;

      // Hook the class if found, else try next classloader.
      try {
        // TestClass = Java.use(
        //   "com.android.server.bluetooth.BluetoothManagerService$6"
        // );

        TestClass = Java.use(
            "com.android.server.location.LocationManagerService"
          );

        // console.log("[+] Found class using classloader: " + loader);
        var methods = TestClass.class.getDeclaredMethods();
        // console.log("[+] Found " + methods.length + " methods in class.");
             
        methods.forEach((element) => {
            console.log(element);
            var method_name = element.getName();
            try{
            var overloads = TestClass[element.getName()].overloads;
            console.log("Method: " + method_name, "Overloads: " + overloads);

            overloads.forEach((overload) => {
                overload.implementation = function () {
                  console.log("called " + TestClass + "." + method_name);
                  console.log("Arguments: " + arguments);
                  var result = this[element.getName()].apply(this, arguments);
                  console.log("Result: " + result);
                  return result;
                };
              });
            } catch (error) {
                console.log("Error: " + error);
            }
        });
        return 
        
      } catch (error) {
        if (error.message.includes("ClassNotFoundException")) {
          console.log(
            "\n You are trying to load encrypted class, trying next loader"
          );
        }
      }
    },
    onComplete: function () {},
  });

});
