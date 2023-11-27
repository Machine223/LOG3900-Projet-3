package ca.polymtl.project.client.draw

import android.content.Context
import android.graphics.drawable.GradientDrawable
import android.view.View
import android.widget.LinearLayout
import ca.polymtl.project.client.R

class ColorButton(context: Context, colorData: ColorData, size: Int = 30, spacing: Int = 5) : View(context) {
    init {
        this.setBackgroundResource(R.drawable.color_square)
        (this.background as GradientDrawable).setColor(colorData.color)
        val layoutParams = LinearLayout.LayoutParams(size, size)
        layoutParams.setMargins(spacing, spacing, spacing, spacing)
        this.layoutParams = layoutParams
    }
}