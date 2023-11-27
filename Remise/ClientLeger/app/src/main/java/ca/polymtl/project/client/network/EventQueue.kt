package ca.polymtl.project.client.network

class EventQueue {
    private val queue = ArrayList<Runnable>()
    private var isPaused = true

    fun start() {
        isPaused = false
        for (event in queue) {
            event.run()
        }

        queue.clear()
    }

    fun pause() {
        isPaused = true
    }

    fun newEvent(event: Runnable) {
        if (isPaused) queue.add(event) else event.run()
    }
}