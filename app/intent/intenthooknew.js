Java.perform(function () {
  var Activity = Java.use("android.app.Activity");
  var String = Java.use("java.lang.String");

  Activity.getIntent.implementation = function () {
    var intent = this.getIntent();
    var cp = intent.getComponent();
    console.log("Starting " + cp.getPackageName() + "/" + cp.getClassName());
    var extras = intent.getExtras();
    if (extras !== null) {
      var keys = extras.keySet().toArray();
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i].toString();
        var value = extras.get(key);
        try {
          var strValue = String.$new(value, "UTF-8");
          console.log("\t" + key + " : " + strValue);
        } catch (e) {
          console.log(e);
        }
         try{      
          console.log("\t" + key + " : " + value);
          var buffer = Java.array("byte", value);
          console.log(buffer.length);
          var result = "";
          try {
            for (var i = 0; i < buffer.length; ++i) {
              result += String.fromCharCode(buffer[i] & 0xff);
            }
            console.log("asd");
          console.log(result);
          } catch (e) {
            console.log("Error: " + e);
          }
        } catch (e) {
            console.log("Error: " + e);
        }
      }
    }
    return intent;
  };

  function encodeHex(byteArray) {
    try {
      const HexClass = Java.use("org.apache.commons.codec.binary.Hex");
      const StringClass = Java.use("java.lang.String");
      const hexChars = HexClass.encodeHex(byteArray);
      return StringClass.$new(hexChars).toString();
    } catch (e) {
      console.log("Error: " + e);
    }
  }

  function stringencode(byteArray) {
    try {
      var stringClass = Java.use("java.lang.String");
      var stringInstance = stringClass.$new(byteArray);
      console.log("look = " + stringInstance.toString());
    } catch (e) {
      console.log("Error: " + e);
    }
  }
});
