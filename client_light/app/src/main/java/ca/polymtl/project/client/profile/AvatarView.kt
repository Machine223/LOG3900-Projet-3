package ca.polymtl.project.client.profile

import android.content.Context
import android.graphics.Color
import android.util.AttributeSet
import androidx.cardview.widget.CardView
import com.caverock.androidsvg.SVG
import com.caverock.androidsvg.SVGImageView

open class AvatarView(context: Context, attrs: AttributeSet?) : CardView(context, attrs) {
    private val avatarView: SVGImageView = SVGImageView(context, attrs)

    init {
        this.addView(avatarView)
        avatarView.scaleX = 0.8f
        avatarView.scaleY = 0.8f

        setCardBackgroundColor(Color.rgb(240, 240, 240))
    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)

        radius = width / 2.0f

        avatarView.layoutParams.width = width
        avatarView.layoutParams.height = width
        elevation = 0.0f
    }

    fun setSVG(svg: SVG?) {
        if (svg != null) {
            avatarView.setSVG(svg)
        }
    }
}