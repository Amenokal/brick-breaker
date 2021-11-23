function generateBricks(){
    Game.bricks = [];
    let x = 10, y = 10;
    for(let i in this.template){
        let b = new Brick(x,y,i);
        x += b.w + b.margin*2;

        if(i==6 || i==13 || i==20 || i==27 || i==34){
            x = 10;
            y += 30;
        };

        switch(this.template[i]){
            case 1 : b.pv = 1; Game.bricks.push(b);
            break;
            case 2 : b.pv = 2; Game.bricks.push(b);
            break;
            case 3 : b.pv = 3; Game.bricks.push(b);
            break;
        }
    }
}

// LVL 1
let Level1 = {
    speed : 4,
    template : [1 , 1 , 1 , 1 , 1 , 1 , 1 ,
                0 , 1 , 1 , 1 , 1 , 1 , 0 ,
                0 , 0 , 1 , 1 , 1 , 0 , 0 ],
    generate : generateBricks,
}
// LVL 2
let Level2 = {
    speed : 4.5,
    template : [2 , 1 , 2 , 1 , 2 , 1 , 2 ,
                1 , 2 , 1 , 2 , 1 , 2 , 1 ,
                1 , 1 , 2 , 1 , 2 , 1 , 1 ,
                0 , 0 , 1 , 2 , 1 , 0 , 0 ],
    generate : generateBricks,
}
// LVL 3
let Level3 = {
    speed : 5,
    template : [1 , 1 , 1 , 3 , 1 , 1 , 1 ,
                1 , 2 , 3 , 2 , 3 , 2 , 1 ,
                2 , 3 , 2 , 3 , 2 , 3 , 2 ,
                1 , 2 , 3 , 2 , 3 , 2 , 1 ,
                1 , 1 , 1 , 3 , 1 , 1 , 1 ],
    generate : generateBricks,
}