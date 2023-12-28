var wordlength = 5;
var gridsize = 5;
var words = [];
var sortedwords = [];
var attempts = [];
var grid;
var gridsize;
var allSelectedCells = [];
var inputletters =[];
var inputstring = "";
var score = 0;
var scorepane;
var rightwrong=[];
var matchcount=[];
var columnlists=[];
var reportcard  = "";
var reportcardpane;
var previoustries =[];

function initializePage() {
  reportcardpane = document.getElementById("reportcardpane");
  reportcardpane.style.display="none";
  grid = document.getElementById("gridtable");
  scorepane =    document.getElementById("scorepane");
 for (i=0; i<wordlength; i++) inputletters.push("");
  grid.addEventListener('click', (ev) => {
    const [x, y] = [
      ev.target.cellIndex,
      ev.target.parentElement.rowIndex
    ];
    if (x === undefined || y === undefined) {
      // Clicked on space between cells
      return;
    }
    processcellclick(x,y);
  });

  document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;
    // Alert the key name and key code on keydown
    processKeystroke(`${name}`);
  }, false);
}

function processKeystroke(key){
  //get current column
  h = document.getElementById("scorepane");
  // console.log(key);
  lastSelectedColumn = getLastSelectedcolumn();

  if (key=="Backspace") {
    if (lastSelectedColumn>=0) resetColumn(lastSelectedColumn);
    // console.log("backspace");
  }
  else if (key=="Enter"){
    if (getLastSelectedcolumn() == wordlength-1) submitanswers();
  }
  else if (lastSelectedColumn < wordlength  && columnlists[lastSelectedColumn+1].indexOf(key) >-1){
    // console.log(key);
    resetColumn(lastSelectedColumn+1);
    keyRow = getKeyRow(lastSelectedColumn+1,key);
    // console.log(keyRow, lastSelectedColumn+1);
    if (keyRow > -1) selectCell(grid.rows[keyRow].cells[lastSelectedColumn+1]);

    }

  }
///  console.log(columnlists[lastSelectedColumn].indexOf(key));
 

function getKeyRow(col,key){
  for (j=0; j<gridsize; j++){

    if (grid.rows[j].cells[col].innerHTML == key) return j;
  }
  return 0;
}


function getLastSelectedcolumn(){
  // console.log("getLastSelectedcolumn()");
  for (i=wordlength-1; i>-1; i--){
    for (j=gridsize-1; j>-1; j--){
      // console.log(i,j,grid.rows[j].cells[i].classList);
      if (grid.rows[j].cells[i].classList.contains("selected")) {
        // console.log("Column " + i )
        return i;
      }
    }
  }
  return -1;
}


function processcellclick(x,y){
  // console.log("cell " + x + "," + y + " clicked");
    clickedCell = grid.rows[y].cells[x]
    // console.log(clickedCell);
    allSelectedCells = document.querySelectorAll("td.selected");

    if (clickedCell.classList.contains("selected")) {
      resetColumn(x);
      return;
    }
    resetColumn(x);
    selectCell(clickedCell);
    console.log(inputletters);
  
}



function selectCell(cell) {
  //console.log("selecting" + cell);
  if (cell.classList.contains("selected")) {
    return "ERROR";
  }
  cell.classList.add("selected");
  inputletters[cell.cellIndex] = 
  cell.innerHTML;

}

function resetColumn(column) {
//  console.log("resetting column " + column);
  for(i=0; i<gridsize; i++){
    grid.rows[i].cells[column].classList.remove("selected") 
  }
}






function startNewGame() {
  score = 0;
  words = getwords();
  previoustries = [];
  drawattempts();
  drawgrid();
}

function nextStage(){
  console.log("NEXT STAGE");
  drawattempts();
  if (gridsize == 1) {
    drawgrid();
    automaticallyDoLastWord();
    return;}
  if (gridsize > 0){
    drawgrid();
  }
  else {
    score=score-1;
    document.getElementById("gridpane").style.display="none";   
    document.getElementById("scorepane").innerHTML = "Score: " + score
    if (score==4) {scorepane.innerHTML +="<h2>Perfect!</h2>"}
    if (score==5) {scorepane.innerHTML +="<h2>Awesome!</h2>"}
    if (score==6) {scorepane.innerHTML +="<h2>Excellent!</h2>"}
    if (score==7) {scorepane.innerHTML +="<h2>Nice.</h2>"}
    if (score>10) {scorepane.innerHTML +="<h2>Okay then.</h2>"}
    reportcardpane.innerHTML = reportcard;
    navigator.clipboard.writeText(reportcard);
    reportcardpane.style.display="block";
  }
}

function automaticallyDoLastWord(){
  for (i=0; i<wordlength; i++){
    console.log(grid);
    inputletters[i]=grid.rows[0].cells[i].innerHTML;
    grid.rows[0].cells[i].classList.add("selected");

  }
submitanswers(); 
}





function submitanswers() {
  allSelectedCells = document.querySelectorAll("td.selected");
  if (allSelectedCells.length != wordlength) {
    console.log("Pick " + wordlength + " letters, dummy!");
    return;
  }
  else {
    console.log("SUBMITTEED");
    inputstring = "";
    for (i = 0; i<wordlength; i++) {
      inputstring += inputletters[i];
    }
    console.log("You entered:" + inputstring);
  }

  if (previoustries.indexOf(inputstring)>-1){
    
    scorepane.innerHTML = "Score: " + score + "<br>Already tried " + inputstring;
    return;
   }
   previoustries.push(inputstring);
   score++;
   scorepane.innerHTML = "Score: " + score

  if (words.includes(inputstring)) {
    // CORRECT ANSWER IS ENTERED
    console.log("YAY!");
    gridsize--;
    var index = words.indexOf(inputstring);
    attempts.push(words[index]);
    words.splice(index, 1);
    rightwrong.push(0);
    matchcount.push(wordlength);
    nextStage();
  }
  else {
    // WRONG ANSWER ENTERED
    numberofmatchingcharacters = measureMatch(inputstring);
    console.log(numberofmatchingcharacters);
    attempts.push(inputstring);
    console.log("boo!");
    rightwrong.push(1);
    matchcount.push(numberofmatchingcharacters);

    drawattempts();
  }

}


function measureMatch(guess){
  max = 0;
  for(i=0; i<words.length; i++){
    count = 0;
    j=0; 
    while(words[i].slice(j,j+1)===guess[j] && j<wordlength) {j++;}
    if (j > max) max = j;
  }
  return max;
}






function drawgrid() {
  console.log(words);
  gridtable.innerHTML = "";
  var scrambledwords = [];


  columnlists=[];
  for(i=0; i<wordlength; i++){
    columnlists.push([]);
  }

  console.log("-----------");
  console.log(columnlists);
  console.log("-----------");




  for (i=0; i<wordlength; i++){
    for(j=0; j<gridsize; j++){
      columnlists[i].push(words[j][i]);
    }
  }

  for (i=0; i<wordlength; i++){
shuffle(columnlists[i]);
  }
  console.log(columnlists);
  for (i = 0; i < gridsize; i++) {
    var row = gridtable.insertRow(-1);
    for (j = 0; j < wordlength; j++) {
      var cell = row.insertCell(-1);
      cell.innerHTML = columnlists[j][i];
      cell.classList.add("gridletter");
    }
  
}



  
  console.log(scrambledwords);

}





function drawattempts() {
  console.log("attempts go here")
  answertable = document.getElementById("answertable");
  answertable.innerHTML = "";
  reportcard = "";
  for (i = 0; i < score; i++) {
    var reportcardline = "";
    var row = answertable.insertRow(0);
    for (j = 0; j < wordlength; j++) {
      var cell = row.insertCell(-1);
      cell.innerHTML = attempts[i][j];
      if (rightwrong[i] && j>=matchcount[i]){
        cell.classList.add("wronganswer");
        reportcardline += String.fromCodePoint(129477);
      }
      if (rightwrong[i] && j<matchcount[i]){
        cell.classList.add("startingright");
        reportcardline += String.fromCodePoint(127819);
      }
      if(!rightwrong[i]){
        cell.classList.add("rightanswer");
        reportcardline += String.fromCodePoint(127818);
      }  
    }
    reportcard = reportcardline  + "<br>" + reportcard;
  }
}



function getwords() {
thewords = [];

for (i=0; i<gridsize; i++){
thewords.push(bigwordlist5[Math.floor(Math.random() * bigwordlist5.length)]);
}
console.log(thewords);
return thewords;
return ["four","five","lead","oreo"];
}

function sortAlpha(word) {
  return word.split("")
    .sort()
    .join("");
}

function scramble(word) {
  strarray = word.split('');           
  var i,j,k
  for (i = 0; i < strarray.length; i++) {
    j = Math.floor(Math.random() * i)
    k = strarray[i]
    strarray[i] = strarray[j]
    strarray[j] = k
  }
  word = strarray.join('');  
  return word;
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
   while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
  [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}



initializePage();
startNewGame();
