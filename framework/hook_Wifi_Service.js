Java.perform(function () {
    var classLoader = Java.classFactory.loader;
    var BluetoothManagerService = null;

    try {
        BluetoothManagerService = Java.use("com.android.server.wifi.WifiServiceImpl");
    } catch (err) {
        console.log("Trying alternative class loaders...");
        Java.enumerateClassLoaders({
            onMatch: function(loader) {
                try {
                    if (loader.findClass("com.android.server.wifi.WifiServiceImpl")) {
                        classLoader = loader;
                        return 'stop'; // Stop enumeration
                    }
                } catch (e) {}
            },
            onComplete: function() {
                Java.classFactory.loader = classLoader;
                BluetoothManagerService = Java.use("com.android.server.wifi.WifiServiceImpl");
                console.log("Found using alternative class loader.");
            }
        });
    }

    if (BluetoothManagerService) {
        // Continue with method hooks
        // console.log("BluetoothManagerService class found!");
        var methods = BluetoothManagerService.class.getDeclaredMethods();
        methods.forEach(function (method) {
            try{
            var methodName = method.getName();
            var overloads = BluetoothManagerService[methodName].overloads;
            console.log(`Hooking ${methodName} with ${overloads.length} overloads`);
            overloads.forEach(function (overload) {
                overload.implementation = function () {
                    console.log(`Called: ${methodName}`);
                    // console.log(`Arguments: ${arguments}`);
                    return this[methodName].apply(this, arguments);
                };
            });}
            catch (error) {
                console.log("Error: " + error);
            }
        });
    } else {
        console.log("BluetoothManagerService class not found.");
    }
});
