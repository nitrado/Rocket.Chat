###
# The command /delete deletes the current room
###

if Meteor.isClient
	RocketChat.slashCommands.add 'delete', undefined,
		description: 'Deletes the current channel'
		params: ''
else
	class Delete
		constructor: (command, params, item) ->
			if(command == "delete")
				try
					Meteor.call 'eraseRoom', item.rid
				catch err
					RocketChat.Notifications.notifyUser Meteor.userId(), 'message', {
						_id: Random.id()
						rid: item.rid
						ts: new Date
						msg: TAPi18n.__(err.error, null, Meteor.user().language)
					}

RocketChat.slashCommands.add('delete', Delete, {
	description: 'Slash_Delete_Description',
});
