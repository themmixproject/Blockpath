function checkDrawPath(el){
    if(game.mouseDown == true && el.innerHTML==""){

        var x = indexInClass(el)%levels[currentLevel].gridWidth;
        var y = indexInClass(el.parentElement)
        var index = indexInClass(el)

        game.path.push(index)
        game.coordinates.push([x, y, index]);
        
        previousCoordinates = game.coordinates[ game.coordinates.length-2 ];

        differenceX = previousCoordinates[0] - x;
        differenceY = previousCoordinates[1] - y;

        if( checkDifferent(index) == true){

            if(
                differenceX <= 1 && differenceX >= -1 && differenceY===0 ||
                differenceY <= 1 && differenceY >= -1 && differenceX === 0
            ){
                drawPath(x, y, index, previousCoordinates);
                if( game.path.length == levels[currentLevel].pathLength ){
                    if(currentLevel == levels.length-1){
                        game.end = true;
                        displayAlert("You have finished the game");
                    }
                    else{
                        displayAlert("You Win! buddy!");
                        game.win=true;
                    }
                }
            }
            else{
                game.path.splice(-1,1);
                game.coordinates.splice(-1,1)
            }
        }
        else{
            game.path.splice(-1,1);
            game.coordinates.splice(-1,1)
        }  
    };
};