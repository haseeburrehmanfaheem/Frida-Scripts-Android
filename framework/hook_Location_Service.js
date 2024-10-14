Java.perform(function () {

  
  hookAllMethods("com.android.server.location.LocationManagerService");
  hookAllMethods("com.android.server.vibrator.VibratorManagerService");
  hookAllMethods("com.android.server.am.ActivityManagerService");
  

  function hookAllMethods(targetClass) {
    var total_hooked = 0;
    try {
      var clazz = Java.use(targetClass);
      var methods = clazz.class.getDeclaredMethods();

      methods.forEach((element) => {
        var method_name = element.getName();
        // console.log("Hooking " + targetClass + "." + method_name);

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
              // console.log("Arguments: " + arguments);
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

// frida -D 16051JECB02154 -l hookLocationService.js "system_server"
// com.android.server.location.LocationManagerService.registerLocationListener(Ljava/lang/String;Landroid/location/LocationRequest;Landroid/location/ILocationListener;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
