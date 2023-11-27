package ca.polymtl.project.client.tutorial

import android.os.AsyncTask
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.fragment.app.DialogFragment
import ca.polymtl.project.client.R
import ca.polymtl.project.client.draw.communications.DrawingCommunication
import ca.polymtl.project.client.game.GameCommunications
import ca.polymtl.project.client.manager.ApplicationManager
import ca.polymtl.project.client.manager.NotificationManager
import ca.polymtl.project.client.tutorial.communication.TutorialDrawingCommunication
import ca.polymtl.project.client.tutorial.communication.TutorialGameCommunication
import ca.polymtl.project.client.tutorial.step.*
import kotlinx.android.synthetic.main.dialog_start_tutorial.*
import java.util.function.BooleanSupplier

object TutorialManager {
    private val steps = arrayOf(
        CustomClickStep(
            "Let's close the chat so that it doesn't block our view!",
            R.id.chat_button,
            BooleanSupplier { NotificationManager.isHidden }),
        ClickStep("Click the 'Play' button to navigate to games.", R.id.play_button),
        InfoStep(
            "You can select the game mode by clicking here. 'Free-for-all' is what we want.",
            R.id.game_mode_spinner
        ),
        InfoStep(
            "You can select the difficulty by clicking here. 'Easy' is what we want.",
            R.id.game_difficulty_spinner
        ),
        ClickStep("Click this button to find gamerooms for your criteria.", R.id.find_button),
        InfoStep(
            "Here you can see a list of existing gamerooms. There is one already! Unfortunately, the game has already started, so we can't join it. Let's create a new one instead!",
            R.id.game_room_list_item_container
        ),
        TextStep(
            "Write 'My Game' as the new gameroom name",
            R.id.new_game_room_name_text,
            "My Game"
        ),
        ClickStep("Click here to create the gameroom", R.id.new_game_room_button),
        InfoStep(
            "Here, you can see all the information about the game you're in.",
            R.id.game_preview_layout
        ),
        InfoStep(
            "You can see that we can't start the game now, as we're missing players.",
            R.id.invalid_message_container
        ),
        InfoStep(
            "Here are all the players in this game. Right now, you're the only player, but others can join. You can also add a virtual player! Let's do that!",
            R.id.lobby_player_container
        ),
        CustomClickStep(
            "Click here to open the list of virtual players and then select anyone you want! They are all great!",
            R.id.add_virtual_player_button,
            BooleanSupplier {
                val lobbyPlayers = ApplicationManager.findView<LinearLayout>(R.id.lobby_players)
                lobbyPlayers != null && lobbyPlayers.childCount > 1
            }),
        InfoStep(
            "As you can see, your virtual player has been added! I also joined the room! The more the merrier!",
            R.id.lobby_player_container
        ),
        ClickStep(
            "Now that we have enough players, we can start the game! Click here.",
            R.id.start_button_game_room
        ),
        CustomWaitStep(BooleanSupplier { (GameCommunications.getInstance() as TutorialGameCommunication).wordChosen }),
        InfoStep(
            "Here you can see the word you picked! This is the object you're supposed to draw. I don't know what it is, but i have to guess based on your drawing!",
            R.id.answer_card_view
        ),
        InfoStep(
            "This is the time you have left to draw it. The guessers like me have the same time to guess, so hurry up!",
            R.id.timer_card_view
        ),
        InfoStep(
            "You can choose your tools or settings here",
            R.id.dynamic_component_card_view
        ),

        InfoStep(
            "By interacting with this area, you will be able to change the color of your pencil or the background of your drawing.",
            R.id.colors_container
        ),


        InfoStep(
            "Here is the infamous pencil, the tool used to create your masterpieces! It is said that da Vinci created the Mona Lisa painting with it.",
            R.id.pencil_button
        ),
        InfoStep(
            "Right next to the pencil is the eraser. With it, you can easily remove unwanted elements from your drawing!",
            R.id.eraser_button
        ),
        InfoStep(
            "The last tool is the grid. Other player won't see the grid, but it will help you to draw more precisely!",
            R.id.grid_toggle_button
        ),
        InfoStep(
            "Another bonus are the undo-redo buttons! Very easy to go back if you mess up!",
            R.id.undo_redo_container
        ),

        InfoStep(
            "Lastly, if you don't like the width of your pencil or your eraser, you can always change them with this slider.",
            R.id.size_slider
        ),


        CustomClickStep(
            "Now start drawing! Slide your finger across the canvas a few times, and let me see that talent!",
            R.id.canvas_view,
            BooleanSupplier { (DrawingCommunication.getInstance() as TutorialDrawingCommunication).nDrawnObjects >= 5 }),
        InfoStep(
            "If you were paying attention to this part, my name flashed in red. I have no idea what you're drawing, so my guess was incorrect! Everyone can see my shame...",
            R.id.score_board_container
        ),
        CustomClickStep(
            "Add more details to your drawing!",
            R.id.canvas_view,
            BooleanSupplier { (DrawingCommunication.getInstance() as TutorialDrawingCommunication).nDrawnObjects >= 10 }),
        CustomClickStep(
            "Now I Got it! Good job! You get some points too, for your amazing drawing!",
            R.id.score_board_container,
            BooleanSupplier { (GameCommunications.getInstance() as TutorialGameCommunication).currentDrawer == 1 }),
        InfoStep("It's the virtual player's turn! Everyone else, including you, has to guess!", R.id.canvas_view),
        CustomClickStep(
            "Let's take a wild guess! How about 'pencil'! Write your word and click enter to make your guess.",
            R.id.enter_guess,
            BooleanSupplier { (GameCommunications.getInstance() as TutorialGameCommunication).badGuessEmitted }),
        InfoStep("Yeah, it's not a pencil. Your name flashed in red!", R.id.score_board_container),
        InfoStep(
            "Being a guesser, you can find all you need right here:\n - Your previous attempts\n - Your hints",
            R.id.dynamic_component_card_view
        ),
        CustomClickStep(
            "Let's take a peek at a hint. Click '+'!",
            R.id.dynamic_component_card_view,
            BooleanSupplier { (GameCommunications.getInstance() as TutorialGameCommunication).wasHintAsked }),
        InfoStep("Now you can see the hint for the drawing!", R.id.dynamic_component_card_view),
        CustomClickStep(
            "It's clearly 'pikachu' (not sponsored by Nintendo)",
            R.id.enter_guess,
            BooleanSupplier { (GameCommunications.getInstance() as TutorialGameCommunication).goodGuessEmitted }),
        CustomClickStep(
            "You got it! I got it too haha! We both got our points. Usually, I would be the next one to draw, but I'm really bad at it, so let's end this here!",
            R.id.score_board_container,
            BooleanSupplier { (GameCommunications.getInstance() as TutorialGameCommunication).currentDrawer == 2 }),
        InfoStep("That was a great game! Good job!", R.id.game_preview_layout),
        ClickStep("Now, let's go back to the main menu! Press 'Leave' to exit the room.", R.id.leave_container),
        ClickStep("Let's go back again!", R.id.back_button_list),
        ClickStep("And one last time!", R.id.back_button),
        InfoStep("If you forget how to play, you can always click here! Good luck!", R.id.tutorial_button)
    )

    private var isTutorial = false

    fun startTutorial(tutorialLayerView: TutorialLayerView) {
        ApplicationManager.setDialog(TutorialDialog(Runnable { runSteps(tutorialLayerView) }))
    }

    private fun runSteps(tutorialLayerView: TutorialLayerView) {
        GameCommunications.newTutorialInstance()
        DrawingCommunication.newTutorialInstance()

        AsyncTask.execute {
            isTutorial = true
            tutorialLayerView.post { tutorialLayerView.visibility = View.VISIBLE }

            for (step in steps) {
                step.execute(tutorialLayerView)
            }

            tutorialLayerView.post { tutorialLayerView.visibility = View.GONE }
            isTutorial = false
        }
    }

    fun isTutorialMode(): Boolean {
        return isTutorial
    }

    class TutorialDialog(private val onYes: Runnable) : DialogFragment() {
        override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
            return inflater.inflate(R.layout.dialog_start_tutorial, container, false)
        }

        override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
            super.onViewCreated(view, savedInstanceState)

            yes_button.setOnClickListener {
                dismiss()
                onYes.run()
            }

            no_button.setOnClickListener {
                dismiss()
            }
        }
    }
}