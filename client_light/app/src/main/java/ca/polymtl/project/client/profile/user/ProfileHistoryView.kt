package ca.polymtl.project.client.profile.user

import android.content.Context
import android.util.AttributeSet
import android.widget.FrameLayout
import ca.polymtl.project.client.R
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.network.NetworkManager
import ca.polymtl.project.client.profile.user.history.HistorySorter
import kotlinx.android.synthetic.main.view_profile_history.view.*
import org.json.JSONObject
import java.util.function.Consumer

class ProfileHistoryView(context: Context, attributeSet: AttributeSet?) : FrameLayout(context, attributeSet) {
    init {
        inflate(context, R.layout.view_profile_history, this)

        val profile = ApplicationManager.getProfile()!!
        NetworkManager.Rest.get(
            "/profile/${profile.username}/stats-history",
            null,
            Consumer { data ->
                val jsonData = JSONObject(data)
                val historyJson = jsonData.getJSONObject("history")

                val historySorter = HistorySorter(context)
                historySorter.addSessions(historyJson.getJSONArray("sessions"))
                historySorter.addGames(historyJson.getJSONArray("games"))
                historySorter.addDates()

                val sortedViews = historySorter.getSortedViews()
                post {
                    for (v in sortedViews)
                        history_container.addView(v)
                }
            }
        )

    }
}