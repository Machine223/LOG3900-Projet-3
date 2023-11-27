package ca.polymtl.project.client.draw

import android.graphics.drawable.Drawable
import com.larvalabs.svgandroid.SVGParser
import org.w3c.dom.Document
import org.w3c.dom.Element
import java.io.StringWriter
import java.util.*
import java.util.stream.Collectors
import javax.xml.parsers.DocumentBuilder
import javax.xml.parsers.DocumentBuilderFactory
import javax.xml.transform.Transformer
import javax.xml.transform.TransformerFactory
import javax.xml.transform.dom.DOMSource
import javax.xml.transform.stream.StreamResult

class SVGDrawing(width: Int, height: Int, fill: String) {
    class SVGPolyline(document: Document, rootSVG: Element) {
        private val points: Vector<Pair<Int, Int>> = Vector()
        private val svgElement: Element = document.createElement("polyline")

        init {
            rootSVG.appendChild(svgElement)
            svgElement.setAttribute("opacity", "0.5")
        }

        fun setColor(color: String): SVGPolyline {
            svgElement.setAttribute("stroke", color)
            return this
        }

        fun addPoint(x: Int, y: Int): SVGPolyline {
            points.addElement(Pair(x, y))
            refresh()
            return this
        }

        fun setWidth(width: Int): SVGPolyline {
            svgElement.setAttribute("stroke-width", width.toString())
            return this
        }

        private fun refresh() {
            val pointAttribute = points.stream().map { pair: Pair<Int, Int> -> "%d,%d".format(pair.first, pair.second) }.collect(Collectors.joining(" "))
            svgElement.setAttribute("points", pointAttribute)
        }
    }

    private val document: Document
    private val rootSVG: Element
    private val rectContainer: Element

    private val transformer: Transformer

    private val polylines: Vector<SVGPolyline> = Vector()

    init {
        val tf: TransformerFactory = TransformerFactory.newInstance()
        transformer = tf.newTransformer()

        val docFactory: DocumentBuilderFactory = DocumentBuilderFactory.newInstance()
        val docBuilder: DocumentBuilder = docFactory.newDocumentBuilder()
        document = docBuilder.newDocument()

        rootSVG = createElement("svg")
        document.appendChild(rootSVG)

        rootSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg")

        rectContainer = createElement("rect")
        rootSVG.appendChild(rectContainer)

        setDimensions(width, height)
        setFill(fill)
    }

    fun setDimensions(width: Int, height: Int) {
        rootSVG.setAttribute("width", width.toString())
        rootSVG.setAttribute("height", height.toString())

        rectContainer.setAttribute("width", width.toString())
        rectContainer.setAttribute("height", height.toString())
    }

    fun setFill(color: String) {
        rectContainer.setAttribute("fill", color)
    }

    fun createPolyline(): SVGPolyline {
        val polyline = SVGPolyline(document, rootSVG)
        polylines.addElement(polyline)
        return polyline
    }

    fun getDrawable(): Drawable {
        val writer = StringWriter()
        transformer.transform(DOMSource(document), StreamResult(writer))
        val output: String = writer.buffer.toString()
        return SVGParser.getSVGFromString(output).createPictureDrawable()
    }

    private fun createElement(name: String): Element {
        return document.createElement(name)
    }

}