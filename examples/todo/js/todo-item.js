define('todo-item',['Component'], function(Component, todoTemplate, footerTemplate){
	var todoItem = new Component('todo-item');

	todoItem.elements = {
		check: { change: itemChange },
		remove: { click:removeItem }
	};

	todoItem.bootstrap();
	return todoItem;
	 
	function itemChange(component, event){ 
		var $component = $(component);
		$component.toggleClass('completed', this.checked);
		Component.emit( 'item::change', {id:$component.data('id'), completed:this.checked} );
	};

	function removeItem(component, event){
		var $component = $(component);
		$component.remove();
		Component.emit( 'item::remove', {id:$component.data('id')} );
	}
});