Java.perform(function() {
    // Get the current process ID and name
    var pid = Process.id;
    var processName = Process.name;

    console.log("Connected to PID: " + pid + ", Process Name: " + processName);
    console.log(Process);
});
