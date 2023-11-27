package ca.polymtl.project.client.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.DialogFragment
import ca.polymtl.project.client.R
import ca.polymtl.project.client.manager.AvatarManager
import ca.polymtl.project.client.profile.AvatarButtonView
import kotlinx.android.synthetic.main.activity_sign_up_dialog.*
import java.util.function.Consumer

class SignUpDialogFragment(onClickConsumer: Consumer<String>) : DialogFragment() {
    private val dismissibleConsumer = Consumer<String> { name ->
        onClickConsumer.accept(name)
        this.dismiss()
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.activity_sign_up_dialog, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        AvatarManager.supplyNames(Consumer { names ->
            names.stream().map { n ->
                val v = AvatarButtonView(requireContext(), n, dismissibleConsumer)
                v
            }.forEach { v ->
                grid_Avatar.post {
                    grid_Avatar.addView(v)
                }
            }
        })
    }

}