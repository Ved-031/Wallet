import { InviteRaw, InviteUI } from "./types";

export const mapInviteToUI = (invite: InviteRaw): InviteUI => {
    return {
        id: invite.id,
        groupId: invite.group.id,
        groupName: invite.group.name,
        invitedBy: {
            id: invite.invitedBy,
            name: invite.inviter.name,
            avatar: invite.inviter.avatar,
        },
        createdAt: invite.createdAt,
    };
}
