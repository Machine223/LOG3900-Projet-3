package ca.polymtl.project.client.profile.user.history

import android.content.Context
import android.graphics.Color
import androidx.core.content.ContextCompat
import ca.polymtl.project.client.R
import kotlinx.android.synthetic.main.view_historic_session.view.*
import org.json.JSONObject
import java.security.InvalidParameterException

class HistoricSessionEventView(sessionJson: JSONObject, context: Context) : HistoricEventView(sessionJson.getLong("timestamp"), R.layout.view_historic_session, context) {
    companion object {
        private val openColor = Color.parseColor("#43a047")
        private val closeColor = Color.parseColor("#ff5722")
    }

    private val isLogin = when (val type = sessionJson.getString("type")) {
        "signIn" -> true
        "signOut" -> false
        else -> throw InvalidParameterException(String.format("Invalid type value [%s]", type))
    }

    init {
        val lp = (container.layoutParams as LayoutParams)
        if (isLogin) {
            session_icon_image.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_right_arrow))
            session_icon_image.setColorFilter(openColor)
            timestamp_text.setTextColor(openColor)
            lp.bottomMargin = 40
        } else {
            session_icon_image.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_left_arrow))
            session_icon_image.setColorFilter(closeColor)
            timestamp_text.setTextColor(closeColor)
        }
    }

    override fun setTimestamp() {
        timestamp_text.text = formatTimestamp(TIME_FORMAT)
    }
}