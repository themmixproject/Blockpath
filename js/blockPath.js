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

levelButtons = document.getElementsByClassName("menu-option");
levelButtonsArr = [];
for(var i=0; i<levelButtons.length; i++){levelButtonsArr.push(levelButtons[i])}

levels = [];
currentLevel = 0;

grid = {
    height:4,
    width:4,
    blockHeight:100,
    blockWidth:100,
    blockMargin:5,
}

game = {
    mouseDown : false,
    path : [],
    coordinates: [],
    startX: 3,
    startY: 1,
    redBlocks:[]
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

function drawGrid(){

    for(i=0; i<(grid.height); i++){
        row=document.createElement("div");
        row.className = "grid-row";
        gameGrid.append(row)
        for(e=0;e<grid.width;e++){
            el = document.createElement("div");
            el.className="grid-block";
            el.style.height = grid.blockHeight + "px";
            el.style.width = grid.blockWidth + "px";
            el.style.margin = grid.blockMargin + "px";
            row.append(el);
        }
    }
    
    gameGrid.style.width = (grid.blockWidth+grid.blockMargin*2)*grid.width+"px";
    gameGrid.style.height = (grid.blockHeight+grid.blockMargin*2)*grid.height+"px";

    pathStart = document.createElement("div");

    pathStart.id = "path-start";

    pathStart.className = "path"

    document.getElementsByClassName("grid-row")[game.startY].getElementsByClassName("grid-block")[game.startX].append(pathStart);

    game.coordinates.push([game.startX, game.startY, indexInClass(pathStart)])
    game.path.push(indexInClass(pathStart.parentElement))
};

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

        console.log("differenceX:" + differenceX+" differenceY:"+differenceY);
        console.log("within X:" + (differenceX <= 1 && differenceX >= -1 && differenceY===0) + " withinY:"+(differenceY <= 1 && differenceY >= -1 && differenceX === 0));

        if( checkDifferent(index) == true){

            if(
                differenceX <= 1 && differenceX >= -1 && differenceY===0 ||
                differenceY <= 1 && differenceY >= -1 && differenceX === 0
            ){

                // console.log(game.path)
                drawPath(x, y, index, previousCoordinates) 
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
        gridBlocks[index].append(el)
    }
    else if( previousCoordinates[0] - (x) == 1 ){
        el = document.createElement("div");
        el.className = "path right";
        gridBlocks[index].append(el)
    }

    else if(previousCoordinates[1] - y == -1){
        el = document.createElement("div");
        el.className = "path top";
        gridBlocks[index].append(el)
    }

    else if(previousCoordinates[1] - y == 1){
        el = document.createElement("div");
        el.className = "path bottom";
        gridBlocks[index].append(el)
    }

    // bindPath();
    bindNewPath(el);

};

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
    constructor(gridHeight, gridWidth, pathStartX, pathStartY){
        this.gridHeight = gridHeight;
        this.gridWidth = gridWidth;
        this.pathStartX = pathStartX;
        this.pathStartY = pathStartY
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
        pathStart.className = "path"
    
        document.getElementsByClassName("grid-row")[this.pathStartY].getElementsByClassName("grid-block")[this.pathStartX].append(pathStart);
    
        game.coordinates.push([this.pathStartX, this.pathStartY, indexInClass(pathStart)])
        game.path.push(indexInClass(pathStart.parentElement))

        pathBlocks = document.getElementsByClassName("path");

        this.addEvents();

    }

    addEvents(){

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

    clear(){
        gameGrid.innerHTML="";
    }

}









/*#####################\
#   event-listeners    #
\#####################*/

function addEventListeners(){

    document.addEventListener("mouseup", function(event){
        setMouseDown(false);
    });

    levelButtonsArr.forEach(function(item, index){
        item.addEventListener("click", function(){
            generateLevel(index);
        });
    })
    

    // for(i=0; i<gridBlocks.length; i++){
    //     gridBlocks[i].addEventListener("mouseenter", function(event){
    //         checkDrawPath(this);
    //     })
        
    // }

    // bindPath();

}

function bindPath(){

    pathBlocks = document.getElementsByClassName("path");



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

/*#####################\
#         init         #
\#####################*/
// drawGrid();
addEventListeners();
level1 = new level(4,4,0,2);
levels.push(level1);
level1.generate();
// drawTestPath();
// drawRedBlock();