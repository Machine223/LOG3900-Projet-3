package ca.polymtl.project.client.game

import android.os.Bundle
import android.view.View
import androidx.core.view.children
import ca.polymtl.project.client.R
import ca.polymtl.project.client.fragment.InflatedLayoutFragment
import ca.polymtl.project.client.game.manager.GameManager
import ca.polymtl.project.client.game.manager.GameManagerFactory
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.game.primitive.GameRoomUser
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.profile.UserProfile
import kotlinx.android.synthetic.main.fragment_game_room_list.*
import java.util.function.Consumer

class GameRoomListFragment(private val userProfile: UserProfile, private val onBackRunnable: Runnable) : InflatedLayoutFragment(R.layout.fragment_game_room_list) {
    private val communications = GameCommunications.getInstance()

    private var gameManager: GameManager? = null

    private val onJoin = Consumer<GameRoom> { gameRoom ->
        communications.emitAddGameroomUser(getGameRoomUser(gameRoom))
    }

    private var gameMode: GameRoom.GameMode? = null
    private var gameDifficulty: GameRoom.GameDifficulty? = null

    private val gameRooms = HashMap<String, GameRoom>()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        gameRooms.clear()

        val receiver = communications.addReceiver(this)
        communications.pause(this)

        receiver.newGameRoomListener = Consumer { gameRoom ->
            addGameroom(gameRoom)
            if (gameRoom.hasUser(userProfile.username)) {
                enterGameRoom(gameRoom)
            }
        }

        receiver.deleteGameRoomListener = Consumer { gameRoom -> removeGameRoom(gameRoom) }

        receiver.addGameRoomUserListener = Consumer { gameRoomUser ->
            val gameRoom = gameRooms[gameRoomUser.gameroomName]
            gameRoom!!.addUser(gameRoomUser.username)
            refreshGameroomView(gameRoom)

            if (gameRoomUser.username == userProfile.username) {
                enterGameRoom(gameRoom)
            }
        }

        receiver.removeGameRoomUserListener = Consumer { gameRoomUser ->
            val gameRoom = gameRooms[gameRoomUser.gameroomName]
            if (gameRoom != null) {
                gameRoom.removeUser(gameRoomUser.username)
                refreshGameroomView(gameRoom)
            }
        }

        receiver.gameStartListener = Consumer { gameStart ->
            val gameRoom = gameRooms[gameStart.gameroomName]!!
            gameRoom.isInGame = true
            refreshGameroomView(gameRoom)
        }

        receiver.gameEndListener = Consumer { gameStart ->
            val gameRoom = gameRooms[gameStart.gameroomName]!!
            gameRoom.isInGame = false
            refreshGameroomView(gameRoom)
        }


        communications.getAllGameRooms(Consumer { gameRooms ->
            gameRooms.forEach { gameRoom -> addGameroom(gameRoom) }
        })

        game_mode_name_text.text = gameMode?.getValue() ?: "All"
        game_difficulty_name_text.text = gameDifficulty?.getValue() ?: "All"

        val newGameRoomRunnable = Runnable {
            val newGameroomName = new_game_room_name_text.text.toString().trim()
            new_game_room_name_text.text.clear()

            if (newGameroomName.isNotEmpty() && !gameRooms.containsKey(newGameroomName)) {

                val users = ArrayList<String>(0)
                users.add(userProfile.username)

                val gameRoom = GameRoom(
                    newGameroomName,
                    GameRoom.GameMode.values().indexOf(this.gameMode),
                    GameRoom.GameDifficulty.values().indexOf(this.gameDifficulty),
                    users,
                    false
                )

                ApplicationManager.clearFocus(new_game_room_name_text)
                communications.emitNewGameroom(gameRoom)
            }
        }

        new_game_room_button.setOnClickListener {
            newGameRoomRunnable.run()
        }

        new_game_room_name_text.setOnEditorActionListener { _, _, _ ->
            newGameRoomRunnable.run()
            true
        }


        back_button_list.setOnClickListener { onBackRunnable.run() }

        communications.start(this)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        communications.pause(this)
    }

    fun setParameters(gameMode: GameRoom.GameMode?, gameDifficulty: GameRoom.GameDifficulty?) {
        this.gameMode = gameMode
        this.gameDifficulty = gameDifficulty
    }

    private fun addGameroom(gameRoom: GameRoom) {
        if (gameRooms.containsKey(gameRoom.gameroomName))
            return

        gameRooms[gameRoom.gameroomName] = gameRoom

        if (context != null) {
            displayGameroom(gameRoom)
        }
    }

    private fun removeGameRoom(gameRoom: GameRoom) {
        gameRooms.remove(gameRoom.gameroomName)

        if (context != null) {
            game_room_list_item_container.post { game_room_list_item_container.removeView(findView(gameRoom)) }
        }
    }

    private fun findView(gameRoom: GameRoom): GameRoomItemView? {
        for (v in game_room_list_item_container.children) {
            if (v is GameRoomItemView && v.gameRoom.gameroomName == gameRoom.gameroomName) {
                return v
            }
        }

        return null
    }

    private fun refreshGameroomView(gameRoom: GameRoom) {
        if (context != null) {
            val view = findView(gameRoom)
            view?.post { view.refresh() }
        }
    }

    private fun displayGameroom(gameRoom: GameRoom) {
        if ((gameMode == null || gameRoom.getGameMode() == gameMode) &&
            (gameDifficulty == null || gameRoom.getDifficulty() == gameDifficulty)
        ) {
            game_room_list_item_container.post { game_room_list_item_container.addView(createItemView(gameRoom)) }
        }
    }

    private fun createItemView(gameRoom: GameRoom): GameRoomItemView {
        return GameRoomItemView(gameRoom, onJoin, requireContext(), null)
    }

    private fun enterGameRoom(gameRoom: GameRoom) {
        gameManager = GameManagerFactory.create(gameMode!!, gameRoom, communications, Runnable {
            ApplicationManager.navigateTo(this)
            gameManager = null
        })

        gameManager!!.enterRoom()
    }

    private fun getGameRoomUser(gameRoom: GameRoom): GameRoomUser {
        return GameRoomUser(gameRoom.gameroomName, userProfile.username)
    }

}