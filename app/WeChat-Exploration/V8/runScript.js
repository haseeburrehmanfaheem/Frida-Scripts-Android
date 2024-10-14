const LIBNAME = "libmmv8.so";
const prefix = "_ZN2v87Isolate";
var have_isolate = false;

// _zn2v87isolate12createparamsd

var nameCheck = ["_ZN2v86Script3RunENS_5LocalINS_7ContextEEE",/*_ZN2v82V810InitializeEi", "_ZN2v87Isolate10GetCurrentEv" ,"_ZN2v86Script3RunENS_5LocalINS_7ContextEEE", "_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi"*/]
var nameCheck2 = ["_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi", "_ZN2v86Script", "_ZN2v811HandleScope", "_ZN2v87Isolate", "2v82V8", "_ZN2v87Context3NewEPNS_7IsolateEPNS_22ExtensionConfigurationENS_10MaybeLocalINS_14ObjectTemplateEEENS5_INS_5ValueEEENS_33DeserializeInternalFieldsCallbackEPNS_14MicrotaskQueueE","ZN2v87Context"]
var nameCheck3 = ["_ZN2v87Isolate10GetCurrentEv"]
var nameCheck4 = ["_ZN2v86Script","_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi"]
waitForModule(LIBNAME, hookCreateParams);

function waitForModule(moduleName, callback) {
    var module = Process.findModuleByName(moduleName);
    if (module !== null) {
        console.log(moduleName + " module found");
        // callback(moduleName, prefix);
        callback(nameCheck4)
    } else {
        console.log(moduleName + " module not found, waiting...");
        setTimeout(function () {
            waitForModule(moduleName, callback);
        }, 100); // Check every 0.1 second
    }
}


function hookCreateParams(nameCheck){
    // console.log("Hooking create params")
    var exports  = Module.enumerateExports("libmmv8.so");

    exports.forEach(exp=>{
        if(exp.type === "function" && nameCheck.some(name => exp.name.toLowerCase().includes(name.toLowerCase()))){
            console.log("Hooking", exp.name);
            Interceptor.attach(exp.address, {
                
                onEnter: function(args){
                    var params = args[0]
                    console.log(`Called ${exp.name}`);

                    if (exp.name.includes("_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi")){ 
                        var str = Memory.readCString(args[1]);
                        console.log("Isolate = ", args[0]);
                        console.log("Script string: ", str.substring(0, 50));

                    }

                    

                    // if(exp.name.includes("_ZN2v811HandleScope")){
                    //     console.log("Handle scope arguments");
                    //     console.log("args[0] = " , args[0] )
                    //     console.log("args[1] = " , args[1] )
                    //     console.log("\n");
                    // }


                    // if(exp.name.includes("_ZN2v87Context3NewEPNS_7IsolateEPNS_22ExtensionConfigurationENS_10MaybeLocalINS_14ObjectTemplateEEENS5_INS_5ValueEEENS_33DeserializeInternalFieldsCallbackEPNS_14MicrotaskQueueE")){
                    //     console.log("Lookie here")
                    //     console.log("args[0] = " , args[0] )
                    //     console.log("args[1] = " , args[1] )
                    //     console.log("args[2] = " , args[2] )
                    //     console.log("args[3] = " , args[3] )
                    //     console.log("args[4] = " , args[4] )
                    //     console.log("args[5] = " , args[5] )

                           
                    
                    // }
                    // var trace = Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress);
                    // for (var j in trace){
                    //     console.log(trace[j].name || trace[j].address);
                    // }
                
                    // args[0] = NULL
                    // if(!have_isolate){
                    // create_new_Isolate(params)
                    // }

                    // if(exp.name.includes("Dispose")){
                    //     console.log("disposing isolate")
                    //     args[0] = ptr(0x0)
                    // }

                },
                onLeave: function(retval){
                    if((exp.name.includes("Isolate")) && (exp.name.includes("Exit") || exp.name.includes("Enter") || exp.name.includes("GetCurrent"))){
                        console.log(`Called ${exp.name}`);
                        console.log("isolate = " , retval )
                    }
                    // if(exp.name.includes("GetCurrentContextEv")){
                    //     console.log("context = " , retval )
                    // }

                    // if(exp.name.includes("_ZN2v87Context3NewEPNS_7IsolateEPNS_22ExtensionConfigurationENS_10MaybeLocalINS_14ObjectTemplateEEENS5_INS_5ValueEEENS_33DeserializeInternalFieldsCallbackEPNS_14MicrotaskQueueE")){
                    //     console.log("Lookie here")
                    //     console.log("ret value = " , retval )

                           
                    
                    // }
                    // console.log(`Returned from ${exp.name}`);
                    // console.log('Return value:', retval);
                    // console.log('\n');
                }
            })
        }

    })
}




function hookAllExports(moduleName, prefix) {
    console.log("Starting export enumeration for " + moduleName);
    var exports  = Module.enumerateExports(moduleName);
        exports.forEach(exp => {
            try{
                if (exp.type === "function" && ( exp.name.toLowerCase().includes("exit") &&  exp.name.toLowerCase().includes("isolate")  /* || exp.name.toLowerCase().includes("_zn2v87isolate12createparamsd")|| exp.name.toLowerCase().includes("startprofiling")|| exp.name.toLowerCase().includes("profiler")  || exp.name.toLowerCase().includes("initialize")*/)) {
                console.log("Hooking", exp.name);
                Interceptor.attach(exp.address, {
                    onEnter: function (args) {
                        console.log(`Called ${exp.name}`);
                        var tmp = args[0];
                        try{
                            console.log('Arguments(isolate):', args[0]);
                            
                            args[0] = null;
                        }catch(e){
                            // console.log("error = ",e);
                            // console.log(e.stack);
                        }

                        try{
                            run_all(tmp)
                        }
                        catch(e){
                            console.log("error = ",e);
                            console.log(e.stack);
                        }
                        
                        // console.log('from:\n' +
                        // Thread.backtrace(this.context, Backtracer.ACCURATE)
                        // .map(DebugSymbol.fromAddress).join('\n') + '\n');
                        
                    // }
                    },
                    onLeave: function (retval) {
                        console.log(`Returned from ${exp.name}`);
                        console.log('Return value:', retval);
                        console.log('\n');
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
        });
}








function run_all(isolate){
// const uv_default_loop = new NativeFunction(Module.getExportByName(null, 'uv_default_loop'), 'pointer', []);
// const uv_async_init = new NativeFunction(Module.getExportByName(null, 'uv_async_init'), 'int', ['pointer', 'pointer', 'pointer']);
// const uv_async_send = new NativeFunction(Module.getExportByName(null, 'uv_async_send'), 'int', ['pointer']);
// const uv_close = new NativeFunction(Module.getExportByName(null, 'uv_close'), 'void', ['pointer', 'pointer']);
// const uv_unref = new NativeFunction(Module.getExportByName(null, 'uv_unref'), 'void', ['pointer']);


// v8::Context::New(v8::Isolate*, v8::ExtensionConfiguration*, v8::MaybeLocal<v8::ObjectTemplate>, v8::MaybeLocal<v8::Value>, v8::DeserializeInternalFieldsCallback, v8::MicrotaskQueue*)
const v8_Isolate_GetCurrent = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Isolate10GetCurrentEv'), 'pointer', []);

const v8_newContext = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Context3NewEPNS_7IsolateEPNS_22ExtensionConfigurationENS_10MaybeLocalINS_14ObjectTemplateEEENS5_INS_5ValueEEENS_33DeserializeInternalFieldsCallbackEPNS_14MicrotaskQueueE'), 'pointer', [ 'pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer']);

const v8_Isolate_GetCurrentContext = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Isolate17GetCurrentContextEv'), 'pointer', ['pointer']);

const v8_HandleScope_init = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v811HandleScopeC1EPNS_7IsolateE'), 'void', ['pointer', 'pointer']);
const v8_HandleScope_finalize = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v811HandleScopeD1Ev'), 'void', ['pointer']);

const v8_String_NewFromUtf8 = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi'), 'pointer', ['pointer', 'pointer', 'int', 'int']);

const v8_Script_Compile = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86Script7CompileENS_5LocalINS_7ContextEEENS1_INS_6StringEEEPNS_12ScriptOriginE'), 'pointer', ['pointer', 'pointer', 'pointer']);
const v8_Script_Run = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86Script3RunENS_5LocalINS_7ContextEEE'), 'pointer', ['pointer', 'pointer']);

const NewStringType = {
  kNormal: 0,
  kInternalized: 1
};
  const isolate_new = v8_Isolate_GetCurrent();
  console.log("Isolate: ", isolate_new);
  const context_new = v8_newContext(isolate_new, NULL, NULL, NULL, NULL, NULL);
  console.log("Context: ", context_new);
//   const scope = Memory.alloc(24);
//   v8_HandleScope_init(scope, isolate_new);
//   const context = v8_Isolate_GetCurrentContext(isolate_new);
//   console.log("Context: ", context);
//   const source = v8_String_NewFromUtf8(isolate_new, Memory.allocUtf8String("console.log(\"Hello from Frida\");"), NewStringType.kNormal, -1);
//   const script = v8_Script_Compile(context, source, NULL);
//   const result = v8_Script_Run(script, context);
}




function create_new_Isolate(createparams){  
    have_isolate = true;
    const v8_Isolate_New = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Isolate3NewERKNS0_12CreateParamsE'), 'pointer', ['pointer']);
    const isolate = v8_Isolate_New(createparams);
    console.log("Isolate: ", isolate);
    have_isolate = true;
}