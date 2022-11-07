'use strict';

class GameClass{
    globalGameMap = new Array(); // in this class property we store information about all the cells in the game
    localGameMap  = new Map();   // in this class property we store information only about the cells that are next to the player
    constructor() {              // constructor, fill elements with predefined values
        this.generateTable();
        this.globalGameMap = Array(1 + 5 * 5).fill('free position');
        this.globalGameMap[0] = 'fake position';
        for (let i = 2; i <= this.globalGameMap.length; i += 10) {
            this.globalGameMap[i]     = 'locked position';
            this.globalGameMap[i + 2] = 'locked position';
            this.drawTheRightColor(i);
            this.drawTheRightColor(i + 2);
        }
        [1, 3, 11, 16, 21].forEach((array_item) => {
            this.globalGameMap[array_item] = 'green';
            this.drawTheRightColor(array_item);
        });

        [6, 8, 13, 18, 23].forEach((array_item) => {
            this.globalGameMap[array_item] = 'red';
            this.drawTheRightColor(array_item);
        });
        [5, 19, 15, 20, 25].forEach((array_item) => {
            this.globalGameMap[array_item] = 'orange';
            this.drawTheRightColor(array_item);
        });
        //this.globalGameMap.forEach(function(array_item, index) {console.log(index + ' ' + array_item);}); // for test and debug
    }
    generateTable() {
        const tbl = document.createElement("table");   // creates a <table> element and a <tbody> element
        const tblBody = document.createElement("tbody");
        for (let i = 1; i < 6; i++) {                  // creating all cells
            const row = document.createElement("tr");  // creates a table row
            for (let j = 1; j < 6; j++) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at the end of the table row
            const cell = document.createElement("td");
            cell.id = 5 * (i - 1) + j;
            cell.onclick = function() { thisGame.myFunc(cell.id); };
            const cellText = document.createTextNode(`cell in row ${i}, column ${j}... id is ${cell.id}`);
            cell.appendChild(cellText);
            row.appendChild(cell);
            }                             // add the row to the end of the table body:
            tblBody.appendChild(row);
        }
        tbl.appendChild(tblBody);         // put the <tbody> in the <table>
        document.body.appendChild(tbl);   // appends <table> into <body>
        tbl.setAttribute("border", "2");  // sets the border attribute of tbl to '2' 
        const currentDiv = document.getElementById("myId");// adding table to DOM, so that later it would be possible to access these elements by id
        document.body.insertBefore(tbl, currentDiv);
        }
        
    myFunc(value){
        if ( sessionStorage.getItem("selectedPosition") === null || sessionStorage.getItem("selectedPosition") === undefined ) { // if the key is set in the session
            if (this.globalGameMap[value] !== 'free position' && this.globalGameMap[value] !== 'locked position' )
                sessionStorage.setItem("selectedPosition", JSON.stringify(Array.from(this.createLocalGameMap(value).entries()))); // serialize to write to session
        }
        else {
            this.localGameMap = new Map(JSON.parse(sessionStorage.getItem("selectedPosition"))); // deserialize to take from session.
            let previousSelectedPosition = this.localGameMap.entries().next().value[0],          // take the desired data from the first key-value pair in the Map structure, 
                previousSelectedColor = this.localGameMap.entries().next().value[1];             // because the first pair there is the previous click
            if (this.localGameMap.get( Number(value)) === 'free position' || value == previousSelectedPosition){
                this.globalGameMap[previousSelectedPosition] = this.globalGameMap[value];        // swap colors
                this.globalGameMap[value] = previousSelectedColor;
                this.drawTheRightColor(previousSelectedPosition);
                this.drawTheRightColor(value);
                sessionStorage.removeItem("selectedPosition");
                this.checkWin();                                                                 // check if it was a win
            }
        }
    }
    createLocalGameMap(selectedPositionCoordinate) {                                             // here we record and store information in the cells next to the player
        this.localGameMap = new Map();
        this.localGameMap.set( Number(selectedPositionCoordinate),     this.globalGameMap[ Number(selectedPositionCoordinate)]);
        this.localGameMap.set( Number(selectedPositionCoordinate) - 5, this.globalGameMap[ Number(selectedPositionCoordinate) - 5]);
        this.localGameMap.set( Number(selectedPositionCoordinate) + 5, this.globalGameMap[ Number(selectedPositionCoordinate) + 5]);
        switch (selectedPositionCoordinate % 5) {
        case 0:                                                                                 // cell in the right corner
            this.localGameMap.set( Number(selectedPositionCoordinate) - 1, this.globalGameMap[ Number(selectedPositionCoordinate) - 1]);
         break;
        case 1:                                                                                 // cell in the left corner
            this.localGameMap.set( Number(selectedPositionCoordinate) + 1, this.globalGameMap[ Number(selectedPositionCoordinate) + 1]);
         break;
        default:
            this.localGameMap.set( Number(selectedPositionCoordinate) - 1, this.globalGameMap[ Number(selectedPositionCoordinate) - 1]);
            this.localGameMap.set( Number(selectedPositionCoordinate) + 1, this.globalGameMap[ Number(selectedPositionCoordinate) + 1]);
        }
        return this.localGameMap;
    }
    checkWin(){
        for (let i = 1; i < this.globalGameMap.length; i += 5)
            if(this.globalGameMap[i] != 'green' || this.globalGameMap[i + 2] != 'red' || this.globalGameMap[i + 4] != 'orange')
                return;
        setTimeout(function(){
            alert('You won! The game will restart.');
            document.location.reload();
        }, 250);
    }
    drawTheRightColor(id, color = '#f2e9e9'){
        switch (this.globalGameMap[id]) {
            case 'locked position':
                color = '#494a44';
            break;
            case 'green':
                color = '#80d981';
            break;
            case 'red':
                color = '#ed5a5f';
            break;
            case 'orange':
                color = '#faa550';
            break;
        }
        document.getElementById(new String(id)).style.backgroundColor = color;
    }    
}

let thisGame = new GameClass();             // create an instance of the class