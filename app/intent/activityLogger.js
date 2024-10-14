Java.perform(function () {
  var Activity = Java.use("android.app.Activity");
  var Intent = Java.use("android.content.Intent");

    function printDivider() {
      console.log(
        "-------------------------------------------------------------"
      );
    }

    function getColorText(text, colorCode) {
      return "\x1b[" + colorCode + "m" + text + "\x1b[0m";
    }

  Activity.startActivity.overload("android.content.Intent").implementation =
    function (intent) {
      printDivider();
      console.log(getColorText("startActivity called: ", "97"));
      printIntent(intent);
      return this.startActivity(intent);
    };

  Activity.startActivityForResult.overloads.forEach(function (overload) {
    overload.implementation = function () {
      printDivider();
      console.log("Called startActivityForResult (overload): " + overload);
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] && arguments[i].toString().includes("Intent")) {
          printIntent(arguments[i]);
        }
      }
      return overload.apply(this, arguments);
    };
  });

  Activity.onActivityResult.overloads.forEach(function (overload) {
    // todo: dont hook all overloads

    overload.implementation = function () {
      printDivider();
      if (arguments[2] == null) {
        var returnval = overload.apply(this, arguments);
      }
      console.log("Called onActivityResult (overload): " + overload);
      var data = arguments[2];
      printIntent(data);
      var returnval = overload.apply(this, arguments);
      return returnval;
    };
  });

  Activity.onCreate.overload("android.os.Bundle").implementation = function (
    bundle
  ) {
    console.log(
      getColorText("Activity started: " + this.getClass().toString(), "97")
    );
    this.onCreate(bundle);
  };

  var ContentResolver = Java.use("android.content.ContentResolver");
  var Cursor = Java.use("android.database.Cursor");
  ContentResolver.query.overload( // To do : other overloads
    "android.net.Uri",
    "[Ljava.lang.String;",
    "java.lang.String",
    "[Ljava.lang.String;",
    "java.lang.String"
  ).implementation = function (
    uri,
    projection,
    selection,
    selectionArgs,
    sortOrder
  ) {
    printDivider();
    console.log("called contentResolver.query");
    var cursor = this.query(
      uri,
      projection,
      selection,
      selectionArgs,
      sortOrder
    );
    if (cursor) {
      logCursor(cursor);
    }
    return cursor;
  };

  // To do : ContentResolver other functions like delete, insert, update etc


  ContentResolver.call.overloads.forEach(function (overload) {
    overload.implementation = function (){
      printDivider();
      console.log("Called contentResolver.call: " + overload);
      for (var i = 0; i < arguments.length; i++) {
        console.log("Arg[" + i + "]: " + arguments[i]);
      }
      return overload.apply(this, arguments);

    }
  });


  ContentResolver.applyBatch.overloads.forEach(function (overload) {
    overload.implementation = function (authority, operations) {
      printDivider();
      console.log("Called applyBatch (overload): " + overload);
      console.log("Authority: " + authority);
      for (var i = 0; i < operations.size(); i++) {
        var operation = operations.get(i);
        console.log(operation);
      }
      return overload.apply(this, arguments); // print the return value as well  // describeContents 
    };
});

  function logCursor(cursor) {
    var cursorCount = cursor.getCount();
    var columnNames = cursor.getColumnNames();
    var index = 0;

    console.log(getColorText("Cursor count: " + cursorCount, "32")); // Green
    console.log(getColorText("Column Names:", "33")); // Yellow
    for (var i = 0; i < columnNames.length; i++) {
      console.log(getColorText("  " + columnNames[i], "33"));
    }

    while (cursor.moveToNext()) {
      console.log(getColorText("Row[" + index + "]:", "96")); // Cyan
      for (var j = 0; j < columnNames.length; j++) {
        var value = cursor.getString(j);
        var color = value !== null ? "32" : "31"; // Green if not null, Red if null
        console.log(getColorText("  " + columnNames[j] + ": " + value, color));
      }
      index++;
    }

    cursor.moveToFirst(); // Reset cursor position
  }

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

  function printIntent(intent) {
    // console.log(getColorText("Starting activity: " + this.getClass().toString(), "97"));
    if(intent === null){
      console.log(getColorText("Intent is null", "31"));
      return;
    }
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
        console.log(
          getColorText("Flags: " + flags + " (" + flagMeaning + ")", "31")
        ); // Red if flag is 0
      } else {
        console.log(
          getColorText("Flags: " + flags + " (" + flagMeaning + ")", "34")
        ); // Blue if not null
      }
    } else {
      console.log(
        getColorText("Flags: " + flags + " (" + getFlagMeaning(0) + ")", "31")
      ); // Red if flag is 0
    }

    // Output extras in yellow color if not null
    var extras = intent.getExtras();
    if (extras !== null) {
      console.log(getColorText("Extras: " + extras, "33"));
    } else {
      console.log(getColorText("Extras: " + extras, "31"));
    }


    var mimeType = intent.getType();
    if (mimeType !== null) {
      console.log(getColorText("MIME Type: " + mimeType, "32"));
    } else{
      console.log(getColorText("MIME Type: " + mimeType, "31"));
    }

    var scheme = intent.getScheme();
    if (scheme !== null) {
      console.log(getColorText("Scheme: " + scheme, "32"));
    }
    else{
      console.log(getColorText("Scheme: " + scheme, "31"));
    }
  }



  // hook broadcast reciever (but is the data being used by the miniapp?)
  var BroadcastReceiver = Java.use("android.content.BroadcastReceiver");

  // onrevieve
  BroadcastReceiver.onReceive.overload("android.content.Context", "android.content.Intent").implementation = function (context, intent) {
    printDivider();
    console.log("BroadcastReceiver.onReceive called: ");
    printIntent(intent);
    return this.onReceive(context, intent);
  };

  // registerReceiver
  var Context = Java.use("android.content.Context");
  Context.registerReceiver.overload("android.content.BroadcastReceiver", "android.content.IntentFilter").implementation = function (receiver, filter) {
    printDivider();
    console.log("Context.registerReceiver called: ");
    console.log("Receiver: " + receiver);
    console.log("Filter: " + filter);
    return this.registerReceiver(receiver, filter);
  };



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




})

// @Override
//     protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//         super.onActivityResult(requestCode, resultCode, data);

//         if (requestCode == PICK_CONTACT_REQUEST && resultCode == RESULT_OK) {
//             // Get the URI and query the content provider for the phone number
//             Uri contactUri = data.getData();
//             String[] projection = {ContactsContract.Contacts._ID, ContactsContract.Contacts.DISPLAY_NAME};

//             // Perform a query on the contact to get the details
//             Cursor cursor = getContentResolver().query(contactUri, projection, null, null, null); // projection could also be null
//             if (cursor != null && cursor.moveToFirst()) {
//                 // Get the contact's name
//                 String contactName = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME));
//                 Log.d("ChooseContact", "Contact Name: " + contactName);
//                 cursor.close();
//             }
//         }
//     }

// applybatch("query90...., query90, addd00,")
// 

// update etc are called in applybatch , but i dont see individual calls(CPO actually includes the individual ones, look into this if needed)
// android.content.ContentProviderOperation and android.content.ContentProviderResult


// broadcast reciever added, but not sure if the data is being used by the miniapp
// registerReceiver and onReceive


//