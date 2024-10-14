Java.perform(function () {
    console.log("Starting script...");

    // List of class names to hook
    var classes = [
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.v",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.d1",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.k",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.w",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.c0",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.z",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.t",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.e0",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.k0",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.h1",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.x",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.f1",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.o0",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.j1",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.g0",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.t0",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.q",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.j",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.o1",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.i",
        // "com.tencent.mm.plugin.appbrand.jsapi.appdownload.l1",
        // "com.tencent.mm.plugin.appbrand.jsapi.lbs.e0",
        // "com.tencent.mm.plugin.appbrand.jsapi.nfc.k",
        // "com.tencent.mm.plugin.appbrand.jsapi.h",
        // "com.tencent.mm.appbrand.commonjni.AppBrandCommonBindingJni"
        // "com.tencent.mm.plugin.appbrand.jsapi.na",
        "com.tencent.mm.sdk.platformtools.k2"
        // "com.tencent.mm.plugin.appbrand.jsapi.oa",
        
    ];

    // Function to hook all methods of a given class
    function hookAllMethods(className) {
        try {
            var clazz = Java.use(className);
            var methods = clazz.class.getDeclaredMethods();
            // console.log("Hooking " + methods.length + " methods for " + className + "...")
            methods.forEach(function (method) {
                // if(!method.getName().includes("nativeInvokeHandler")) {
                //     return
                // }
                var methodName = method.getName();
                var overloads = clazz[methodName].overloads;
                console.log("Hooking " + overloads.length + " overloads for " + className + "." + methodName + "...");  
                // console.log("Overloads: " + overloads);
                overloads.forEach(function (overload) {
                    overload.implementation = function () {
                        
                        // You can add your own logic here

                        // if(methodName == "f") {
                            for (var i = 0; i < arguments.length; i++) {
                                console.log("Argument " + i + ": " + arguments[i]);
                            }
                            var s = overload.apply(this, arguments);
                            console.log("Hooked " + className + "." + methodName + " " + `s=${s}`); 
                            // var stackTrace = Java.use("java.lang.Thread").currentThread().getStackTrace();
                            // console.log("Stack trace for " + className + "." + methodName + ":");
                            // stackTrace.forEach(function (traceElement) {
                            //     console.log("\t" + traceElement.toString());
                            // });
                            console.log(`s=${s}`);
                        // }
                        // Call the original method
                        return overload.apply(this, arguments);
                    };
                });
            });
        } catch (e) {
            console.log("Failed to hook methods for " + className + ": " + e.message);
        }
    }

    // Hook methods for all specified classes
    classes.forEach(function (className) {
        hookAllMethods(className);
    });

    console.log("Script execution complete.");
});

// let i0 = Java.use("com.tencent.mm.plugin.appbrand.jsapi.i0");
// let h = Java.use("com.tencent.mm.plugin.appbrand.jsapi.h");
// h["f"].implementation = function () {
//     console.log(`h.f is called`);
//     let result = this["f"]();
//     console.log(`h.f result=${result}`);
//     return result;
// };