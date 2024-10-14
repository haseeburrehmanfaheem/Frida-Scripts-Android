// 0x7a7ce53a90
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
const v8_Script_Run = new NativeFunction(Module.getExportByName("libmmv8.so", '_ZN2v86Script3RunENS_5LocalINS_7ContextEEE'), 'pointer', ['pointer', 'pointer']);




run_all(0x77eff3aa90);

function run_all(pointer){
    
    
    
    // const isolateAddress = ptr(pointer);
    // v8_Isolate_Enter(isolateAddress);
    // console.log("Entered Isolate: ", isolateAddress);



    
    const isolate_new = v8_Isolate_GetCurrent();
    console.log("Current Isolate: ", isolate_new);
    var curr_context = v8_current_context(isolateAddress);
    console.log("Initial Context: ", curr_context); // returns null 
    
    


    if(curr_context.equals(ptr(0x0))){
    const handleScopeSize = 24; 
    const handleScopeAddress = Memory.alloc(handleScopeSize);
    
    
    v8_HandleScope_Constructor(handleScopeAddress, isolateAddress);
    
    console.log("Handle Scope Called = ", handleScopeAddress);

    curr_context = v8_current_context(isolateAddress);
    console.log("Current Context: ", curr_context); // returns null 
    
    if(curr_context.equals(ptr(0x0))){
    
    console.log("Creating new context");
    const context_new = v8_newContext(isolateAddress, ptr(0x0), ptr(0x0), ptr(0x0), ptr(0x0), ptr(0x0));
    console.log("New Context: ", context_new);
    v8_Context_enter(context_new);
    curr_context = v8_current_context(isolateAddress);
    } 
}   
    
    const scriptString1 = `
    (function() {
        var event = "test1";
        var paramsString = JSON.stringify({ key: "value" });
        var callbackId = "123";
        var privateArgsString = JSON.stringify({ private: "args" });

        var result = _invokeHandler(event, paramsString, callbackId, privateArgsString);
        return JSON.stringify(result);
    })()
`;
    const scriptString2 = `
    (function(global) {
        //var result = isString("hello");
         var result = "world";
        return result;
    })(this);
    `;
    const scriptString4 = `
        (function(global) {
            function getDataType(data) {
                return Object.prototype.toString.call(data).slice(8, -1);
            }

            function isString(x) {
                return getDataType(x) === "String";
            }

            var result = isString("hello");
            return result;
        })(this);
`;


const scriptString5 = `
(function(global) {
    var _invokeHandler = function (event, paramsString, callbackId, privateArgsString) {
        
            var result = WeixinJSCore.invokeHandler(event, paramsString, callbackId, privateArgsString);
            /*
            if (typeof result === 'string' && result !== '') {
                // sync functions
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    result = {};
                }
            }
            return WeixinNativeBuffer.unpack(result);
            */
           return "ez"
    };
    var event = "myEvent";
    var paramsString = JSON.stringify({ key: "value" });
    var callbackId = "123";
    var privateArgsString = JSON.stringify({ private: "args" });
    var result = _invokeHandler(event, paramsString, callbackId, privateArgsString);
    return JSON.stringify(result);
})(this);
`;

    
const scriptString6 = `
(function(global) {
    if (typeof WeixinJSCore !== 'undefined') {
        //var result = WeixinJSCore.invokeHandler(event, paramsString, callbackId, privateArgsString);
        return "defined in context";
    } else {
        return "not defined";
    }
})(this);
`;
const scriptString7 = `
    function getDataType(data) {
        return Object.prototype.toString.call(data).slice(8, -1);
    }

    function isString(x) {
        return getDataType(x) === "String";
    }`;

    const scriptString = "(function(){ return isString(1);})()";

    // console.log("\n\nRunning scripts");

    const scriptString8 = `
    (function(global) {
        if (global.WeixinJSBridge) return 'success';

        return 'fail';
    })(this);
    `
    
    const scriptString9 = ` (function(global){
    var _WeixinJSCore = global.WeixinJSCore
    if (!_WeixinJSCore) {
        return undefined;
    }
    return "does not exist"
})(this);
    `
    executeScript(scriptString9, curr_context, isolateAddress);

    // executeScript(scriptString, curr_context, isolateAddress);
    }


function resultToString(result, isolateAddress){
    const v8_String_Utf8Value_Constructor = new NativeFunction(
        Module.getExportByName("libmmv8.so", '_ZN2v86String9Utf8ValueC1EPNS_7IsolateENS_5LocalINS_5ValueEEE'),
        'void',
        ['pointer', 'pointer', 'pointer']
    );
    const utf8ValueSize = 200; 
    const utf8ValueAddress = Memory.alloc(utf8ValueSize);
    v8_String_Utf8Value_Constructor(utf8ValueAddress, isolateAddress, result); // result is what we get back by running the script:run function
    const utf8String = Memory.readUtf8String(Memory.readPointer(utf8ValueAddress));
    console.log("UTF-8 String: ", utf8String);
}


function executeScript(scriptString, curr_context, isolateAddress) {
    console.log("\n\nExecuting script: ", scriptString);
    const source = v8_String_NewFromUtf8(isolateAddress, Memory.allocUtf8String(scriptString), 0, -1);
    const script = v8_Script_Compile(curr_context, source, ptr(0x0));
    console.log("Compile called with Script ", script);
    const result = v8_Script_Run(script, curr_context);
    console.log("Result pointer = ", result);
    return resultToString(result, isolateAddress);
}
















