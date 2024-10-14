Java.perform(function () {
  function hookAllMethods(targetClass) {
    try {
      // var systemClassLoader = Java.classFactory.loader;

      // Try to use the system class loader directly
      // Java.classFactory.loader = systemClassLoader;
      var clazz = Java.use(targetClass);
      var methods = clazz.class.getDeclaredMethods();

      methods.forEach((element) => {
        var method_name = element.getName();
        console.log("Hooking " + targetClass + "." + method_name);

        try {
          var overloads = clazz[element.getName()].overloads;
          // console.log("Method: " + method_name, "Overloads: " + overload);

          overloads.forEach((overload) => {
            overload.implementation = function () {
              console.log("called " + targetClass + "." + method_name);
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
    } catch (error) {
      console.log("Error: " + error);
    }
  }

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
        methods.forEach((element) => {
          console.log("Hooking " + targetClass + "." + method_name);
          var method_name = element.getName();
          console.log("Hooking " + targetClass + "." + method_name);

          try {
            var overloads = TestClass[element.getName()].overload;
            // console.log("Method: " + method_name, "Overloads: " + overloads);

            overloads.forEach((overload) => {
              overload.implementation = function () {
                console.log("called " + targetClass + "." + method_name);
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

  // Java.enumerateLoadedClasses({
  //     onMatch: function (className) {
  //         if (className.startsWith("com.android.server.bluetooth.BluetoothManagerService")) {
  //             console.log(className);

  //             hookAllMethods(className);
  //         }
  //     },
  //     onComplete: function () {
  //         console.log('Class enumeration complete. Only Bluetooth related classes were listed.');
  //     }
  // });
});
