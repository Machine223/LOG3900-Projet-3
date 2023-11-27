package ca.polymtl.project.client.game

import android.util.Log
import android.view.View
import android.view.animation.AlphaAnimation
import android.view.animation.Animation
import android.view.animation.CycleInterpolator
import android.widget.TextView
import java.util.*
import kotlin.collections.HashSet
import kotlin.math.roundToInt

class GameTimer {
    private lateinit var timerView: TextView
    private lateinit var warningView: View

    private var timer = Timer()

    fun setTimerView(view: TextView, warningView: View) {
        timerView = view
        this.warningView = warningView
    }

    fun start(timeFrom: Long) {
        val endTimestamp = Date().time + timeFrom * 1000

        val secondAnimated = HashSet<Int>()

        timer = Timer()
        timer.scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                val currentTime = Calendar.getInstance().timeInMillis
                val timeLeft = endTimestamp - currentTime

                val text = if (timeLeft < 0)
                    "Time's up!"
                else
                    formatTime(timeLeft)

                val currentSecond = toSeconds(timeLeft)
                if (currentSecond <= 10) {
                    if (!secondAnimated.contains(currentSecond)) {
                        secondAnimated.add(currentSecond)
                        warningView.post {
                            warningView.alpha = 0.5f
                            warningView.animate().alpha(0.0f)
                                .setDuration(1000)
                                .start()
                        }
                    }
                }

                timerView.post { timerView.text = text }
            }

        }, 0, 50)
    }

    fun stop() {
        timer.cancel()
        timer.purge()
    }

    private fun formatTime(time: Long): String {
        val fullSeconds = toSeconds(time)

        val seconds = fullSeconds % 60
        val minutes = (fullSeconds - seconds) / 60
        return String.format("%02d:%02d", minutes, seconds)
    }

    private fun toSeconds(time: Long): Int {
        return (time.toDouble() / 1000.0).roundToInt()
    }
}