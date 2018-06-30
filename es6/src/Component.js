class Component {
    constructor(nome) {
		this.nome = nome;
		this._events = {};
		this.events = {};
		this.elements = {};		
    }

    on(event, cb) { ( this._events[event] = this._events[event] || [] ).push(cb); }
   	
   	off(event, cb) {
        if (!this._events[event]) return;
        event = this._events[event];
        event.splice(event.indexOf(cb) >>> 0, 1);
    }

    emit(event) {
        let list = this._events[event]
        if (!list || !list[0]) return;
        let args = list.slice.call(arguments, 1);
        list.slice().map((i) => { i.apply(this, args) })
    }

    register(target, event, fn) {
        if (!this.events[event]) this.events[event] = {};
        if (!this.events[event][target]) this.events[event][target] = {};
        this.events[event][target] = fn;
    }

    install( component ){
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
}

export { Component };