Java.perform(function() {
    var ContentResolver = Java.use("android.content.ContentResolver");
    var ContentProviderOperation = Java.use("android.content.ContentProviderOperation");

    function getColorText(text, color) {
        return "\u001b[" + color + "m" + text + "\u001b[0m";
    }

    function printDivider() {
        console.log("========================================");
    }

    function logContentValues(values) {
        var keys = values.keySet().toArray();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = values.get(key);
            console.log(getColorText("  " + key + ": " + value, "32")); // Green
        }
    }

    function logContentProviderOperation(operation) {
        var typeString = getOperationTypeString(operation.getType());
        var uri = operation.getUri();
        // var selection = operation.getSelection();
        // var selectionArgs = operation.getSelectionArgs();
        var selectionArgs = null
        var selection = null 
        var values = operation.getValues();

        if(typeString == "insert"){
            
        }
        console.log(getColorText("ContentProviderOperation", "34")); // Blue
        console.log(getColorText("  Type: " + typeString, "32")); // Green
        console.log(getColorText("  URI: " + uri, "32"));
        console.log(getColorText("  Selection: " + selection, "32"));

        if (selectionArgs !== null) {
            console.log(getColorText("  Selection Args:", "32"));
            for (var i = 0; i < selectionArgs.length; i++) {
                console.log(getColorText("    " + i + ": " + selectionArgs[i], "32"));
            }
        }

        if (values !== null) {
            console.log(getColorText("  Values:", "32"));
            logContentValues(values);
        }

        printDivider();
    }

    function getOperationTypeString(type) {
        switch (type) {
            case 1:
                return "insert";
            case 2:
                return "update";
            case 3:
                return "delete";
            default:
                return "unknown";
        }
    }

    // Hook applyBatch method
    ContentResolver.applyBatch.overload('java.lang.String', 'java.util.ArrayList').implementation = function(authority, operations) {
        console.log(getColorText("Called applyBatch", "34"));
        console.log("Argument count: 2");
        console.log("Arg[0]: Type=string, Value=" + authority);

        // Print the entire ArrayList in a detailed way
        console.log("Arg[1]: Type=object, Value=[");
        for (var i = 0; i < operations.size(); i++) {
            var operation = Java.cast(operations.get(i), ContentProviderOperation);
            console.log("  Operation[" + i + "]:");
            console.log(operation);
            logContentProviderOperation(operation);
        }
        console.log("]");

        return this.applyBatch(authority, operations);
    };
});
