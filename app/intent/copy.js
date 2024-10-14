Java.perform(function () {
    var Activity = Java.use("android.app.Activity");
    var Intent = Java.use("android.content.Intent");

    function printDivider() {
        console.log("-------------------------------------------------------------");
    }

    function getColorText(text, colorCode) {
        return "\x1b[" + colorCode + "m" + text + "\x1b[0m";
    }

    console.log("Activity logger successfully attached.");

    function getFlagMeaning(flag) {
        switch (flag) {
            case 0:
                return getColorText("Unknown Flag", "31");
            case 1: // Intent.FLAG_GRANT_READ_URI_PERMISSION
                return "FLAG_GRANT_READ_URI_PERMISSION";
            case 2: // Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                return "FLAG_GRANT_WRITE_URI_PERMISSION";
            case 4: // Intent.FLAG_FROM_BACKGROUND
                return "FLAG_FROM_BACKGROUND";
            case 8: // Intent.FLAG_DEBUG_LOG_RESOLUTION
                return "FLAG_DEBUG_LOG_RESOLUTION";
            case 16: // Intent.FLAG_EXCLUDE_STOPPED_PACKAGES
                return "FLAG_EXCLUDE_STOPPED_PACKAGES";
            case 32: // Intent.FLAG_INCLUDE_STOPPED_PACKAGES
                return "FLAG_INCLUDE_STOPPED_PACKAGES";
            case 64: // Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
                return "FLAG_GRANT_PERSISTABLE_URI_PERMISSION";
            case 128: // Intent.FLAG_GRANT_PREFIX_URI_PERMISSION
                return "FLAG_GRANT_PREFIX_URI_PERMISSION";
            case 16384: // Intent.FLAG_ACTIVITY_TASK_ON_HOME
                return "FLAG_ACTIVITY_TASK_ON_HOME";
            case 32768: // Intent.FLAG_ACTIVITY_CLEAR_TASK
                return "FLAG_ACTIVITY_CLEAR_TASK";
            case 65536: // Intent.FLAG_ACTIVITY_NO_ANIMATION
                return "FLAG_ACTIVITY_NO_ANIMATION";
            case 131072: // Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
                return "FLAG_ACTIVITY_REORDER_TO_FRONT";
            case 262144: // Intent.FLAG_ACTIVITY_NO_USER_ACTION
                return "FLAG_ACTIVITY_NO_USER_ACTION";
            case 524288: // Intent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET | Intent.FLAG_ACTIVITY_NEW_DOCUMENT
                return "FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET | FLAG_ACTIVITY_NEW_DOCUMENT";
            case 8192: // Intent.FLAG_ACTIVITY_RETAIN_IN_RECENTS
                return "FLAG_ACTIVITY_RETAIN_IN_RECENTS";
            case 1048576: // Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY
                return "FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY";
            case 2097152: // Intent.FLAG_ACTIVITY_FORWARD_RESULT | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
                return "FLAG_ACTIVITY_FORWARD_RESULT | FLAG_ACTIVITY_RESET_TASK_IF_NEEDED";
            case 4194304: // Intent.FLAG_ACTIVITY_BROUGHT_TO_FRONT
                return "FLAG_ACTIVITY_BROUGHT_TO_FRONT";
            case 8388608: // Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS
                return "FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS";
            case 134217728: // Intent.FLAG_ACTIVITY_MULTIPLE_TASK
                return "FLAG_ACTIVITY_MULTIPLE_TASK";
            case 536870912: // Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_RECEIVER_REPLACE_PENDING
                return "FLAG_ACTIVITY_SINGLE_TOP | FLAG_RECEIVER_REPLACE_PENDING";
            case 1073741824: // Intent.FLAG_ACTIVITY_NO_HISTORY | Intent.FLAG_RECEIVER_REGISTERED_ONLY
                return "FLAG_ACTIVITY_NO_HISTORY | FLAG_RECEIVER_REGISTERED_ONLY";
            case 268435456: // Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_RECEIVER_FOREGROUND
                return "FLAG_ACTIVITY_NEW_TASK | FLAG_RECEIVER_FOREGROUND";
            case 335544320: // Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_RECEIVER_FOREGROUND
                return "FLAG_ACTIVITY_NEW_TASK | FLAG_ACTIVITY_CLEAR_TASK | FLAG_RECEIVER_FOREGROUND";
            case 268468224: // Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NO_ANIMATION | Intent.FLAG_RECEIVER_FOREGROUND
                return "FLAG_ACTIVITY_NEW_TASK | FLAG_ACTIVITY_CLEAR_TASK | FLAG_ACTIVITY_NO_ANIMATION | FLAG_RECEIVER_FOREGROUND";
            default:
                return getColorText("Unknown Flag", "31");
        }
    }

    Activity.startActivity.overload('android.content.Intent').implementation = function (intent) {
        printDivider();
        console.log(getColorText("Starting activity: " + this.getClass().toString(), "97"));

        // Output action in green color if not null, red if null
        var action = intent.getAction();
        if (action !== null) {
            console.log(getColorText("Action: " + action, "96")); // Green if not null
        } else {
            console.log(getColorText("Action: " + action, "31")); // Red if null
        }

        // Output data value in green color if not null, red if null
        var dataString = intent.getDataString();
        if (dataString !== null) {
            console.log(getColorText("Data: " + dataString, "32")); // Green if not null
        } else {
            console.log(getColorText("Data: " + dataString, "31")); // Red if null
        }

        // Output component in magenta color if not null
        var component = intent.getComponent();
        if (component !== null) {
            console.log(getColorText("Components: " + component, "35"));
        } else {
            console.log(getColorText("Components: " + component, "31"));
        }

        // Output categories in light blue color if not null
        var categories = intent.getCategories();
        if (categories !== null) {
            console.log(getColorText("Categories: " + categories, "94"));
        } else {
            console.log(getColorText("Categories: " + categories, "31"));
        }

        // Output flags in dark blue color if not null
        var flags = intent.getFlags();
        if (flags !== null) {
            var flagMeaning = getFlagMeaning(flags);
            if (flags === 0) {
                console.log(getColorText("Flags: " + flags + " (" + flagMeaning + ")", "31")); // Red if flag is 0
            } else {
                console.log(getColorText("Flags: " + flags + " (" + flagMeaning + ")", "34")); // Blue if not null
            }
        } else {
            console.log(getColorText("Flags: " + flags + " (" + getFlagMeaning(0) + ")", "31")); // Red if flag is 0
        }

        // Output extras in yellow color if not null
        var extras = intent.getExtras();
        if (extras !== null) {
            console.log(getColorText("Extras: " + extras, "33"));
        } else {
            console.log(getColorText("Extras: " + extras, "31"));
        }

        this.startActivity(intent);
    };

    Activity.onCreate.overload('android.os.Bundle').implementation = function (bundle) {
        printDivider();
        console.log(getColorText("Activity started: " + this.getClass().toString(), "97"));
        this.onCreate(bundle);
    };
});