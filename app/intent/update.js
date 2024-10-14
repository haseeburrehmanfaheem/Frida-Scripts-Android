Java.perform(function(){
    
    var ContentResolver = Java.use("android.content.ContentResolver");
//     ContentResolver.query.overload(
//     "android.net.Uri",
//     "[Ljava.lang.String;",
//     "java.lang.String",
//     "[Ljava.lang.String;",
//     "java.lang.String"
//   ).implementation = function (
//     uri,
//     projection,
//     selection,
//     selectionArgs,
//     sortOrder
//   ) {
//     // printDivider();
//     console.log("called content resolver");
//     var cursor = this.query(
//       uri,
//       projection,
//       selection,
//       selectionArgs,
//       sortOrder
//     );
//     // if (cursor) {
//     //   logCursor(cursor);
//     // }
//     return cursor;
//   };
function printDivider() {
    console.log(
      "-------------------------------------------------------------"
    );
  }

  function getColorText(text, colorCode) {
    return "\x1b[" + colorCode + "m" + text + "\x1b[0m";
  }

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
              
              if(method_name == "applyBatch"){
            console.log(overload);
              console.log("Argument count: " + arguments.length);
              for (let i = 0; i < arguments.length; i++) {
                  console.log("Arg[" + i + "]: Type=" + typeof arguments[i] + ", Value=" + arguments[i]);
              }

              var operations = arguments[1]
              for (var i = 0; i < operations.size(); i++) {
                console.log("  " + operations.get(i).toString());
            }
            console.log("]");
            }
              // console.log("\n");

              if(method_name.includes("apply") || method_name.includes("insert") || method_name.includes("update") || method_name.includes("delete")){
              console.log("LOOKKKKKKKKKKKKKKGHEREEEEEEEEEEEEe")
            }
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

// hookAllMethods("android.content.ContentResolver")
hookAllMethods("android.content.ContentProviderOperation")

   // Hook applyBatch
//    ContentResolver.applyBatch.overload('java.lang.String', 'java.util.ArrayList').implementation = function(authority, operations) {
//     console.log(getColorText("Called applyBatch", "34"));
//     console.log("Authority: " + authority);
//     printDivider();

//     // Print all the operations in the batch
//     for (var i = 0; i < operations.size(); i++) {
//         var op = Java.cast(operations.get(i), ContentProviderOperation);
//         console.log(getColorText("Operation[" + i + "]: ", "34"));
//         console.log(getColorText("  Type: " + op.getType(), "32"));
//         console.log(getColorText("  URI: " + op.getUri(), "32"));
//         console.log(getColorText("  Selection: " + op.getSelection(), "32"));
//         console.log(getColorText("  Values: " + op.getValues(), "32"));
//     }

//     // Call the original implementation
//     try {
//         return this.applyBatch(authority, operations);
//     } catch (e) {
//         if (e instanceof OperationApplicationException) {
//             console.log(getColorText("Operation Application Exception: " + e, "31"));
//         }
//         throw e;
//     }
// };



})












