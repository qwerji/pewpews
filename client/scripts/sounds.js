function SoundManager() {
    
    this.sounds = {
        sword: {
            pickup: [
                new Audio('./../sounds/swordpickup1.wav'),
                new Audio('./../sounds/swordpickup2.wav'),
                new Audio('./../sounds/swordpickup3.wav')
            ],
            hit: [
                new Audio('./../sounds/swordhit1.wav'),
                new Audio('./../sounds/swordhit2.wav'),
                new Audio('./../sounds/swordhit3.wav'),
                new Audio('./../sounds/swordhit4.wav'),
                new Audio('./../sounds/swordhit5.wav')
            ]
        },
        player: {
            hit: [
                new Audio('./../sounds/playerhit1.wav'),
                new Audio('./../sounds/playerhit2.wav'),
                new Audio('./../sounds/playerhit3.wav'),
                new Audio('./../sounds/playerhit4.wav'),
                new Audio('./../sounds/playerhit5.wav'),
                new Audio('./../sounds/playerhit6.wav')
            ],
            pew: new Audio('./../sounds/pew1.wav')
        }
    }

    this.play = {
        swordPickup: () => {
            play(this.sounds.sword.pickup[randomInt(0,this.sounds.sword.pickup.length-1)])
        },
        swordHit: i => {
            play(this.sounds.sword.hit[i])
        },
        playerHit: () => {
            play(this.sounds.player.hit[randomInt(0,this.sounds.player.hit.length-1)])
        },
        pew: () => {
            play(this.sounds.player.pew)
        }
    }

    function play(sound) {
        sound.pause()
        sound.currentTime = 0
        sound.play()
    }

}
