// 0x7a7ce53a90




run_all(0x754dda3a90);

function run_all(pointer){
    
    const v8_Isolate_Enter = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Isolate5EnterEv'), 'void', ['pointer']);
    const v8_Isolate_GetCurrent = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Isolate10GetCurrentEv'), 'pointer', []);
    const v8_HandleScope_Constructor = new NativeFunction(
        Module.getExportByName("libmmv8.so", '_ZN2v811HandleScopeC1EPNS_7IsolateE'),
        'void',
        ['pointer', 'pointer']
    );
    const v8_current_context = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Isolate17GetCurrentContextEv'), 'pointer', ['pointer']);
    const v8_newContext = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Context3NewEPNS_7IsolateEPNS_22ExtensionConfigurationENS_10MaybeLocalINS_14ObjectTemplateEEENS5_INS_5ValueEEENS_33DeserializeInternalFieldsCallbackEPNS_14MicrotaskQueueE'), 'pointer', [ 'pointer', 'pointer', 'pointer', 'pointer', 'pointer', 'pointer']);
    const v8_Context_enter = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v87Context5EnterEv'), 'void', ['pointer']);
    const v8_String_NewFromUtf8 = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi'), 'pointer', ['pointer', 'pointer', 'int', 'int']);
    
    const v8_Script_Compile = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86Script7CompileENS_5LocalINS_7ContextEEENS1_INS_6StringEEEPNS_12ScriptOriginE'), 'pointer', ['pointer', 'pointer', 'pointer']);
    
    const v8_profiler_new = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v811CpuProfiler3NewEPNS_7IsolateENS_22CpuProfilingNamingModeENS_23CpuProfilingLoggingModeE'), 'pointer', ['pointer', 'int', 'int']);
    
    const v8_profiler_startprofiling = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v811CpuProfiler14StartProfilingENS_5LocalINS_6StringEEEb'), 'void', ['pointer', 'pointer', 'bool']);
    const v8_profiler_stopprofiling = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v811CpuProfiler13StopProfilingENS_5LocalINS_6StringEEE'), 'void', ['pointer', 'pointer']);
    
    const isolateAddress = ptr(pointer);
    v8_Isolate_Enter(isolateAddress);
    console.log("Entering Isolate: ", isolateAddress);
    
    const isolate_new = v8_Isolate_GetCurrent();
    console.log("Current Isolate: ", isolate_new);
    // console.log("Isolate Address: ", isolateAddress)


    const handleScopeSize = 24; 
    const handleScopeAddress = Memory.alloc(handleScopeSize);
    
    
        v8_HandleScope_Constructor(handleScopeAddress, isolateAddress);
        
        console.log("Handle Scope Called = ", handleScopeAddress);

        const curr_context = v8_current_context(isolateAddress);
        console.log("Current Context: ", curr_context); // returns null 
        if(curr_context.equals(ptr(0x0))){
        console.log("Creating new context");
        const context_new = v8_newContext(isolateAddress, ptr(0x0), ptr(0x0), ptr(0x0), ptr(0x0), ptr(0x0));
        console.log("New Context: ", context_new);
        v8_Context_enter(context_new);
        }

    
    
    

    
    

    const curr_context2 = v8_current_context(isolateAddress);
    // console.log("Current Context: ", curr_context2);

    const curr_context3 = v8_current_context(isolateAddress);
    // console.log("Current Context: ", curr_context3);


    const profiler = v8_profiler_new(isolateAddress, 1, 1);
    console.log("Initializing Profiler: ", profiler);


    const string = v8_String_NewFromUtf8(isolateAddress, Memory.allocUtf8String("profiler1"), 0, -1);
    
    const startprofiling = v8_profiler_startprofiling(profiler, string, 1);
    console.log("Started profiling");

        setTimeout(function(){
            const profile = v8_profiler_stopprofiling(profiler, string);
            console.log("Stopped profiling = " + profile);
        }, 10000);
    

    }