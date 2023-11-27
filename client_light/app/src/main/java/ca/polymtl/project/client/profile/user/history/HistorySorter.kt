package ca.polymtl.project.client.profile.user.history

import android.content.Context
import org.json.JSONArray
import java.util.*
import java.util.stream.Collectors
import kotlin.collections.HashSet

class HistorySorter(private val context: Context) {
    private val views = HashSet<HistoricEventView>()

    fun addSessions(sessionsArray: JSONArray) {
        for (i in 0 until sessionsArray.length()) {
            views.add(HistoricSessionEventView(sessionsArray.getJSONObject(i), context))
        }
    }

    fun addGames(gamesArray: JSONArray) {
        for (i in 0 until gamesArray.length()) {
            views.add(HistoricGameEventView(gamesArray.getJSONObject(i), context))
        }
    }

    fun addDates() {
        views.addAll(views.stream().map { v ->
            val c = Calendar.getInstance()
            c.time = Date(v.timestamp)
            c.set(Calendar.HOUR_OF_DAY, 23)
            c.set(Calendar.MINUTE, 59)
            c.set(Calendar.SECOND, 59)
            c.set(Calendar.MILLISECOND, 999)
            c.timeInMillis
        }.distinct().map { ts -> NewDateEventView(ts, context) }.collect(Collectors.toList()))
    }

    fun getSortedViews(): List<HistoricEventView> {
        return views.stream().sorted().collect(Collectors.toList()).reversed()
    }
}