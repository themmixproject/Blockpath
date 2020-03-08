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

        if(isMobile==true){
            addMobileGridEvents(this.gridWidth);
        }
        else{
            addGridEvents(this.gridWidth);
        }
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
