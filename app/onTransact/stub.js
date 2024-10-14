// let Stub = Java.use("android.location.ILocationManager$Stub");
// Stub["asBinder"].implementation = function () {
//     console.log(`Stub.asBinder is called`);
//     let result = this["asBinder"]();
//     console.log(`Stub.asBinder result=${result}`);
//     return result;
// };





Java.perform(function () {
    var classLoader = Java.classFactory.loader;
    var clazz = null;

    try {
        clazz = Java.use("android.os.IVibratorManagerService$Stub");
    } catch (err) {
        console.log("Trying alternative class loaders...");
        Java.enumerateClassLoaders({
            onMatch: function(loader) {
                try {
                    if (loader.findClass("android.os.IVibratorManagerService$Stub")) {
                        classLoader = loader;
                        return 'stop'; // Stop enumeration
                    }
                } catch (e) {}
            },
            onComplete: function() {
                Java.classFactory.loader = classLoader;
                clazz = Java.use("android.os.IVibratorManagerService$Stub");
                console.log("Found using alternative class loader.");
            }
        });
    }

    if (clazz) {

        let Parcel = Java.use("android.os.Parcel");
        let CombinedVibration = Java.use('android.os.CombinedVibration'); // Adjust class path if needed
        let VibrationAttributes = Java.use('android.os.VibrationAttributes'); // Adjust class path if needed

        // Parcel.



        clazz.onTransact.implementation = function (code, data, reply, flags) {
            console.log(`Stub.onTransact is called: code=${code}, data=${data}, reply=${reply}, flags=${flags}`);
            data.setDataPosition(0);
            try {
                console.log(`Stub.onTransact called: code=${code}, flags=${flags}`);

        console.log(Object.getOwnPropertyNames(data).join(', '));
        console.log(Object.getOwnPropertyNames(data.__proto__).join(', '));
        
        data.setDataPosition(0);

        // Reading data as specified
        let _arg06 = data.readInt();
        console.log(`_arg06: ${_arg06}`);
        
        let _arg14 = data.readInt();
        console.log(`_arg14: ${_arg14}`);

        let _arg22 = data.readString();
        console.log(`_arg22: ${_arg22}`);

        let CombinedVibration = Java.use('android.os.CombinedVibration'); // Adjust class path if needed
        let _arg32 = data.readTypedObject(CombinedVibration.CREATOR);
        console.log(`_arg32: ${_arg32}`);

        let VibrationAttributes = Java.use('android.os.VibrationAttributes'); // Adjust class path if needed
        let _arg42 = data.readTypedObject(VibrationAttributes.CREATOR);
        console.log(`_arg42: ${_arg42}`);

        let _arg5 = data.readString();
        console.log(`_arg5: ${_arg5}`);

        let _arg6 = data.readStrongBinder();
        console.log(`_arg6: ${_arg6}`);

        // Ensure there's no more data to read
        try {
            data.enforceNoDataAvail();
        } catch (e) {
            console.error("Error: data parcel still has more data.");
        }

        // Reset position after reading
        data.setDataPosition(0);

        // Proceed with the original call
        let result = this.onTransact(code, data, reply, flags);
        console.log(`Stub.onTransact result: ${result}`);

        return result;
            } catch (e) {
                console.error("Error processing data parcel: " + e);
            }
        }
        return 
        // Continue with method hooks
        // console.log("clazz class found!");
        var methods = clazz.class.getDeclaredMethods();
        methods.forEach(function (method) {
            try{
                // console.log("Hooking " + method.getName() + " with " + clazz[method.getName()].overloads.length + " overloads");
            var methodName = method.getName();
            var overloads = clazz[methodName].overloads;
            console.log(`Hooking ${methodName} with ${overloads.length} overloads`);
            overloads.forEach(function (overload) {
                overload.implementation = function () {
                    console.log(`Called: ${methodName}`);
                    for (let i = 0; i < arguments.length; i++) {
                        console.log(`arg[${i}]:`, arguments[i]);
                    }
                    return this[methodName].apply(this, arguments);
                };
            });
        
        }
            catch (error) {
                console.log("Error: " + error);
            }
        });
    } else {
        console.log("clazz class not found.");
    }
});

// let Stub = Java.use("android.os.IVibratorManagerService$Stub");
// Stub["onTransact"].implementation = function (code, data, reply, flags) {
//     console.log(`Stub.onTransact is called: code=${code}, data=${data}, reply=${reply}, flags=${flags}`);
//     let result = this["onTransact"](code, data, reply, flags);
//     console.log(`Stub.onTransact result=${result}`);
//     return result;
// };
