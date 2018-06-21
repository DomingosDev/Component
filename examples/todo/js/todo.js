define('todo',['Component', 'text!../html/todo-item.html', 'text!../html/footer.html'], function(Component, todoTemplate, footerTemplate){
	var todo = new Component('todo');
	todo.install = install;

	todo.elements = {
		new: { keyup: onNewKeyup }
	};



	todo.bootstrap();
	return todo;

	function install(){
		var self = this;
		self.state = {
			todos:[]
		};

		Component.install.call(self, todo);
		Component.on('item::change', setItemStatus);
		Component.on('item::remove', removeItem);

		return render(self);

		function setItemStatus(status){
			var l = self.state.todos.length;
			var item = null;
			for(var i=0; i<l; i++){
				if( self.state.todos[i].id != status.id ) continue;
				item = self.state.todos[i];
				break;
			}
			if(!item) return;
			Object.keys( status ).forEach(function(key){ item[key] = status[key]; });
		}

		function removeItem(item){
			var l = self.state.todos.length;

			for(var i=0; i<l; i++){
				if( self.state.todos[i].id != item.id ) continue;
				self.state.todos.splice(i,1);
				break;
			}
		}

		
	}
	
	function render(root){
		$('.todo_list', root).html(Mustache.render(todoTemplate, root.state.todos));
	}	

	

	function onNewKeyup(component, event){
		if( event.which != 13 ) return;
		component.state.todos.push( new Todo( new Date().getTime(), this.value) );
		this.value = "";
		render(component);
	}

	function Todo( id, title ){
		this.title = title || "";
		this.id = id || 0;
		this.completed = false;
		return this;
	}
});