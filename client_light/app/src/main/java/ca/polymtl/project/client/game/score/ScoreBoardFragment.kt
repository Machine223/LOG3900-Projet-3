package ca.polymtl.project.client.game.score

import android.os.Bundle
import android.view.View
import androidx.annotation.CallSuper
import ca.polymtl.project.client.fragment.InflatedLayoutFragment
import ca.polymtl.project.client.game.objects.NewScore
import ca.polymtl.project.client.game.objects.WordBadGuess
import ca.polymtl.project.client.game.objects.WordGoodGuess
import ca.polymtl.project.client.game.primitive.GameRoom

abstract class ScoreBoardFragment(protected val gameRoom: GameRoom, layout: Int) : InflatedLayoutFragment(layout) {
    class Score(var score: Float = 0.0f, var nGoodGuesses: Int = 0, var nBadGuesses: Int = 0)

    var scores = HashMap<String, Score>()

    init {
        for (user in gameRoom.getAllUsers())
            scores[user] = Score()

        refresh()
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        refresh()
    }

    abstract fun setDrawer(username: String)

    fun addUser(username: String) {
        gameRoom.addUser(username)
        refresh()
    }

    fun removeUser(username: String) {
        gameRoom.removeUser(username)
    }

    @CallSuper
    open fun newScore(score: NewScore) {
        scores[score.username]!!.score = score.score
    }

    @CallSuper
    open fun goodGuess(guess: WordGoodGuess) {
        scores[guess.username]!!.nGoodGuesses += 1
    }

    @CallSuper
    open fun badGuess(guess: WordBadGuess) {
        scores[guess.username]!!.nBadGuesses += 1
    }

    abstract fun refreshView()

    protected fun refresh() {
        refreshScores()
        if (context != null)
            refreshView()
    }

    private fun refreshScores() {
        val allUsers = gameRoom.getAllUsers()
        for (user in allUsers) {
            if (!scores.containsKey(user))
                scores[user] = Score()
        }

        for (user in HashSet<String>(scores.keys)) {
            if (!allUsers.contains(user))
                scores.remove(user)
        }
    }

    abstract fun clone(): ScoreBoardFragment
}