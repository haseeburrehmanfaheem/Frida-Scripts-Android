Java.perform(function () {
    hookAllMethods("android.location.LocationManager");
    // hookAllMethods("android.bluetooth.BluetoothManager");
    // hookAllMethods("android.os.Vibrator");
    // hookAllMethods("android.net.wifi.WifiManager");
    // hookAllMethods("android.app.ActivityManager");

    // let Vibrator = Java.use("android.os.Vibrator");
    
  
    function hookAllMethods(targetClass) {
      var total_hooked = 0;
      try {
        var clazz = Java.use(targetClass);
        var methods = clazz.class.getDeclaredMethods();
  
        methods.forEach((element) => {
          var method_name = element.getName();
          console.log("Hooking " + targetClass + "." + method_name);
  
          try {
            var overloads = clazz[element.getName()].overloads;
          //   console.log(
          //     "Method: " + method_name,
          //     "Overloads: " + overloads.length
          //   );
            total_hooked += overloads.length;
          //   console.log(total_hooked);
            overloads.forEach((overload) => {
              overload.implementation = function () {
                console.log("called " + targetClass + "." + method_name);
                console.log("Arguments: " + arguments);
                // console.log("Vibrate called with duration: " + args[0]);
                console.log("Argument count: " + arguments.length);
                for (let i = 0; i < arguments.length; i++) {
                    console.log("Arg[" + i + "]: Type=" + typeof arguments[i] + ", Value=" + arguments[i]);
                }
                console.log("\n");
                var result = this[element.getName()].apply(this, arguments);
                // console.log("Result: " + result);
                return result;
              };
            });
          } catch (error) {
            console.log("Error: " + error);
          }
        });
  
        console.log("Total hooked: " + total_hooked);
      } catch (error) {
        console.log("Error: " + error);
      }
    }
  });
  