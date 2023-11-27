package ca.polymtl.project.client

import android.content.Context
import android.view.ViewGroup
import android.widget.RelativeLayout
import ca.polymtl.project.client.draw.ColorButton
import ca.polymtl.project.client.draw.ColorData
import com.google.android.flexbox.*

class ColorHistory(private var context: Context, private var flexLayout: FlexboxLayout) {
    private var toolColorsHistory: ArrayList<ColorData> = ArrayList()
    private var backgroundColorsHistory: ArrayList<ColorData> = ArrayList()
    lateinit var onColorHistoryPick: OnColorHistoryPick

    fun showBackgroundColorsHistory() {
        replaceColorList(backgroundColorsHistory)
    }

    fun showToolColorsHistory() {
        replaceColorList(toolColorsHistory)
    }

    fun addColorToToolHistory(colorData: ColorData) {
        if (toolColorsHistory.size >= 10) {
            toolColorsHistory.removeAt(0)
        }
        toolColorsHistory.add(colorData)
    }

    fun addColorToBackgroundHistory(colorData: ColorData) {
        if (backgroundColorsHistory.size >= 10) {
            backgroundColorsHistory.removeAt(0)
        }
        backgroundColorsHistory.add(colorData)
    }

    private fun replaceColorList(colorList: List<ColorData>) {
        if (flexLayout.childCount > 0) {
            flexLayout.removeAllViews()
        }
        if (colorList.isEmpty()) {
            return
        }
        var reversedList = colorList.asReversed()
        for (color in reversedList) {
            var colorButton = ColorButton(context, color, 60)

            colorButton.setOnClickListener {
                onColorHistoryPick.onColorPick(color)
            }

            flexLayout.addView(colorButton)
        }
    }

    interface OnColorHistoryPick {
        fun onColorPick(colorData: ColorData)
    }
}