package ca.polymtl.project.client.game.manager

import androidx.annotation.CallSuper
import androidx.fragment.app.DialogFragment
import ca.polymtl.project.client.R
import ca.polymtl.project.client.chat.communications.ChatCommunications
import ca.polymtl.project.client.chat.objects.channel.ChatChannel
import ca.polymtl.project.client.game.GameCommunications
import ca.polymtl.project.client.game.GameFragment
import ca.polymtl.project.client.game.objects.*
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.game.primitive.GameRoomUser
import ca.polymtl.project.client.game.room.GameRoomFragment
import ca.polymtl.project.client.game.score.ScoreBoardFragment
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.manager.SoundManager
import ca.polymtl.project.client.tutorial.TutorialManager
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import java.util.function.Consumer


abstract class GameManager(protected val gameRoom: GameRoom, protected val communications: GameCommunications, private val onExit: Runnable) {
    protected var scoreBoardFragment: ScoreBoardFragment = createNewScoreBoard()

    protected var chatChannel: ChatChannel? = null

    protected val profile = ApplicationManager.getProfile()!!

    var gameRoomFragment: GameRoomFragment? = null

    protected var gameFragment: GameFragment? = null

    private var currentDialog: DialogFragment? = null

    init {
        val receiver = communications.addReceiver(this)

        receiver.turnInfoListener = Consumer { turnInfo ->
            newTurnInfo(turnInfo)
        }

        receiver.turnStartListener = Consumer { ts ->
            turnStart(ts)
        }

        receiver.turnEndListener = Consumer {
            turnEnd()
        }

        receiver.attemptConsumedListener = Consumer {
            attemptConsumed()
        }

        receiver.wordGoodGuessListener = Consumer { goodGuess ->
            wordGoodGuessConsumed(goodGuess)
        }

        receiver.wordBadGuessListener = Consumer { badGuess ->
            wordBadGuessConsumed(badGuess)
        }

        receiver.hintAskedListener = Consumer { hintAsked ->
            hintAskedConsumed(hintAsked)
        }

        receiver.gameStartListener = Consumer { game ->
            if (game.gameroomName == gameRoom.gameroomName) {
                startGame()
            }
        }

        receiver.newScoreListener = Consumer { score ->
            updateScore(score)
        }

        receiver.gameEndListener = Consumer { gameRoom ->
            if (gameRoom.gameroomName == this.gameRoom.gameroomName) {
                enterRoom()
                gameEnd()
            }
        }

        receiver.addGameRoomUserListener = Consumer { gameRoomUser ->
            if (gameRoomUser.gameroomName == gameRoom.gameroomName) {
                gameRoomFragment?.addNewPlayer(gameRoomUser.username)
                scoreBoardFragment.addUser(gameRoomUser.username)
            }
        }

        receiver.removeGameRoomUserListener = Consumer { gameRoomUser ->
            if (gameRoomUser.gameroomName == gameRoom.gameroomName) {
                gameRoomFragment?.removePlayer(gameRoomUser.username)
                scoreBoardFragment.removeUser(gameRoomUser.username)
            }
        }

        receiver.wordChoiceListner = Consumer { wordChoice ->
            if (wordChoice.gameroomName == gameRoom.gameroomName) {
                chooseWord(wordChoice.words)
            }
        }

        if (!TutorialManager.isTutorialMode()) {
            val chatCommunications = ChatCommunications.getInstance()

            val shitex = Mutex()
            var found = false
            GlobalScope.launch {
                while (!found) {
                    shitex.lock()
                    chatCommunications.getAllChannels(Consumer { channels ->
                        for (channel in channels) {
                            if (channel.isGameChannel && channel.users.contains(ApplicationManager.getProfile()!!.username)) {
                                setChat(channel)
                                chatCommunications.removeReceiver(this)
                                found = true

                                break
                            }
                        }

                        shitex.unlock()
                    })
                }
            }
        }

        communications.start(this)
    }

    fun addUser(username: String) {
        communications.emitAddGameroomUser(GameRoomUser(gameRoom.gameroomName, username))
    }

    fun removeUser(username: String) {
        communications.emitRemoveGameroomUser(GameRoomUser(gameroomName = gameRoom.gameroomName, username = username))
    }

    @CallSuper
    open fun enterRoom() {
        gameRoomFragment = createRoomFragment()
        ApplicationManager.navigateTo(gameRoomFragment!!)
    }

    fun emitStartGame() {
        communications.emitGameStart(gameRoom)
    }

    fun emitWordChoice(word: String) {
        communications.emitWordChoice(WordChoice(gameRoom.gameroomName, arrayOf(word)))
    }

    @CallSuper
    open fun leaveGameroom() {
        communications.emitRemoveGameroomUser(GameRoomUser(gameRoom.gameroomName, profile.username))
        communications.removeReceiver(this)

        onExit.run()
        gameRoomFragment = null
    }

    abstract fun emitGuess(word: String): Boolean

    @CallSuper
    open fun startGame() {
        gameRoomFragment = null
        scoreBoardFragment = createNewScoreBoard()
        dismissDialog()
    }

    protected abstract fun createRoomFragment(): GameRoomFragment

    protected abstract fun newTurnInfo(turnInfo: TurnInfo)

    protected abstract fun turnStart(ts: TurnStart)

    protected abstract fun turnEnd()

    protected abstract fun attemptConsumed()

    private fun gameEnd() {
        SoundManager.playSoundEffect(R.raw.game_end)
        SoundManager.stopMusic()
        dismissDialog()

        displayEndgameResults(scoreBoardFragment.scores, Runnable {
            dismissDialog()
        })
    }

    protected abstract fun displayEndgameResults(scores: HashMap<String, ScoreBoardFragment.Score>, onDismiss: Runnable)

    private fun wordGoodGuessConsumed(goodGuess: WordGoodGuess) {
        scoreBoardFragment.goodGuess(goodGuess)
        gameFragment?.wordGoodGuessConsumed(goodGuess)
    }

    private fun wordBadGuessConsumed(badGuess: WordBadGuess) {
        scoreBoardFragment.badGuess(badGuess)
        gameFragment?.wordBadGuessConsumed(badGuess)
    }

    private fun updateScore(newScore: NewScore) {
        scoreBoardFragment.newScore(newScore)
        gameFragment?.updateScore(newScore)
    }

    protected abstract fun chooseWord(words: Array<String>)

    private fun hintAskedConsumed(hintAsked: HintAsked) {
        gameFragment?.hintAskedConsumed(hintAsked)
    }

    open fun emitHintAsked() {
        val hintAsked = HintAsked(gameRoom.gameroomName, ApplicationManager.getProfile()!!.username)
        communications.emitHintAsked(hintAsked)
    }

    protected open fun setChat(chatChannel: ChatChannel) {
        this.chatChannel = chatChannel
        gameRoomFragment?.setChat(chatChannel)
        gameFragment?.setChat(chatChannel)
    }

    protected abstract fun createNewScoreBoard(): ScoreBoardFragment

    protected fun setDialog(dialogFragment: DialogFragment) {
        dismissDialog()

        currentDialog = dialogFragment
        ApplicationManager.setDialog(dialogFragment)
    }

    protected fun dismissDialog() {
        currentDialog?.dismiss()
        currentDialog = null
    }


}