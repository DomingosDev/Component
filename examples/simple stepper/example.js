define('example', ['Component'], function(Component){
	var example = new Component('example');

	example.elements.plus = { click: addToInput };
	example.elements.minus = { click: removeFromInput };
	example.elements.input = { change: onInputChange };

	example.bootstrap();
	return example;

	function addToInput(component, event){
		var input = component.querySelector('.example_input');
		input.value = parseInt(input.value) + 1;
		input.dispatchEvent( new Event('change', { bubbles: true }) );
	}

	function removeFromInput(component, event){
		var input = component.querySelector('.example_input');
		input.value -= 1;
		input.dispatchEvent( new Event('change', { bubbles: true }) );
	}

	function onInputChange(component, event){
		component.querySelector('.example_result').innerHTML = this.value;
	}
})