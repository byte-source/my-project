// file my-view

var app = app || {};
var Mn = Marionette;
var todoList;
var todoView;

app.TodoItemModel = Backbone.Model.extend({
	defaults: {
		taskName: "this is the default todo item"
	},
	initialize: function () {
		this.on('change:taskName', function () {
			// if(this.get('title') === '') {
			// 	this.set({title:"this is the main title of the page"});
			// }
		})
	}
});

app.TodoListCollection = Backbone.Collection.extend({
	model: app.TodoItemModel,

	initialize: function () {
		console.log("collection is created");
	}
});



todoListCollection = new app.TodoListCollection();

app.todoItemView = Mn.ItemView.extend({
	
	template: Handlebars.compile($("#todoItemTmpl").html()),

	initialize: function (item) {
		this.model = item;
		this.render();
	},

	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

// main todo view
app.TodoView = Mn.ItemView.extend({
	
	template: Handlebars.compile($("#todoRegionTmpl").html()),

	collection: todoListCollection,

	initialize: function (options) {		
		var that = this;
		todoListCollection.bind('add', function(model){
			console.log("a model is added", this.models.length);
			that.addItem(model);
		})
	},
	addItem: function(item) {
		var newItem = new app.todoItemView(item);
		this.$el.append(newItem.$el);
	},
	onShow: function () {
	},
	render: function () {
		this.$el.html(this.template);
	}
});

todoView = new app.TodoView({ collection: todoList });
// Upper layout view

app.UpperView = Mn.LayoutView.extend({
	el: ".myapp",
	template: Handlebars.compile($("#myTemplate").html()),

	regions: {
		firstRegion: "#todoRegion"
	},

	ui: {
		'todoForm': '#todoForm'
	},

	bindings: {
		'#todoText' : {
			observe: 'todoValue',
			events: ['change'],
			onSet: function (value) {
				debugger;
				return value;
			},
			setOptions: {
				validate: true
			}
		},
	},

	events: {
		//'submit @ui.todoForm': "submitHandler"
	},

	submitHandler: function (e) {
		e.preventDefault();
		var value = $(this.ui.todoForm).find('input[type="text"]').val();
		var item = new app.TodoItemModel({ 'taskName': value });
		todoListCollection.push(item);
		console.log("a new todo item is added");
		console.log(todoListCollection.collection);
	},

	initialize: function () {
		this.render();
	},


	render: function () {
		this.$el.html(this.template);
		this.firstRegion.show(todoView);
	}
});

new app.UpperView();


---------------------------------------------------
<!doctype html>
<html lang="en" data-framework="backbonejs">
	<head>
		<meta charset="utf-8">
		<title>example</title>
		<link rel="stylesheet" href="node_modules/todomvc-common/base.css">
		<link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
	</head>
	<body>
		<section class="myapp">
		</section>
		
		<script type="text/template" id="myTemplate">
			<h1>add a todo item</h1>

			<form id="todoForm">
				<input type="text" id="todoText" name="todoValue">
				<button type="submit">Add</button>
			</form>

			<div id='todoRegion'> </div>		
		</script>

		<script type="text/template" id="todoRegionTmpl">
		</script>

		<script type="text/template" id="todoItemTmpl">
			<div>{{taskName}}</div>
		</script>

		<script src="node_modules/todomvc-common/base.js"></script>
		<script src="node_modules/jquery/dist/jquery.js"></script>
		<script src="node_modules/underscore/underscore.js"></script>
		<script src="js/handlebars.js"></script>
		<script src="node_modules/backbone/backbone.js"></script>
		<script src="js/backbone.marionette.js"></script>
		<script src="node_modules/backbone.localstorage/backbone.localStorage.js"></script>
		<script src="js/models/my-model.js"></script>
		<script src="js/views/my-view.js"></script>
	</body>
</html>
