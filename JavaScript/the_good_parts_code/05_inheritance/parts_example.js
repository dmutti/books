var eventuality = function(that) {
    var registry = { };

    that.fire = function(event) {
        var array,
            func,
            handler,
            i,
            type = typeof event === 'string' ? event : event.type;

        if (registry.hasOwnProperty(type)) {
            array = registry[type];
            for (i = 0; i < array.length; i++) {
                handler = array[i];
                console.log('fire(): handler found at loop ' + i);

                func = handler.method;
                if (typeof func === 'string') {
                    console.log('fire(): the found func is a string');
                    console.log(func);
                } else {
                    console.log('fire(): the found method is NOT a string');
                    func.apply(this, handler.parameters);
                }

            }
        }
        return this;
    };
    that.on = function(type, method, parameters) {
        var handler = {
            method: method,
            parameters: typeof parameters === 'string' ? [parameters] : parameters
        };
        if (registry.hasOwnProperty(type)) {
            registry[type].push(handler);
        } else {
            console.log('on(): "' + type + '" event registered');
            registry[type] = [handler];
        }
        return this;
    };
    return that;
}

var myVar = {
    hello: function(name) {
        console.log('hello ' + name);
    },
    message: "this is a message"
};
eventuality(myVar);

myVar.on('test', myVar.hello, 'Danilo');
myVar.fire('test');
myVar.on('message', myVar.message);
myVar.fire({type: 'message'});
