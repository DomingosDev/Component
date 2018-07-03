(function() {
    var handledEvents = ['blur', 'change', 'focus', 'focusin', 'focusout', 'select', 'submit', 'click', 'contextmenu', 'dblclick', 'hover', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'keydown', 'keypress', 'keyup', 'resize', 'scroll'];
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
                module.install.call(self);
                self.installed = true;
            });
        });
    };


    function insereElemento(c,element){

         var component = ( element.attributes['data-component'] )? element.attributes['data-component'].value : '' ;
        
        if( component ){
            element.component = component;
            c.last_component[ component ] = {
                element : element,
                name : component,
                elements : []
            };
            c.components.push( c.last_component[component] );
        }

        var classList = element.className.split(' ');
        var l = classList.length;
        for(var i=0; i<l; i++){
            var _class = classList[i];
            var _i = _class.indexOf('_');
            if( _i  == -1 ) continue;
            if( _class.indexOf('--') != -1 ) continue;
            if( _i != _class.lastIndexOf('_') ) continue;

            var parts = _class.split('_');
            if(!c.last_component[ parts[0] ]) continue;
            c.last_component[ parts[0] ].elements.push( {
                name : _class,
                element : element
            });
        }

        return c;
    }

    function componentEvent(event) {
        if( !event.target || !event.target.tagName || ['HTML', 'BODY'].indexOf( event.target.tagName ) != -1  ) return;

        var element = event.target;
        var element_list = [];

        while( element != document.body ){
            element_list.push( element );
            element = element.parentElement;
        }

        var data = element_list.reverse().reduce( insereElemento, { 
            waiting_components : {},
            components : [],
            last_component : {}
        });

        var called = [];
        data.components.reverse().forEach(function(component){
            require( [component.name], function(module) { 
                if( !module.events[event.type] ) return;

                component.elements
                            .reverse()
                            .forEach(function(element){
                                if( !module.events[ event.type ][ element.name ] ) return;
                                if( called.indexOf( module.events[ event.type ][ element.name ] ) != -1 ) return;
                                module.events[ event.type ][ element.name ].call( element.element, component.element, event );
                                called.push( module.events[ event.type ][ element.name ] );
                            });

            });
        });

       return;
    }

    define('Component', [], function() {
        function Component(name) {
            this.name = name;
            return this
        };

        Component._events = {};
        Component.instances = [];
        Component.on = function() {
            on.apply(Component, arguments);
        }
        Component.off = function() {
            off.apply(Component, arguments);
        }
        Component.emit = function() {
            emit.apply(Component, arguments);
        }
        Component.prototype = {
            on: on,
            off: off,
            emit: emit,
            _events: {},
            events: {},
            elements: {},
            register: register,
            bootstrap: bootstrap,
            install: function() {}
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

        var el = document.createElement('DIV');
        document.body.appendChild(el);
        document.body.removeChild(el);

        window.Component = Component;
        return Component;
    });

})();