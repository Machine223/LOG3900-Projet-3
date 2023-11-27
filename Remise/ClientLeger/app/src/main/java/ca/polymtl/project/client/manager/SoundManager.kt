package ca.polymtl.project.client.manager

import android.content.Context
import android.media.MediaPlayer

object SoundManager {
    private var musicPlayer: MediaPlayer? = null // for music
    private var soundEffectsPlayer: MediaPlayer? = null // for sound effects
    private lateinit var context: Context
    private var volume = 1.0f
    var isMuted: Boolean = false

    fun init(context: Context){
        this.context = context
        musicPlayer = MediaPlayer()
        soundEffectsPlayer = MediaPlayer()
    }

    fun cleanUp(){
        if(musicPlayer != null){
            stopMusic()
        }
        if(soundEffectsPlayer != null){
            stopSoundEffect()
        }
    }

    fun mute() {
        volume = 0.0f
        musicPlayer?.setVolume(volume, volume)
        soundEffectsPlayer?.setVolume(volume, volume)
    }

    fun unmute() {
        volume = 1.0f
        musicPlayer?.setVolume(volume, volume)
        soundEffectsPlayer?.setVolume(volume, volume)
    }

    fun playSoundEffect(sfxResourceId: Int){
        stopSoundEffect()
        soundEffectsPlayer?.reset()
        soundEffectsPlayer = MediaPlayer.create(context, sfxResourceId)
        soundEffectsPlayer?.setVolume(volume, volume)
        soundEffectsPlayer?.start()
    }

    fun playMusic(musicResourceId: Int){
        stopMusic()
        musicPlayer?.reset()
        musicPlayer = MediaPlayer.create(context, musicResourceId)
        musicPlayer?.setVolume(volume, volume)
        musicPlayer?.start()
    }

    fun loopMusic(musicResourceId: Int){
        playMusic(musicResourceId)
        musicPlayer?.isLooping = true
    }

    fun stopMusic(){
        if(musicPlayer != null){
            if(musicPlayer?.isPlaying!! || musicPlayer?.isLooping!!){
                musicPlayer?.stop()
                musicPlayer?.isLooping = false
                resetMusicPlaybackParams()
            }
            musicPlayer?.reset()
            musicPlayer?.release()
            musicPlayer = null
        }
    }

    fun stopSoundEffect(){
        if(soundEffectsPlayer != null){
            if(soundEffectsPlayer?.isPlaying!!){
                soundEffectsPlayer?.stop()
            }
            soundEffectsPlayer?.reset()
            soundEffectsPlayer?.release()
            soundEffectsPlayer = null
        }
    }

    fun resetMusicPlaybackParams(){
        musicPlayer?.playbackParams?.speed = 1.0f;
        musicPlayer?.playbackParams?.pitch = 1.0f;
    }

    fun setMusicPlaybackParams(speed: Float = 1.0f, pitch: Float = 1.0f){
        musicPlayer?.playbackParams?.speed = speed;
        musicPlayer?.playbackParams?.pitch = pitch;
    }
}