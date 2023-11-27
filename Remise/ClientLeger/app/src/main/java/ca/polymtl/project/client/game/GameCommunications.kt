package ca.polymtl.project.client.game


import android.util.Log
import ca.polymtl.project.client.chat.communications.ChatCommunications
import ca.polymtl.project.client.draw.communications.DrawingCommunication
import ca.polymtl.project.client.game.objects.*
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.game.primitive.GameRoomUser
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.network.CommunicationsHandler
import ca.polymtl.project.client.network.NetworkManager
import ca.polymtl.project.client.network.SocketEventHandler
import ca.polymtl.project.client.tutorial.TutorialManager
import ca.polymtl.project.client.tutorial.communication.TutorialDrawingCommunication
import ca.polymtl.project.client.tutorial.communication.TutorialGameCommunication
import com.github.nkzawa.socketio.client.Socket
import org.json.JSONObject
import java.util.function.Consumer
import java.util.function.Supplier

open class GameCommunications protected constructor(socket: Socket) : CommunicationsHandler<GameCommunications.Dispatcher>(Supplier { Dispatcher() }) {
    companion object {
        private var instance: GameCommunications? = null
        private var tutorialInstance = TutorialGameCommunication()

        fun getInstance(): GameCommunications {
            if (TutorialManager.isTutorialMode())
                return tutorialInstance

            return instance!!
        }

        fun newInstance(socket: Socket) {
            instance = GameCommunications(socket)
        }

        fun newTutorialInstance() {
            tutorialInstance = TutorialGameCommunication()
        }
    }

    class Dispatcher : CommunicationsHandler.EventDispatcher() {
        var newGameRoomListener = Consumer<GameRoom> { }
        var deleteGameRoomListener = Consumer<GameRoom> { }
        var addGameRoomUserListener = Consumer<GameRoomUser> { }
        var removeGameRoomUserListener = Consumer<GameRoomUser> { }
        var gameStartListener = Consumer<GameRoom> { }
        var gameEndListener = Consumer<GameRoom> { }

        var turnStartListener = Consumer<TurnStart> { }
        var turnEndListener = Consumer<TurnEnd> { }

        var turnInfoListener = Consumer<TurnInfo> { }

        var newScoreListener = Consumer<NewScore> { }
        var attemptConsumedListener = Consumer<AttemptConsumed> { }

        var wordGoodGuessListener = Consumer<WordGoodGuess> { }
        var wordBadGuessListener = Consumer<WordBadGuess> { }

        var wordChoiceListner = Consumer<WordChoice> { }
        var hintAskedListener = Consumer<HintAsked> { }
    }

    private val newGameroomEventHandler = SocketEventHandler<GameRoom>(socket, "gameroom_new")
    private val deleteGameroomEventHandler = SocketEventHandler<GameRoom>(socket, "gameroom_delete")
    private val addGameroomUserEventHandler = SocketEventHandler<GameRoomUser>(socket, "gameroom_add_user")
    private val removeGameroomUserEventHandler = SocketEventHandler<GameRoomUser>(socket, "gameroom_remove_user")

    private val gameStartEventHandler = SocketEventHandler<GameRoom>(socket, "game_start")
    private val gameEndEventHandler = SocketEventHandler<GameRoom>(socket, "game_end")

    private val turnStartEventHandler = SocketEventHandler<TurnStart>(socket, "turn_start")
    private val turnEndEventHandler = SocketEventHandler<TurnEnd>(socket, "turn_end")
    private val turnInfoEventHandler = SocketEventHandler<TurnInfo>(socket, "turn_info")

    private val wordChoiceEventHandler = SocketEventHandler<WordChoice>(socket, "word_choice")
    private val goodGuessEventHandler = SocketEventHandler<WordGoodGuess>(socket, "good_guess")
    private val badGuessEventHandler = SocketEventHandler<WordBadGuess>(socket, "bad_guess")
    private val hintAskedHandler = SocketEventHandler<HintAsked>(socket, "hint_asked")

    private val newScoreEventHandler = SocketEventHandler<NewScore>(socket, "new_score")

    private val attemptConsumedEventHandler = SocketEventHandler<AttemptConsumed>(socket, "attempt_consumed")

    init {
        newGameroomEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.newGameRoomListener, data)
        })

        deleteGameroomEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.deleteGameRoomListener, data)
        })

        addGameroomUserEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.addGameRoomUserListener, data)
        })

        removeGameroomUserEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.removeGameRoomUserListener, data)
        })


        gameStartEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.gameStartListener, data)
        })

        gameEndEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.gameEndListener, data)
        })


        turnStartEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.turnStartListener, data)
        })

        turnEndEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.turnEndListener, data)
        })


        turnInfoEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.turnInfoListener, data)
        })


        newScoreEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.newScoreListener, data)
        })

        attemptConsumedEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.attemptConsumedListener, data)
        })


        goodGuessEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.wordGoodGuessListener, data)
        })

        badGuessEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.wordBadGuessListener, data)
        })

        wordChoiceEventHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.wordChoiceListner, data)
        })

        hintAskedHandler.addListener(Consumer { data ->
            for (receiver in getReceivers())
                receiver.newEvent(receiver.hintAskedListener, data)
        })
    }

    open fun getAllGameRooms(consumer: Consumer<Array<GameRoom>>) {
        NetworkManager.Rest.get("/gamerooms", null, Consumer { data ->
            val gameRoomsJsonArray = JSONObject(data).getJSONArray("gamerooms")
            val gameRooms: Array<GameRoom> = NetworkManager.deserialize(gameRoomsJsonArray.toString(), Array<GameRoom>::class.java)
            consumer.accept(gameRooms)
        })
    }

    open fun emitNewGameroom(gameRoom: GameRoom) {
        newGameroomEventHandler.emit(gameRoom)
    }

    open fun emitAddGameroomUser(gameRoomUser: GameRoomUser) {
        addGameroomUserEventHandler.emit(gameRoomUser)
    }

    open fun emitRemoveGameroomUser(gameRoomUser: GameRoomUser) {
        removeGameroomUserEventHandler.emit(gameRoomUser)
    }

    open fun emitGoodGuess(goodGuess: WordGoodGuess) {
        goodGuessEventHandler.emit(goodGuess)
    }

    open fun emitBadGuess(badGuess: WordBadGuess) {
        badGuessEventHandler.emit(badGuess)
    }

    open fun emitHintAsked(hintAsked: HintAsked) {
        hintAskedHandler.emit(hintAsked)
    }

    open fun emitGameStart(gameRoom: GameRoom) {
        gameStartEventHandler.emit(gameRoom)
    }

    open fun emitWordChoice(wordChoice: WordChoice) {
        wordChoiceEventHandler.emit(wordChoice)
    }
}