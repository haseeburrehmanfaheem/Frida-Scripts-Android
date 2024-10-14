////////////////// 1 /////////////////////// 
// console.log("v8_inspector::V8ProfilerAgentImpl::startProfiling(v8_inspector::String16 ");
// const f1 = Module.getExportByName('libmmv8.so', '_ZN12v8_inspector19V8ProfilerAgentImpl14startProfilingERKNS_8String16E')
// if(f1 == null){
//     console.log("Function not found");
// }
// console.log("Function found: "+ f1);
// try{
//     var startProfiling = new NativeFunction(f1, 'pointer',['pointer']);
//     var para2 = createString16('Haseeb');
//     var s = startProfiling(para2);
//     console.log("startProfiling called");
//     console.log("startProfiling2: "+ s);
// } 
// catch(err){
//     console.log("Error: "+err.stack);
// }





////////////////// 2 ////////////////////////
// working with string parameter
// console.log(" _ZN2v88internal22TracingCpuProfilerImpl14StartProfilingEv")
// const f2 = Module.getExportByName('libmmv8.so', '_ZN2v88internal22TracingCpuProfilerImpl14StartProfilingEv') 
// if(f2 == null){
//     console.log("Function not found");
// }
// console.log("Function found: "+ f2);
// try{
//     var startProfiling = new NativeFunction(f2, 'void',['pointer']);
//     var para2 = createString8('');
//     startProfiling(para2); // Error: Error: access violation accessing 0xd671e3f4
//     console.log("startProfiling called");
// }
// catch(err){
//     console.log("Error: "+err.stack);
// }


////////////////// 3 ////////////////////////
// console.log("_ZNK2v810CpuProfile15GetSamplesCountEv")
// const f3 = Module.getExportByName('libmmv8.so', '_ZNK2v810CpuProfile15GetSamplesCountEv')
// // const f3 = new NativeFunction(ptr("0x746ce9cc08"), 'int',[]);
// if(f3 == null){
//     console.log("Function not found");
// }
// console.log("Function found: "+ f3);
// console.log("0x746ce9cc08")
// try{
//     var startProfiling = new NativeFunction(f3, 'int',['pointer']);
//     var pointer = Memory.allocUtf8String('Haseeb');
//     var s = startProfiling(pointer);
//     console.log("startProfiling called");
//     console.log("startProfiling2: "+ s);
// }
// catch(err){
//     console.log("Error: "+err.stack);
// }




////////////////// 4 ////////////////////////
// console.log("_ZN2v811CpuProfiler14StartProfilingENS_5LocalINS_6StringEEEb")
// const f4 = Module.getExportByName('libmmv8.so', '_ZN2v811CpuProfiler14StartProfilingENS_5LocalINS_6StringEEEb')
// if(f4 == null){
//     console.log("Function not found");
// }
// console.log("Function found: " + f4);
// try{
//     var startProfiling = new NativeFunction(f4, 'void',['pointer','pointer','bool']);
//     var para1 = Memory.allocUtf16String(' ');
//     var para2 = Memory.allocUtf8String('Haseeb');
//     // var somebool = 1;
//     var somebool = 1;
//     var s = startProfiling(para1, para2, 23);
//     console.log("startProfiling called");
//     console.log("startProfiling222: "+ s);
// }
// catch(err){
//     console.log("Error: "+err.stack);
// }
// var v8Initialised = false 

// if(!v8Initialised){
//     console.log("_ZN2v82V810InitializeEi")
//     const f = Module.getExportByName('libmmv8.so', '_ZN2v82V810InitializeEi')
//     if(f == null){
//         console.log("Function not found");
//     }
//     console.log("Function found: "+ f);
//     try{
//         var v8Init = new NativeFunction(f, 'bool',['int']);
//         console.log("v8Init called");
//         v8Init(0);
//         v8Initialised = true;
//         console.log("v8Initialised: "+ v8Initialised);
//     }
//     catch(err){
//         console.log("Error: "+err.stack);
//     }

// }


// var v8IsolateEnter = "_ZN2v87Isolate5EnterEv"
// waitForModule('libmmv8.so', interceptV8Initialize);
// for (var i = 184; i < 1000; i++) {
//     setTimeout(initialiseParam(i), 5000);
// }


// waitForModule('libmmv8.so', interceptV8Initialize);
// interceptV8Initialize();

waitForModule("libmmv8.so", callback)

function interceptIsolateEnter(){
    console.log("_ZN2v87Isolate5EnterEv")
    const f = Module.getExportByName('libmmv8.so', '_ZN2v87Isolate5EnterEv')
    if(f == null){
        console.log("Function not found");
    }
    else{
    console.log("Function found: "+ f);
    Interceptor.attach(f, {
        onEnter: function (args) {
            console.log("v8::Isolate::Enter called");
        },
        onLeave: function (retval) {
            console.log("v8::Isolate::Enter returned");
        }
    });
}
}

function interceptnewIsolate(){
    console.log("_ZN2v87Isolate3NewERKNS0_12CreateParamsE")
    const f = Module.getExportByName('libmmv8.so', '_ZN2v87Isolate8AllocateEv')
    if(f == null){
        console.log("Function not found");
    }
    else{
    console.log("Function found: "+ f);
    Interceptor.attach(f, {
        onEnter: function (args) {
            console.log("v8::Isolate::New called");
        },
        onLeave: function (retval) {
            console.log("v8::Isolate::New returned");
            var isolate = retval;
            console.log("isolate: "+ isolate);
        }
    });
}

}

function interceptV8Initialize() {
    if (!v8Initialised) {
        console.log("Attempting to intercept v8::V8::Initialize...");
        const f = Module.getExportByName('libmmv8.so', '_ZN2v82V810InitializeEi');
        if (f == null) {
            console.log("Function not found");
        } else {
            console.log("Function found: " + f);
            Interceptor.attach(f, {
                onEnter: function (args) {
                    console.log("v8::V8::Initialize called with arg: " + args[0].toInt32());
                },
                onLeave: function (retval) {
                    console.log("v8::V8::Initialize returned");
                    v8Initialised = true;
                    console.log("v8Initialised: " + retval.toInt32());
                    // getCurrent();
                    // setTimeout(()=>getCurrent(),1000)
                    
                    // Now that V8 is initialized, we can proceed create an Isolate
                    // setTimeout(()=>initialiseParam(184),5000)
                    setTimeout(()=>initialiseParam(185),5000)
                }
            });
        }
    }
}

function newIsolate(paramPointer){
    console.log("_ZN2v87Isolate3NewERKNS0_12CreateParamsE")
    const f = Module.getExportByName('libmmv8.so', '_ZN2v87Isolate3NewERKNS0_12CreateParamsE')
    if(f == null){
        console.log("Function not found");
    }
    else{
        try{
    console.log("Function found: "+ f);
    var isolatepointer = new NativeFunction(f, 'pointer',['pointer']);
    console.log("isolatepointer called");
    var isolatepointer = isolatepointer(paramPointer);
    console.log("isolatepointer: "+ isolatepointer);
    }catch(err){
        console.log("Error: "+err.stack);
    }}
}

function interceptv8ContextCreate() {
        console.log("_ZN2v87Context3NewEPNS_7IsolateEPNS_22ExtensionConfigurationENS_10MaybeLocalINS_14ObjectTemplateEEENS5_INS_5ValueEEENS_33DeserializeInternalFieldsCallbackEPNS_14MicrotaskQueueE")
        const f = Module.getExportByName('libmmv8.so', '_ZN2v87Context3NewEPNS_7IsolateEPNS_22ExtensionConfigurationENS_10MaybeLocalINS_14ObjectTemplateEEENS5_INS_5ValueEEENS_33DeserializeInternalFieldsCallbackEPNS_14MicrotaskQueueE')
        var context = null;
        if(f == null){
            console.log("Function not found");
        }
        else{
        console.log("Function found: "+ f);
        Interceptor.attach(f, {
            onEnter: function (args) {
                console.log("v8::Context::New called");
            },
            onLeave: function (retval) {
                console.log("v8::Context::New returned");
                context = retval;
            }
        });
    }
}

function waitForModule(moduleName, callback) {
    var module = Process.findModuleByName(moduleName);
    if (module !== null) {
        console.log(moduleName + " module found");
        callback();
    } else {
        console.log(moduleName + " module not found, waiting...");
        setTimeout(function () {
            waitForModule(moduleName, callback);
        }, 10); // Check every 1 second
    }
}

// Wait for libmmv8.so to be loaded before initializing V8
// waitForModule('libmmv8.so', interceptV8Initialize);
// waitForModule('libmmv8.so', interceptV8Initialize);




function CreateIsolate() {
////////////////// 4.5 ////////////////////////
// if (v8Initialised && !haveIsolatePointer) {
    console.log("_ZN2v87Isolate8AllocateEv")
    const f45 = Module.getExportByName('libmmv8.so', '_ZN2v87Isolate8AllocateEv')
    if(f45 == null){
        console.log("Function not found");
    }
    console.log("Function found: " + f45);
    try{
        var isolatepointer = new NativeFunction(f45, 'pointer',[]);
        console.log("isolatepointer called");
        var isolatepointer = isolatepointer();
        // haveIsolatePointer = true;
        console.log("isolatepointer: "+ isolatepointer);
        // CreateCpuProfile&#40;isolatepointer&#41;;
        initialiseParam(184);
        
        
    }
    catch(err){
        console.log("Error: "+err.stack);
    }
// }
}


function getCurrentContext(isolatepointer){
    console.log("_ZN2v87Isolate17GetCurrentContextEv")
    const f = Module.getExportByName('libmmv8.so', '_ZN2v87Isolate17GetCurrentContextEv')
    if(f == null){
        console.log("Function not found");
    }
    else{
        console.log("Function found: "+ f);
        try{
            var getCurrentContext = new NativeFunction(f, 'pointer',['pointer']);
            console.log("getCurrentContext called");
            var context = getCurrentContext(isolatepointer);
            console.log("getCurrentContext: "+ context);
        }
        catch(err){
            console.log("Error: "+err.stack);
        }
    
    }
}

function getCurrent(){
    console.log("_ZN2v87Isolate10GetCurrentEv")
    const f = Module.getExportByName('libmmv8.so', '_ZN2v87Isolate10GetCurrentEv')
    if(f == null){
        console.log("Function not found");
    }
    else{
        console.log("Function found: "+ f);
        try{
            var getCurrent = new NativeFunction(f, 'pointer',[]);
            console.log("getCurrent called");
            var context = getCurrent();
            console.log("getCurrent: "+ context);
        }
        catch(err){
            console.log("Error: "+err.stack);
        }
    }
    
    
}


function initialiseParam(size){
    // console.log("_ZN2v87Isolate12CreateParamsC2Ev")
    const f = Module.getExportByName('libmmv8.so', '_ZN2v87Isolate12CreateParamsC2Ev')
    if(f == null){
        console.log("Function not found");
    }
    // console.log("Function found: "+ f);
    try{
        var createParams = new NativeFunction(f, 'void',['pointer']);
        // console.log("createParams called");
        // var createParamsSize = 
        // var paramsPointer = createParams();
        // console.log("createParams = " + paramsPointer);
        // console.log("param: "+ param);
        
        // const createParamsSize = 184; // Adjust this value if necessary
        // const createParamsSize = 184;
        const createParamsPtr = Memory.alloc(size);
        console.log("createParamsPtr: "+ createParamsPtr);
        // Call the constructor
        createParams(createParamsPtr);
        
        // createParamsPtr now points to the initialized CreateParams object
        console.log("CreateParams object pointer:", createParamsPtr);
        console.log("worked with size:", size);
        newIsolate(createParamsPtr);

    }
    catch(err){
        // console.log("Error: "+err.stack);
        console.log(size)
        console.log("Error: "+err);
    }
}


function CreateCpuProfile(isolatepointer) {
// if (haveIsolatePointer && !haveCpuProfilePointer){

    console.log("_ZN2v811CpuProfiler3NewEPNS_7IsolateENS_22CpuProfilingNamingModeENS_23CpuProfilingLoggingModeE")
    const f47 = Module.getExportByName('libmmv8.so', '_ZN2v811CpuProfiler3NewEPNS_7IsolateENS_22CpuProfilingNamingModeENS_23CpuProfilingLoggingModeE')
    if(f47 == null){
        console.log("Function not found");
    }
    console.log("Function found: " + f47);
    try{
        var cpuProfilepointer = new NativeFunction(f47, 'pointer',['pointer','int','int']);
        console.log("cpuProfilepointer called");
        var cpuProfilerpointer = cpuProfilepointer(isolatepointer, 1, 1); // verbosenames, // eagerlogging
        haveCpuProfilePointer = true;
        console.log("cpuProfilepointer: "+ cpuProfilerpointer);
    }
    catch(err){
        console.log("Error: "+err.stack);
    }   
// }
}


////////////////// 5 ////////////////////////

// console.log("_ZN2v88internal11CpuProfiler16GetProfilesCountEv")
// const f5 = Module.getExportByName('libmmv8.so', '_ZN2v88internal11CpuProfiler16GetProfilesCountEv')
// if(f5 == null){
//     console.log("Function not found");
// }
// console.log("Function found: "+ f5);
// try{
//     var getProfiles = new NativeFunction(f5, 'int',['pointer']);
//     var para = createString8('');
//     console.log("para: "+ para);
//     var s = getProfiles(para);
//     console.log("getProfiles called");
//     console.log("getProfiles: "+ s);
// }
// catch(err){
//     console.log("Error: "+err.stack);
// }

////////////////// 6 ////////////////////////
// console.log("_ZN2v88internal11CpuProfiler10GetProfileEi")
// const f6 = Module.getExportByName('libmmv8.so', '_ZN2v88internal11CpuProfiler10GetProfileEi')
// if (f6 == null) {
//     console.log("Function not found");
// }
// console.log("Function found: " + f6);
// try {
//     // var getProfile = new NativeFunction(f6, 'pointer', ['pointer', 'int']);
//     // var para = createString8('');
//     // var profilepointer = getProfile&#40;para, 1&#41;;
//     // console.log("getProfile called");
//     // console.log("getProfile: " + profilepointer);
//     console.log("_ZN2v88internal11CpuProfiler16GetProfilesCountEv")
//     const f5 = Module.getExportByName('libmmv8.so', '_ZN2v88internal11CpuProfiler16GetProfilesCountEv')
//     if (f5 == null) {
//         console.log("Function not found");
//     }
//     console.log("Function found: " + f5);
//     try {
//         var getProfiles = new NativeFunction(f5, 'int', ['pointer']);
//         // var para = createString8('');
//         // console.log("para: " + para);
//         var s = getProfiles(new NativePointer('0x75dc296ba0'));
//         console.log("getProfiles called");
//         console.log("getProfiles: " + s);
//     }
//     catch (err) {
//         console.log("Error: " + err);
//     }
// }
// catch (err) {
//     console.log("Error1" + err);
// }







// Java.perform(()=>{
//     console.log("Hooking startProfiling");
//     const activity = Java.use('android.app.Instrumentation');
//     var original = activity.startProfiling.overload();

//     activity.startProfiling.implementation = function(){
//         console.log("startProfiling called");
//         return original.call(this);
//     }
// })

// Java.perform(() => {
//     try {
//         Java.choose('android.app.Instrumentation', {
//             onMatch: function(instance) {
//                 console.log('Found instance of android.app.Instrumentation');
//                 instance.startProfiling();
//                 console.log('startProfiling called');

//                 // Stop profiling after 5 seconds
//                 setTimeout(() => {
//                     instance.stopProfiling();
//                     console.log('stopProfiling called');
//                 }, 5000);
//             },
//             onComplete: function() {}
//         });
//     } catch (err) {
//         console.log('Error: ' + err);
//     }
// });


// working with string parameter
// Java.perform(()=>{
//     const f = Module.getExportByName('libmmv8.so', '_ZN12v8_inspector19V8ProfilerAgentImpl5startEv')
//     if(f == null){
//         console.log("Function not found");
//         return;
//     }


//     var startProfiling = new NativeFunction(f, 'pointer',['pointer']);
//     console.log("startProfiling: "+startProfiling);
//     try{
//         // var param1 = Memory.allocUtf8String('Haseeb');

//         // var para2 = createString16('Haseeb');
//         // var somebool = 1;
//         var s = startProfiling(createString16('Haseeb'));
//         console.log("startProfiling called");
//         console.log("startProfiling2: "+ s);

//     }catch(err){
//         console.log("Error: "+err.stack);
//     }
// })


function createString16(jsString) {
    // Encode the JavaScript string as UTF-16
    var utf16String = Memory.allocUtf16String(jsString);
    var utf16Length = jsString.length;

    // Allocate memory for the String16 object
    // Assuming the size of String16 is the same as the size of a pointer (this might not be accurate)
    var string16Ptr = Memory.alloc(Process.pointerSize);

    // Write the pointer to the UTF-16 data and the length into the String16 object
    // This assumes the layout of String16 is [pointer to data, length]
    // You might need to adjust this based on the actual memory layout of String16
    Memory.writePointer(string16Ptr, utf16String);
    Memory.writeU64(string16Ptr.add(Process.pointerSize), utf16Length);

    return string16Ptr;
}

function createString8(jsString) {
    // Encode the JavaScript string as UTF-8
    var utf8String = Memory.allocUtf8String(jsString);
    var utf8Length = jsString.length;

    // Allocate memory for the String8 object
    // Assuming the size of String8 is the same as the size of a pointer (this might not be accurate)
    var string8Ptr = Memory.alloc(Process.pointerSize);

    // Write the pointer to the UTF-8 data and the length into the String8 object
    // This assumes the layout of String8 is [pointer to data, length]
    // You might need to adjust this based on the actual memory layout of String8
    Memory.writePointer(string8Ptr, utf8String);
    Memory.writeU64(string8Ptr.add(Process.pointerSize), utf8Length);

    return string8Ptr;
}







// Java.perform(() => {
//     const moduleName = 'libmmv8.so'; // Replace with the actual module name
//     const functionName = '_ZN12v8_inspector19V8ProfilerAgentImpl4stopEPNSt6__ndk110unique_ptrINS_8protocol8Profiler7ProfileENS1_14default_deleteIS5_EEEE'; // Mangled name
//     const functionAddress = Module.findExportByName(moduleName, functionName);

//     if (!functionAddress) {
//         console.error(`Function ${functionName} not found.`);
//         return;
//     }

//     console.log(`Found function at address: ${functionAddress}`);

//     // Assuming you have an instance of V8ProfilerAgentImpl
//     // const instance = /* code to obtain or create an instance of V8ProfilerAgentImpl */;

//     // Create a NativeFunction for the stop method
//     const stopProfiling = new NativeFunction(functionAddress, 'void', [ 'pointer', 'pointer']);

//     // Prepare a unique_ptr for the Profile object
//     const profilePtr = Memory.alloc(Process.pointerSize); // Allocate memory for the pointer
//     // Memory.writePointer(profilePtr); // Initialize the unique_ptr to null

//     console.log("Calling stop function...");
//     try {
//         stopProfiling(createString16('Haseeb'),profilePtr);
//         console.log("stopProfiling called");

//         // You might need to extract the Profile object from the unique_ptr here
//         // and handle the profiling data as needed.
//     } catch (err) {
//         console.error(`Error calling function: ${err.stack}`);
//     }
// });












// })