
Java.perform(function () {
let AppBrandCommonBindingJni = Java.use("com.tencent.mm.appbrand.commonjni.AppBrandCommonBindingJni");
AppBrandCommonBindingJni["invokeCallbackHandler"].implementation = function (i15, str) {
    console.log(`AppBrandCommonBindingJni.invokeCallbackHandler is called: i15=${i15}, str=${str}`);
    this["invokeCallbackHandler"](i15, str);
};
})