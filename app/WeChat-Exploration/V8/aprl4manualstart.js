const LIBNAME = "libmmv8.so";


const v8_Isolate_Enter = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v87Isolate5EnterEv'), 'void', ['pointer']);
const v8_Isolate_GetCurrent = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v87Isolate10GetCurrentEv'), 'pointer', []);
const v8_HandleScope_Constructor = new NativeFunction(
    Module.getExportByName(LIBNAME, '_ZN2v811HandleScopeC1EPNS_7IsolateE'),
    'void',
    ['pointer', 'pointer']
);
const v8_current_context = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v87Isolate17GetCurrentContextEv'), 'pointer', ['pointer']);
const v8_newContext = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v87Context3NewEPNS_7IsolateEPNS_22ExtensionConfigurationENS_10MaybeLocalINS_14ObjectTemplateEEENS5_INS_5ValueEEENS_33DeserializeInternalFieldsCallbackEPNS_14MicrotaskQueueE'), 'pointer', [ 'pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer']);
const v8_Context_enter = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v87Context5EnterEv'), 'void', ['pointer']);
const v8_String_NewFromUtf8 = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi'), 'pointer', ['pointer', 'pointer', 'int', 'int']);

const v8_Script_Compile = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v86Script7CompileENS_5LocalINS_7ContextEEENS1_INS_6StringEEEPNS_12ScriptOriginE'), 'pointer', ['pointer', 'pointer', 'pointer']);
const v8_Script_Run = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v86Script3RunENS_5LocalINS_7ContextEEE'), 'pointer', ['pointer', 'pointer']);
const v8_profiler_new = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v811CpuProfiler3NewEPNS_7IsolateENS_22CpuProfilingNamingModeENS_23CpuProfilingLoggingModeE'), 'pointer', ['pointer', 'int', 'int']);
    
const v8_profiler_startprofiling = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v811CpuProfiler14StartProfilingENS_5LocalINS_6StringEEEb'), 'void', ['pointer', 'pointer', 'bool']);
const v8_profiler_stopprofiling = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v811CpuProfiler13StopProfilingENS_5LocalINS_6StringEEE'), 'void', ['pointer', 'pointer']);
const v8_profiler_dispose = new NativeFunction(Module.getExportByName(LIBNAME, '_ZN2v811CpuProfiler7DisposeEv'), 'void', ['pointer']);


function getCurrentContext(isolateAddress){
    const curr_context = v8_current_context(isolateAddress);

    if(curr_context.equals(ptr(0x0))){
        console.log("[getCurrentContext]::Current Context is null");
    }
    console.log("Current Context: ", curr_context); // returns null 
    return curr_context;
}



function resultToString(result, isolateAddress){
    const v8_String_Utf8Value_Constructor = new NativeFunction(
        Module.getExportByName(LIBNAME, '_ZN2v86String9Utf8ValueC1EPNS_7IsolateENS_5LocalINS_5ValueEEE'),
        'void',
        ['pointer', 'pointer', 'pointer']
    );
    const utf8ValueSize = 200; 
    const utf8ValueAddress = Memory.alloc(utf8ValueSize);
    v8_String_Utf8Value_Constructor(utf8ValueAddress, isolateAddress, result); // result is what we get back by running the script:run function
    const utf8String = Memory.readUtf8String(Memory.readPointer(utf8ValueAddress));
    console.log("[resultToString]::UTF-8 String: ", utf8String);
}

function stringToV8String(isolateAddress, string){
    return v8_String_NewFromUtf8(isolateAddress, Memory.allocUtf8String(string), 0, -1);
}

function executeScript(scriptString, curr_context, isolateAddress) {
    console.log("[executeScript]::Executing script: ", scriptString);
    const source = v8_String_NewFromUtf8(isolateAddress, Memory.allocUtf8String(scriptString), 0, -1);
    const script = v8_Script_Compile(curr_context, source, ptr(0x0));
    console.log("[executeScript]::Compile called with Script: ", script);
    const result = v8_Script_Run(script, curr_context);
    console.log("[executeScript]::Result pointer : ", result);
    return resultToString(result, isolateAddress);
}

function stopProfiler(profiler, string){
    var executed = false
    Interceptor.attach(v8_Isolate_GetCurrent, {
        onEnter: function(args){
            if(executed == true) return
            executed = true
            console.log("[stopProfiler]::Entered");
            const isolateAddress2 = v8_Isolate_GetCurrent();
            console.log("[stopProfiler]::Current Isolate: ", isolateAddress2);
            const string2 = stringToV8String(isolateAddress2, "");
            const cpuProfiler = v8_profiler_stopprofiling(profiler, string2);
            v8_profiler_dispose(profiler);
            console.log("[stopProfiler]::Stopped profiling with result: ", cpuProfiler);
        }
    });
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(){
    var executed = false
    var executed1 = false
    if(executed == true) return
            executed = true
             // Wait for 30 seconds

             try{
            console.log("[v8_Isolate_GetCurrent]::Entered");
            const isolateAddress1 = v8_Isolate_GetCurrent();
            // await delay(5000);
            console.log("[main]::Current Isolate: ", isolateAddress1);
            var isolateAddress2 = ptr(0x74ce19ea90);

            // v8_Isolate_Enter(isolateAddress2);
            console.log("[main]::Current Isolate: ", v8_Isolate_GetCurrent());
            
            
            const profiler = ptr(0x7292fc0050)
            
                // console.log("[main]::Error: ", e);
            
            // console.log("[main]::call made to new")
            executed = true;
            console.log("[main]::Initializing Profiler: ", profiler);
            const string = ptr(0x7392e13540)
                try{
            v8_profiler_startprofiling(profiler, string, 1);
            console.log("[main]::Started profiling");
                }catch(e){
                    console.log("[main]::Error: ", e);
                }

            // Interceptor.attach(v8_Isolate_GetCurrent, {
            //     onEnter: function(args){
            //         if(executed1 == true) return
            //         console.log("[v8_Isolate_GetCurrent]::Entered");
            //         const isolateAddress2 = v8_Isolate_GetCurrent();
            //         // const isolateAddress = ptr(args[0]);
            //         // console.log("[main]::Current Isolate: ", isolateAddress2);
            //         console.log("[main]::Current Isolate: ", isolateAddress2);
            //         // const profiler = v8_profiler_new(isolateAddress2, 1, 1);
            //         executed1 = true;
            //         console.log("[main]::Initialised Profiler: ", profiler);
            //         const string = stringToV8String(isolateAddress2, "testing");
            //         console.log("string converted : " , string);
                    

            //         // const cpuProfile = v8_profiler_stopprofiling(profiler, string);
            //         // v8_profiler_startprofiling(profiler, stringToV8String(isolateAddress2, "testing1"), 0);
            //         // console.log("[main]::stopped profiling");
            //         // console.log("[main]::Stopped profiling with result: ", cpuProfile);
            //         // console.log("[stopProfiler]::Entered");
            //         // setTimeout(()=>{
            //         //     console.log("[stopProfiler]::Entered");
            //         //     // const string2 = stringToV8String(isolateAddress2, "testing");
            //         //     const cpuProfile = v8_profiler_stopprofiling(profiler, string);
            //         //     // const cpuProfile1 = v8_profiler_stopprofiling(profiler, stringToV8String(isolateAddress2, "testing1"));
            //         //     console.log("[main]::Stopped profiling with result: ", cpuProfile);
            //         //     // console.log("[main]::Stopped profiling with result: ", cpuProfile1);
            //         // }, 30000);
                    
            //         // return;
            //     },
            //     onLeave: function(retval){
                    
            //     }
            // });
            
            // const string = stringToV8String(isolateAddress2, "profile1");
            // console.log("[main]::string converted : " , string);
            // v8_profiler_ startprofiling(profiler, string, 1);
            // console.log("[main]::Started profiling");
            // const string2 = stringToV8String(isolateAddress2, "");
            
            // const cpuProfile = v8_profiler_stopprofiling(profiler, string2);
            // console.log("[main]::Stopped profiling");
            // console.log("[main]::Stopped profiling with result: ", cpuProfile);
            // console.log("[main]::Current Isolate: ", isolateAddress2);
            // setTimeout(()=>{
            //     console.log("[main]::waiting...");
            //     stopProfiler(profiler, string);
            // }, 30000);
            console.log("[main]::going ahead...");
             }catch(e){
                 console.log("[main]::Error: ", e);
             }
}


main();