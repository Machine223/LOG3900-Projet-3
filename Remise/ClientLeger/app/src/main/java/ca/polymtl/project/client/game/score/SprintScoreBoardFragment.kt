package ca.polymtl.project.client.game.score

import ca.polymtl.project.client.R
import ca.polymtl.project.client.game.objects.NewScore
import ca.polymtl.project.client.game.objects.PlayerGuessView
import ca.polymtl.project.client.game.objects.WordBadGuess
import ca.polymtl.project.client.game.objects.WordGoodGuess
import ca.polymtl.project.client.game.primitive.GameRoom
import kotlinx.android.synthetic.main.fragment_sprint_score_board.*
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlin.math.roundToInt

class SprintScoreBoardFragment(gameRoom: GameRoom) : ScoreBoardFragment(gameRoom, R.layout.fragment_sprint_score_board) {
    private var playerGuessViewsMap = HashMap<String, PlayerGuessView>()

    override fun setDrawer(username: String) {}

    override fun newScore(score: NewScore) {
        super.newScore(score)
        setScore()
    }

    override fun goodGuess(guess: WordGoodGuess) {
        super.goodGuess(guess)
        if (context != null)
            playerGuessViewsMap[guess.username]?.goodGuess()
    }

    override fun badGuess(guess: WordBadGuess) {
        super.badGuess(guess)
        if (context != null)
            playerGuessViewsMap[guess.username]?.badGuess()
    }

    override fun refreshView() {
        setScore()

        guess_list_container.post {
            guess_list_container.removeAllViews()
        }

        playerGuessViewsMap.clear()
        val waitingMutex = Mutex(false)
        GlobalScope.launch {
            gameRoom.getRealUsers().filter { user -> scores.containsKey(user) }.forEach { user ->
                waitingMutex.lock()
                val playerGuessView = PlayerGuessView(user, scores[user]!!, requireContext());
                playerGuessViewsMap[user] = playerGuessView
                guess_list_container.post {
                    guess_list_container.addView(playerGuessView)
                    waitingMutex.unlock()
                }
            }
        }
    }

    private fun setScore() {
        score_textView?.post {
            val profileScore = scores.values.map { score -> score.score }.max()!!
            score_textView?.text = String.format("%d", profileScore.roundToInt()) + "pts"
        }
    }

    override fun clone(): ScoreBoardFragment {
        val frag = SprintScoreBoardFragment(gameRoom)
        frag.playerGuessViewsMap = playerGuessViewsMap
        frag.scores = scores

        return frag
    }
}