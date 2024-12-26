var wordlength = 5;
var gridsize = 5;
var words = [];
var sortedwords = [];
var attempts = [];
var grid;
var gridsize;
var allSelectedCells = [];
var inputletters = [];
var inputstring = "";
var score = 0;
var scorepane;
var rightwrong = [];
var matchcount = [];
var columnlists = [];
var reportcard = "";
var reportcardpane;
var previoustries = [];

function initializePage() {
  reportcardpane = document.getElementById("reportcardpane");
  reportcardpane.style.display = "none";
  grid = document.getElementById("gridtable");
  scorepane = document.getElementById("scorepane");
  document.getElementById("copymessage").style.display = "none";

  for (i = 0; i < wordlength; i++) inputletters.push("");
  grid.addEventListener('click', (ev) => {
    const [x, y] = [
      ev.target.cellIndex,
      ev.target.parentElement.rowIndex
    ];
    if (x === undefined || y === undefined) {
      // Clicked on space between cells
      return;
    }
    processcellclick(x, y);
  });

  document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;
    // Alert the key name and key code on keydown
    processKeystroke(`${name}`);
  }, false);
}

function processKeystroke(key) {
  //get current column
  h = document.getElementById("scorepane");
  // console.log(key);
  lastSelectedColumn = getLastSelectedcolumn();

  if (key == "Backspace") {
    if (lastSelectedColumn >= 0) resetColumn(lastSelectedColumn);
    // console.log("backspace");
  }
  else if (key == "Enter") {
    if (getLastSelectedcolumn() == wordlength - 1) submitanswers();
  }
  else if (lastSelectedColumn < wordlength && columnlists[lastSelectedColumn + 1].indexOf(key) > -1) {
    // console.log(key);
    resetColumn(lastSelectedColumn + 1);
    keyRow = getKeyRow(lastSelectedColumn + 1, key);
    // console.log(keyRow, lastSelectedColumn+1);
    if (keyRow > -1) selectCell(grid.rows[keyRow].cells[lastSelectedColumn + 1]);

  }

}
///  console.log(columnlists[lastSelectedColumn].indexOf(key));


function getKeyRow(col, key) {
  for (j = 0; j < gridsize; j++) {

    if (grid.rows[j].cells[col].innerHTML == key) return j;
  }
  return 0;
}


function getLastSelectedcolumn() {
  // console.log("getLastSelectedcolumn()");
  for (i = wordlength - 1; i > -1; i--) {
    for (j = gridsize - 1; j > -1; j--) {
      // console.log(i,j,grid.rows[j].cells[i].classList);
      if (grid.rows[j].cells[i].classList.contains("selected")) {
        // console.log("Column " + i )
        return i;
      }
    }
  }
  return -1;
}


function processcellclick(x, y) {
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
  for (i = 0; i < gridsize; i++) {
    grid.rows[i].cells[column].classList.remove("selected")
  }
}

function unselectAll() {
  for (j = 0; j < wordlength; j++) {
    for (i = 0; i < gridsize; i++) {
      grid.rows[i].cells[j].classList.remove("selected");
    }
  }
}




function startNewGame() {
  score = 0;
  words = getwords();
  previoustries = [];
  drawattempts();
  drawgrid();
}

function nextStage() {
  console.log("NEXT STAGE");
  drawattempts();
  if (gridsize == 1) {
    drawgrid();
    automaticallyDoLastWord();
    return;
  }
  if (gridsize > 0) {
    drawgrid();
  }
  else {
    score = score - 1;
    document.getElementById("resetbutton").style.display = "none";
    document.getElementById("submitbutton").style.display = "none";
    document.getElementById("gridpane").style.display = "none";
    document.getElementById("rulesbutton").style.display = "none";
    document.getElementById("shufflebutton").style.display = "none";

    document.getElementById("scorepane").innerHTML = "Score: " + score
    if (score == 4) { scorepane.innerHTML += "<h2>Perfect!</h2>" }
    if (score == 5) { scorepane.innerHTML += "<h2>Awesome!</h2>" }
    if (score == 6) { scorepane.innerHTML += "<h2>Excellent!</h2>" }
    if (score == 7) { scorepane.innerHTML += "<h2>Nice.</h2>" }
    if (score > 10) { scorepane.innerHTML += "<h2>Okay then.</h2>" }
    document.getElementById("reportcardtext").innerHTML = reportcard;
    reportcardpane.style.display = "block";
  }
}

function automaticallyDoLastWord() {
  for (i = 0; i < wordlength; i++) {
    console.log(grid);
    inputletters[i] = grid.rows[0].cells[i].innerHTML;
    grid.rows[0].cells[i].classList.add("selected");

  }
  submitanswers();
}

function getmonthname(m) {
  if (m == 0) return "Jan";
  if (m == 1) return "Feb";
  if (m == 2) return "Mar";
  if (m == 3) return "Apr";
  if (m == 4) return "May";
  if (m == 5) return "Jun";
  if (m == 6) return "Jul";
  if (m == 7) return "Aug";
  if (m == 8) return "Sep";
  if (m == 9) return "Oct";
  if (m == 10) return "Nov";
  if (m == 11) return "Dec";
}


function copyscore() {
  today = new Date();
  month = today.getMonth();
  month = getmonthname(month);
  day = today.getDate();
  datestring = month + " " + day;


  linktext = "\nhttp://catfrog6502.github.io\n";
  reportcard = "Five-Stir " + datestring + ": Score: " + score + "\n\n" + reportcard;
  reportcard = reportcard.replaceAll("<br>", "\n");
  reportcard += linktext;
  navigator.clipboard.writeText(reportcard);
  document.getElementById("copymessage").style.display = "block";

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
    for (i = 0; i < wordlength; i++) {
      inputstring += inputletters[i];
    }
    console.log("You entered:" + inputstring);
    // if (!(bigwordlist5.includes(inputstring))){
    //   sp = document.getElementById("scorepane")
    //   sp.innerHTML = "\""+inputstring+"\" is not a Fivestir Word <br>" +sp.innerHTML
    //   return;

    // }



  }

  if (previoustries.indexOf(inputstring) > -1) {

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


function measureMatch(guess) {
  max = 0;
  for (i = 0; i < words.length; i++) {
    count = 0;
    j = 0;
    while (words[i].slice(j, j + 1) === guess[j] && j < wordlength) { j++; }
    if (j > max) max = j;
  }
  return max;
}






function drawgrid() {
  console.log(words);
  gridtable.innerHTML = "";
  var scrambledwords = [];


  columnlists = [];
  for (i = 0; i < wordlength; i++) {
    columnlists.push([]);
  }

  console.log("-----------");
  console.log(columnlists);
  console.log("-----------");




  for (i = 0; i < wordlength; i++) {
    for (j = 0; j < gridsize; j++) {
      columnlists[i].push(words[j][i]);
    }
  }

  for (i = 0; i < wordlength; i++) {
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
      if (rightwrong[i] && j >= matchcount[i]) {
        cell.classList.add("wronganswer");
        //        reportcardline += String.fromCodePoint(129477);
        reportcardline += String.fromCodePoint(129531);
      }
      if (rightwrong[i] && j < matchcount[i]) {
        cell.classList.add("startingright");
        reportcardline += String.fromCodePoint(129413);
      }
      if (!rightwrong[i]) {
        cell.classList.add("rightanswer");
        reportcardline += String.fromCodePoint(128005);
      }
    }
    reportcard = reportcardline + "<br>" + reportcard;
  }
}




function getwords() {
  thewords = [];

  today = new Date();
  month = today.getMonth();
  day = today.getDate();

  monthday = month * 100 + day;

  console.log(monthday);
  // switch (monthday) {
  //   case 1: return ["ready", "point", "laser", "stain", "audio"];
  //   case 2: return ["cater", "drift", "stake", "voice", "study"];
  //   case 3: return ["salve", "gross", "entry", "chant", "rotor"];
  //   case 4: return ["plumb", "lapel", "carob", "speak", "quark"];
  //   case 5: return ["badly", "tripe", "thine", "lucid", "angle"];
  //   case 6: return ["plump", "chair", "sushi", "loyal", "oaten"];
  //   case 7: return ["logic", "clerk", "ascot", "tamer", "mound"];
  //   case 1131: return ["logic", "clerk", "ascot", "tamer", "mound"];


  // }

  // return ["aaaaa", "aaaaa", "aaaaa", "aaaaa", "aaaaa"];

  for (i = 0; i < gridsize; i++) {
    thewords.push(bigwordlist5[Math.floor(Math.random() * bigwordlist5.length)]);
    //  thewords.push(bigwordlist7[Math.floor(Math.random() * bigwordlist7.length)]);
  }
  console.log(thewords);
  return thewords;
  return ["mixed", "weird", "laser", "funny", "funky"];
}

function sortAlpha(word) {
  return word.split("")
    .sort()
    .join("");
}

function scramble(word) {
  strarray = word.split('');
  var i, j, k
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
  let currentIndex = array.length, randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


function showrules() {
  window.open("rules.html", '_blank').focus();
}

initializePage();
startNewGame();
