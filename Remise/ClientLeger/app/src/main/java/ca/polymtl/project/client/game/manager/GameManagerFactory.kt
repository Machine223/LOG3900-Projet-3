package ca.polymtl.project.client.game.manager

import ca.polymtl.project.client.game.GameCommunications
import ca.polymtl.project.client.game.primitive.GameRoom

class GameManagerFactory private constructor() {
    companion object {
        fun create(gameMode: GameRoom.GameMode, gameRoom: GameRoom, communications: GameCommunications, onExit: Runnable): GameManager {
            return when (gameMode) {
                GameRoom.GameMode.FREE_FOR_ALL -> FFAGameManager(gameRoom, communications, onExit)
                GameRoom.GameMode.SPRINT_COOP -> CoopGameManager(gameRoom, communications, onExit)
                GameRoom.GameMode.SPRINT_SOLO -> SoloGameManager(gameRoom, communications, onExit)
            }
        }
    }

}