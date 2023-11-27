package ca.polymtl.project.client.game.room

import ca.polymtl.project.client.game.manager.GameManager
import ca.polymtl.project.client.game.primitive.GameRoom

class SoloGameRoomFragment(gameRoom: GameRoom, gameManager: GameManager) : GameRoomFragment(gameRoom, gameManager) {
    override fun checkValidity() {
        if (gameRoom.getVirtualUsers().size != 1)
            setInvalid("Must have 1 Virtual Player")
        else
            setValid()
    }

    override fun getVirtualPlayerLimit(): Int {
        return 1
    }

    override fun getPlayerLimit(): Int {
        return 2
    }
}