# Component
Uma pequena biblioteca de criação de componentes BEM em js.

Esta biblioteca foi feita utilizando a conotação BEM, onde o componente é nossa **B**ase e a partir dele, encontramos seus **E**lementos.

Futuramente poderemos setar o estado através dos **M**odifiers, mas não hoje.


## Preparando o campo

Você precisará incluir no seu HTML  o RequireJS e apontar o atributo **data-main** com a localização do Component.js


```html
<script src="node_modules/requirejs/require.js" data-main="js/Component" ></script>
```

Desse modo a descoberta de componentes adicionados ao documento é feita de forma automática.

## Meu primeiro componente
Vamos criar um componente Hello World para ilustrar a funcionalidade de componentes dinâmicos

**index.html**

```html
<div class="hello" data-component="hello">
	<span class="hello_greeting"></span>
</div>
<script src="node_modules/requirejs/require.js" data-main="js/Component"></script>
```

**js/hello.js**

```js
define('hello',['Component'], function(Component,){

	var base = new Component('hello');
	base.install = install;
	base.bootstrap();

	return base;

	function install(){
		this.querySelector('.hello_greeting').innerHTML = "Hello World!";
	}

});
```
Não é necessária nenhuma outra ação para que o componente funcione, através do **mutation observer** a biblioteca encontra e instala os componentes da página.

O atributo **install** do objeto base será acionado para cada componente hello adicionado a página, tendo como escopo o próprio elemento do componente.

Nesse exemplo a função install está apenas adicionando o texto Hello World! no elemento greeting do nosso componente.

## Adicionando elementos a base

Vamos adicionar um botão para nosso componente Hello, que quando acionado criará outro componente hello no body.
Para isso devemos apenas adicionar a linha referente ao botão no componente html, ele deve conter a conotação BEM, sendo a base o nome do componente seguido de um underline e o nome do elemento
**[BASE]**\_**[elemento]** -> **hello**\_**add**

**Em index.html** 

```html
<button class="hello_add">Add a new hello to body</button>
```

**Em js/hello.js**

```js
base.elements = {
	new: { click: addNewHelloToBody }
};
	
 
function addNewHelloToBody(){
	var newHello = document.createElement('DIV');
	newHello.setAttribute('data-component', "hello");
	newHello.innerHTML = '<span class="hello_greeting"></span><button class="hello_new"> Add new Hello Component </button>';
	document.body.appendElement( newHello );
}
```

Definimos o elemento **add** adicionando uma chave ao objeto elements, e no element new definimos que seu evento **click** seja delegado a função **addNewHelloToBody**

Dessa forma a cada clique no botão um novo componente hello será inserido na página, na inserção a função **install** tratará  de adicionar o texto Hello World ao elemento **greeting**