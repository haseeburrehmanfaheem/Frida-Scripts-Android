Java.perform(function () {
  function hookAllMethods(targetClass) {
    var total_hooked = 0;
    try {
      var clazz = Java.use(targetClass);
      var methods = clazz.class.getDeclaredMethods();
      console.log("Class : " + targetClass);
      methods.forEach((element) => {
        var method_name = element.getName();
        //   console.log("Hooking " + targetClass + "." + method_name);

        try {
          var overloads = clazz[element.getName()].overloads;
          console.log(
            "Method: " + method_name,
            "Overloads: " + overloads.length
          );
          total_hooked += overloads.length;
          //   console.log(total_hooked);
          overloads.forEach((overload) => {
            overload.implementation = function () {
              console.log("called " + targetClass + "." + method_name);
              console.log("Arguments: " + arguments);
              // console.log("Vibrate called with duration: " + args[0]);
              //   console.log("Argument count: " + arguments.length);
              for (let i = 0; i < arguments.length; i++) {
                console.log(
                  "Arg[" +
                    i +
                    "]: Type=" +
                    typeof arguments[i] +
                    ", Value=" +
                    arguments[i]
                );
              }
              // console.log("\n");
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
      //   total += total_hooked;

      //   console.log(total);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  hookAllMethods("java.io.File");
  hookAllMethods("java.io.FileInputStream");
  hookAllMethods("java.io.FileOutputStream");
  hookAllMethods("java.nio.channels.FileChannel");
  hookAllMethods("java.io.FileDescriptor");

  //   var CLS = {
  //     File: Java.use("java.io.File"),
  //     FileInputStream: Java.use("java.io.FileInputStream"),
  //     FileOutputStream: Java.use("java.io.FileOutputStream"),
  //     String: Java.use("java.lang.String"),
  //     FileChannel: Java.use("java.nio.channels.FileChannel"),
  //     FileDescriptor: Java.use("java.io.FileDescriptor"),
  //     Thread: Java.use("java.lang.Thread"),
  //     StackTraceElement: Java.use("java.lang.StackTraceElement"),
  //     AndroidDbSQLite: Java.use("android.database.sqlite.SQLiteDatabase")
  // };
});
