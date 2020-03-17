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
 *  - MAYBE CHANGE EVENT BINDING ON LEVEL BUTTONS
 * 
 *  - COMPRESS EVENT LISTENERS
 *    - Worst case split into different file
 * 
 *  - MAKE UI ARROW IMAGES BACKGROUNDS OF DIVS
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

var gameGridScreen = document.getElementById("game-grid-screen");

var levelBackButton = document.getElementById("level-back-button");

var gameLevelHeader = document.getElementById("game-level-header");

var mainMenu = document.getElementById("main-menu");

var gameAlertScreen = document.getElementById("game-alert-screen");

var gameAlertHeader = document.getElementById("game-alert-header");

var playButton = document.getElementById("play-button");

var gameLevelScreen = document.getElementById("game-level-screen");

var worldHeader = document.getElementById("world-header");

var nextWorldButton = document.getElementById("next-world-button");

var previousWorldButton = document.getElementById("previous-world-button");

var levelGrid = document.getElementById("level-grid");

var levels;

var currentLevel = 0;
var currentWorld = 0;

var grid = {
    height:4,
    width:4,
    blockHeight:46,
    blockWidth:46,
    blockMargin:1,
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

var progressLevel;
var progressWorld;

if(Cookies.get("progress") == undefined || Cookies.get("progress") == null){
    progressLevel =  0;
    progressWorld = 0;

    Cookies.set("progress",JSON.stringify({progressWorld:progressWorld,progressLevel:progressLevel}));

}
else{
    progress = JSON.parse(Cookies.get("progress"));

    progressLevel = progress.progressLevel;

    progressWorld = progress.progressWorld;
}


// var isMobile = false;

// Cookies.set('progress',{progessLevel:0,progressWorld:0});

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

function generateLevel(level){
    mainMenu.style.display = "none";

    for(var i=0; i<level.gridHeight; i++){
        var row=document.createElement("div");
        row.className = "grid-row";
        gameGrid.append(row)
        for(var e=0;e<level.gridWidth;e++){
            var el = document.createElement("div");
            el.className="grid-block";
            el.style.height = grid.blockHeight + "px";
            el.style.width = grid.blockWidth + "px";
            el.style.margin = grid.blockMargin + "px";
            row.append(el);
        }
    }

    gameGrid.style.width = (grid.blockWidth+grid.blockMargin*2)*level.gridWidth+"px";
    gameGrid.style.height = (grid.blockHeight+grid.blockMargin*2)*level.gridHeight+"px";

    var pathStart = document.createElement("div");
    pathStart.id = "path-start";
    pathStart.className = "path";
    pathStart.style.height = grid.blockHeight + "px";
    pathStart.style.width = grid.blockWidth + "px";

    document.getElementsByClassName("grid-row")[level.pathStartY].getElementsByClassName("grid-block")[level.pathStartX].append(pathStart);

    game.coordinates.push([level.pathStartX, level.pathStartY, indexInClass(pathStart)])
    game.path.push(indexInClass(pathStart.parentElement))

    pathBlocks = document.getElementsByClassName("path");

    level.drawRedBlocks();

    addGridEvents(level.gridWidth);

    displayGameGridScreen();

}

function previousWorld(){
    if(currentWorld==0){
        console.log("do nothing");
    }
    else{
        currentWorld--;
        renderLevelButtons();
    }
}

function nextWorld(){
    if(currentWorld<levels.length-1){
        currentWorld++;
        renderLevelButtons();
    }
    else{
        console.log("do nothing");
    }
}

/*#####################################################\
 *|                                                    #
 *| 3. display functions                               #
 *|                                                    # 
\#####################################################*/

function renderLevelButtons(){

    displayWorldIndex = currentWorld+1;
    worldHeader.textContent = "World " + displayWorldIndex;

    levelGrid.innerHTML = "";

    var levelCounter = 1;
    for(i=0;i<7;i++){
        
        row = document.createElement("div");
        row.className = "grid-row";
        
        console.log("current: " + currentWorld + " progress: " + progressWorld);

        for(o=0;o<5;o++){
            el=document.createElement("div");

            if(currentWorld>progressWorld){
                el.className = el.className = "level-button level-locked";
            }
            else if(progressWorld==currentWorld){
                if(progressLevel==0 && levelCounter-1==0){
                    el.className = "level-button";
                }
                
                else if(levelCounter-1>progressLevel){
                    el.className = el.className = "level-button level-locked";
                }
                
                else{
                    el.className = "level-button";
                }
            }
            else{
                el.className = "level-button";
            }
            
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

    addLevelButtonEvents();

}

function hideAllScreens(){
    mainMenu.style.display = "none";
    gameGridScreen.style.display = "none";
    gameAlertScreen.style.display = "none";
    gameLevelScreen.style.display = "none";
}

function displayMainMenu(){
    hideAllScreens();
    mainMenu.style.display = "block";
}

function displayGameGridScreen(){
    hideAllScreens();
    gameGridScreen.style.display = "block";
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
 *| 4. event functions                                 #
 *|                                                    # 
\#####################################################*/


function alertScreenEvent(){
    if(
        gameAlertScreen.style.display!="none" && 
        gameAlertScreen.style.display!=""
    ){
        if( game.win == true ){
            console.log("finished level");
            if(currentLevel == levels[currentWorld].length-1){

                console.log("finished world");

                if(progressWorld<=currentWorld && progressWorld < levels.length-1){
                    progressWorld++;
                    progressLevel = 0;
                    Cookies.set("progress",JSON.stringify({progressWorld:progressWorld,progressLevel:progressLevel}));
                }

                game.win=false;
                nextWorld();
                resetGrid();
                displayLevelScreen();
            }
            else if( game.end == true ){
                console.log("finished game");
                resetGame();
                displayLevelScreen();
            }
            else{
                game.win = false;
                nextLevel();
            }
            
        }

        else{
            displayGameGridScreen();
        }
    }
}



/*#####################################################\
 *|                                                    #
 *| 5. event listeners                                 #
 *|                                                    # 
\#####################################################*/


function addEventListeners(){

    console.log("desktop events added");

    document.addEventListener("mouseup", function(){
        setMouseDown(false);
    });

    gameAlertScreen.addEventListener("click", function(){
        alertScreenEvent();
    });

    playButton.addEventListener("click", function(){
        displayLevelScreen();
    })

    previousWorldButton.addEventListener("click", function(){
        previousWorld();
    });

    nextWorldButton.addEventListener("click", function(){
        nextWorld();
    });

    levelBackButton.addEventListener("click", function(){
        displayLevelScreen();
    });

    // 
    // MOBILE EVENTS
    // 

    console.log("mobile events added");

    document.addEventListener("touchstart", function(event){
        // console.log("hello world!");
        setMouseDown(false);
        event.preventDefault();
    });

    gameAlertScreen.addEventListener("touchstart", function(event){
        alertScreenEvent();
        event.preventDefault();
    });

    playButton.addEventListener("touchstart", function(){
        displayLevelScreen();
        event.preventDefault();
    })

    previousWorldButton.addEventListener("touchstart", function(){
        previousWorld();
        event.preventDefault();
    });

    nextWorldButton.addEventListener("touchstart", function(){
        nextWorld();
        event.preventDefault();
    });

    levelBackButton.addEventListener("touchstart", function(){
        displayLevelScreen();
        event.preventDefault();
    });

    /**
     * grid events are added here as well
     */

    gameGrid.addEventListener("touchmove", function(event){
        element = document.elementFromPoint(
            event.touches[0].clientX,
            event.touches[0].clientY
        )
        if(hasClass(element,"grid-block")){
            checkDrawPath(element,levels[currentWorld][currentLevel].gridWidth);
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

    // MOBILE EVENTS

    pathBlocks = document.getElementsByClassName("path");

    for(i=0; i<pathBlocks.length; i++){
        pathBlocks[i].addEventListener("touchstart",function(event){
            console.log("path touch");
            pathMouseDown(this);
            // event.preventDefault();
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

function addLevelButtonEvents(){
    var levelButtons = document.getElementsByClassName("level-button");

    levelCounter = 0;

    for(i=0; i<levelButtons.length; i++){
        if(!hasClass(levelButtons[i],"level-locked")){
            levelButtons[i].addEventListener("click", function(event){
                currentLevel = indexInClass(this);
                levels[currentWorld][indexInClass(this)].generate();
                displayGameGridScreen();
            })            
        }

        levelCounter++;
    }
}

/*#####################################################\
 *|                                                    #
 *| 6. Initialization                                  #
 *|                                                    # 
\#####################################################*/

addEventListeners();

displayMainMenu();


// mainMenu.style.display = "none";

// displayLevelScreen();


// displayGameGridScreen();

// currentLevel = 3;
// levels[0][3].generate();

