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
    console.log("[executeScript]Result pointer : ", result);
    return resultToString(result, isolateAddress);
}

function stopProfiler(profiler, string){
    Interceptor.attach(v8_Isolate_GetCurrent, {
        onEnter: function(args){
            console.log("[stopProfiler]::Entered");
            const cpuProfiler = v8_profiler_stopprofiling(profiler, string);
            console.log("[stopProfiler]::Stopped profiling with result: ", cpuProfiler);
        }
    });
}


function main(){
    var executed = false
    Interceptor.attach(v8_Isolate_GetCurrent, {
        onEnter: function(args){
            if(executed == true) return
            console.log("[v8_Isolate_GetCurrent]::Entered");
            const isolateAddress = v8_Isolate_GetCurrent();
            const curr_context = getCurrentContext(isolateAddress);
            console.log("[main]::Current Isolate: ", isolateAddress);
            console.log("[main]::Initializing Profiler: ", profiler);
            const string = stringToV8String(isolateAddress2, "testing");
            // v8_profiler_startprofiling(profiler, string, 0);
            const cpuProfile = v8_profiler_stopprofiling(profiler, string);
            // v8_profiler_startprofiling(profiler, stringToV8String(isolateAddress2, "testing1"), 0);
            console.log("[main]::stopped profiling");
            console.log("[main]::Stopped profiling with result: ", cpuProfile);
        },
        onLeave: function(retval){
            
        }
    });
}


main();