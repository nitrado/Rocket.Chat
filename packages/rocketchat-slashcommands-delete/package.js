Package.describe({
	name: 'rocketchat:slashcommands-delete',
	version: '0.0.1',
	summary: 'Deletes a group if you are admin with /delete',
	git: ''
});

Package.onUse(function(api) {
	api.versionsFrom('1.0');

	api.use([
		'coffeescript',
		'rocketchat:lib'
	]);
	api.addFiles('delete.coffee');
});
