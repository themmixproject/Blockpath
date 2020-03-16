function checkDifferent(index){
    for(var i = 0; i < game.path.length-1; i++)
    {
        if(game.path[i] === index){
            return false;
        }
    }
    return true;
}

function checkDrawPath(el, gridWidth){
    if(game.mouseDown == true && el.innerHTML==""){

        var x = indexInClass(el)%gridWidth;
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
                if( game.path.length == levels[currentWorld][currentLevel].pathLength ){
                    if(currentLevel == levels.length-1){
                        game.end = true;
                        displayAlert("Level Completed!");
                        // displayLevelScreen();
                    }
                    else{
                        displayAlert("Level Completed!");
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

function reset(parseIndex){
    startIndex = game.path.indexOf(parseIndex)+1;

    for( i = startIndex; i < game.path.length; i++ ){
        gridBlocks[ game.path[i] ].innerHTML = "";
    }

    game.path.splice(startIndex);
    game.coordinates.splice(startIndex);

}

function checkIndex(index){

    for(var i = 0; i< game.path.length; i++){
        if(game.path[i] == index){
                return false
        }
    }
    return true
}

function nextLevel(){
    resetGrid();
    currentLevel+=1;
    levels[currentWorld][currentLevel].generate();
    displayGameGrid();
}