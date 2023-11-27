package ca.polymtl.project.client.draw

import android.os.Bundle
import android.util.Log
import android.view.MotionEvent
import android.view.View
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import ca.polymtl.project.client.R
import kotlinx.android.synthetic.main.activity_draw.*

class ActivityDraw : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        super.setContentView(R.layout.activity_draw)

        drawing.post { drawing.setOnTouchListener(Touch(SVGDrawing(drawing.width, drawing.height, "#00ff00"))) }

    }


    class Touch(private val dr: SVGDrawing) : View.OnTouchListener {
        private var polyline: SVGDrawing.SVGPolyline? = null;

        override fun onTouch(v: View?, event: MotionEvent?): Boolean {
            if (v != null && event != null) {
                val position: Pair<Int, Int> = Pair(event.x.toInt(), event.y.toInt())

                val imageView = v as ImageView

                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        polyline = dr.createPolyline().setColor("#aaaaaa").addPoint(position.first, position.second).setWidth(5)
                    }
                    MotionEvent.ACTION_UP -> {
                        polyline = null
                    }
                    MotionEvent.ACTION_MOVE -> {
                        polyline?.addPoint(position.first, position.second)
                    }
                }

                imageView.setImageDrawable(dr.getDrawable())
            }

            return true
        }

    }
}