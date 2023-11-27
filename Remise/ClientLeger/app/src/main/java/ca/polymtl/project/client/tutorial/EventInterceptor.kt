package ca.polymtl.project.client.tutorial

import android.annotation.SuppressLint
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.TextView
import ca.polymtl.project.client.manager.ApplicationManager
import kotlinx.coroutines.sync.Mutex
import java.lang.reflect.Field
import java.lang.reflect.Method
import java.util.function.BooleanSupplier


object EventInterceptor {

    fun waitForClick(view: View) {
        val waiter = Mutex(true)

        val oldListener = getOnClickListener(view)
        view.setOnClickListener {
            waiter.unlock()
            oldListener.onClick(view)
        }

        while (!waiter.tryLock())
            Thread.sleep(100)

        view.setOnClickListener(oldListener)
    }

    fun waitForText(view: TextView, text: String) {
        val waiter = Mutex(true)

        view.setOnEditorActionListener { _, _, _ -> true }

        view.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}

            override fun afterTextChanged(s: Editable?) {
                val newText = s.toString()

                if (newText == text) {
                    ApplicationManager.clearFocus(view)
                    waiter.unlock()
                }
            }
        })

        while (!waiter.tryLock())
            Thread.sleep(100)
    }

    fun waitForOk(okButton: View) {
        val waiter = Mutex(true)

        okButton.setOnClickListener {
            waiter.unlock()
        }

        while (!waiter.tryLock())
            Thread.sleep(100)
    }

    fun waitForCondition(condition: BooleanSupplier) {
        while (!condition.asBoolean)
            Thread.sleep(100)
    }

    @SuppressLint("DiscouragedPrivateApi")
    private fun getOnClickListener(view: View): View.OnClickListener {
        val method: Method = View::class.java.getDeclaredMethod("getListenerInfo")
        method.isAccessible = true

        val result: Any = method.invoke(view)
        val field: Field = result.javaClass.getDeclaredField("mOnClickListener")
        field.isAccessible = true

        return field.get(result) as View.OnClickListener
    }
}