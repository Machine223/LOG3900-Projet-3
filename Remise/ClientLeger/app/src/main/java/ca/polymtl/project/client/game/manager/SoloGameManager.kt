package ca.polymtl.project.client.game.manager

import ca.polymtl.project.client.game.GameCommunications
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.game.room.GameRoomFragment
import ca.polymtl.project.client.game.room.SoloGameRoomFragment

class SoloGameManager(
    gameRoom: GameRoom,
    gameCommunications: GameCommunications,
    onExit: Runnable
) :
    CoopGameManager(gameRoom, gameCommunications, onExit) {

    override fun createRoomFragment(): GameRoomFragment {
        val frag = SoloGameRoomFragment(gameRoom, this)
        frag.setChat(chatChannel)
        return frag
    }
}

