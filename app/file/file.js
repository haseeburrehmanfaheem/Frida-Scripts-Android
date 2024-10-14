Java.perform(function () {
    var File = Java.use("java.io.File");

    function printDivider() {
        console.log("-------------------------------------------------------------");
        
    }

    function getColorText(text, colorCode) {
        return "\x1b[" + colorCode + "m" + text + "\x1b[0m";
    }
    
    console.log("File access logger successfully attached.");

    // Hook file read operations
    var FileInputStream = Java.use('java.io.FileInputStream');
    FileInputStream.$init.overload('java.io.File').implementation = function (file) {
        try {
            this.$init(file);
            console.log(getColorText("SUCCESS     - READ        - [*] file: " + file.getAbsolutePath(), "34")); // Blue color
        } catch (e) {
            console.log(getColorText("FAIL        - READ        - [*] file: " + file.getAbsolutePath(), "31")); // Red color
        }
    };

    // Hook file write operations
    var FileOutputStream = Java.use('java.io.FileOutputStream');
    FileOutputStream.$init.overload('java.io.File').implementation = function (file) {
        try {
            this.$init(file);
            console.log(getColorText("SUCCESS     - WRITE       - [*] file: " + file.getAbsolutePath(), "32")); // Green color
        } catch (e) {
            console.log(getColorText("FAIL        - WRITE       - [*] file: " + file.getAbsolutePath(), "31")); // Red color
        }
    };

    // Hook file delete operations
    File.delete.implementation = function () {
        var result = this.delete.call(this);
        if (result) {
            console.log(getColorText("SUCCESS     - DELETE      - [*] file: " + this.getAbsolutePath(), "32")); // Green color
        } else {
            console.log(getColorText("FAIL        - DELETE      - [*] file: " + this.getAbsolutePath(), "31")); // Red color
        }
        return result;
    };
});