package ca.polymtl.project.client.fragment

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.content.ContextCompat
import androidx.fragment.app.DialogFragment
import ca.polymtl.project.client.R
import com.google.android.material.tabs.TabLayout
import kotlinx.android.synthetic.main.activity_main_profile_dialog.*
import kotlinx.android.synthetic.main.fragment_game_room.*
import kotlinx.android.synthetic.main.view_profile_info.*
import kotlinx.android.synthetic.main.view_profile_info.view.*


class ProfileDialogFragment : DialogFragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.activity_main_profile_dialog, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)


        tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                if (tab != null) {
                    when (tab.position) {
                        0 -> view_flipper?.displayedChild = 0
                        1 -> view_flipper?.displayedChild = 1
                        else -> view_flipper?.displayedChild = 2
                    }
                }
            }

            override fun onTabReselected(tab: TabLayout.Tab?) {
                // Handle tab reselect
            }

            override fun onTabUnselected(tab: TabLayout.Tab?) {
                // Handle tab unselect
            }


        })


        context?.let { ContextCompat.getColor(it, R.color.white) }?.let { profileButton.setTextColor(it) }
        context?.let { ContextCompat.getColor(it, R.color.colorPrimary) }?.let { profileButton.setBackgroundColor(it) }

        profileButton.setOnClickListener {
            dismiss()
        }
    }
}