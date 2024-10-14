const LIBNAME = "libmmv8.so";
const prefix = "_ZN2v87Isolate";




waitForModule(LIBNAME, hookCreateParams);

function waitForModule(moduleName, callback) {
    var module = Process.findModuleByName(moduleName);
    if (module !== null) {
        console.log(moduleName + " module found");
        callback(moduleName, prefix);
    } else {
        console.log(moduleName + " module not found, waiting...");
        setTimeout(function () {
            waitForModule(moduleName, callback);
        }, 100); // Check every 0.1 second
    }
}



function hookCreateParams(){
    console.log("Hooking create params")
    var exports  = Module.enumerateExports("libmmv8.so");

    exports.forEach(exp=>{
        if(exp.type === "function" && exp.name.includes("_zn2v87isolate12createparamsd")){
            Interceptor.attach(exp.address, {
                
                onEnter: function(args){
                    params = args[0]
                    console.log("Called CreateParams")
                    args[0] = NULL
                    create_new_Isolate(params)

                },
                onLeave: function(retval){
                    console.log("Returned from CreateParams")
                }
            })
        }

    })
}


var isolate = null;

// console.log(getUtf8Value(ptr(0x7bdc807a90), ptr(0x7a9ce80510)))
// function getUtf8Value(isolate, v8String) {
//     console.log("isolate ", isolate)
//     const utf8Value = Memory.alloc(1024); // Allocate memory for the string
//     const v8_String_Utf8Value = new NativeFunction(Module.getExportByName("libmmv8.so", "_ZN2v86String9Utf8ValueC1EPNS_7IsolateENS_5LocalINS_5ValueEEE"), 'void', ['pointer','pointer', 'pointer']);

//     v8_String_Utf8Value(isolate, utf8Value, v8String); // Convert V8 string to C string
//     return Memory.readUtf8String(utf8Value); // Return the UTF-8 string
// }


function hookAllExports(moduleName, prefix) {
    // var isolate = null;
    console.log("Starting export enumeration for " + moduleName);
    var exports  = Module.enumerateExports(moduleName);
        exports.forEach(exp => {
            if(exp.type === "function" && (exp.name.includes("_ZN2v86Script7CompileENS_5LocalINS_7ContextEEENS1_INS_6StringEEEPNS_12ScriptOriginE"))){
                Interceptor.attach(exp.address, {
                    onEnter: function (args) {
                        // console.log(`Called compile`);
                        console.log('Arguments of compile string:', args[1]);
                    },
                    onLeave: function (retval) {
                        // console.log(`Returned from ${exp.name}`);
                        console.log('compile pointer :', retval);
                        console.log('\n');
                    }

                });
            }


            // if (exp.type === "function" && (exp.name.includes("_ZN2v86String9Utf8ValueC1EPNS_7IsolateENS_5LocalINS_5ValueEEE"))) {
            //     Interceptor.attach(exp.address, {
            //         onEnter: function (args) {
            //             console.log(`Called ${exp.name}`);
            //             this.isolate = args[0];
            //             this.save = args[1];
            //             console.log('Arguments:', args[1])
            //         },
            //         onLeave: function (retval) {
            //             // console.log("retval = ", retval)
            //             // console.log(`Returned from ${exp.name}`);
            //             // console.log('Return value:', Memory.readUtf8String(retval));
            //             // console.log('\n');

            //             const utf8ValuePtr = Memory.readPointer(retval);
            //             const cString = Memory.readUtf8String(utf8ValuePtr);
            //             console.log('Return value:', cString);
            //             console.log('\n');
            //         }
            //     });
            // }
            
            if (exp.type === "function" && (exp.name.includes("_ZN2v86Script3RunENS_5LocalINS_7ContextEEE"))) {
                Interceptor.attach(exp.address, {
                    onEnter: function (args) {
                        // console.log(`Called ${exp.name}`);
                        
                    },
                    onLeave: function (retval) {
                        if(isolate == null){
                            return
                        }
                        console.log("retval = ", retval)
                        // var sourceutf8 = getUtf8Value(isolate, retval);
                        
                        // console.log("Source UTF8: ", sourceutf8);
                        console.log(`Returned from ${exp.name}`);
                        console.log('Return value:', retval);
                        console.log('\n');
                        // You can add logic here to inspect or modify the return value
                    }
                });
            }
            try{
                if (exp.type === "function" && (exp.name.includes("_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi") /*|| exp.name.toLowerCase().includes("startprofiling")|| exp.name.toLowerCase().includes("profiler")  || exp.name.toLowerCase().includes("initialize")*/)) {
                if(isolate != null){
                    return 
                } 
                    console.log("Hooking", exp.name);
                Interceptor.attach(exp.address, {
                    onEnter: function (args) {
                        // console.log(`Called ${exp.name}`);
                        try{
                            isolate = args[0];
                            // console.log('isolate:', args[0]);
                            console.log('Arguments of V8 String:', Memory.readUtf8String(args[1]));
                        }catch(e){
                            // console.log('Arguments:', args);
                        }
                        // args[1] = Memory.allocUtf8String("console.log('Hello from Frida');");
                        
                    // }
                    },
                    onLeave: function (retval) {
                        // console.log(`Returned from ${exp.name}`);
                        console.log('V8 String Pointer: ', retval);
                        // console.log('\n');
                        // You can add logic here to inspect or modify the return value
                    }
                });

                
            }
        } catch (e) {
            console.log(e);
        }
        
        });
}


// 0x7bd672ba90
// ===

// var context = 0x7a9ce3c2d0
// var isolate = ptr(0x7bd672ba90)

// run_with_isolate(isolate)



function run_with_isolate(isolate){
    console.log("_ZN2v87Isolate5EnterEv")
    const v8_Isolate_Enter = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Isolate5EnterEv'), 'void', ['pointer']);
    
    v8_Isolate_Enter(isolate);
    console.log("_ZN2v87Isolate17GetCurrentContextEv")
    const v8_Isolate_GetCurrentContext = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Isolate17GetCurrentContextEv'), 'pointer', ['pointer']);
    var context = v8_Isolate_GetCurrentContext(isolate);
    console.log("Context: ", context);
}

function run_all(isolate){
    console.log()
    // const uv_default_loop = new NativeFunction(Module.getExportByName(null, 'uv_default_loop'), 'pointer', []);
    // const uv_async_init = new NativeFunction(Module.getExportByName(null, 'uv_async_init'), 'int', ['pointer', 'pointer', 'pointer']);
    // const uv_async_send = new NativeFunction(Module.getExportByName(null, 'uv_async_send'), 'int', ['pointer']);
    // const uv_close = new NativeFunction(Module.getExportByName(null, 'uv_close'), 'void', ['pointer', 'pointer']);
    // const uv_unref = new NativeFunction(Module.getExportByName(null, 'uv_unref'), 'void', ['pointer']);
    
    // const v8_Isolate_GetCurrent = new NativeFunction(Module.getExportByName(null, '_ZN2v87Isolate10GetCurrentEv'), 'pointer', []);
    const v8_Isolate_GetCurrentContext = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Isolate17GetCurrentContextEv'), 'pointer', ['pointer']);
    ;
    const v8_HandleScope_init = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v811HandleScopeC1EPNS_7IsolateE'), 'void', ['pointer', 'pointer']);
    const v8_HandleScope_finalize = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v811HandleScopeD1Ev'), 'void', ['pointer']);
    
    const v8_String_NewFromUtf8 = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi'), 'pointer', ['pointer', 'pointer', 'int', 'int']);
    
    const v8_Script_Compile = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86Script7CompileENS_5LocalINS_7ContextEEENS1_INS_6StringEEEPNS_12ScriptOriginE'), 'pointer', ['pointer', 'pointer', 'pointer']);
    const v8_Script_Run = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86Script3RunENS_5LocalINS_7ContextEEE'), 'pointer', ['pointer', 'pointer']);
    
    const NewStringType = {
      kNormal: 0,
      kInternalized: 1
    };
    //   const isolate = v8_Isolate_GetCurrent();
      const scope = Memory.alloc(24);
      v8_HandleScope_init(scope, isolate);
      console.log("Scope: ", scope);
      const context = v8_Isolate_GetCurrentContext(isolate);
      const source = v8_String_NewFromUtf8(isolate, Memory.allocUtf8String(item), NewStringType.kNormal, -1);
      const script = v8_Script_Compile(context, source, NULL);
      const result = v8_Script_Run(script, context);
      
      run('console.log("Hello from Frida");');
      console.log("Result: ", result);
    }


function create_new_Isolate(createparams){
    const v8_Isolate_New = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Isolate3NewEPNS_22CreateParamsE'), 'pointer', ['pointer']);
    const isolate = v8_Isolate_New(createparams);
    console.log("Isolate: ", isolate);
}