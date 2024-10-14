const androidManagers = [
    "android.hardware.camera2.CameraManager",
];

var total = 0;
Java.perform(function () {

    androidManagers.forEach(element => {

    //   if(element.includes("android.hardware") || element.includes("android.app") || element.includes("android.view") || element.includes("android.content"))
    //   {
    //     return 
    //   }
      hookAllMethods(element);
    });
    // hookAllMethods("android.location.LocationManager");
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
        //   console.log("Hooking " + targetClass + "." + method_name);
  
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

                if(method_name == "getService")
                {
                    // print arguments
                    console.log("Arguments: " + arguments);
                    console.log("Argument count: " + arguments.length);
                    for (let i = 0; i < arguments.length; i++) {
                        console.log("Arg[" + i + "]: Type=" + typeof arguments[i] + ", Value=" + JSON.stringify(arguments[i]));
                    }
                }
                // console.log("Arguments: " + arguments);
                // console.log("Vibrate called with duration: " + args[0]);
                // console.log("Argument count: " + arguments.length);
                // for (let i = 0; i < arguments.length; i++) {
                //     console.log("Arg[" + i + "]: Type=" + typeof arguments[i] + ", Value=" + arguments[i]);
                // }
                // console.log("\n");
                var result = this[element.getName()].apply(this, arguments);
                // console.log("Result: " + result);
                return result;
              };
            });
          } catch (error) {
            // console.log("Error: " + error);
          }
        });
  
        console.log("Total hooked: " + total_hooked);
        total += total_hooked;

        console.log(total);
      } catch (error) {
        console.log("Error: " + error);
      }
    }
  });
  