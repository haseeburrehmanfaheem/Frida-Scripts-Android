var fileOperations = {
    openFiles: {},  // Maps file descriptors to file paths
    skippedPaths: ['/proc']  // Paths to skip logging and tracking
};

// Utility functions for color-coded output
function getColorText(text, colorCode) {
    return "\x1b[" + colorCode + "m" + text + "\x1b[0m";
}

// Function to check if a path should be skipped
function shouldSkipPath(path) {
    return fileOperations.skippedPaths.some(skippedPath => path.startsWith(skippedPath));
}

Interceptor.attach(Module.findExportByName("libc.so", "open"), {
    onEnter: function(args) {
        this.path = Memory.readCString(args[0]);
        this.skip = shouldSkipPath(this.path);
    },
    onLeave: function(retval) {
        if (!this.skip && retval.toInt32() >= 0) {
            var fd = retval.toInt32();
            fileOperations.openFiles[fd.toString()] = this.path;
            console.log(getColorText("open() returned FD: " + fd + " for file: " + this.path, "32")); // Green color
        }
    }
});

Interceptor.attach(Module.findExportByName("libc.so", "close"), {
    onEnter: function(args) {
        var fd = args[0].toInt32();
        var path = fileOperations.openFiles[fd.toString()];
        if (path && !shouldSkipPath(path)) {
            console.log(getColorText("Closing file: " + path + " (FD: " + fd + ")", "31")); // Red color
            delete fileOperations.openFiles[fd.toString()];
        }
    }
});

Interceptor.attach(Module.findExportByName("libc.so", "read"), {
    onEnter: function(args) {
        var fd = args[0].toInt32();
        var path = fileOperations.openFiles[fd.toString()];
        if (path && !shouldSkipPath(path)) {
            console.log(getColorText("read() called on file: " + path + " (FD: " + fd + ")", "36")); // Cyan color
        }
    }
});

Interceptor.attach(Module.findExportByName("libc.so", "write"), {
    onEnter: function(args) {
        var fd = args[0].toInt32();
        var path = fileOperations.openFiles[fd.toString()];
        if (path && !shouldSkipPath(path)) {
            console.log(getColorText("write() called on file: " + path + " (FD: " + fd + ")", "34")); // Blue color
        }
    }
});
