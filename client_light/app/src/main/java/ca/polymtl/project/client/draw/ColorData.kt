package ca.polymtl.project.client.draw

class ColorData(val color: Int = 0xFFFFFF, val opacity: Float = 1.0f) {
    fun colorAsString(): String {
        var str = Integer.toHexString(color)
        if(str.length > 6){
            return "#" + Integer.toHexString(color).substring(2)
        }
        return "#" + Integer.toHexString(color)
    }
}