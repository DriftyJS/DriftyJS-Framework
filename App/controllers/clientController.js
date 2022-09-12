const path = require("path");
const {Client} = require(path.join(__dirname, '../../Core/models/'));
const {ClientGroups} = require(path.join(__dirname, '../../Core/models/'));
const {Groups} = require(path.join(__dirname, '../../Core/models/'));

module.exports = {

    view: async (request, h) => {
        const clients = await Client.findAll();
        return h.view('clients', {clients: clients, activePage: 'clients'});
    },

    edit: async (request, h) => {
        const clientID = request.params.clientID;
        let client = [];
        let clientGroups = [];
        if (clientID) {
            client = await Client.findOne({ where: { id: clientID } });
            clientGroups = await ClientGroups.findAll({ where: { ClientId: clientID }, attributes: ["GroupId"], raw: true, nest: true })
                .then(function(clientGroups) {
                    return clientGroups.map(function(clientGroups) { return clientGroups.GroupId; })
                });
        }
        const groups = await Groups.findAll();
        return h.view('editclient', {client: client, clientGroups: clientGroups, groups: groups, activePage: 'client'});
    },

    saveEdit: async (request, h) => {
        let clientID = request.params.clientID
        const {username, clientGroups, activeClient} = request.payload;

        let active = false
        if (activeClient) {
            active = true;
        }

        if (clientID) {
            const updated = await Client.update(
                {
                    username: username,
                    active: active,
                },
                {
                    where: {id: clientID}
                }
            );
        } else {
            const newClient = await Client.create(
                {
                    username: username,
                    active: active,
                }
            );
            clientID = newClient.id;
        }

        await ClientGroups.destroy({ where: { ClientId: clientID } });

        if (ClientGroups) {
            for (const groupId of clientGroups) {
                await ClientGroups.create({
                    ClientId: clientID,
                    GroupId: groupId,
                });
            }
        }

        return 'test';
    },

    deleteUser: async(request, h) => {
        let clientID = request.params.clientID
        await ClientGroups.destroy({ where: { clientId: clientID } });
        await Client.destroy({ where: { id: clientID } });
        return true;
    },
}