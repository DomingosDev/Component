'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
    function Component(nome) {
        _classCallCheck(this, Component);

        this.nome = nome;
        this._events = {};
        this.events = {};
        this.elements = {};
    }

    _createClass(Component, [{
        key: 'on',
        value: function on(event, cb) {
            (this._events[event] = this._events[event] || []).push(cb);
        }
    }, {
        key: 'off',
        value: function off(event, cb) {
            if (!this._events[event]) return;
            event = this._events[event];
            event.splice(event.indexOf(cb) >>> 0, 1);
        }
    }, {
        key: 'emit',
        value: function emit(event) {
            var _this = this;

            var list = this._events[event];
            if (!list || !list[0]) return;
            var args = list.slice.call(arguments, 1);
            list.slice().map(function (i) {
                i.apply(_this, args);
            });
        }
    }, {
        key: 'register',
        value: function register(target, event, fn) {
            if (!this.events[event]) this.events[event] = {};
            if (!this.events[event][target]) this.events[event][target] = {};
            this.events[event][target] = fn;
        }
    }, {
        key: 'install',
        value: function install(component) {
            var self = this;
            Object.keys(component.elements).forEach(function (element) {
                [].slice.call(self.querySelectorAll('.' + component.name + '_' + element)).forEach(function (_element) {
                    var binds = [];
                    if (_element.attributes['data-bind']) binds = binds.concat(_element.attributes['data-bind'].value.split(','));
                    binds = binds.concat(Object.keys(component.elements[element]));
                    _element.setAttribute('data-bind', binds.join(','));
                });
            });
        }
    }]);

    return Component;
}();

exports.Component = Component;