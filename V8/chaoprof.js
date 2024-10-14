```javascript

    // fetch v8::IsolateGetCurrent method

    const v8IsolateGetCurrent_ptr = Module.findExportByName(`lib${v8Module}.so`, '_ZN2v87Isolate10GetCurrentEv');

 

    // grab current isolate first

    const v8IsolateGetCurrent = new NativeFunction(v8IsolateGetCurrent_ptr, 'pointer', []);

    const isolate_ptr = v8IsolateGetCurrent();

    console.log(`v8::Isolate* isolate @ ${isolate_ptr}`);

 

    // wake up & stop profiling

    const v8CpuProfilerStopProfiling_ptr = Module.findExportByName(`lib${v8Module}.so`, '_ZN2v811CpuProfiler13StopProfilingENS_5LocalINS_6StringEEE');

    console.log(`v8::CpuProfiler::StopProfiling @ ${v8CpuProfilerStopProfiling_ptr}`);

    const v8CpuProfilerStopProfiling = new NativeFunction(v8CpuProfilerStopProfiling_ptr, 'pointer', ['pointer', 'pointer']);

 

    const v8StringNewFromUtf8_ptr = Module.findExportByName(`lib${v8Module}.so`, '_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi');

    const v8StringNewFromUtf8 = new NativeFunction(v8StringNewFromUtf8_ptr, 'pointer', ['pointer', 'pointer', 'int', 'int']);

    const profileTitleName = Memory.allocUtf8String(`sample`);

 

    const v8StringMaybeLocal_profileTitleName_ptr = v8StringNewFromUtf8(isolate_ptr, profileTitleName, 0, -1);

    console.log(`v8::MaybeLocal<v8::String> title @ ${v8StringMaybeLocal_profileTitleName_ptr}`);

 

    // got it!

    const profile_ptr = v8CpuProfilerStopProfiling(profiler_ptr_global, v8StringMaybeLocal_profileTitleName_ptr);

console.log(`v8::CpuProfile profile @ ${profile_ptr}`);

```