# Frida Scripts Android Repository

This repository focuses on WeChat exploration but extends to hooking manager APIs, service APIs, file read/write operations, and content resolver APIs. Below is a breakdown of the different directories and scripts in the repository.

## Framework

The `framework` directory contains scripts for hooking various Android services and methods. These scripts generally provide hooks to capture method calls or interactions with system services, such as Bluetooth, Wi-Fi, location, and more.

- **hook_all_methods.js**: Hooks and logs all method calls within a specified class. Useful for broad analysis of method invocations.
- **hook_all_methods_classloaderfix.js**: Similar to `hook_all_methods.js` but includes a classloader fix for compatibility with different class loading mechanisms.
- **hook_bluetooth.js**: Hooks Bluetooth service methods to capture any interactions with Bluetooth functionality.
- **hook_bluetooth_classloader.js**: Addresses classloader-related issues specific to Bluetooth, ensuring that Bluetooth-related methods are hooked correctly.
- **hook_permission_methods.js**: Hooks into methods related to Android permissions to observe when permissions are requested or granted.
- **enumerate_classloader.js**: Enumerates all loaded classes, making it easier to locate specific targets for hooking.
- **hook_getSystemService.js**: Hooks the `getSystemService` method to intercept and log all service retrievals in the Android framework.
- **hook_Bluetooth_Service.js**: Targets the Bluetooth service specifically, hooking service-level interactions and capturing details.
- **hook_Location_Service.js**: Hooks the location service to monitor location-related method invocations.
- **hook_Vibrator_Service.js**: Hooks the vibrator service to capture method calls related to vibration control.
- **hook_Wifi_Service.js**: Hooks into the Wi-Fi service to observe Wi-Fi-related method calls.
- **hook_Wifi_Service2.js**: An alternative hook for the Wi-Fi service, capturing slightly different interactions compared to `hook_Wifi_Service.js`.

## App

The `app` directory contains scripts focused on application-specific operations, including file I/O, intent logging, and manager hooks.

### File

- **hook_file_io.js**: Hooks and logs file read/write operations to track file I/O activities in the target application.
- **hook_file_io2.js**: Similar to `hook_file_io.js` but with different filtering or tracking logic, possibly handling different file types or contexts.
- **hook_libc.js**: Hooks into libc functions, particularly those related to file operations, to capture lower-level system interactions.
- **hook_sharedpreference.js**: Hooks into Android’s `SharedPreferences` system to monitor and log data being stored or retrieved from persistent app preferences.

### Intent

- **activityLogger.js**: Logs intent-based activities, capturing details about the activities being launched via intents.
- **intenthook.js**: Hooks into Android’s intent system, intercepting intent broadcasts and start activities to observe how intents are used by the app.
- **process.js**: Handles the processing of intents, logging the details for analysis.

### Managers

- **enumerate_managers.js**: Enumerates available managers within the Android system, providing insight into which managers are being used and potentially hooked.
- **hook_all_managers.js**: Hooks into all manager-level APIs, capturing method invocations and interactions with system managers.
- **manager_test.js**: A testing script for hooking manager methods, ensuring the hooks work as expected.

## onTransact

- **stub_on_transact.js**: Hooks the `onTransact` method, allowing you to intercept binder transactions. This is useful for observing IPC (inter-process communication) between apps or services.

## Contributing

Pull requests are welcome! If you have improvements or additional hooks to contribute, please make sure your code is well-documented and follows the repository structure. Feel free to open an issue first to discuss any major changes or ideas.



