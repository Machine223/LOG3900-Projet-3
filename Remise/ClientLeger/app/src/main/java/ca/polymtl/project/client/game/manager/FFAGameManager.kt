package ca.polymtl.project.client.game.manager

import ca.polymtl.project.client.R
import ca.polymtl.project.client.draw.communications.DrawingCommunication
import ca.polymtl.project.client.draw.communications.VirtualDrawer
import ca.polymtl.project.client.game.*
import ca.polymtl.project.client.game.objects.*
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.game.results.FFAResultsDialog
import ca.polymtl.project.client.game.room.FFAGameRoomFragment
import ca.polymtl.project.client.game.room.GameRoomFragment
import ca.polymtl.project.client.game.score.FFAScoreBoardFragment
import ca.polymtl.project.client.game.score.ScoreBoardFragment
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.manager.ProfileManager
import ca.polymtl.project.client.manager.SoundManager
import java.util.function.Consumer

class FFAGameManager(gameRoom: GameRoom, gameCommunications: GameCommunications, onExit: Runnable) :
    GameManager(gameRoom, gameCommunications, onExit) {
    private val virtualDrawer = VirtualDrawer(gameRoom)


    private var score: NewScore = NewScore(0.0f, ApplicationManager.getProfile()!!.username)

    private lateinit var turnInfo: TurnInfo
    private var wordToGuess = ""

    override fun emitGuess(word: String): Boolean {
        return if (word.toLowerCase() == wordToGuess) {
            SoundManager.playSoundEffect(R.raw.good_guess)
            communications.emitGoodGuess(WordGoodGuess(gameRoom.gameroomName, profile.username, 0))
            true
        } else {
            SoundManager.playSoundEffect(R.raw.bad_guess)
            communications.emitBadGuess(
                WordBadGuess(
                    gameRoom.gameroomName,
                    profile.username,
                    word.toLowerCase()
                )
            )
            false
        }
    }

    override fun createRoomFragment(): GameRoomFragment {
        val frag = FFAGameRoomFragment(gameRoom, this)
        frag.setChat(chatChannel)
        return frag
    }

    override fun newTurnInfo(turnInfo: TurnInfo) {
        dismissDialog()

        this.turnInfo = turnInfo
        wordToGuess = turnInfo.virtualDrawing.word.toLowerCase()

        if (ProfileManager.isVirtualPlayer(turnInfo.drawer)) {
            virtualDrawer.setPair(turnInfo.virtualDrawing)
        }

        scoreBoardFragment = scoreBoardFragment.clone()
        scoreBoardFragment.setDrawer(turnInfo.drawer)

        gameFragment = getNewGameFragment(this.turnInfo.drawer)
        gameFragment!!.setHints(turnInfo.virtualDrawing.hints)
        gameFragment!!.updateScore(score)
        ApplicationManager.navigateTo(gameFragment!!)

        gameFragment!!.setChosenWord(wordToGuess)
    }

    override fun turnStart(ts: TurnStart) {
        SoundManager.playSoundEffect(R.raw.turn_start)
        gameFragment?.turnStart(ts)
    }

    override fun turnEnd() {
        gameFragment?.turnEnd()
        setDialog(WaitForWordDialog())
    }

    override fun attemptConsumed() {
        gameFragment?.attemptConsumed()
    }

    override fun displayEndgameResults(scores: HashMap<String, ScoreBoardFragment.Score>, onDismiss: Runnable) {
        setDialog(FFAResultsDialog(scores, onDismiss))
    }

    override fun chooseWord(words: Array<String>) {
        setDialog(PickWordDialog(words, Consumer { w ->
            emitWordChoice(w)
        }))
    }

    override fun createNewScoreBoard(): ScoreBoardFragment {
        return FFAScoreBoardFragment(gameRoom)
    }

    private fun getNewGameFragment(user: String): GameFragment {
        val fragment = when {
            user == ApplicationManager.getProfile()!!.username -> LocalGameFragment(
                gameRoom,
                scoreBoardFragment,
                this,
                DrawingCommunication.getInstance()
            )
            ProfileManager.isVirtualPlayer(user) -> RemoteGameFragment(
                gameRoom,
                scoreBoardFragment,
                this,
                virtualDrawer
            )
            else -> RemoteGameFragment(
                gameRoom,
                scoreBoardFragment,
                this,
                DrawingCommunication.getInstance()
            )
        }

        fragment.setChat(chatChannel)

        return fragment
    }

    override fun startGame() {
        super.startGame()
        SoundManager.loopMusic(R.raw.bensound_funkyelement)
        setDialog(WaitForWordDialog())
    }

    private fun isDrawer(): Boolean {
        return turnInfo.drawer == ApplicationManager.getProfile()!!.username
    }

    private fun isVirtualDrawer(): Boolean {
        return ProfileManager.isVirtualPlayer(turnInfo.drawer)
    }
}