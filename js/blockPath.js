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

var gameWinScreen = document.getElementById("game-win-screen");

var gameWinHeader = document.getElementById("game-win-header");

var playButton = document.getElementById("play-button");

var levels = [];
var currentLevel = 0;

var grid = {
    height:4,
    width:4,
    blockHeight:46,
    blockWidth:46,
    blockMargin:2,
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
    gameWinScreen.style.display = "block";
    gameWinHeader.innerHTML = text;
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
 *| 4. event listeners                                 #
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

        if(isMobile==true){
            document.addEventListener("touchmove", function(event){
                element = document.elementFromPoint(
                    event.touches[0].clientX,
                    event.touches[0].clientY
                )

                // console.log(hasClass(element,"path"))
                
                if(hasClass(element,"grid-block")){
                    checkDrawPath(element);
                }

                // event.preventDefault();
            })

        }
        else{
            gridBlocks[i].addEventListener("mouseenter", function(event){
                checkDrawPath(this);
            })
        }


        
    }

    for(i=0; i<pathBlocks.length; i++){

        if(isMobile==true){
            // pathBlocks[i].addEventListener("touchstart", function(event){
            //     pathMouseDown(this);
            // });

            document.addEventListener("touchstart",function(event){
                
                element = document.elementFromPoint(
                    event.touches[0].clientX,
                    event.touches[0].clientY
                )

                // console.log(hasClass(element,"path"))
                
                if(hasClass(element,"path")){
                    pathMouseDown(element);
                }

                // event.preventDefault();

            })

            document.addEventListener("touchmove",function(){

                element = document.elementFromPoint(
                    event.touches[0].clientX,
                    event.touches[0].clientY
                )

                if(hasClass(element,"path")){
                    pathMouseDown(element);
                }

                // console.log(hasClass(element,"path"))
                
                // event.preventDefault();

            });
        }
        else{
            pathBlocks[i].addEventListener("mousedown", function(event){
                pathMouseDown(this);
            });

            pathBlocks[i].addEventListener("mouseenter",function(event){
                pathMouseEnter(this);
            });
        }    
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
 *| 5. Initialization                                  #
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