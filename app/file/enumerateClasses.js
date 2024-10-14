Java.perform(
    function(){
      Java.enumerateLoadedClasses(
        {"onMatch":function(className){
            if (className.startsWith("android") && className.endsWith("Manager")) 
                console.log(className) 
            },
           "onComplete":function(){}
         }
       )
     }
   )