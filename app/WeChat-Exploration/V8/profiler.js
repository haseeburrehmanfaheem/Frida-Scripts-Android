// Wechat
// const LIBNAME = "libmmv8.so";

// baidu 
const LIBNAME = "libzeusv8.so";


const v8_Isolate_Enter = new NativeFunction(
  Module.getExportByName(LIBNAME, "_ZN2v87Isolate5EnterEv"),
  "void",
  ["pointer"]
);
const v8_Isolate_GetCurrent = new NativeFunction(
  Module.getExportByName(LIBNAME, "_ZN2v87Isolate10GetCurrentEv"),
  "pointer",
  []
);
const v8_HandleScope_Constructor = new NativeFunction(
  Module.getExportByName(LIBNAME, "_ZN2v811HandleScopeC1EPNS_7IsolateE"),
  "void",
  ["pointer", "pointer"]
);
const v8_current_context = new NativeFunction(
  Module.getExportByName(LIBNAME, "_ZN2v87Isolate17GetCurrentContextEv"),
  "pointer",
  ["pointer"]
);
const v8_newContext = new NativeFunction(
  Module.getExportByName(
    LIBNAME,
    "_ZN2v87Context3NewEPNS_7IsolateEPNS_22ExtensionConfigurationENS_10MaybeLocalINS_14ObjectTemplateEEENS5_INS_5ValueEEENS_33DeserializeInternalFieldsCallbackEPNS_14MicrotaskQueueE"
  ),
  "pointer",
  ["pointer", "pointer", "pointer", "pointer", "pointer", "pointer"]
);
const v8_Context_enter = new NativeFunction(
  Module.getExportByName(LIBNAME, "_ZN2v87Context5EnterEv"),
  "void",
  ["pointer"]
);
const v8_String_NewFromUtf8 = new NativeFunction(
  Module.getExportByName(
    LIBNAME,
    "_ZN2v86String11NewFromUtf8EPNS_7IsolateEPKcNS_13NewStringTypeEi"
  ),
  "pointer",
  ["pointer", "pointer", "int", "int"]
);

const v8_Script_Compile = new NativeFunction(
  Module.getExportByName(
    LIBNAME,
    "_ZN2v86Script7CompileENS_5LocalINS_7ContextEEENS1_INS_6StringEEEPNS_12ScriptOriginE"
  ),
  "pointer",
  ["pointer", "pointer", "pointer"]
);
const v8_Script_Run = new NativeFunction(
  Module.getExportByName(LIBNAME, "_ZN2v86Script3RunENS_5LocalINS_7ContextEEE"),
  "pointer",
  ["pointer", "pointer"]
);
const v8_profiler_new = new NativeFunction(
  Module.getExportByName(
    LIBNAME,
    "_ZN2v811CpuProfiler3NewEPNS_7IsolateENS_22CpuProfilingNamingModeENS_23CpuProfilingLoggingModeE"
  ),
  "pointer",
  ["pointer", "int", "int"]
);

const v8_profiler_startprofiling = new NativeFunction(
  Module.getExportByName(
    LIBNAME,
    "_ZN2v811CpuProfiler14StartProfilingENS_5LocalINS_6StringEEEb"
  ),
  "void",
  ["pointer", "pointer", "bool"]
);
const v8_profiler_stopprofiling = new NativeFunction(
  Module.getExportByName(
    LIBNAME,
    "_ZN2v811CpuProfiler13StopProfilingENS_5LocalINS_6StringEEE"
  ),
  "pointer",
  ["pointer", "pointer"]
);

const v8_profiler_startprofiling2 = new NativeFunction( Module.getExportByName(LIBNAME, "_ZN2v811CpuProfiler14StartProfilingENS_5LocalINS_6StringEEENS_16CpuProfilingModeEbj"), "void", ["pointer","pointer", "int", "bool", "uint"]);

const v8_profilenode_getscriptresourcename = new NativeFunction(Module.getExportByName(LIBNAME, "_ZNK2v814CpuProfileNode24GetScriptResourceNameStrEv"), "pointer", ["pointer"]);

const v8_profilenode_getfunctionnamestr = new NativeFunction(Module.getExportByName(LIBNAME, "_ZNK2v814CpuProfileNode18GetFunctionNameStrEv"), "pointer", ["pointer"]);

const v8_profilenode_getchild = new NativeFunction(Module.getExportByName(LIBNAME, "_ZNK2v814CpuProfileNode8GetChildEi"), "pointer", ["pointer","int"]);

const v8_profilenode_getchildrencount = new NativeFunction(Module.getExportByName(LIBNAME, "_ZNK2v814CpuProfileNode16GetChildrenCountEv"), "int", ["pointer"]);

// const v8_profilenode_

const v8_profile_gettopdownroot = new NativeFunction(Module.getExportByName(LIBNAME, "_ZNK2v810CpuProfile14GetTopDownRootEv"), "pointer", ["pointer"]);

const v8_profile_getsample = new NativeFunction(Module.getExportByName(LIBNAME, "_ZNK2v810CpuProfile9GetSampleEi"), "pointer", ["pointer", "int"]);

const v8_profile_getcount = new NativeFunction(Module.getExportByName(LIBNAME, "_ZNK2v810CpuProfile15GetSamplesCountEv"), "int", ["pointer"]);

const v8_profilenode_getlinenumber = new NativeFunction(Module.getExportByName(LIBNAME, "_ZNK2v814CpuProfileNode13GetLineNumberEv"), "int", ["pointer"]);

const v8_profilenode_getcolumnnumber = new NativeFunction(Module.getExportByName(LIBNAME, "_ZNK2v814CpuProfileNode15GetColumnNumberEv"), "int", ["pointer"]);

function getCurrentContext(isolateAddress) {
  const curr_context = v8_current_context(isolateAddress);

  if (curr_context.equals(ptr(0x0))) {
    console.log("[getCurrentContext]::Current Context is null");
  }
  console.log("Current Context: ", curr_context);
  return curr_context;
}

function stringToV8String(isolateAddress, string) {
  return v8_String_NewFromUtf8(
    isolateAddress,
    Memory.allocUtf8String(string),
    0,
    -1
  );
}

function dfs(root, depth = 0) {
  const indent = ' '.repeat(depth * 2);
  const name = v8_profilenode_getfunctionnamestr(root).readCString();
  const count = v8_profilenode_getchildrencount(root);
  const scriptName = v8_profilenode_getscriptresourcename(root).readCString();
  var lineNumber = v8_profilenode_getlinenumber(root);
  var columnNumber = v8_profilenode_getcolumnnumber(root);
  
  console.log(`${indent}(${name}), (${scriptName}), (${count}) Line: ${lineNumber} Column: ${columnNumber}`);
  
  for (let i = 0; i < count; i++) {
      const child = v8_profilenode_getchild(root, i);
      dfs(child, depth + 1); 
  }
}

function printAllCalls(profile) {
  console.log("[printAllCalls]::Profile: ", profile);
  const root = v8_profile_gettopdownroot(profile);
  dfs(root);
}


function stopProfiler(profiler, string) {
  var executedstop = false;
  console.log("[stopProfiler]::Waiting for tap...");
  Interceptor.attach(v8_Isolate_GetCurrent, {
    onEnter: async function (args) {
      if (!executedstop) {
        try {
          executedstop = true;
          const isolateAddress = v8_Isolate_GetCurrent();
          const context = getCurrentContext(isolateAddress);
          console.log("[stopProfiler]::Current Isolate: ", isolateAddress);
          var cpuProfiler = v8_profiler_stopprofiling(profiler, string);
          console.log("[stopProfiler]::Stopped profiling");
          console.log("[stopProfiler]::Cpu Profiler: ", cpuProfiler);
          printAllCalls(cpuProfiler);
        } catch (err) {
          console.log("[stopProfiler]::Error: ", err);
        }
      }
    },
    onLeave: function (retval) {},
  });
}

function main() {
  var executedstart = false;
  Interceptor.attach(v8_Isolate_GetCurrent, {
    onEnter: function (args) {
      if (!executedstart) {
        try {
          executedstart = true;
          const isolateAddress = v8_Isolate_GetCurrent();
          const context = getCurrentContext(isolateAddress);
          console.log("[main]::Current Isolate: ", isolateAddress);
          const profiler = v8_profiler_new(isolateAddress, 0, 1);
          console.log("[main]::Profiler Created: ", profiler);
          const string = stringToV8String(isolateAddress, "1");
          // v8_profiler_startprofiling(profiler, string, 1);
          v8_profiler_startprofiling2(profiler, string, 1, 0, 0);
          console.log("[main]::Started profiling");
          console.log("[main]::going ahead...");
          setTimeout(function () {
            stopProfiler(profiler, string);
          }, 1000);
        } catch (err) {
          console.log("[main]::Error: ", err);
        }
      }
    },
    onLeave: function (retval) {},
  });
}

main();
