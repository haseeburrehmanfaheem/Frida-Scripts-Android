Java.perform(function(){
    Process.enumerateModules()
    .forEach(function(m) {
        // You can print just the name by using m.name or the entire system path with m.path
        console.log(m.name);
    });
});