var __Storage_Handler = {
    get: function(target, key) {
        if(target.hasOwnProperty(key))
            return target[key];
        return localStorage.getItem(key);
    },
    set: function(target, key, value){
        target[key] = value;
        localStorage.setItem(key, value);
    }
}

var Session = new Proxy({}, __Storage_Handler );