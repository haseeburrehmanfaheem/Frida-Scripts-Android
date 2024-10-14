Java.perform(function () {
    console.log("Starting script...");
//     let k2 = Java.use("com.tencent.mm.sdk.platformtools.k2");
//     k2["e"].implementation = function (str, str2, objArr) {
//     console.log(`k2.e is called: str=${str}, str2=${str2}, objArr=${objArr}`);
//     this["e"](str, str2, objArr);
// };
// let AppBrandCommonBindingJni = Java.use("com.tencent.mm.appbrand.commonjni.AppBrandCommonBindingJni");
let v = Java.use("com.tencent.mm.plugin.appbrand.jsapi.contact.v");
v["u"].implementation = function (lVar, jSONObject, i15) {
    console.log(`v.u is called: lVar=${lVar}, jSONObject=${jSONObject}, i15=${i15}`);
    this["u"](lVar, jSONObject, i15);
};

let q = Java.use("com.tencent.mm.plugin.appbrand.jsapi.contact.q");
q["u"].implementation = function (lVar, jSONObject, i15) {
    console.log(`q.u is called: lVar=${lVar}, jSONObject=${jSONObject}, i15=${i15}`);
    this["u"](lVar, jSONObject, i15);
};


let d = Java.use("com.tencent.mm.plugin.appbrand.jsapi.bio.face.d");
d["u"].implementation = function (lVar, jSONObject, i15) {
    console.log(`d.u is called: lVar=${lVar}, jSONObject=${jSONObject}, i15=${i15}`);
    this["u"](lVar, jSONObject, i15);
};

Java.choose("com.tencent.mm.appbrand.commonjni.AppBrandCommonBindingJni", {
    onMatch: function (instance) {
        console.log("Found instance: " + instance);


        // instance["nativeInvokeHandler"].overload('java.lang.String', 'java.lang.String', 'java.lang.String', 'int', 'boolean').implementation = function (str, str2, str3, i15, z15) {
        //     console.log("Hooked com.tencent.mm.appbrand.commonjni.AppBrandCommonBindingJni.nativeInvokeHandler");
        //     console.log("Arguments:");
        //     console.log("Argument 0: " + str);
        //     console.log("Argument 1: " + str2);
        //     console.log("Argument 2: " + str3);
        //     console.log("Argument 3: " + i15);
        //     console.log("Argument 4: " + z15);
        //     // var stackTrace = Java.use("java.lang.Thread").currentThread().getStackTrace();
        //     // console.log("Stack trace for com.tencent.mm.appbrand.commonjni.AppBrandCommonBindingJni.nativeInvokeHandler:");
        //     // stackTrace.forEach(function (traceElement) {
        //     //     console.log("\t" + traceElement.toString());
        //     // });
        //     var result = this["nativeInvokeHandler"](str, str2, str3, i15, z15);
        //     console.log("Result: " + result);
        //     return result;
        // };

        // call the function ourselves to test it
        // var StringClass = Java.use("java.lang.String");
        // var arg0 = StringClass.$new("chooseContact");
        // var arg1 = StringClass.$new("{}");
        // var arg2 = StringClass.$new("{}");

        // var result = instance["nativeInvokeHandler"](arg0, arg1, arg2, 96, true);
        // var result = instance["nativeInvokeHandler"]("openWeRunSetting", "", "{}", 102, true);
        // var result = instance["nativeInvokeHandler"]("openWeRunSetting", "", "{}", 103, true);
        // var result = instance["nativeInvokeHandler"]("private_addContact", "{\"username\": \"haseeb\", \"scene\":0}", "{}", 102, true);
        // var result = instance["nativeInvokeHandler"]("private_openUrl", "{\"url\": \"https://developers.weixin.qq.com/miniprogram/dev/api/base/crypto/UserCryptoManager.getRandomValues.html\",}", "{}", 102, true);
        // https://www.google.com
        var result = instance["nativeInvokeHandler"]("getLocation", "", "{}", 102, true);
        console.log("Result: " + result);
    },
    onComplete: function () {
        console.log("Completed search");
    }
});
}) 


// let AppBrandCommonBindingJni = Java.use("com.tencent.mm.appbrand.commonjni.AppBrandCommonBindingJni");
// AppBrandCommonBindingJni["nativeInvokeHandler"].implementation = function (str, str2, str3, i15, z15) {
//     console.log(`AppBrandCommonBindingJni.nativeInvokeHandler is called: str=${str}, str2=${str2}, str3=${str3}, i15=${i15}, z15=${z15}`);
//     let result = this["nativeInvokeHandler"](str, str2, str3, i15, z15);
//     console.log(`AppBrandCommonBindingJni.nativeInvokeHandler result=${result}`);
//     return result;
// };
// });