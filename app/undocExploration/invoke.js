Java.perform(function () {
    console.log("Starting script...");

    // The class name and method to hook
    var className = "com.tencent.mm.appbrand.commonjni.AppBrandCommonBindingJni";
    var methodName = "nativeInvokeHandler";

    // Function to hook the specific method and call it with given arguments
    function hookAndInvokeMethod(className, methodName, args) {
        try {
            var clazz = Java.use(className);
            var method = clazz[methodName];
            var originalMethod = method.overload('java.lang.String', 'java.lang.String', 'java.lang.String', 'int', 'boolean');

            // Hook the method
            originalMethod.implementation = function (str, str2, str3, i15, z15) {
                console.log("called " + className + "." + methodName);
                console.log("Arguments:");
                console.log("Argument 0: " + str);
                console.log("Argument 1: " + str2);
                console.log("Argument 2: " + str3);
                console.log("Argument 3: " + i15);
                console.log("Argument 4: " + z15);

                // Capture and print the stack trace
                // var stackTrace = Java.use("java.lang.Thread").currentThread().getStackTrace();
                // console.log("Stack trace for " + className + "." + methodName + ":");
                // stackTrace.forEach(function (traceElement) {
                //     console.log("\t" + traceElement.toString());
                // });

                // Call the original method
                return originalMethod.call(this, str, str2, str3, i15, z15);
            };

            // Invoke the method with specified arguments
            // var StringClass = Java.use("java.lang.String");
            // var arg0 = StringClass.$new("chooseContact");
            // var arg1 = StringClass.$new("{}");
            // var arg2 = StringClass.$new("{}");
            // var result = originalMethod.call(clazz, arg0, arg1, arg2, args[3], args[4]);
            // console.log("Result: " + result);

        } catch (e) {
            console.log("Failed to hook and invoke method for " + className + "." + methodName + ": " + e.message);
        }
    }

    // Arguments to call the function with
    var args = ["chooseContact", "{}", "{}", 96, true];

    // Hook and invoke the method
    console.log("Hooking and invoking method in class: " + className);
    hookAndInvokeMethod(className, methodName, args);

    console.log("Script execution complete.");
});
