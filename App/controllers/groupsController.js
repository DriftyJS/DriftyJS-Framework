const path = require("path");
const {Groups} = require(path.join(__dirname, '../../Core/models/'));
const {Channels} = require(path.join(__dirname, '../../Core/models/'));


module.exports = {
    view: async(request, h) => {
        const groups = await Groups.findAll(
              {
                  include: {
                      model: Channels,
                  },
                  where: { UserId: global.userID }
                }
            );
        return h.simsView('groups', {groups: groups, activePage: 'playlists'});
    },

    editView: async(request, h) => {
        const groupID = request.params.groupID;
        let group = [];
        if (groupID) {
            group = await Groups.findOne({ where: { id: groupID, UserId: global.userID } });
        }
        return h.simsView('editGroup', {group: group, activePage: 'playlists'});
    },

    editSave: async(request, h) => {
        const groupID = request.params.groupID;
        let {name, mapped, VOD} = request.payload;

        if (!VOD) {
          VOD = 0;
        }

        if (groupID) {
            await Groups.update(
                {
                    name: name,
                    mapped: mapped,
                    VOD: VOD,
                },
                {
                    where: {id: groupID, UserId: global.userID}
                }
            );
        } else {
            await Groups.create(
                {
                    name: name,
                    mapped: mapped,
                    VOD: VOD,
                    UserId: global.userID
                }
            );
        }

        return 'test';
    },

    deleteGroup: async(request, h) => {
        const groupID = request.params.groupID;
        await Channels.destroy({ where: { GroupId: groupID, UserId: global.userID } });
        await Groups.destroy({ where: { id: groupID, UserId: global.userID } });
        return 'test';
    },
};
