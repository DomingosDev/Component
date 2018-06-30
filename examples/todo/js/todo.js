define('todo',['Component', 'text!../html/todo-item.html', 'text!../html/footer.html'], function(Component, todoTemplate, footerTemplate){
	var todo = new Component('todo');
	todo.install = install;

	todo.elements = {
		new: { keyup: onNewKeyup },
		'tab-btn': { click: onChangeTab },
		'clear-completed': { click: clearCompleted},
		'check': { click: checkToggle },
		'remove': { click: onRemove },
	};

	todo.bootstrap();
	return todo;

	function checkToggle(component, event){
		var item = this;
		
		while( !item.attributes['data-id'] && item != document.body ){ item = item.parentElement; }
		if(!item.attributes['data-id']) return;

		var id = item.attributes['data-id'].value;
		var l = component.state.todos.length;

		for(var i=0; i<l; i++){
			if( component.state.todos[i].id != id) continue;
			component.state.todos[i].completed = this.value;
			break;
		}

	}
	function onRemove(component, event){
		var item = this; 

		while( !item.attributes['data-id'] && item != document.body ){ item = item.parentElement; }
		if(!item.attributes['data-id']) return;
		
		var id = item.attributes['data-id'].value;
		var l = component.state.todos.length;

		for(var i=0; i<l; i++){
			if( component.state.todos[i].id != id) continue;
			component.state.todos.splice(i,1);
			break;
		}

		render(component);
	}

	function install(){
		var self = this;
		self.state = {
			todos:[],
			tab: 1
		};

		Component.install.call(self, todo);
		return render(self);

	}
	
	function render(component){
		setTimeout(function(){
			component.state.activeTodoWord = component.state.todos.filter(function(e){ return !e.completed }).length;
			component.state.isAll    = component.state.tab == 1;
			component.state.isActive = component.state.tab == 2;
			component.state.isCompleted   = component.state.tab == 3;
			component.state.completedTodos = component.state.todos.filter(function(todo){ return todo.completed; }).length;

			$('.todo_list', component).html(
				Mustache.render(todoTemplate, component.state.todos.filter(function(todo){
					if( component.state.isAll ) return true;
					if( component.state.isActive && !todo.completed) return true;
					if( component.state.isCompleted && todo.completed) return true;
					return false;
				}))
			);
			$('#footer', component).html( Mustache.render(footerTemplate, component.state) );


			
			if( component.state.todos.length ) return $('#footer', component).fadeIn(100);
			$('#footer', component).fadeOut(100);
		})
	}	

	function clearCompleted(component, event){
		component.state.todos = component.state.todos.filter(function(todo){ return !todo.completed ;});
		render( component );
	}

	function onChangeTab(component, event){
		if( !this.attributes['data-tab'] ) return;
		component.state.tab = this.attributes['data-tab'].value;
		return render(component);
	}	

	function onNewKeyup(component, event){
		if( event.which != 13 || !this.value) return;
		component.state.todos.push( new Todo( new Date().getTime(), this.value) );
		if(component.state.tab == 3)component.state.tab = 1;
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