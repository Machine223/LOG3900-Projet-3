package ca.polymtl.project.client.game.manager


import ca.polymtl.project.client.R
import ca.polymtl.project.client.draw.communications.VirtualDrawer
import ca.polymtl.project.client.game.GameCommunications
import ca.polymtl.project.client.game.RemoteGameFragment
import ca.polymtl.project.client.game.objects.TurnInfo
import ca.polymtl.project.client.game.objects.TurnStart
import ca.polymtl.project.client.game.objects.WordBadGuess
import ca.polymtl.project.client.game.objects.WordGoodGuess
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.game.results.SprintResultsDialog
import ca.polymtl.project.client.game.room.CoopGameRoomFragment
import ca.polymtl.project.client.game.room.GameRoomFragment
import ca.polymtl.project.client.game.score.ScoreBoardFragment
import ca.polymtl.project.client.game.score.SprintScoreBoardFragment
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.manager.SoundManager

open class CoopGameManager(
    gameRoom: GameRoom,
    gameCommunications: GameCommunications,
    onExit: Runnable
) : GameManager(gameRoom, gameCommunications, onExit) {

    private var virtualDrawer: VirtualDrawer? = null

    private lateinit var wordToGuess: String

    override fun enterRoom() {
        super.enterRoom()

        gameFragment = null
        virtualDrawer = null
    }

    override fun emitGuess(word: String): Boolean {
        return if (word.toLowerCase() == wordToGuess) {
            SoundManager.playSoundEffect(R.raw.good_guess)
            val wordGoodGuess =
                WordGoodGuess(gameRoom.gameroomName, ApplicationManager.getProfile()!!.username, 3)
            communications.emitGoodGuess(wordGoodGuess)
            true
        } else {
            SoundManager.playSoundEffect(R.raw.bad_guess)
            val wordBadGuess = WordBadGuess(
                gameRoom.gameroomName,
                ApplicationManager.getProfile()!!.username,
                word.toLowerCase()
            )
            communications.emitBadGuess(wordBadGuess)
            false
        }
    }

    override fun createRoomFragment(): GameRoomFragment {
        val frag = CoopGameRoomFragment(gameRoom, this)
        frag.setChat(chatChannel)
        return frag
    }

    override fun newTurnInfo(turnInfo: TurnInfo) {
        scoreBoardFragment = scoreBoardFragment.clone()

        virtualDrawer = VirtualDrawer(gameRoom)

        gameFragment = RemoteGameFragment(gameRoom, scoreBoardFragment, this, virtualDrawer!!)
        gameFragment!!.setChat(chatChannel)
        ApplicationManager.navigateTo(gameFragment!!)

        wordToGuess = turnInfo.virtualDrawing.word.toLowerCase()
        gameFragment?.setHints(turnInfo.virtualDrawing.hints)
        virtualDrawer?.setPair(turnInfo.virtualDrawing)
    }

    override fun turnStart(ts: TurnStart) {
        SoundManager.playSoundEffect(R.raw.turn_start)
        gameFragment?.turnStart(ts)
    }

    override fun turnEnd() {
        gameFragment?.turnEnd()
    }

    override fun attemptConsumed() {
        gameFragment?.attemptConsumed()
    }

    override fun displayEndgameResults(scores: HashMap<String, ScoreBoardFragment.Score>, onDismiss: Runnable) {
        setDialog(SprintResultsDialog(scores, onDismiss))
    }

    override fun startGame(){
        super.startGame()
        SoundManager.loopMusic(R.raw.bensound_funkyelement)
    }

    override fun chooseWord(words: Array<String>) {}

    override fun createNewScoreBoard(): ScoreBoardFragment {
        return SprintScoreBoardFragment(gameRoom)
    }
}