RocketChat.QueueMethods = {
	/* Least Amount Queuing method:
	 *
	 * default method where the agent with the least number
	 * of open chats is paired with the incoming livechat
	 */
	'Least_Amount' : function(guest, message, roomInfo) {
		const agent = RocketChat.Livechat.getNextAgent(guest.department);
		if (!agent) {
			throw new Meteor.Error('no-agent-online', 'Sorry, no online agents');
		}

		const roomCode = RocketChat.models.Rooms.getNextLivechatRoomCode();

		const room = _.extend({
			_id: message.rid,
			msgs: 1,
			lm: new Date(),
			code: roomCode,
			label: guest.name || guest.username,
			usernames: [agent.username, guest.username],
			t: 'l',
			ts: new Date(),
			v: {
				_id: guest._id,
				token: message.token
			},
			servedBy: {
				_id: agent.agentId,
				username: agent.username
			},
			open: true
		}, roomInfo);
		let subscriptionData = {
			rid: message.rid,
			name: guest.name || guest.username,
			alert: true,
			open: true,
			unread: 1,
			answered: false,
			code: roomCode,
			u: {
				_id: agent.agentId,
				username: agent.username
			},
			t: 'l',
			desktopNotifications: 'all',
			mobilePushNotifications: 'all',
			emailNotifications: 'all'
		};

		RocketChat.models.Rooms.insert(room);
		RocketChat.models.Subscriptions.insert(subscriptionData);

		return room;
	},
	/* Guest Pool Queuing Method:
	 *
	 * An incomming livechat is created as an Inquiry
	 * which is picked up from an agent.
	 * An Inquiry is visible to all agents (TODO: in the correct department)
     *
	 * A room is still created with the initial message, but it is occupied by
	 * only the client until paired with an agent
	 */
	'Guest_Pool' : function(guest, message, roomInfo) {
		const agents = RocketChat.Livechat.getAgents(guest.department);
		if (!agents) {
			throw new Meteor.Error('no-agent-online', 'Sorry, no online agents');
		}

		const roomCode = RocketChat.models.Rooms.getNextLivechatRoomCode();

		const agentIds = [];

		agents.forEach((agent) => {
			if (guest.department) {
				agentIds.push(agent.agentId);
			} else {
				agentIds.push(agent._id);
			}
		});

		var inquiry = {
			rid: message.rid,
			message: message.msg,
			name: guest.name || guest.username,
			ts: new Date(),
			code: roomCode,
			department: guest.department,
			agents: agentIds,
			status: 'open'
		};
		const room = _.extend({
			_id: message.rid,
			msgs: 1,
			lm: new Date(),
			code: roomCode,
			label: guest.name || guest.username,
			usernames: [guest.username],
			t: 'l',
			ts: new Date(),
			v: {
				_id: guest._id,
				token: message.token
			},
			open: true
		}, roomInfo);
		RocketChat.models.LivechatInquiry.insert(inquiry);
		RocketChat.models.Rooms.insert(room);

		return room;
	}
};
