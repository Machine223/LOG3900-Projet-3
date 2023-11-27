package ca.polymtl.project.client.profile.user.history

import android.content.Context
import android.widget.FrameLayout
import java.text.SimpleDateFormat
import java.util.*

abstract class HistoricEventView(val timestamp: Long, layout: Int, context: Context) : FrameLayout(context), Comparable<HistoricEventView> {
    protected companion object {
        val TIME_FORMAT = SimpleDateFormat("KK:mm:ss aa")
        val DATE_FORMAT = SimpleDateFormat("EEE MMM dd yyyy")
    }

    init {
        inflate(context, layout, this)
        setTimestamp()
    }

    abstract fun setTimestamp()

    override fun hashCode(): Int {
        return timestamp.hashCode()
    }

    fun formatTimestamp(format: SimpleDateFormat): String {
        val dt = Date(timestamp)
        return format.format(dt)
    }

    override operator fun compareTo(other: HistoricEventView): Int {
        return timestamp.compareTo(other.timestamp)
    }
}