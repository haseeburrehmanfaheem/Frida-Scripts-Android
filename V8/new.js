const LIBNAME = "libmmv8.so";
const prefix = "_ZN2v87Isolate";




waitForModule(LIBNAME, hookAllExports);

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

function hookAllExports(moduleName, prefix) {
    console.log("Starting export enumeration for " + moduleName);
    var exports  = Module.enumerateExports(moduleName);
        exports.forEach(exp => {
            try{
                if (exp.type === "function" && (exp.name.toLowerCase().includes("_zn2v87isolate5enterev") /*|| exp.name.toLowerCase().includes("startprofiling")|| exp.name.toLowerCase().includes("profiler")  || exp.name.toLowerCase().includes("initialize")*/)) {
                console.log("Hooking", exp.name);
                Interceptor.attach(exp.address, {
                    onEnter: function (args) {
                        console.log(`Called ${exp.name}`);
                        try{
                            console.log('Arguments:', args[0]);
                        }catch(e){
                            console.log('Arguments:', args);
                        }
                        run_all(args[0])
                        // console.log('from:\n' +
                        // Thread.backtrace(this.context, Backtracer.ACCURATE)
                        // .map(DebugSymbol.fromAddress).join('\n') + '\n');
                        
                    // }
                    },
                    onLeave: function (retval) {
                        console.log(`Returned from ${exp.name}`);
                        console.log('Return value:', retval);


                        console.log('\n');
                        // run_all(retval)
                        // You can add logic here to inspect or modify the return value
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
        });
}

var done = false 
function run_all(isolate){
    if(done){
        return;
    }
    try{
    console.log("Isolate: ", isolate);
    const v8_Context_New = new NativeFunction(
        Module.getExportByName("libmmv8.so", "_ZN2v810NewContextEPNS_7IsolateEPNS_22ExtensionConfigurationENS_10MaybeLocalINS_14ObjectTemplateEEENS4_INS_5ValueEEEmNS_33DeserializeInternalFieldsCallbackEPNS_14MicrotaskQueueE"),
        'pointer', // Return type: Local<Context> is a pointer
        ['pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer'] // Argument types
    );
    
    // Assuming you have a valid `isolate` pointer:
    // const isolatePtr = ...;
    
    // For the optional arguments, you can pass `NULL` if you don't need to specify them:
    const context = v8_Context_New(
        isolate,   // Isolate*
        NULL,         // ExtensionConfiguration*
        NULL,         // MaybeLocal<ObjectTemplate>
        NULL,         // MaybeLocal<Value>
        NULL,         // DeserializeInternalFieldsCallback
        NULL          // MicrotaskQueue*
    );
    console.log("Context: ", context);
    // const uv_default_loop = new NativeFunction(Module.getExportByName(null, 'uv_default_loop'), 'pointer', []);
    // const uv_async_init = new NativeFunction(Module.getExportByName(null, 'uv_async_init'), 'int', ['pointer', 'pointer', 'pointer']);
    // const uv_async_send = new NativeFunction(Module.getExportByName(null, 'uv_async_send'), 'int', ['pointer']);
    // const uv_close = new NativeFunction(Module.getExportByName(null, 'uv_close'), 'void', ['pointer', 'pointer']);
    // const uv_unref = new NativeFunction(Module.getExportByName(null, 'uv_unref'), 'void', ['pointer']);
    
    // const v8_Isolate_GetCurrent = new NativeFunction(Module.getExportByName(null, '_ZN2v87Isolate10GetCurrentEv'), 'pointer', []);
    // const v8_Isolate_GetCurrentContext = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Isolate17GetCurrentContextEv'), 'pointer', ['pointer']);
    
    const v8_HandleScope_init = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v811HandleScopeC1EPNS_7IsolateE'), 'void', ['pointer', 'pointer']);
    const v8_HandleScope_finalize = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v811HandleScopeD1Ev'), 'void', ['pointer']);
    
    const v8_String_NewFromUtf8 = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi'), 'pointer', ['pointer', 'pointer', 'int', 'int']);
    
    const v8_Script_Compile = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86Script7CompileENS_5LocalINS_7ContextEEENS1_INS_6StringEEEPNS_12ScriptOriginE'), 'pointer', ['pointer', 'pointer', 'pointer']);
    const v8_Script_Run = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86Script3RunENS_5LocalINS_7ContextEEE'), 'pointer', ['pointer', 'pointer']);
    
    const NewStringType = {
      kNormal: 0,
      kInternalized: 1
    };
      
      const scope = Memory.alloc(24);
      v8_HandleScope_init(scope, isolate);
    //   const context = v8_Isolate_GetCurrentContext(isolate);
      

      const source = v8_String_NewFromUtf8(isolate, Memory.allocUtf8String('console.log("Hello from Frida");'), NewStringType.kNormal, -1);
    //   const script = v8_Script_Compile(context, source, NULL);
    //   const result = v8_Script_Run(script, context);
    //   console.log("Context: ", context);
    //   console.log("Scope: ", scope);
    //   console.log("Source: ", source);
    //   console.log("Script: ", script);
    //   console.log(result);
      const v8_String_Utf8Value = new NativeFunction(Module.getExportByName("libmmv8.so", "_ZN2v86String9Utf8ValueC1EPNS_7IsolateENS_5LocalINS_5ValueEEE"), 'void', ['pointer','pointer', 'pointer']);
    //   if(result){
    //         done = true;
    //   }
      // Function to get the UTF-8 value of a V8 Local<String>
        function getUtf8Value(isolate, v8String) {
            const utf8Value = Memory.alloc(1024); // Allocate memory for the string
            v8_String_Utf8Value(isolate, utf8Value, v8String); // Convert V8 string to C string
            return Memory.readUtf8String(utf8Value); // Return the UTF-8 string
        }
            
        var sourceutf8 = getUtf8Value(isolate, source);
        console.log("Source UTF8: ", sourceutf8);
        // var scriptutf8 = getUtf8Value(isolate, script);
        // console.log("Script UTF8: ", scriptutf8);


    //   setTimeout(()=>{
    //     console.log("_ZN2v86String9Utf8ValueC1EPNS_7IsolateENS_5LocalINS_5ValueEEE")
      
    //   const resultString = Memory.alloc(1024); // Allocate memory for the string
    //   v8_String_Utf8Value(isolate, resultString, result); // Convert V8 string to C string
    //   console.log("called successfully"); // Print the result
    //   console.log(Memory.readUtf8String(resultString)); // Print the result
    //   }, 5000)

    //   asd =====

      
    //   result_pointer = v8_String_Utf8Value(isolate, result);
    //   console.log(result_pointer);
    //   run('console.log("Hello from Frida");');
    }
    catch(e){
        console.log(e); 
    }
    }




