package ca.polymtl.project.client.game

import android.annotation.SuppressLint
import android.graphics.Color
import android.graphics.PorterDuff
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.view.MotionEvent
import android.view.View
import android.widget.Button
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.core.view.setPadding
import ca.polymtl.project.client.R
import ca.polymtl.project.client.draw.ColorData
import ca.polymtl.project.client.draw.ColorPicker
import ca.polymtl.project.client.draw.communications.DrawingCommunication
import ca.polymtl.project.client.draw.communications.primitive.BackgroundPrimitive
import ca.polymtl.project.client.draw.manager.LocalDrawingManager
import ca.polymtl.project.client.draw.tools.EraserTool
import ca.polymtl.project.client.draw.tools.PencilTool
import ca.polymtl.project.client.draw.tools.Tool
import ca.polymtl.project.client.draw.tools.actions.ChangeBackgroundAction
import ca.polymtl.project.client.game.manager.GameManager
import ca.polymtl.project.client.game.objects.HintAsked
import ca.polymtl.project.client.game.objects.NewScore
import ca.polymtl.project.client.game.objects.WordBadGuess
import ca.polymtl.project.client.game.objects.WordGoodGuess
import ca.polymtl.project.client.game.primitive.GameRoom
import ca.polymtl.project.client.game.score.ScoreBoardFragment
import com.google.android.material.slider.Slider
import kotlinx.android.synthetic.main.fragment_game.*
import kotlinx.android.synthetic.main.view_dynamic_local_game.*
import kotlinx.android.synthetic.main.view_tools_container.*
import java.util.function.Consumer

class LocalGameFragment(
    gameRoom: GameRoom,
    scoreBoardFragment: ScoreBoardFragment,
    gameManager: GameManager,
    private val drawingCommunication: DrawingCommunication
) : GameFragment(gameRoom, scoreBoardFragment, gameManager) {
    private val drawingManager: LocalDrawingManager =
        LocalDrawingManager(gameRoom, drawingCommunication)
    private lateinit var currentTool: Tool
    private val pencilTool: PencilTool =
        PencilTool(drawingManager, drawingCommunication, "#000000", 1.0f, 1.0f)
    private val eraserTool: EraserTool = EraserTool(drawingManager, drawingCommunication, 5.0f)
    private lateinit var colorPicker: ColorPicker
    private lateinit var quickSelect: View
    private lateinit var chosenWord: String

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        quickSelect = layoutInflater.inflate(R.layout.view_color_quick_select, null)

        quickSelect.findViewById<Button>(R.id.quick_select_back_button)
            ?.setOnClickListener {
                container_flipper.displayedChild = 0
            }
        quickSelect.findViewById<Button>(R.id.more_colors_button)
            ?.setOnClickListener {
                container_flipper.displayedChild = 2
            }

        colorPicker = context?.let {
            ColorPicker(
                it,
                quickSelect.findViewById(R.id.color_quick_select),
                quickSelect.findViewById(R.id.color_history)
            )
        }!!
        colorPicker.onColorPick = object : ColorPicker.OnColorPick {
            override fun onToolColorConfirm(colorData: ColorData) {
                onConfirmToolColor(colorData)
            }

            override fun onBackgroundColorConfirm(colorData: ColorData) {
                onConfirmBackgroundColor(colorData)
            }

            override fun onBack() {
                container_flipper.displayedChild = 1
            }
        }

        container_flipper.addView(quickSelect)
        container_flipper.addView(colorPicker)

        (tool_color_picker_button.background as GradientDrawable).setColor(Color.BLACK)
        (background_color_picker_button.background as GradientDrawable).setColor(Color.WHITE)

        grid_opacity_slider.addOnChangeListener { slider, value, fromUser ->
            drawingManager.setGridOpacity(slider.value)
            canvas_view.invalidate()
        }

        grid_width_slider.addOnChangeListener { slider, value, fromUser ->
            drawingManager.setGridWidth(slider.value)
            canvas_view.invalidate()
        }

        grid_toggle_switch.isChecked = false

        grid_toggle_switch.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                grid_buttons_container.visibility = View.VISIBLE
            } else {
                grid_buttons_container.visibility = View.GONE
            }
            drawingManager.toggleGrid()
            canvas_view.invalidate()
        }


        tool_color_picker_button.setOnClickListener {
            colorPicker.useToolColor()
            container_flipper.displayedChild = 1
        }

        background_color_picker_button.setOnClickListener {
            colorPicker.useBackgroundColor()
            container_flipper.displayedChild = 1
        }

        size_slider.addOnSliderTouchListener(object : Slider.OnSliderTouchListener {
            override fun onStartTrackingTouch(slider: Slider) {
                // Do nothing
            }

            override fun onStopTrackingTouch(slider: Slider) {
                currentTool.setSizeAttribute(slider.value)
            }
        })

        toggler_group.check(R.id.pencil_button)

        canvas_view.post {
            canvas_view.setOnDrawHandler(Consumer { canvas ->
                drawingManager.renderToCanvas(
                    canvas
                )
            })

            currentTool = pencilTool

            canvas_view.setOnTouchListener(OnDrawing(currentTool))

            toggler_group.addOnButtonCheckedListener { _, checkedId, _ ->
                if (checkedId == R.id.grid_toggle_button) {
                    if (grid_toggle_wrapper.visibility == View.VISIBLE) {
                        grid_toggle_wrapper.visibility = View.GONE
                    } else {
                        grid_toggle_wrapper.visibility = View.VISIBLE
                        if (grid_toggle_switch.isChecked) {
                            grid_buttons_container.visibility = View.VISIBLE
                        }
                    }
                    size_slider.visibility = View.GONE
                    size_slider_text.visibility = View.GONE
                    return@addOnButtonCheckedListener
                }
                currentTool = if (checkedId == R.id.pencil_button) {
                    size_slider_text.text = "Stroke width"
                    size_slider.value = pencilTool.getStrokeWidth()
                    pencilTool
                } else {
                    size_slider_text.text = "Eraser radius"
                    size_slider.value = eraserTool.getRadius()
                    eraserTool
                }
                size_slider.visibility = View.VISIBLE
                size_slider_text.visibility = View.VISIBLE
                grid_buttons_container.visibility = View.GONE
                canvas_view.setOnTouchListener(OnDrawing(currentTool))
            }

            undo_button.setOnClickListener {
                drawingManager.undo()
                canvas_view.invalidate()
            }

            drawingManager.undoState = object: LocalDrawingManager.ButtonState {
                override fun enable() {
                    undo_button.post {
                        undo_button.isEnabled = true
                    }
                }

                override fun disable() {
                    undo_button.post {
                        undo_button.isEnabled = false
                    }
                }

            }

            redo_button.setOnClickListener {
                drawingManager.redo()
                canvas_view.invalidate()
            }

            drawingManager.redoState = object: LocalDrawingManager.ButtonState {
                override fun enable() {
                    redo_button.post {
                        redo_button.isEnabled = true
                    }
                }

                override fun disable() {
                    redo_button.post {
                        redo_button.isEnabled = false
                    }
                }

            }

            canvas_view.invalidate()
        }

        setWordToSee(chosenWord)
    }

    override fun updateScore(newScore: NewScore) {}

    override fun wordGoodGuessConsumed(goodGuess: WordGoodGuess) {}

    override fun wordBadGuessConsumed(badGuess: WordBadGuess) {}

    override fun hintAskedConsumed(hintAsked: HintAsked) {}

    override fun attemptBadGuess(badGuess: WordBadGuess) {}

    override fun getDynamicComponentLayoutId(): Int {
        return R.layout.view_dynamic_local_game
    }

    override fun attemptConsumed() {}

    override fun setHints(hints: Array<String>) {}

    fun onConfirmToolColor(colorData: ColorData) {
        (tool_color_picker_button.background as GradientDrawable).setColor(colorData.color)
        tool_color_picker_button.alpha = colorData.opacity
        pencilTool.setColor(Integer.toHexString(colorData.color))
        pencilTool.setOpacity(colorData.opacity)
        container_flipper.displayedChild = 0
    }

    fun onConfirmBackgroundColor(colorData: ColorData) {
        (background_color_picker_button.background as GradientDrawable).setColor(colorData.color)
        background_color_picker_button.alpha = colorData.opacity

        val fromData = ColorData(drawingManager.colorDataBackground.color, drawingManager.colorDataBackground.opacity)
        drawingManager.colorDataBackground = colorData

        val changeBackgroundAction = ChangeBackgroundAction(fromData, colorData, background_color_picker_button)
        drawingCommunication.emitEditBackground(BackgroundPrimitive(drawingManager.gameRoom.gameroomName, colorData.colorAsString(), colorData.opacity))
        drawingManager.addAction(changeBackgroundAction)

        drawingManager.setBackground(Integer.toHexString(colorData.color))
        drawingManager.setOpacity(colorData.opacity)
        canvas_view.invalidate()

        container_flipper.displayedChild = 0
    }

    override fun setChosenWord(word: String) {
        setWordToSee(word)
    }

    @SuppressLint("ResourceType")
    private fun setWordToSee(word: String) {
        chosenWord = word

        if (answer_card_view != null) {
            answer_card_view.post {
                answer_card_view.removeAllViews()
                val text = TextView(context)
                context?.let { ContextCompat.getColor(it, R.color.colorPrimary) }
                    ?.let { text.setTextColor(it) }
                text.setPadding(10)
                text.textAlignment = TextView.TEXT_ALIGNMENT_CENTER
                text.typeface = Typeface.DEFAULT_BOLD
                text.text = word
                text.textSize = 26.0f
                answer_card_view.addView(text)
            }
        }
    }

    class OnDrawing(private val tool: Tool) :
        View.OnTouchListener {
        override fun onTouch(v: View?, event: MotionEvent?): Boolean {
            if (v != null && event != null) {
                val x = event.x
                val y = event.y

                when (event.action) {
                    MotionEvent.ACTION_DOWN -> tool.onTouch(x, y)
                    MotionEvent.ACTION_UP -> tool.onRelease(x, y)
                    MotionEvent.ACTION_MOVE -> tool.onMove(x, y)
                }

                v.invalidate()
            }

            return true
        }
    }
}