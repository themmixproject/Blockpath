/**
 * TO MOORE AWAKE STEVEN
 * THE BUG IS KINDA CAUSED BY THE EVENTLISTENRS
 * BEING CONSTANTLY ADDED,
 * SO THAT'S SOMETHING TO LOOK INTO
 * 
 * FIX SCOPES OF THE INDEX VARIABLE
 */

/*#####################\
#  init global values  #
\#####################*/

gridBlocks = document.getElementsByClassName("grid-block");

pathBlocks = document.getElementsByClassName("path");

gridRow = document.getElementsByClassName("grid-row");

gameGrid = document.getElementById("game-grid");

mainMenu = document.getElementById("main-menu");

gameWinScreen = document.getElementById("game-win-screen");

gameWinHeader = document.getElementById("game-win-header");

playButton = document.getElementById("play-button");

levels = [];
currentLevel = 0;

grid = {
    height:4,
    width:4,
    blockHeight:70,
    blockWidth:70,
    blockMargin:2,
}

game = {
    mouseDown : false,
    path : [],
    coordinates: [],
    startX: 3,
    startY: 1,
    redBlocks:[],
    win: false
}



// gameGrid.style.width = "10px";

/*#####################\
#       functions      #
\#####################*/

function indexInClass(node) {
    var collection = document.getElementsByClassName(node.className);
    for (var i = 0; i < collection.length; i++) {
      if (collection[i] === node)
        return i;
    }
    return -1;
}

function setMouseDown(mouseDown){
    
    // pathStart = document.getElementById("path-start");

    game.mouseDown = mouseDown;

    // console.log(game.mouseDown)
}

function checkDifferent(index){
    for(var i = 0; i < game.path.length-1; i++)
    {
        if(game.path[i] === index){
            return false;
        }
    }
    return true;
}


function pathMouseDown(element){
    
    var elementIndex = indexInClass( element.parentElement);

    var lastIndex = game.path[game.path.length-1];

    if(elementIndex !== lastIndex){
        reset(elementIndex)
    }
    else{
       setMouseDown(true); 
    }

    setMouseDown(true);
    
}

function pathMouseEnter(element){

    var elementIndex = indexInClass( element.parentElement );
    var lastIndex = game.path[game.path.length-1];

    if(game.mouseDown == true && elementIndex !== lastIndex){
        reset(elementIndex);
    }
}

function displayAlert(text){
    gameWinScreen.style.display = "block";
    gameWinHeader.innerHTML = text;
}

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

                // console.log(game.path)
                drawPath(x, y, index, previousCoordinates);

                if(game.path.length == levels[currentLevel].pathLength){

                    if(currentLevel == levels.length-1){
                        game.end = true;
                        displayAlert("You have finished the game");
                        // console.log("game end");
                    }
                    else{
                        displayAlert("You Win! buddy!");
                        game.win=true;
                    }
                    // displayGameWinScreen();
                    
                    // nextLevel();
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

function drawPath(x, y, index, previousCoordinates){

    var el;

    if(previousCoordinates[0] - (x) == -1){
        el = document.createElement("div");
        el.className = "path left";
        el.style.height = grid.blockHeight + "px";
        el.style.width = grid.blockWidth + "px";
        gridBlocks[index].append(el)
    }
    else if( previousCoordinates[0] - (x) == 1 ){
        el = document.createElement("div");
        el.className = "path right";
        el.style.height = grid.blockHeight + "px";
        el.style.width = grid.blockWidth + "px";
        gridBlocks[index].append(el)
    }

    else if(previousCoordinates[1] - y == -1){
        el = document.createElement("div");
        el.className = "path top";
        el.style.height = grid.blockHeight + "px";
        el.style.width = grid.blockWidth + "px";
        gridBlocks[index].append(el)
    }

    else if(previousCoordinates[1] - y == 1){
        el = document.createElement("div");
        el.className = "path bottom";
        el.style.height = grid.blockHeight + "px";
        el.style.width = grid.blockWidth + "px";
        gridBlocks[index].append(el)
    }

    // bindPath();
    bindNewPath(el);

};

function resetGame(){
    currentLevel=0;
    gameGrid.innerHTML="";
    game.end = false;
    game.win = false;
    resetGrid();
}

function resetGrid(){
    game.path = [];
    game.coordinates = [];
    gameGrid.innerHTML = "";
}

function reset(parseIndex){
    startIndex = game.path.indexOf(parseIndex)+1;

    // console.log(resetBlocks);

    for( i = startIndex; i < game.path.length; i++ ){

        gridBlocks[ game.path[i] ].innerHTML = "";

    }

    game.path.splice(startIndex);
    game.coordinates.splice(startIndex);

}

function drawTestPath(){

    game.mouseDown = true;

    checkDrawPath(gridBlocks[6])
    checkDrawPath(gridBlocks[10])
    checkDrawPath(gridBlocks[14])

    game.mouseDown = false;
}

function testReset(){
    console.log(game.path);
    reset(10);
}

function checkIndex(index){

    for(var i = 0; i< game.path.length; i++){
        if(game.path[i] == index){
                return false
            
        }
    }
    return true
}

function drawRedBlock(){

    var randomIndex = Math.floor(Math.random()*(gridBlocks.length-1))
    var el;

    if(checkIndex(randomIndex)){
        el = document.createElement("div");
        el.className = "grid-block-red";
        gridBlocks[randomIndex].append(el);
        game.redBlocks.push(randomIndex);
        return;
    }
    else{
        drawRedBlock();
        return;
    }

}

class level {
    constructor(gridHeight, gridWidth, pathStartX, pathStartY, redBlocks){
        this.gridHeight = gridHeight;
        this.gridWidth = gridWidth;
        this.pathStartX = pathStartX;
        this.pathStartY = pathStartY
        this.redBlocks = redBlocks;
        this.pathLength = (this.gridHeight*gridWidth) - redBlocks.length;
    }

    generate(){

        mainMenu.style.display = "none";

        for(var i=0; i<this.gridHeight; i++){
            var row=document.createElement("div");
            row.className = "grid-row";
            gameGrid.append(row)
            for(var e=0;e<this.gridWidth;e++){
                var el = document.createElement("div");
                el.className="grid-block";
                el.style.height = grid.blockHeight + "px";
                el.style.width = grid.blockWidth + "px";
                el.style.margin = grid.blockMargin + "px";
                row.append(el);
            }
        }

        gameGrid.style.width = (grid.blockWidth+grid.blockMargin*2)*this.gridWidth+"px";
        gameGrid.style.height = (grid.blockHeight+grid.blockMargin*2)*this.gridHeight+"px";
    
        var pathStart = document.createElement("div");
        pathStart.id = "path-start";
        pathStart.className = "path";
        pathStart.style.height = grid.blockHeight + "px";
        pathStart.style.width = grid.blockWidth + "px";
    
        document.getElementsByClassName("grid-row")[this.pathStartY].getElementsByClassName("grid-block")[this.pathStartX].append(pathStart);
    
        game.coordinates.push([this.pathStartX, this.pathStartY, indexInClass(pathStart)])
        game.path.push(indexInClass(pathStart.parentElement))

        pathBlocks = document.getElementsByClassName("path");

        this.drawRedBlocks();

        addGridEvents();

    }

    drawRedBlocks(){
        var el;
        if(this.redBlocks!==undefined && this.redBlocks.length!==0 ){
            this.redBlocks.forEach(function(item, index){
                el = document.createElement("div");
                el.className = "grid-block-red";
                el.style.height = grid.blockHeight + "px";
                el.style.width = grid.blockWidth + "px";
                gridBlocks[item].append(el);
                game.redBlocks.push(item);
            });
        }
    }

    clear(){
        gameGrid.innerHTML="";
    }

}

function nextLevel(){
    resetGrid();
    currentLevel+=1;
    levels[currentLevel].generate();
    displayGameGrid();

    
}

/*#####################\
#   display functions  #
\#####################*/

function hideAllScreens(){
    mainMenu.style.display = "none";
    gameGrid.style.display = "none";
    gameWinScreen.style.display = "none";
}

function displayMainMenu(){
    hideAllScreens();
    mainMenu.style.display = "block";
}

function displayGameGrid(){
    hideAllScreens();
    gameGrid.style.display = "block";
}

function displayGameWinScreen(){
    hideAllScreens();
    gameGrid.style.display = "block";
    gameWinScreen.style.display = "block";
}



/*#####################################################\
 *|                                                    #
 *| 2. Event Listeners                                 #
 *|                                                    # 
\#####################################################*/


function addEventListeners(){

    document.addEventListener("mouseup", function(event){
        setMouseDown(false);
    });

    gameWinScreen.addEventListener("click", function(){
        if(document.getElementById("game-win-screen").style.display!="none" && document.getElementById("game-win-screen").style.display!=""){
            if( game.win == true ){
                nextLevel();
                game.win = false;
            }
            else if( game.end == true ){
                resetGame();
                displayMainMenu();
            }
            else{
                displayGameGrid();
            }
        }
    });

    playButton.addEventListener("click", function(){
        // displayGameGrid();
        levels[currentLevel].generate();
        displayGameGrid();
        displayAlert("drag the path to fill the grid!");
    })

}

function addGridEvents(){

    console.log("add grid events!");

    pathBlocks = document.getElementsByClassName("path");

    for(i=0; i<gridBlocks.length; i++){
        gridBlocks[i].addEventListener("mouseenter", function(event){
            checkDrawPath(this);
        })
        
    }

    for(i=0; i<pathBlocks.length; i++){

        pathBlocks[i].addEventListener("mousedown", function(event){
            pathMouseDown(this);
        });

        pathBlocks[i].addEventListener("mouseenter",function(event){
            pathMouseEnter(this);
        });
    }

}

function bindNewPath(element){

    element.addEventListener("mousedown", function(event){
        pathMouseDown(this);
    })

    element.addEventListener("mouseenter",function(event){
        pathMouseEnter(this);
    });

}

/*#####################################################\
 *|                                                    #
 *| 2. Initialization                                  #
 *|                                                    # 
\#####################################################*/
// drawGrid();
addEventListeners();
// mainMenu.style.display = "none";
displayMainMenu();

levels.push(
    new level(3,3,0,2,[4]),
    new level(7,4,0,4,[10,14,22,23,27]),
    new level(8,6,1,0,[10,19, 28, 30, 36, 37, 45]),
    new level(6,5,0,0,[8,13,11,28]),
    new level(7 ,5, 0,0,[1,2,3,10,17,22]),
    new level(8,6,4,4,[11,13,14,19,27,29,46,47])
)
// levels[currentLevel].generate();
// drawTestPath();
// drawRedBlock();