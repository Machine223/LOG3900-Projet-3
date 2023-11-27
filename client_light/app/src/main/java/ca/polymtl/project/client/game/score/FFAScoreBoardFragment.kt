package ca.polymtl.project.client.game.score

import android.content.Context
import android.graphics.Typeface
import android.view.View
import android.widget.FrameLayout
import ca.polymtl.project.client.R
import ca.polymtl.project.client.game.objects.NewScore
import ca.polymtl.project.client.game.objects.WordBadGuess
import ca.polymtl.project.client.game.objects.WordGoodGuess
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.manager.AvatarManager
import ca.polymtl.project.client.manager.ProfileManager
import kotlinx.android.synthetic.main.fragment_ffa_score_board.*
import kotlinx.android.synthetic.main.view_ffa_score.view.*
import java.util.function.Consumer
import kotlin.math.roundToInt

class FFAScoreBoardFragment(gameRoom: GameRoom) : ScoreBoardFragment(gameRoom, R.layout.fragment_ffa_score_board) {
    private class FFAScoreView(username: String, score: Score, isDrawer: Boolean, context: Context) : FrameLayout(context) {
        init {
            inflate(context, R.layout.view_ffa_score, this)

            drawer_pencil_image.visibility = if (isDrawer) View.VISIBLE else View.INVISIBLE
            username_text.text = username
            if (ApplicationManager.getProfile()!!.username == username)
                username_text.typeface = Typeface.DEFAULT_BOLD

            ProfileManager.fetch(username, Consumer { profile ->
                AvatarManager.applyAvatarOnView(avatar_view, profile!!.avatarName)
            })

            if (ProfileManager.isVirtualPlayer(username)) {
                score_text.visibility = View.GONE
                virtual_player_image.visibility = View.VISIBLE
            } else {
                score_text.visibility = View.VISIBLE
                virtual_player_image.visibility = View.GONE
            }

            setScore(score.score)
        }

        fun setScore(score: Float) {
            post {
                score_text?.text = String.format("%d", score.roundToInt())
            }
        }

        fun goodGuess() {
            post {
                good_answer.animate().alpha(0.3f).duration = 200
            }
        }

        fun badGuess() {
            flash(bad_answer)
        }

        private fun flash(view: View) {
            post {
                view.alpha = 0.3f
                view.animate().alpha(0.0f).duration = 1000
            }
        }
    }

    private val scoreViewMap = HashMap<String, FFAScoreView>()

    private var currentDrawer = gameRoom.getAllUsers()[0]


    override fun newScore(score: NewScore) {
        super.newScore(score)
        if (context != null)
            scoreViewMap[score.username]?.setScore(score.score)
    }

    override fun setDrawer(username: String) {
        currentDrawer = username
        refresh()
    }

    override fun goodGuess(guess: WordGoodGuess) {
        super.goodGuess(guess)
        if (context != null)
            scoreViewMap[guess.username]?.goodGuess()
    }

    override fun badGuess(guess: WordBadGuess) {
        super.badGuess(guess)
        if (context != null)
            scoreViewMap[guess.username]?.badGuess()
    }

    override fun refreshView() {
        scores_container?.post { scores_container?.removeAllViews() }
        scoreViewMap.clear()

        for (user in gameRoom.getAllUsers()) {
            val scoreView = FFAScoreView(user, scores[user]!!, user == currentDrawer, requireContext())
            scoreViewMap[user] = scoreView

            scores_container?.post { scores_container?.addView(scoreView) }
        }
    }

    override fun clone(): ScoreBoardFragment {
        val frag = FFAScoreBoardFragment(gameRoom)
        frag.scores = scores
        frag.currentDrawer = currentDrawer

        return frag
    }

}