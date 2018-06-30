(function() {
    var handledEvents = ['blur', 'change', 'focus', 'focusin', 'focusout', 'select', 'submit', 'click', 'contextmenu', 'dblclick', 'hover', /*'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup',*/ 'keydown', 'keypress', 'keyup', 'resize', 'scroll'];
    handledEvents.forEach(function(event) { document.addEventListener(event, componentEvent); });

    new MutationObserver(componentObserver).observe(document.body, {
        childList: true,
        subtree: true
    });

    function componentObserver(mutations, observer) {
        var update = false;
        for (var index = 0; index < mutations.length; index++) {
            var mutation = mutations[index];
            if (mutation.type === 'childList' && mutation.addedNodes.length) update = true;
        }
        if (update) installComponents();
    }

    function installComponents() {
        var components = [].slice.call(document.querySelectorAll('[data-component]'));
        components.forEach(function(component){
            var self = component;
            if(component.installed) return;
            require([self.attributes['data-component'].value], function(module) {
                module.install.call(self, module);
                self.installed = true;
            });
        });
    };

    function componentEvent(event) {



       
         var component = event.target;
        var path = [event.target];
        var components = {};

        while (component != document.body) {
            component = component.parentElement;
            path.push(component);
        }

        var components = path.reduce(function(carry, element){
            if( !element.attributes['data-component'] || carry.indexOf(element.attributes['data-component'].value) != -1 ) return carry;
            carry.push( element.attributes['data-component'].value );
            return carry;
        }, []);

        console.log( path, components );
        if (!event.target || !event.target.attributes || !event.target.attributes['data-bind']) return;
        
        var component = event.target;
        var components = [];
        var named_components = {};
        var target = event.target;
        var action = {};

        while (component != document.body) {
            if (component.attributes['data-component']) {
                components.push(component.attributes['data-component'].value);
                named_components[component.attributes['data-component'].value] = component;
            }
            component = component.parentElement;
        }

        if (!components.length) return;
        target.className.split(' ')
            .forEach(function(el) {
                if (el.indexOf('_') == -1) return false;
                var parts = el.split('_');
                if (components.indexOf(parts[0]) == -1) return false;
                if (parts[1].indexOf('--') != -1) return false; // cortando modifiers
                if (!action[parts[0]]) action[parts[0]] = [];
                action[parts[0]].push(el);
            });

        Object.keys(action).forEach(function(m) {
            require([m], function(module) {
                if (!module.events || !module.events[event.type]) return;
                action[m].forEach(function(method) {
                    if (!module.events[event.type][method]) return;
                    module.events[event.type][method].call(target, named_components[m], event);
                });
            });
        });
    }

    define('Component', [], function() {
        function Component(name) {
            this.name = name;
            return this
        };

        Component._events = {};
        Component.instances = [];
        Component.on   = function() {   on.apply(Component, arguments); }
        Component.off  = function() {  off.apply(Component, arguments); }
        Component.emit = function() { emit.apply(Component, arguments); }
        Component.install = install;
        Component.prototype = {
            on: on,
            off: off,
            emit: emit,
            _events: {},
            events: {},
            elements: {},
            register: register,
            bootstrap: bootstrap,
            install: install
        };

        function on(event, cb) {
            event = this._events[event] = this._events[event] || []
            event.push(cb);
        }

        function off(event, cb) {
            if (!this._events[event]) return;
            event = this._events[event];
            event.splice(event.indexOf(cb) >>> 0, 1);
        }

        function emit(event) {
            var list = this._events[event]
            if (!list || !list[0]) return

            var args = list.slice.call(arguments, 1)
            list.slice().map(function(i) {
                i.apply(this, args)
            })
        }

        function bootstrap() {
            Component.instances.push(this);
            var self = this;
            Object.keys(self.elements).forEach(function(target) {
                Object.keys(self.elements[target]).forEach(function(event) {
                    self.register(self.name + '_' + target, event, self.elements[target][event]);
                })
            })
        }

        function register(target, event, fn) {
            if (!this.events[event]) this.events[event] = {};
            if (!this.events[event][target]) this.events[event][target] = {};
            this.events[event][target] = fn;
        }

        function install( component ){
            var self = this;
            Object
                .keys( component.elements )
                .forEach(function(element){
                    [].slice.call(self.querySelectorAll( '.' + component.name + '_' + element ))
                    .forEach(function(_element){
                        var binds = [];
                        if( _element.attributes['data-bind'] ) binds = binds.concat( _element.attributes['data-bind'].value.split(',') );
                        binds = binds.concat( Object.keys(component.elements[element]) );
                        _element.setAttribute('data-bind', binds.join(',') );
                    })

                });
        }

        window.Component = Component;
        return Component;
    });

    document.body.innerHTML += "<div></div>";
})();