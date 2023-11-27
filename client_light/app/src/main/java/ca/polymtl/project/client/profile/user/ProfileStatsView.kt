package ca.polymtl.project.client.profile.user

import android.content.Context
import android.util.AttributeSet
import android.widget.FrameLayout
import ca.polymtl.project.client.R
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.network.NetworkManager
import kotlinx.android.synthetic.main.view_profile_stats.view.*
import org.json.JSONObject
import java.util.function.Consumer

class ProfileStatsView(context: Context, attributeSet: AttributeSet?) :
    FrameLayout(context, attributeSet) {
    init {
        inflate(context, R.layout.view_profile_stats, this)

        val profile = ApplicationManager.getProfile()!!
        NetworkManager.Rest.get(
            "/profile/${profile.username}/stats-history",
            null,
            Consumer { data ->
                val jsonData = JSONObject(data)
                val statsJson = jsonData.getJSONObject("statistics")

                post {
                    games_played_text.setText(statsJson.getString("totalGamePlayed"))

                    val totalGameTime = statsJson.getLong("totalGameTime")
                    total_time_played_text.setText(durationToTime(totalGameTime))

                    average_time_per_game_text.setText(durationToTime(statsJson.getLong("timePerGame")))

                    win_ratio_text.setText(
                        String.format(
                            "%d",
                            (statsJson.getDouble("FFAWinRatio") * 100).toInt()
                        ) + "%"
                    )
                    best_sprint_solo_text.setText(statsJson.getString("bestSoloScore"))
                }
            }
        )
    }

    private fun durationToTime(duration: Long): String {
        val hours = duration / 3600
        val minutes = (duration % 3600) / 60
        val seconds = duration % 60

        val finalText = StringBuilder()
        if (hours > 0)
            finalText.append(String.format("%d hours, ", hours))
        if (hours > 0 || minutes > 0)
            finalText.append(String.format("%d min, ", minutes))
        finalText.append(String.format("%d sec", seconds))

        return finalText.toString()
    }
}