
//wechat
const LIBNAME = "libmmv8.so";

// baidu
// const LIBNAME = "libzeusv8.so";

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

const v8_String_Utf8Value_Constructor = new NativeFunction(
  Module.getExportByName(
    LIBNAME,
    "_ZN2v86String9Utf8ValueC1EPNS_7IsolateENS_5LocalINS_5ValueEEE"
  ),
  "void",
  ["pointer", "pointer", "pointer"]
);

function getCurrentContext(isolateAddress) {
  const curr_context = v8_current_context(isolateAddress);

  if (curr_context.equals(ptr(0x0))) {
    console.log("[getCurrentContext]::Current Context is null");
  }
  console.log("Current Context: ", curr_context); // returns null
  return curr_context;
}

function resultToString(result, isolateAddress) {
  
  const utf8ValueSize = 200;
  const utf8ValueAddress = Memory.alloc(utf8ValueSize);
  v8_String_Utf8Value_Constructor(utf8ValueAddress, isolateAddress, result); // result is what we get back by running the script:run function
  const utf8String = Memory.readUtf8String(
    Memory.readPointer(utf8ValueAddress)
  );
  console.log("[resultToString]::UTF-8 String: ", utf8String);
}

function executeScript(scriptString, curr_context, isolateAddress) {
  console.log("[executeScript]::Executing script: ", scriptString);
  const source = v8_String_NewFromUtf8(
    isolateAddress,
    Memory.allocUtf8String(scriptString),
    0,
    -1
  );
  const script = v8_Script_Compile(curr_context, source, ptr(0x0));
  console.log("[executeScript]::Compile called with Script: ", script);
  const result = v8_Script_Run(script, curr_context);
  console.log("[executeScript]Result pointer : ", result);
  return resultToString(result, isolateAddress);
}

function main() {
  var executed = false;
  console.log("[main]::Entered");
  Interceptor.attach(v8_Isolate_GetCurrent, {
    onEnter: function (args) {
      if (executed == true) return;
      console.log("[v8_Isolate_GetCurrent]::Entered");
      const isolateAddress2 = v8_Isolate_GetCurrent();
      // const isolateAddress = ptr(args[0]);
      // console.log("[main]::Current Isolate: ", isolateAddress2);
      console.log("[main]::Current Isolate: ", isolateAddress2);
      const curr_context = getCurrentContext(isolateAddress2);
      const scriptString2 = `
                    (function(global) {
                        var result = isString("hello");
                        // var result = "world";
                        return result;
                    })(this);
                    `;
      const scriptString8 = `
                    (function(global) {
                        if (global.WeixinJSBridge) return 'success';

                        return 'fail';
                    })(this);
                    `;

      const scriptString9 = ` (function(global){
                    var _WeixinJSCore = global.WeixinJSCore
                    if (!_WeixinJSCore) {
                        return undefined;
                    }
                    return "Exists"
                    
                })(this);
                    `;

      const scriptString10 = `(function(global){
                        console.log("Hello World!");
                    })(this);
                    `;

      const scriptString11 = `(function(global) {
                        var eventName = 'newAPIIII'; 
                        var params = " ";
                        if (typeof global.WeixinJSBridge === 'undefined' ||
                            typeof global._invokeHandler === 'undefined') {
                            return "noooooo"; // Exit the function if WeixinJSBridge or its invoke method are not present
                        } else {
                            return "yessssss"; // WeixinJSBridge and its invoke method are present
                        }
                    })(this); 
                    `;

      const scriptString12 = `
                    (function(global) {
                        if (global) {
                            const keys = Object.keys(global);
                            return keys; 
                        } else {
                            return "not defined"; 
                        }
                    })(this);                     
                    `;

      const scriptString13 = `(function(global) {
                        try{
                        if (typeof global.WeixinJSCore === 'undefined') {
                            return 'WeixinJSCore is not defined';
                        }
                        if (typeof global.WeixinJSCore.invokeHandler !== 'function') {
                            return 'invokeHandler is not defined in WeixinJSCore';
                        }
                        
                        var r = global.WeixinJSCore.invokeHandler('chooseContact',"" ,400);
                        // var s = global.WeixinJSCore.invokeHandler('NOAPIAPIAPI',"" ,5);  
                        

                        return "executed";
                        var api = 'getLocation';
                        var args = JSON.stringify({ type: 'wgs84' });
                        var callbackId = 12;
                        var callbackId = 12;
                        var args = JSON.stringify({ title: '成功',icon: 'success', duration: 2000 });
                        global.WeixinJSCore.invokeHandler('showToast', { title: '成功',icon: 'success', duration: 2000 }, callbackId);
                        if(typeof global.WeixinJSCoreAndroid.invokeCallbackHandler !== 'function'){
                        return "not defined";
                        }    
                        return r;
                    }catch(err){
                        return err;
                    }
                    })(this);`;

      const scriptString14 = `(function(global) {
                        if (typeof global.WeixinJSCore === 'undefined' || typeof global.WeixinJSCore.invokeHandler !== 'function') {
                            return 'WeixinJSCore or invokeHandler is not defined';
                        }
                    
                        var handler = global.WeixinJSCore.invokeHandler;
                    
                        var info = 'Function Name: ' + handler.name + '\\n' +
                                   'Function Length (Expected Arguments): ' + handler.length + '\\n' +
                                   'Is Native Function: ' + handler.toString().includes('[native code]') + '\\n' +
                                   'Source Code: ' + handler.toString() + '\\n' +
                                   'Function Properties: ' + Object.keys(handler).join(', ');
                    
                        return info;
                    })(this);`;

      const scriptString15 = `(function(global) {
                        var result = '';
                        for (var key in global) {
                            if (global.hasOwnProperty(key)) {
                                var value = global[key];
                                if (typeof value === 'object' || typeof value === 'function') {
                                    result += key + ': ' + (typeof value) + '\\n';
                                    for (var prop in value) {
                                        if (value.hasOwnProperty(prop)) {
                                            result += '  ' + prop + ': ' + (typeof value[prop]) + '\\n';
                                        }
                                    }
                                }
                            }
                        }
                        return result;
                    })(this);`;

      const scriptString16 = `
                    (function(global) {
                        if (global) {
                            const allProperties = Reflect.ownKeys(global);
                            // const functions = allProperties.filter(key => typeof global.NativeGlobal[key] === 'function');
                            // console.log(functions);
                            return allProperties;
                        } else {
                            return "NativeGlobal is not defined in this scope.";
                        }
                    })(this);
                    `;

      const scriptString17 = `
                        (function(global) {
                            if (global.swan) {
                                const keys = Object.keys(global.swan);
                                console.log("Keys in NativeGlobal:", keys);
                                return keys;
                            } else {
                                console.log("NativeGlobal is not defined");
                                return "NativeGlobal is not defined";
                            }
                        })(this);
                    `;

      const scriptString18 = `
                        (function(global) {
                            if (global) {
                                const keys = Object.keys(global);
                                const details = keys.reduce((acc, key) => {
                                    const value = global[key];
                                    acc[key] = {
                                        type: typeof value,
                                        isFunction: typeof value === 'function'
                                    };
                                    return acc;
                                }, {});
                                console.log("Details of NativeGlobal:", JSON.stringify(details, null, 2));
                                return JSON.stringify(details);
                            } else {
                                console.log("NativeGlobal is not defined");
                                return "NativeGlobal is not defined";
                            }
                        })(this);
                    `;

      const scriptString19 = `
                        (function(global) {
                            function getDetails(obj) {
                                return Object.keys(obj).reduce((acc, key) => {
                                    const value = obj[key];
                                    acc[key] = {
                                        type: typeof value,
                                        isFunction: typeof value === 'function',
                                        isObject: typeof value === 'object' && value !== null
                                    };
                                    return acc;
                                }, {});
                            }

                            if (global) {
                                const keys = Object.keys(global);
                                const details = keys.reduce((acc, key) => {
                                    const value = global[key];
                                    acc[key] = {
                                        type: typeof value,
                                        isFunction: typeof value === 'function',
                                        isObject: typeof value === 'object' && value !== null,
                                        properties: typeof value === 'object' && value !== null ? getDetails(value) : {}
                                    };
                                    return acc;
                                }, {});
                                console.log("Details of NativeGlobal:", JSON.stringify(details, null, 2));
                                return JSON.stringify(details);
                            } else {
                                console.log("NativeGlobal is not defined");
                                return "NativeGlobal is not defined";
                            }
                        })(this);
                    `;

      const scriptString20 = `
                    (function(global) {
                        var result = __wxConfig.model;
                        // var result = "world";
                        return result;
                    })(this);
                    `;

      const scriptString21 = `
                    (function(global) {
                        if(global.wx){
                            return "It exists"
                        }
                        return "does not exist";
                    })(this);
                    `;

      const scriptString22 = `
    function getDataType(data) {
        return Object.prototype.toString.call(data).slice(8, -1);
    }

    function isString(x) {
        return getDataType(x) === "String";
    }
    
    
    (function(global) {
        var result = isString("hello");
        return result;
    })(this);
    
    `;

      const scriptString23 = `var WeixinJSCore = (function(global) {
        var _WeixinJSCore = global.WeixinJSCore
        if (!_WeixinJSCore) {
            return undefined;
        }
    
        var __invokeHandler__ = _WeixinJSCore.invokeHandler
        var __invokeHandler2__ = _WeixinJSCore.invokeHandler2
        if (global.NativeGlobal && global.NativeGlobal.invokeHandler) {
            __invokeHandler2__ = global.NativeGlobal.invokeHandler
        } else if (global.workerInvokeJsApi) {
            __invokeHandler2__ = global.workerInvokeJsApi
        }
    
        var ret = {};
        ret.publishHandler = function(event, data, dst) {
            _WeixinJSCore.publishHandler(event, data, dst)
        }
    
        ret.invokeHandler = function(api, args, callbackId, privateArgs) {
            if (__invokeHandler2__) {
                privateArgs = privateArgs || ""
                if (typeof privateArgs !== 'string') {
                    privateArgs = JSON.stringify(privateArgs)
                }
                return __invokeHandler2__(api, args, callbackId, privateArgs)
            } else {
                return __invokeHandler__(api, args, callbackId)
            }
        }
        if (global.workerInvokeJsApi) {
            // 改为每次都查找 WeixinJSCore.invokeHandler，保证 node 的 hook 能生效
            global.workerInvokeJsApi = function(api, args, callbackId, privateArgs) {
                return ret.invokeHandler(api, args, callbackId, privateArgs)
            }
        }
    
        return ret
    })(this);`;

      const scriptString24 = `JSON.stringify(CheckErrMsg);`;

      const scriptString25 = `
      (function() {
        const caseInsensitiveSort = (a, b) => {
          const lowerA = a.toLowerCase();
          const lowerB = b.toLowerCase();
          if (lowerA < lowerB) return -1;
          if (lowerA > lowerB) return 1;
          return 0;
        };
        const sortedGlobals = [...Object.getOwnPropertyNames(globalThis)].sort(caseInsensitiveSort);
        return JSON.stringify(sortedGlobals);
      })();
      `
      const scriptString26 = `
      (function() {
        try{
        wx.getLocation({type: "wgs84"});
        } catch(err){
          return err;
        }
        return "success";

        })();
      `

      const scriptString27 = `
      (function() {
        try{
        if(typeof swan.isAppInstalled === "function"){
          s = swan.isAppInstalled("com.tencent.mobileqq");
          return s;
        }
        } catch(err){
          return err;
        }

        })();
      
      `

      executed = true;
      try{
      executeScript(scriptString13, curr_context, isolateAddress2);
      }catch(err){
        console.log("Error: ", err);
      }
    },
    onLeave: function (retval) {},
  });
}

main();
