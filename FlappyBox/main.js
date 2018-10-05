var game = new Phaser.Game(400 , 490, Phaser.AUTO);

var globalHighScore = 0;

var GameState = {
    //where assets loaded
    preload: function() {
        this.load.image('background', 'assets/background.png');
        this.load.image('box', 'assets/box.png');
        this.load.image('toucan', 'assets/toucan.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('cursor', 'assets/cursor.png');
        this.load.audio('jump', 'assets/jump.wav');
        this.load.audio('whack', 'assets/whack.wav');

    },
    //use assets after preload finish
    create: function() {
        // this.background = this.game.add.sprite(0,  0, 'background');
        game.stage.backgroundColor = "#71c5cf";
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.jumpSound = game.add.audio('jump');
        this.jumpSound.volume = 0.2;
        this.whackSound = game.add.audio('whack');
        this.whackSound.volume = 0.2;

        this.box = game.add.sprite(100, 245, 'box');
        game.physics.arcade.enable(this.box);
        this.box.body.gravity.y = 900;
        this.box.anchor.setTo(-0.2, 0.5);
        this.box.alive=true;

        this.pipes = game.add.group();      
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20,20, "0", { font: "30px Arial", fill: "#ffffff" });
        this.labelHighScoreText = game.add.text(190,19, "High Score: ", { font: "30px Arial", fill: "#ffffff" });
        this.labelHighScore = game.add.text(355,20, globalHighScore, { font: "30px Arial", fill: "#ffffff" });
        this.waitIncreaseScore = game.time.events.add(3200, this.timerIncreaseScore, this);  

        // var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // spaceKey.onDown.add(this.jump, this);
        game.input.onDown.add(this.jump, this);
    },
    //keeps going during game
    update: function() {
        if(this.box.y<0 || this.box.y > 490){
            this.deathTriggered();
        }

        game.physics.arcade.overlap(this.box, this.pipes, this.hitPipe, null, this);

        if (this.box.angle < 20 && this.box.alive==true)
            this.box.angle += 1; 
    },

    hitPipe: function() {
        if(this.box.alive == false)
            return;

        this.whackSound.play();
        this.box.anchor.setTo(-0.1, 1);
        var animation = game.add.tween(this.box);
        animation.to({angle: -80}, 100);
        animation.start();
        this.deathByHit = true;
        this.deathTriggered();
    },

    jump: function() {
        if (this.box.alive == false)
            return;  
        this.box.body.velocity.y = -300;
        this.jumpSound.play();
        var animation = game.add.tween(this.box);
        animation.to({angle: -20}, 100);
        animation.start();
    },

    deathTriggered: function() {
        this.box.alive = false;
        game.time.events.remove(this.timer);
        game.time.events.remove(this.waitIncreaseScore);
        game.time.events.remove(this.timer2);

        this.pipes.forEach(function(p){
            p.body.velocity.x=0;
        }, this);

        if(this.score>globalHighScore){
            globalHighScore = this.score;
            this.labelHighScore.text = globalHighScore;
        }

        if(this.deathByHit){
            game.time.events.add(675, this.allowRestart, this);
        } else{
            this.allowRestart();
        }
    },

    allowRestart: function() {
        this.labelHighScoreText = game.add.text(135,235, "RESTART", { font: "30px Arial", fill: "#ffffff" });
        game.input.onDown.add(this.restartGame, this);
    },

    restartGame: function() {
        game.state.start('GameState');
    },

    addOnePipe: function(x,y){
        var pipe = game.add.sprite(x,y, 'pipe');
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);
        pipe.body.velocity.x = -200;

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5) +1;
        for(var i=0; i < 8; i++){
            if(i != hole && i != hole+1)
                this.addOnePipe(400, i*60+10);
        }
        this.box.bringToTop();
    },

    timerIncreaseScore: function() {
        this.score += 1;
        this.labelScore.text = this.score;    
        this.timer2 = game.time.events.loop(1500, this.increaseScore, this);
    },
    increaseScore:function() {
        this.score += 1;
        this.labelScore.text = this.score;   
    }
};

game.state.add('GameState', GameState);
game.state.start('GameState');