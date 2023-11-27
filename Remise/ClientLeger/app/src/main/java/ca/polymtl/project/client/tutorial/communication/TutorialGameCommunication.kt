package ca.polymtl.project.client.tutorial.communication

import ca.polymtl.project.client.draw.communications.DrawingCommunication
import ca.polymtl.project.client.game.GameCommunications
import ca.polymtl.project.client.game.objects.*
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.game.primitive.GameRoomUser
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.manager.ProfileManager
import ca.polymtl.project.client.network.NetworkManager
import com.github.nkzawa.socketio.client.IO
import org.json.JSONObject
import java.util.*
import java.util.function.Consumer

class TutorialGameCommunication : GameCommunications(IO.socket("http://localhost/")) {

    var wordChosen = false

    var badGuessEmitted = false
    var goodGuessEmitted = false
    var wasHintAsked = false

    var currentDrawer = 0

    private var gameRoom: GameRoom? = null

    override fun getAllGameRooms(consumer: Consumer<Array<GameRoom>>) {
        val gameRoomsJsonArray = JSONObject(ApplicationManager.readFromAssets("all_gamerooms.json")).getJSONArray("gamerooms")
        val gameRooms: Array<GameRoom> = NetworkManager.deserialize(gameRoomsJsonArray.toString(), Array<GameRoom>::class.java)
        consumer.accept(gameRooms)
    }

    override fun emitNewGameroom(gameRoom: GameRoom) {
        this.gameRoom = gameRoom
        this.wordChosen = false
        badGuessEmitted = false
        goodGuessEmitted = false
        wasHintAsked = false

        this.currentDrawer = 0

        acceptNewGameroom(gameRoom)
    }

    override fun emitAddGameroomUser(gameRoomUser: GameRoomUser) {
        acceptAddGameroomUser(gameRoomUser)
        acceptAddGameroomUser(GameRoomUser("My Game", ProfileManager.getTutorialProfile().username))
    }

    override fun emitRemoveGameroomUser(gameRoomUser: GameRoomUser) {
    }

    override fun emitGoodGuess(goodGuess: WordGoodGuess) {
        if (!badGuessEmitted) {
            return
        }

        goodGuessEmitted = true
        getReceivers().forEach { r -> r.wordGoodGuessListener.accept(goodGuess) }
    }

    override fun emitBadGuess(badGuess: WordBadGuess) {
        if (badGuess.word == "pencil") {
            badGuessEmitted = true
            getReceivers().forEach { r -> r.wordBadGuessListener.accept(badGuess) }
        }
    }

    override fun emitHintAsked(hintAsked: HintAsked) {
        this.wasHintAsked = true
        getReceivers().forEach { r -> r.hintAskedListener.accept(hintAsked) }
    }

    override fun emitGameStart(gameRoom: GameRoom) {
        acceptGameStart(gameRoom)
    }

    override fun emitWordChoice(wordChoice: WordChoice) {
        wordChosen = true
        val turnInfo: TurnInfo = NetworkManager.deserialize(ApplicationManager.readFromAssets("turn_info_self.json"), TurnInfo::class.java)
        turnInfo.drawer = ApplicationManager.getProfile()!!.username
        turnInfo.virtualDrawing.word = wordChoice.words[0]

        acceptTurnInfo(turnInfo)

    }

    private fun acceptNewGameroom(gameRoom: GameRoom) {
        getReceivers().forEach { r -> r.newGameRoomListener.accept(gameRoom) }
    }

    private fun acceptAddGameroomUser(gameRoomUser: GameRoomUser) {
        getReceivers().forEach { r -> r.addGameRoomUserListener.accept(gameRoomUser) }
    }

    private fun acceptGameStart(gameRoom: GameRoom) {
        getReceivers().forEach { r ->
            r.gameStartListener.accept(gameRoom)
            r.wordChoiceListner.accept(WordChoice(gameRoom.gameroomName, arrayOf("banana", "apple", "computer")))
        }

        (DrawingCommunication.getInstance() as TutorialDrawingCommunication).attachToRoom(gameRoom)
    }

    private fun acceptTurnInfo(turnInfo: TurnInfo) {
        runInThread(
            Runnable {
                getReceivers().forEach { r ->
                    r.turnInfoListener.accept(turnInfo)
                }
            }
        )

        runInThread(
            Runnable {
                Thread.sleep(100)
                getReceivers().forEach { r ->
                    r.turnStartListener.accept(TurnStart(180, 3))
                }
            }
        )

        val gg = WordGoodGuess("My Game", ProfileManager.getTutorialProfile().username, 0)
        if (currentDrawer == 0) {
            runInThread(Runnable {
                while ((DrawingCommunication.getInstance() as TutorialDrawingCommunication).nDrawnObjects < 5)
                    Thread.sleep(100)

                Thread.sleep(500)
                val bg = WordBadGuess("My Game", ProfileManager.getTutorialProfile().username, "wtf")
                getReceivers().forEach { r -> r.wordBadGuessListener.accept(bg) }


                while ((DrawingCommunication.getInstance() as TutorialDrawingCommunication).nDrawnObjects < 10)
                    Thread.sleep(100)

                getReceivers().forEach { r ->
                    r.wordGoodGuessListener.accept(gg)
                    r.newScoreListener.accept(NewScore(75.0f, ProfileManager.getTutorialProfile().username))
                    r.newScoreListener.accept(NewScore(60.0f, ApplicationManager.getProfile()!!.username))
                }

                Thread.sleep(5000)
                getReceivers().forEach { r ->
                    r.turnEndListener.accept(TurnEnd())
                }

                Thread.sleep(1000)
                val ti = NetworkManager.deserialize(ApplicationManager.readFromAssets("turn_info_virtual.json"), TurnInfo::class.java)
                ti.drawer = gameRoom!!.getVirtualUsers()[0]
                currentDrawer++

                acceptTurnInfo(ti)
            })
        } else {
            runInThread(Runnable {
                while (!goodGuessEmitted)
                    Thread.sleep(100)

                getReceivers().forEach { r ->
                    r.wordGoodGuessListener.accept(gg)
                    r.newScoreListener.accept(NewScore(150.0f, ProfileManager.getTutorialProfile().username))
                    r.newScoreListener.accept(NewScore(135.0f, ApplicationManager.getProfile()!!.username))
                }

                Thread.sleep(10000)
                currentDrawer++
                getReceivers().forEach { r ->
                    r.gameEndListener.accept(gameRoom!!)
                }
            })
        }
    }

    private fun runInThread(runnable: Runnable) {
        object : Thread() {
            override fun run() {
                runnable.run()
            }
        }.start()
    }
}