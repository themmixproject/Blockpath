/*

    ~Index blockPath.js~
    ----------------------

    1. init values
    2. functions
    3. level class
    4. display functions
    5. event listeners

*/

/**
 * TO MOORE AWAKE STEVEN
 * ---------------------
 * 
 * EDIT GAME LOGIC SO THAT IT'S ADJUSTED TO THE NEW 
 * CURRENTLEVEL DATA STRUCTURE.
 * 
 * 
 */

/*#####################################################\
 *|                                                    #
 *| 1. init values                                     #
 *|                                                    #
\#####################################################*/

var gridBlocks = document.getElementsByClassName("grid-block");

var pathBlocks = document.getElementsByClassName("path");

var gridRow = document.getElementsByClassName("grid-row");

var gameGrid = document.getElementById("game-grid");

var mainMenu = document.getElementById("main-menu");

var gameAlertScreen = document.getElementById("game-alert-screen");

var gameAlertHeader = document.getElementById("game-alert-header");

var playButton = document.getElementById("play-button");

var gameLevelScreen = document.getElementById("game-level-screen");

var levelGrid = document.getElementById("level-grid");

var levels = [];
var currentLevel = 0;

var grid = {
    height:4,
    width:4,
    blockHeight:46,
    blockWidth:46,
    blockMargin:2,
}

var gameLevelGrid = {
    height: 7,
    width: 5,
    blockHeight: 50,
    blockWidth: 50,
    blockMargin: 2
}

var game = {
    mouseDown : false,
    path : [],
    coordinates: [],
    startX: 3,
    startY: 1,
    redBlocks:[],
    win: false,
}

// var isMobile = false;



// gameGrid.style.width = "10px";

/*#####################################################\
 *|                                                    #
 *| 2. functions                                       #
 *|                                                    #
\#####################################################*/
function indexInClass(node) {
    var collection = document.getElementsByClassName(node.className);
    for (var i = 0; i < collection.length; i++) {
      if (collection[i] === node)
        return i;
    }
    return -1;
}

function hasClass(element, elementClass){
    var className = " " + elementClass + " ";
    if(element!=null){
            return (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1;
    }
    else{
        console.log("Error: no element input");
    }

}

function setMouseDown(mouseDown){
    game.mouseDown = mouseDown;
}

function pathMouseDown(element){
    
    var elementIndex = indexInClass( element.parentElement);

    var lastIndex = game.path[game.path.length-1];

    if(elementIndex !== lastIndex){
        reset(elementIndex)
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
    gameAlertScreen.style.display = "block";
    gameAlertHeader.innerHTML = text;
}

function drawPath(x, y, index, previousCoordinates){

    var el;

    el = document.createElement("div");
    el.style.height = grid.blockHeight + "px";
    el.style.width = grid.blockWidth + "px";

    if(previousCoordinates[0] - (x) == -1){
        el.className = "path left";
    }
    else if( previousCoordinates[0] - (x) == 1 ){
        el.className = "path right";
    }
    else if(previousCoordinates[1] - y == -1){
        el.className = "path top";
    }

    else if(previousCoordinates[1] - y == 1){
        el.className = "path bottom";
    }

    gridBlocks[index].append(el)

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

/*#####################################################\
 *|                                                    #
 *| 3. display functions                               #
 *|                                                    # 
\#####################################################*/

function renderLevelButtons(){
    console.log("render levels");

    var levelCounter = 1;
    for(i=0;i<7;i++){
        
        row = document.createElement("div");
        row.className = "grid-row";
        
        for(o=0;o<5;o++){
            el=document.createElement("div");
            el.className = "level-button";
            el.style.height = gameLevelGrid.blockHeight+"px";
            el.style.width = gameLevelGrid.blockWidth+"px";
            el.style.margin = gameLevelGrid.blockMargin+"px";

            levelText = document.createElement("div");
            levelText.className= "level-text";
            levelText.textContent = levelCounter;

            el.append(levelText);

            row.append(el);

            levelCounter++;
        }

        levelGrid.style.width = (gameLevelGrid.blockWidth+gameLevelGrid.blockMargin*2)*gameLevelGrid.width+"px";
        levelGrid.style.height = (gameLevelGrid.blockHeight+gameLevelGrid.blockMargin*2)*gameLevelGrid.height+"px";

        levelGrid.append(row);
    }


}

function hideAllScreens(){
    mainMenu.style.display = "none";
    gameGrid.style.display = "none";
    gameAlertScreen.style.display = "none";
    gameLevelScreen.style.display = "none";
}

function displayMainMenu(){
    hideAllScreens();
    mainMenu.style.display = "block";
}

function displayGameGrid(){
    hideAllScreens();
    gameGrid.style.display = "block";
}

function displaygameAlertScreen(){
    hideAllScreens();
    gameGrid.style.display = "block";
    gameAlertScreen.style.display = "block";
}

function displayLevelScreen(){
    hideAllScreens();
    renderLevelButtons();
    gameLevelScreen.style.display = "block";
}


/*#####################################################\
 *|                                                    #
 *| 4. event listeners                                 #
 *|                                                    # 
\#####################################################*/


function addEventListeners(){

    console.log("desktop events added");

    document.addEventListener("mouseup", function(event){
        setMouseDown(false);
    });

    gameAlertScreen.addEventListener("click", function(){
        if(
            gameAlertScreen.style.display!="none" && 
            gameAlertScreen.style.display!=""
        ){
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

function addGridEvents(gridWidth){

    console.log("add grid events!");

    pathBlocks = document.getElementsByClassName("path");

    for(i=0; i<gridBlocks.length; i++){
        gridBlocks[i].addEventListener("mouseenter", function(event){
            checkDrawPath(this, gridWidth);
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

function addMobileEventListeners(gridWidth){
    console.log("mobile events added");

    document.addEventListener("touchstart", function(event){
        console.log("hello world!");
        setMouseDown(false);
    });

    gameAlertScreen.addEventListener("touchstart", function(){
        if(
            gameAlertScreen.style.display!="none" && 
            gameAlertScreen.style.display!=""
        ){
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

    playButton.addEventListener("touchstart", function(){
        levels[currentLevel].generate();
        displayGameGrid(gridWidth);
        displayAlert("drag the path to fill the grid!");
    })

    /**
     * grid events are added here as well
     */

    gameGrid.addEventListener("touchmove", function(event){
        element = document.elementFromPoint(
            event.touches[0].clientX,
            event.touches[0].clientY
        )
        if(hasClass(element,"grid-block")){
            checkDrawPath(element);
        }
        event.preventDefault();
    
    })

    document.addEventListener("touchmove",function(){
        element = document.elementFromPoint(
            event.touches[0].clientX,
            event.touches[0].clientY
        );
        if(hasClass(element,"path")){
            pathMouseDown(element);
        }
        event.preventDefault();
    });

}

function addMobileGridEvents(){

    console.log("add grid (path) events!");

    pathBlocks = document.getElementsByClassName("path");

    for(i=0; i<pathBlocks.length; i++){
            pathBlocks[i].addEventListener("touchstart",function(event){
                pathMouseDown(this);
                event.preventDefault();
            })
    }



}

function bindNewPath(element){
    if(isMobile==true){
        element.addEventListener("touchstart", function(event){
            pathMouseDown(this);
        });
    }
    else{
        element.addEventListener("mousedown", function(event){
            pathMouseDown(this);
        })
    
        element.addEventListener("mouseenter",function(event){
            pathMouseEnter(this);
        });
    }
}

/*#####################################################\
 *|                                                    #
 *| 5. Initialization                                  #
 *|                                                    # 
\#####################################################*/
// drawGrid();
if(isMobile == true){
 addMobileEventListeners();
}
else{
    addEventListeners();
}

// displayMainMenu();
// mainMenu.style.display = "none";
// displayLevelScreen();

displayGameGrid();

// levels.push(
//     new level(3,3,0,2,[4]),
//     new level(7,4,0,4,[10,14,22,23,27]),
//     new level(8,6,1,0,[10,19, 28, 30, 36, 37, 45]),
//     new level(6,5,0,0,[8,13,11,28]),
//     new level(7 ,5, 0,0,[1,2,3,10,17,22]),
//     new level(8,6,4,4,[11,13,14,19,27,29,46,47])
// )

// levels[currentLevel].generate();

levels.push(
    [
        new level(3,3,0,2,[4]),
        new level(7,4,0,4,[10,14,22,23,27]),

        new level(7,5,1,3,[1,12,15,19,24,31]),
        new level(8,5,4,6,[8,10,16,29,30,37]),

        new level(7,6,0,0,[3,11,17,26,34,38]),
        new level(8,6,1,0,[10,19,28,30,36,37,45]),

        new level(8,6,1,0,[4,12,22,23,32,42,47]),
        new level(8,6,5,5,[3,7,24,29,38,42,44]),

        new level(8,6,4,2,[14,15,17,22,30,35,38]),
        new level(8,6,4,0,[7,32,40,41,44,46,47]),

        new level(8,6,4,0,[2,3,9,22,30,33,41]),
        new level(8,6,1,0,[10,12,19,21,25,38,39]),

        new level(8,6,0,3,[13,16,17,33,38,40,44]),
        new level(8,6,4,0,[0,5,10,14,32,35,37]),

        new level(8,6,0,0,[8,18,23,24,42,44,47]),
        new level(8,6,2,0,[7,13,15,22,28,31,41]),

        new level(8,6,1,4,[7,15,18,19,22,33,43]),
        new level(8,6,4,3,[13,16,19,25,32,35,43]),

        new level(8,6,0,1,[5,7,12,14,32,35,44]),
        new level(8,6,1,0,[14,15,19,25,32,35,36]),

        new level(8,6,1,0,[2,3,18,21,24,29,31]),
        new level(8,6,2,0,[7,17,23,32,40,41,44]),

        new level(8,6,2,0,[0,6,11,24,26,42,44]),
        new level(8,6,1,5,[3,7,16,24,27,30,46]),

        new level(8,6,3,0,[6,17,27,29,35,43]),
        new level(8,6,4,0,[7,8,13,15,26,30,33]),

        new level(8,6,5,0,[3,19,24,25,33,44,45]),
        new level(8,6,1,0,[9,12,15,27,32,43,47]),

        new level(8,6,1,0,[0,9,22,28,32,35,44]),
        new level(8,6,0,0,[2,13,22,32,33,35,47]),

        new level(8,6,4,0,[2,3,20,22,24,29,40]),
        new level(8,6,4,5,[3,28,29,35,36,38,44]),

        new level(8,6,3,0,[4,9,13,17,23,42,47]),
        new level(8,6,3,0,[8,31,33,37,38,39,47]),

        new level(8,6,5,0,[3,11,14,16,29,31,37]),
    ],
    [
        new level(8,5,3,2,[8,12,15,24,35,37]),
        new level(6,6,0,1,[5,7,12,17,30,33]),

        new level(7,6,4,0,[3,10,23,24,32,40]),
        new level(8,6,3,0,[8,24,28,31,37,46,47]),

        new level(8,6,3,0,[0,20,22,33,38,42,44]),
        new level(8,6,4,0,[5,9,13,14,37,40,46]),

        new level(8,6,0,0,[3,8,23,26,27,33,42]),
        new level(8,6,4,0,[3,10,26,28,32,38,46]),

        new level(8,6,1,0,[2,3,15,24,34,35,47]),
        new level(8,6,2,0,[0,17,22,26,39,42,45]),

        new level(8,6,0,0,[3,5,21,24,29,46,47]),
        new level(8,6,3,0,[4,13,16,17,33,37,40]),

        new level(8,6,0,3,[5,12,13,24,42,43,45]),
        new level(8,6,0,5,[14,15,22,24,34,35,36]),

        new level(8,6,3,4,[0,3,22,26,30,33,36]),
        new level(8,6,5,5,[12,14,15,28,29,37,44]),

        new level(8,6,0,0,[8,12,16,25,29,38,46]),
        new level(8,6,0,2,[2,5,13,21,28,42,44]),

        new level(8,6,4,0,[3,7,22,24,34,35,46]),
        new level(8,6,3,2,[10,14,18,23,40,44,45]),

        new level(8,6,0,0,[1,9,19,20,29,45,46]),
        new level(8,6,3,0,[2,12,15,21,31,37,44]),

        new level(8,6,4,5,[3,7,15,28,30,42,47]),
        new level(8,6,0,4,[8,9,19,27,32,35,41]),

        new level(8,6,1,0,[7,15,16,18,37,43,47]),
        new level(8,6,0,4,[9,14,17,27,30,42,45]),

        new level(8,6,1,6,[13,16,29,30,35,36,38]),
        new level(8,6,1,0,[2,11,12,17,32,37,47]),

        new level(8,6,0,4,[5,7,16,20,21,37,41]),
        new level(8,6,5,3,[3,14,22,24,29,34,35]),

        new level(8,6,5,1,[8,9,10,14,17,38,41]),
        new level(8,6,5,1,[5,9,14,17,42,45,47]),

        new level(8,6,1,6,[3,14,15,30,31,40,45]),
        new level(8,6,1,0,[0,16,22,25,36,38,44]),

        new level(8,6,1,4,[5,18,19,35,36,37,38]),
    ],
    [
        new level(6,6,1,0,[0,3,12,15,28]),
        new level(6,6,0,0,[16,18,20,28,29,35]),

        new level(6,6,3,3,[7,15,22,24,29]),
        new level(7,6,0,0,[6,10,16,26,27,35]),

        new level(8,6,3,0,[4,13,23,24,29,32,40]),
        new level(8,6,0,0,[3,5,19,29,30,33,47]),

        new level(8,6,0,0,[1,10,23,30,31,33,42]),
        new level(8,6,1,0,[11,14,17,22,23,24,34]),

        new level(8,6,0,3,[10,14,26,27,43,41,47]),
        new level(8,6,3,0,[12,24,29,33,37,35]),

        new level(8,6,4,0,[3,7,10,14,16,44,37]),
        new level(8,6,1,0,[10,19,28,30,36,37,45]),

        new level(8,6,3,0,[18, 22, 24, 25, 39, 45, 47]),
        new level(8,6,1,0,[5,16,31,34,36,42,47]),
        
        new level(8,6,5,0,[9,14,17,18,27,45,47]),
        new level(8,6,3,0,[8,11,19,32,33,34,35]),

        new level(8,6,2,0,[0,15,17,24,28, 37,44]),
        new level(8,6,5,0,[0,3,12,13,28,37,45]),

        new level(8,6,3,1,[2,10,13,21,35,35,39,44]),
        new level(8,6,1,0,[0,5,15,30,39,40,43]),

        new level(8,6,2,0,[3,8,16,22,28,31,41]),
        new level(8,6,0,1,[3,12,16,18,33,37,43]),

        new level(8,6,1,0,[7,15,25,28,34,43,47]),
        new level(8,6,1,0,[0,5,6,28,36,39,45]),

        new level(8,6,1,0,[6,15,21,26,37,44,47]),
        new level(8,6,0,0,[3,19,21,22,36,41,42]),

        new level(8,6,2,0,[5,16,24,25,31,35,39]),
        new level(8,6,0,0,[15,21,24,27,33,39,44]),

        new level(8,6,1,0,[0,17,19,30,31,39,43]),
        new level(8,6,0,3,[3,12,15,21,32,35,47]),

        new level(8,6,3,0,[14,16,18,23,34,37,38]),
        new level(8,6,1,0,[0,5,6,28,36,39,45]),

        new level(8,6,3,0,[8,16,21,29,32,35,40]),
        new level(8,6,1,0,[0,8,17,22,28,30,33]),

        new level(8,6,5,0,[4,12,17,18,26,36,44]),
        new level(8,6,1,0,[0,5,6,28,36,39,45]),

        new level(8,6,2,0,[3,8,19,30,35,38,42]),
    ],
    [
        new level(8,6,5,5,[3,16,25,28,29,41,45]),
        new level(8,6,1,0,[0,2,8,13,27,38,45]),

        new level(8,6,1,0,[7,17,23,27,29,45,47]),
        new level(8,6,0,6,[2,18,27,33,37,40,42]),

        new level(8,6,1,0,[2,10,19,32,34,39,47]),
        new level(8,6,3,0,[0,1,13,16,22,36,39]),

        new level(8,6,0,0,[1,2,5,11,21,39,44]),
        new level(8,6,2,1,[2,5,13,23,36,39,41]),

        new level(8,6,3,0,[5,12,24,29,30,40]),
        new level(8,6,0,4,[0,18,23,30,34,42,45]),
    ]
)

console.log(levels[levels.length-1][levels[levels.length-1].length-1])

levels[levels.length-1][levels[levels.length-1].length-1].generate();

// levels[currentLevel].generate();
// drawTestPath();
// drawRedBlock();