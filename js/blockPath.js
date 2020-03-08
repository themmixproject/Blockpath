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

function addMobileEventListeners(){
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
        displayGameGrid();
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

displayMainMenu();
// mainMenu.style.display = "none";
// displayLevelScreen();

// displayGameGrid();

levels.push(
    new level(3,3,0,2,[4]),
    new level(7,4,0,4,[10,14,22,23,27]),
    new level(8,6,1,0,[10,19, 28, 30, 36, 37, 45]),
    new level(6,5,0,0,[8,13,11,28]),
    new level(7 ,5, 0,0,[1,2,3,10,17,22]),
    new level(8,6,4,4,[11,13,14,19,27,29,46,47])
)

// levels.push(
//     [
//         new level(3,3,0,2,[4])
//     ]
// )

// levels[0][0].generate();

// levels[currentLevel].generate();
// drawTestPath();
// drawRedBlock();