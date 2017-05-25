function Badge() {

    this.player = null
    this.avatarSprite = null
    this.healthSprite = null
    this.scoreSprite = null

}

Badge.prototype.updateScore = function() {
    this.player.score += 1
    this.scoreSprite.text = this.player.score
}

Badge.prototype.updateHealth = function() {
    this.healthSprite.text = this.player.health
}

Badge.prototype.setup = function(player, stage) {

    this.player = player
    this.avatarSprite = new PIXI.Sprite(
        // PIXI.loader.resources[player.avatar].texture
        PIXI.loader.resources['temp-avatar'].texture
    )
    this.healthSprite = new PIXI.Text(player.health, game.constants.healthBarTextStyle)
    this.scoreSprite = new PIXI.Text(player.score, game.constants.healthBarTextStyle)

    const centerPoint = {
        x: ((renderer.width/4)*(player.gamePadIndex+1)) - (renderer.width/4)/2,
        y: renderer.height - (statusBarOffset/2)
    }

    this.avatarSprite.x = centerPoint.x 
    this.avatarSprite.y = centerPoint.y 
    this.avatarSprite.anchor.set(.5, .5)
    this.avatarSprite.zIndex = 10

    this.healthSprite.x = centerPoint.x - this.avatarSprite.width/4
    this.healthSprite.y = centerPoint.y + this.avatarSprite.height/4 
    this.healthSprite.anchor.set(.5, .5)
    this.healthSprite.zIndex = 11

    this.scoreSprite.x = centerPoint.x + this.avatarSprite.width/4
    this.scoreSprite.y = centerPoint.y + this.avatarSprite.height/4
    this.scoreSprite.anchor.set(.5, .5)
    this.scoreSprite.zIndex = 11

    stage.addChild(this.avatarSprite, this.healthSprite, this.scoreSprite)
}
