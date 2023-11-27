package ca.polymtl.project.client.game

import android.content.Context
import android.util.AttributeSet
import android.view.View
import android.view.animation.Animation
import android.view.animation.Transformation
import android.widget.FrameLayout
import android.widget.TextView
import androidx.core.content.ContextCompat
import ca.polymtl.project.client.R
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.manager.AvatarManager
import ca.polymtl.project.client.manager.ProfileManager
import ca.polymtl.project.client.profile.AvatarView
import kotlinx.android.synthetic.main.fragment_game_room.*
import kotlinx.android.synthetic.main.view_game_room_list_item.view.*
import kotlinx.android.synthetic.main.view_username_pair.view.*
import java.util.function.Consumer


class GameRoomItemView(val gameRoom: GameRoom, private val onJoin: Consumer<GameRoom>, context: Context, attributeSet: AttributeSet?) : FrameLayout(context, attributeSet) {
    private var isExpanded = false

    init {
        inflate(context, R.layout.view_game_room_list_item, this)
        join_button.setOnClickListener { onJoin.accept(gameRoom) }
        refresh()

        toggle_button.setOnClickListener {
            toggle()
        }

        setExpanded(isExpanded)
    }

    private fun toggle() {
        isExpanded = !isExpanded
        setExpanded(isExpanded)
    }

    private fun setExpanded(state: Boolean) {
        /*
        expandable_users.visibility = if (state) {
            toggle_button.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_up_arrow))
            View.VISIBLE
        } else {
            toggle_button.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_down_arrow))
            View.GONE
        }
        */

        if (state) {
            toggle_button.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_up_arrow))
            expand(expandable_users)
        } else {
            toggle_button.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_down_arrow))
            collapse(expandable_users)
        }

    }

    fun refresh() {
        game_room_name.text = gameRoom.gameroomName

        val realUsers = gameRoom.getRealUsers()
        val virtualUsers = gameRoom.getVirtualUsers()

        val nVirtual = virtualUsers.size
        number_players_robot_text.text = nVirtual.toString()

        val nReal = realUsers.size
        number_players_human_text.text = nReal.toString()

        join_button.isEnabled = canJoin()
        join_button.text = if (gameRoom.isInGame) "In Game" else "Join"
        if(join_button.isEnabled){
            context?.let { ContextCompat.getColor(it, R.color.white) }?.let { join_button.setTextColor(it) }
            context?.let { ContextCompat.getColor(it, R.color.colorPrimary) }?.let { join_button.setBackgroundColor(it) }
        }else{
            context?.let { ContextCompat.getColor(it, R.color.white) }?.let { join_button.setTextColor(it) }
            context?.let { ContextCompat.getColor(it, R.color.colorPrimaryContrast) }?.let { join_button.setBackgroundColor(it) }
        }

        expandable_users.removeAllViews()
        for (i in 0..Integer.max(nVirtual, nReal)) {
            val leftUser = if (i < nReal)
                realUsers[i]
            else
                null

            val rightUser = if (i < nVirtual)
                virtualUsers[i]
            else
                null

            expandable_users.addView(UserViewPair(leftUser, rightUser, context))
        }
    }

    fun canJoin(): Boolean {
        if (gameRoom.isInGame)
            return false

        return when (gameRoom.getGameMode()) {
            GameRoom.GameMode.FREE_FOR_ALL ->
                gameRoom.getAllUsers().size < 4
            GameRoom.GameMode.SPRINT_SOLO ->
                false
            GameRoom.GameMode.SPRINT_COOP ->
                gameRoom.getRealUsers().size < 4
        }
    }

    class UserViewPair(usernameLeft: String?, usernameRight: String?, context: Context) : FrameLayout(context, null) {
        init {
            inflate(context, R.layout.view_username_pair, this)
            setParameters(usernameLeft, user_left_name, user_left_image)
            setParameters(usernameRight, user_right_name, user_right_image)
        }

        private fun setParameters(text: String?, textView: TextView, imageView: AvatarView) {
            if (text != null) {
                textView.text = text
                ProfileManager.fetch(text, Consumer { profile ->
                    AvatarManager.applyAvatarOnView(imageView, profile!!.avatarName)
                })
            } else {
                textView.visibility = View.INVISIBLE
                imageView.visibility = View.INVISIBLE
            }
        }
    }


    private fun expand(v: View) {
        val matchParentMeasureSpec = MeasureSpec.makeMeasureSpec((v.parent as View).width, MeasureSpec.EXACTLY)
        val wrapContentMeasureSpec = MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED)
        v.measure(matchParentMeasureSpec, wrapContentMeasureSpec)
        val targetHeight = v.measuredHeight

        // Older versions of android (pre API 21) cancel animations for views with a height of 0.
        v.layoutParams.height = 1
        v.visibility = VISIBLE
        val a: Animation = object : Animation() {
            override fun applyTransformation(interpolatedTime: Float, t: Transformation?) {
                v.layoutParams.height = if (interpolatedTime == 1f) LayoutParams.WRAP_CONTENT else (targetHeight * interpolatedTime).toInt()
                v.requestLayout()
            }

            override fun willChangeBounds(): Boolean {
                return true
            }
        }

        // Expansion speed of 1dp/ms
        a.duration = (targetHeight / v.context.resources.displayMetrics.density).toLong()
        v.startAnimation(a)
    }

    private fun collapse(v: View) {
        val initialHeight = v.measuredHeight
        val a: Animation = object : Animation() {
            override fun applyTransformation(interpolatedTime: Float, t: Transformation?) {
                if (interpolatedTime == 1f) {
                    v.visibility = GONE
                } else {
                    v.layoutParams.height = initialHeight - (initialHeight * interpolatedTime).toInt()
                    v.requestLayout()
                }
            }

            override fun willChangeBounds(): Boolean {
                return true
            }
        }

        // Collapse speed of 1dp/ms
        a.duration = (initialHeight / v.context.resources.displayMetrics.density).toLong()
        v.startAnimation(a)
    }
}