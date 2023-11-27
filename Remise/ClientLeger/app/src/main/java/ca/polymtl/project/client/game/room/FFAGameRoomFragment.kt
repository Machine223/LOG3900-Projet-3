package ca.polymtl.project.client.game.room

import ca.polymtl.project.client.game.manager.FFAGameManager
import ca.polymtl.project.client.game.primitive.GameRoom

class FFAGameRoomFragment(gameRoom: GameRoom, gameManager: FFAGameManager) : GameRoomFragment(gameRoom, gameManager) {
    override fun checkValidity() {
        when {
            gameRoom.getRealUsers().size < 2 -> {
                setInvalid("Must have 2 human players")
            }
            gameRoom.getAllUsers().size < 3 -> {
                setInvalid("Must have 3 players")
            }
            else -> {
                setValid()
            }
        }
    }

    override fun getVirtualPlayerLimit(): Int {
        return 2
    }

    override fun getPlayerLimit(): Int {
        return 4
    }
}