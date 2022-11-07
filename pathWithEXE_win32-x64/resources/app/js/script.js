'use strict';

class GameClass{
    globalGameMap = new Array();
    localGameMap = new Map();
    constructor() {            // constructor, fill elements with predefined values
        this.generateTable();
        this.globalGameMap = Array(1 + 5 * 5).fill('free position');
        this.globalGameMap[0] = 'fake position';
        for (let i = 2; i <= this.globalGameMap.length; i += 10) {
            this.globalGameMap[i] = 'locked position';
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
        // creates a <table> element and a <tbody> element
        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");
        // creating all cells
        for (let i = 1; i < 6; i++) {
            // creates a table row
            const row = document.createElement("tr");
            for (let j = 1; j < 6; j++) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            const cell = document.createElement("td");
            cell.id = 5 * (i - 1) + j;
            cell.onclick = function() { thisGame.myFunc(cell.id); };
            const cellText = document.createTextNode(`cell in row ${i}, column ${j}... id is ${cell.id}`);
            cell.appendChild(cellText);
            row.appendChild(cell);
            }
            // add the row to the end of the table body
            tblBody.appendChild(row);
        }
        // put the <tbody> in the <table>
        tbl.appendChild(tblBody);
        // appends <table> into <body>
        document.body.appendChild(tbl);
        // sets the border attribute of tbl to '2' 
        tbl.setAttribute("border", "2");
        // adding table to DOM, so that later it would be possible to access these elements by id
        const currentDiv = document.getElementById("myId");
        document.body.insertBefore(tbl, currentDiv);
        }
        
    myFunc(value){
        if ( sessionStorage.getItem("selectedPosition") === null || sessionStorage.getItem("selectedPosition") === undefined ) {
            if (this.globalGameMap[value] !== 'free position' && this.globalGameMap[value] !== 'locked position' )
                sessionStorage.setItem("selectedPosition", JSON.stringify(Array.from(this.createLocalGameMap(value).entries())));
        }
        else /* if(this.globalGameMap[value] === 'free position') */{
            this.localGameMap = new Map(JSON.parse(sessionStorage.getItem("selectedPosition")));
            let previousSelectedPosition = this.localGameMap.entries().next().value[0],
                previousSelectedColor = this.localGameMap.entries().next().value[1];
            if (this.localGameMap.get( Number(value)) === 'free position' || value == previousSelectedPosition){
                this.globalGameMap[previousSelectedPosition] = this.globalGameMap[value];
                this.globalGameMap[value] = previousSelectedColor;
                this.drawTheRightColor(previousSelectedPosition);
                this.drawTheRightColor(value);
                sessionStorage.removeItem("selectedPosition");
                this.checkWin();
            }
        }
    }
    createLocalGameMap(selectedPositionCoordinate) {
        this.localGameMap = new Map();
        this.localGameMap.set( Number(selectedPositionCoordinate), this.globalGameMap[ Number(selectedPositionCoordinate)]);
        this.localGameMap.set( Number(selectedPositionCoordinate) - 5, this.globalGameMap[ Number(selectedPositionCoordinate) - 5]);
        this.localGameMap.set( Number(selectedPositionCoordinate) + 5, this.globalGameMap[ Number(selectedPositionCoordinate) + 5]);
        switch (selectedPositionCoordinate % 5) {
        case 0:
            this.localGameMap.set( Number(selectedPositionCoordinate) - 1, this.globalGameMap[ Number(selectedPositionCoordinate) - 1]);
        break;
        case 1:
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

let thisGame = new GameClass();