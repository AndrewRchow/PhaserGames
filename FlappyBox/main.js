var game = new Phaser.Game(400 , 490, Phaser.AUTO);

var GameState = {
    //where assets loaded
    preload: function() {
        this.load.image('background', 'assets/background.png');
        this.load.image('box', 'assets/box.png');
        this.load.image('toucan', 'assets/toucan.png');
        this.load.image('pipe', 'assets/pipe.png');

    },
    //use assets after preload finish
    create: function() {
        // this.background = this.game.add.sprite(0,  0, 'background');
        game.stage.backgroundColor = "#71c5cf";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.box = game.add.sprite(100, 245, 'box');
        game.physics.arcade.enable(this.box);
        this.box.body.gravity.y = 900;
        // this.toucan.anchor.setTo(0.5,0.5);
        // this.toucan.scale.setTo(0.5,0.5);

        this.pipes = game.add.group();      
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.waitIncreaseScore = game.time.events.add(3200, this.timerIncreaseScore, this);        
  
        this.labelScore = game.add.text(20,20, "0", { font: "30px Arial", fill: "#ffffff" });

        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    },
    //keeps going during game
    update: function() {
        if(this.box.y<0 || this.box.y > 490)
            this.restartGame();

        // game.physics.arcade.overlap(this.box, this.pipes, this.restartGame, null, this);
    },


    jump: function() {
        this.box.body.velocity.y = -300;
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