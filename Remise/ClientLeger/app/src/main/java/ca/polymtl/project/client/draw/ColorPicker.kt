package ca.polymtl.project.client.draw

import android.content.Context
import android.graphics.Color
import android.view.MotionEvent
import androidx.coordinatorlayout.widget.CoordinatorLayout
import ca.polymtl.project.client.ColorHistory
import ca.polymtl.project.client.R
import com.google.android.flexbox.FlexboxLayout
import kotlinx.android.synthetic.main.view_color_picker.view.*

class ColorPicker(
    context: Context,
    private var colorQuickSelect: FlexboxLayout?,
    private var colorHistoryFlexLayout: FlexboxLayout?
) : CoordinatorLayout(context) {
    var colorHistory: ColorHistory
    lateinit var onColorPick: OnColorPick
    private var quickSelectColors: List<ColorData> = listOf(
        ColorData(Color.WHITE),
        ColorData(Color.GRAY),
        ColorData(Color.BLACK),
        ColorData(Color.BLUE),
        ColorData(Color.CYAN),
        ColorData(Color.GREEN),
        ColorData(Color.YELLOW),
        ColorData(-23296), // its orange :)
        ColorData(Color.RED),
        ColorData(Color.MAGENTA)
    )

    private var colorOnBackground: Boolean = false

    init {
        inflate(context, R.layout.view_color_picker, this)
        colorHistory = context?.let {
            ColorHistory(it, colorHistoryFlexLayout!!)
        }
        colorHistory.onColorHistoryPick = object : ColorHistory.OnColorHistoryPick {
            override fun onColorPick(colorData: ColorData) {
                if (colorOnBackground) {
                    onColorPick.onBackgroundColorConfirm(colorData)
                } else {
                    onColorPick.onToolColorConfirm(colorData)
                }
            }

        }

        saturation_bar.setSaturation(0.0f)
        value_bar.setValue(0.0f)
        opacity_bar.opacity = 255

        color_picker.addSaturationBar(saturation_bar)
        color_picker.addOpacityBar(opacity_bar)
        color_picker.addValueBar(value_bar)
        color_picker.showOldCenterColor = false

        color_picker.setOnTouchListener { _, motionEvent ->
            if (motionEvent.action == MotionEvent.ACTION_DOWN) {
                saturation_bar.post { saturation_bar.setSaturation(1.0f) }
                value_bar.post { value_bar.setValue(1.0f) }
                opacity_bar.post { opacity_bar.opacity = 255 }
                true
            }
            false
        }

        initQuickSelectColors()

        confirm_button.setOnClickListener {
            val color = color_picker.color
            val opacity = opacity_bar.opacity / 255.0f
            val colorData = ColorData(color, opacity)
            if (colorOnBackground) {
                colorHistory.addColorToBackgroundHistory(colorData)
                onColorPick.onBackgroundColorConfirm(colorData)
            } else {
                colorHistory.addColorToToolHistory(colorData)
                onColorPick.onToolColorConfirm(colorData)
            }
        }

        color_picker_back_button.setOnClickListener { onColorPick.onBack() }
    }

    fun useToolColor() {
        colorOnBackground = false
        colorHistory.showToolColorsHistory()
    }

    fun useBackgroundColor() {
        colorOnBackground = true
        colorHistory.showBackgroundColorsHistory()
    }

    private fun initQuickSelectColors() {
        for (colorData in quickSelectColors) {
            var colorButton = ColorButton(context, colorData, 60)
            colorButton.setOnClickListener {
                if (colorOnBackground) {
                    colorHistory.addColorToBackgroundHistory(colorData)
                    onColorPick.onBackgroundColorConfirm(colorData)
                } else {
                    colorHistory.addColorToToolHistory(colorData)
                    onColorPick.onToolColorConfirm(colorData)
                }
            }
            colorQuickSelect?.addView(colorButton)
        }
    }

    interface OnColorPick {
        fun onToolColorConfirm(colorData: ColorData)
        fun onBackgroundColorConfirm(colorData: ColorData)
        fun onBack()
    }
}