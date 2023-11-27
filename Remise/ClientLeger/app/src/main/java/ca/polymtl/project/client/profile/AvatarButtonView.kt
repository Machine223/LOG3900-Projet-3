package ca.polymtl.project.client.profile

import android.content.Context
import ca.polymtl.project.client.manager.AvatarManager
import java.util.function.Consumer


class AvatarButtonView(context: Context, name: String, onClickSupplier: Consumer<String>) : AvatarView(context, null) {
    init {
        AvatarManager.applyAvatarOnView(this, name)

        this.setOnClickListener {
            onClickSupplier.accept(name)
        }
    }

}