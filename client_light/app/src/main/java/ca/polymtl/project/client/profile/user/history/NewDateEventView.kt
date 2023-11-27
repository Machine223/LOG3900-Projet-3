package ca.polymtl.project.client.profile.user.history

import android.content.Context
import ca.polymtl.project.client.R
import kotlinx.android.synthetic.main.view_historic_date.view.*

class NewDateEventView(ts: Long, context: Context) : HistoricEventView(ts, R.layout.view_historic_date, context) {
    override fun setTimestamp() {
        timestamp_text.text = formatTimestamp(DATE_FORMAT)
    }
}