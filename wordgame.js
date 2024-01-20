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
        reportcardline += String.fromCodePoint(129704);
      }
      if (rightwrong[i] && j < matchcount[i]) {
        cell.classList.add("startingright");
        reportcardline += String.fromCodePoint(127819);
      }
      if (!rightwrong[i]) {
        cell.classList.add("rightanswer");
        reportcardline += String.fromCodePoint(127818);
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
  switch (monthday) {

    case 20: return ["hurry", "banjo", "jumpy", "strip", "drift"];
    case 21: return ["corps", "smile", "brick", "crumb", "bumpy"];
    case 23: return ["local", "theme", "usual", "smile", "tonic"]; 
    case 24: return ["gland", "cubit", "pedal", "break", "brave"]; 
    case 25: return ["liege", "mushy", "bower", "yummy", "inner"]; 
    case 26: return ["outer", "flies", "often", "abaft", "jaded"]; 
    case 27: return ["annex", "birch", "warty", "cider", "nylon"]; 
    case 28: return ["cleat", "chock", "shred", "enjoy", "bated"]; 
    case 29: return ["husky", "brick", "blame", "mafia", "melon"]; 
    case 30: return ["filly", "viola", "fluid", "apple", "umbra"]; 
    case 31: return ["based", "opine", "basic", "kooky", "budge"]; 

    case 100: return ["gaudy", "vocal", "suave", "motel", "whole"]; 
case 101: return ["shrug", "scree", "rower", "floss", "study"]; 
case 102: return ["indie", "miser", "hoist", "cinch", "skill"]; 
case 103: return ["tacit", "agave", "peaty", "tract", "pupal"]; 
case 104: return ["hurry", "every", "cater", "value", "blush"]; 
case 105: return ["thank", "tansy", "moxie", "lifer", "owing"]; 
case 106: return ["quill", "comet", "young", "shire", "razor"]; 
case 107: return ["child", "tract", "aside", "sport", "plead"]; 
case 108: return ["revel", "dryly", "grace", "gleam", "liner"]; 
case 109: return ["bebop", "lowly", "stain", "still", "mucky"]; 
case 110: return ["mound", "hatch", "flare", "neigh", "empty"]; 
case 111: return ["bloat", "reach", "privy", "abide", "dated"]; 
case 112: return ["ozone", "email", "jaunt", "yummy", "trice"]; 
case 113: return ["tinge", "candy", "genie", "filly", "video"]; 
case 114: return ["deuce", "madly", "exalt", "gourd", "fuzzy"]; 
case 115: return ["crust", "frizz", "eared", "setup", "chuff"]; 
case 116: return ["block", "floor", "chary", "oxbow", "widen"]; 
case 117: return ["phase", "fusty", "pecan", "share", "carob"]; 
case 118: return ["inlay", "screw", "soapy", "salty", "brass"]; 
case 119: return ["tarot", "lofty", "might", "slash", "labor"]; 
case 120: return ["joint", "musty", "crime", "avast", "forte"]; 
case 121: return ["audio", "carom", "geode", "range", "rider"]; 
case 122: return ["vinyl", "mourn", "arrow", "chalk", "haste"]; 
case 123: return ["budge", "foyer", "speak", "croon", "sonic"]; 
case 124: return ["amuse", "joust", "grimy", "purge", "clime"]; 
case 125: return ["pluck", "whose", "hefty", "burst", "chick"]; 
case 126: return ["roomy", "lunge", "tower", "timer", "batty"]; 
case 127: return ["batch", "delay", "pekoe", "trunk", "nonce"]; 
case 128: return ["imbue", "cycle", "retro", "scope", "reedy"]; 
case 129: return ["level", "nasal", "rabid", "rowdy", "molly"]; 
case 130: return ["flint", "ardor", "stout", "revue", "assay"]; 
case 131: return ["trill", "harry", "chock", "spice", "testy"]; 
case 200: return ["lemma", "lorry", "belie", "dodge", "buddy"]; 
case 201: return ["spicy", "muted", "eject", "easel", "fairy"]; 
case 202: return ["feral", "rumor", "plebe", "stoke", "agate"]; 
case 203: return ["blimp", "trade", "lemma", "trope", "fauna"]; 
case 204: return ["wispy", "verge", "gofer", "among", "imbue"]; 
case 205: return ["spire", "clank", "owlet", "dully", "hater"]; 
case 206: return ["vodka", "heard", "frump", "urine", "chain"]; 
case 207: return ["decaf", "sixty", "dimer", "pushy", "drown"]; 
case 208: return ["tinny", "spell", "fumed", "chart", "hunch"]; 
case 209: return ["dowry", "jumpy", "sneer", "treat", "rough"]; 
case 210: return ["grant", "arbor", "trike", "candy", "craft"]; 
case 211: return ["creep", "beryl", "jaunt", "annex", "grail"]; 
case 212: return ["ratio", "obese", "nabob", "pique", "spicy"]; 
case 213: return ["dowse", "amour", "month", "ether", "queen"]; 
case 214: return ["sadly", "leash", "aptly", "sleek", "apple"]; 
case 215: return ["youth", "screw", "allot", "silly", "juror"]; 
case 216: return ["plaza", "owned", "unfed", "ovoid", "flunk"]; 
case 217: return ["quack", "plate", "agile", "gauze", "viola"]; 
case 218: return ["green", "shawl", "fling", "naive", "rabid"]; 
case 219: return ["erode", "share", "elegy", "layup", "hunch"]; 
case 220: return ["blank", "flair", "cubit", "cider", "alloy"]; 
case 221: return ["moray", "pylon", "evade", "brown", "curry"]; 
case 222: return ["eight", "poppy", "crown", "chary", "stale"]; 
case 223: return ["alert", "torus", "pique", "robot", "messy"]; 
case 224: return ["crone", "forge", "lupus", "silky", "terse"]; 
case 225: return ["flank", "widen", "month", "giant", "cozen"]; 
case 226: return ["woody", "chuff", "growl", "furze", "rotor"]; 
case 227: return ["foggy", "vowel", "amply", "ovary", "realm"]; 
case 228: return ["smock", "abbey", "lunge", "click", "charm"]; 
case 229: return ["lucky", "flank", "allot", "vireo", "levee"]; 
case 230: return ["alike", "angle", "oddly", "skirt", "naked"]; 
case 231: return ["ghost", "march", "lover", "crony", "tubed"]; 
case 300: return ["burly", "scope", "godly", "basal", "dully"]; 
case 301: return ["adder", "puffy", "anger", "graph", "goody"]; 
case 302: return ["sigma", "laugh", "lowly", "extra", "greet"]; 
case 303: return ["cause", "lipid", "swipe", "hooey", "tamed"]; 
case 304: return ["hobby", "drier", "agave", "polyp", "snare"]; 
case 305: return ["speak", "sneak", "joist", "raver", "faced"]; 
case 306: return ["joust", "sniff", "sully", "larva", "pixel"]; 
case 307: return ["dated", "jetty", "hyena", "pasha", "felon"]; 
case 308: return ["belch", "whelk", "speak", "large", "agent"]; 
case 309: return ["small", "champ", "torso", "funky", "frill"]; 
case 310: return ["sudsy", "ethyl", "lucky", "aging", "rabid"]; 
case 311: return ["bevel", "dummy", "binge", "manna", "piper"]; 
case 312: return ["sable", "roast", "spoof", "decaf", "plush"]; 
case 313: return ["toddy", "oasis", "power", "false", "owlet"]; 
case 314: return ["viand", "holey", "chunk", "doyen", "croft"]; 
case 315: return ["plait", "hoary", "greed", "curve", "touch"]; 
case 316: return ["tardy", "juice", "clump", "evoke", "talon"]; 
case 317: return ["spill", "shame", "spill", "pilot", "xerox"]; 
case 318: return ["yahoo", "bonus", "inner", "toxin", "shine"]; 
case 319: return ["poser", "point", "flood", "sharp", "pinch"]; 
case 320: return ["colic", "phlox", "prowl", "serve", "stomp"]; 
case 321: return ["allay", "scary", "unfit", "gorge", "blind"]; 
case 322: return ["midst", "inert", "embed", "mania", "tansy"]; 
case 323: return ["dirge", "mixer", "place", "warty", "chard"]; 
case 324: return ["broom", "thyme", "start", "spoke", "slate"]; 
case 325: return ["march", "bowed", "yodel", "horse", "tinge"]; 
case 326: return ["velum", "sedgy", "ruddy", "angel", "surly"]; 
case 327: return ["dolly", "futon", "guess", "chime", "caret"]; 
case 328: return ["girth", "drawl", "lasso", "wrong", "uncle"]; 
case 329: return ["yokel", "whole", "arrow", "their", "slate"]; 
case 330: return ["moped", "sough", "smelt", "heard", "picky"]; 
case 331: return ["staph", "treat", "endow", "codex", "loser"]; 
case 400: return ["stoke", "guano", "scape", "hiker", "growl"]; 
case 401: return ["vocal", "edify", "adage", "crank", "timer"]; 
case 402: return ["flash", "holey", "lever", "gauze", "stink"]; 
case 403: return ["mogul", "fewer", "debug", "folly", "flunk"]; 
case 404: return ["peace", "mayor", "speed", "zilch", "moxie"]; 
case 405: return ["clamp", "whist", "bingo", "troth", "hazel"]; 
case 406: return ["toque", "berth", "alley", "burgh", "erase"]; 
case 407: return ["mason", "tinny", "felon", "glaze", "shake"]; 
case 408: return ["throe", "pesky", "yacht", "shaky", "flame"]; 
case 409: return ["snoop", "wheel", "siren", "altar", "smash"]; 
case 410: return ["pudgy", "bawdy", "alias", "umbra", "below"]; 
case 411: return ["theme", "solve", "aired", "rimed", "shrew"]; 
case 412: return ["purse", "scrum", "scull", "saint", "annoy"]; 
case 413: return ["razed", "totem", "lupus", "river", "chino"]; 
case 414: return ["bight", "oddly", "curve", "label", "drupe"]; 
case 415: return ["harpy", "exist", "loath", "mired", "toner"]; 
case 416: return ["error", "squid", "ruled", "segue", "frump"]; 
case 417: return ["unfed", "pooch", "ricer", "zebra", "junta"]; 
case 418: return ["mined", "maser", "afoot", "roomy", "sudsy"]; 
case 419: return ["manta", "amine", "hardy", "aging", "token"]; 
case 420: return ["cheat", "sewer", "bight", "edict", "agave"]; 
case 421: return ["enemy", "crony", "dregs", "seven", "broad"]; 
case 422: return ["manly", "heron", "deary", "rosin", "skunk"]; 
case 423: return ["swish", "chute", "nabob", "faded", "thorn"]; 
case 424: return ["spear", "amigo", "lodge", "sorry", "hello"]; 
case 425: return ["speed", "mafia", "swish", "silly", "stuff"]; 
case 426: return ["urine", "whist", "uvula", "enema", "feral"]; 
case 427: return ["shell", "trews", "uncut", "chafe", "hatch"]; 
case 428: return ["cumin", "dopey", "slyly", "beast", "evoke"]; 
case 429: return ["quake", "dress", "grief", "edict", "blond"]; 
case 430: return ["elite", "meson", "cater", "topic", "posse"]; 
case 431: return ["udder", "carve", "wonky", "sweat", "crepe"]; 
case 500: return ["tizzy", "slush", "crate", "hired", "combo"]; 
case 501: return ["tribe", "udder", "clone", "inner", "dinar"]; 
case 502: return ["shoot", "mower", "lemma", "broad", "payee"]; 
case 503: return ["creep", "japan", "evoke", "mouth", "elite"]; 
case 504: return ["fable", "rutty", "swipe", "goody", "brass"]; 
case 505: return ["afire", "gloss", "humid", "opine", "tenor"]; 
case 506: return ["amiss", "lodge", "fused", "spill", "blare"]; 
case 507: return ["epoch", "never", "grade", "wonky", "theta"]; 
case 508: return ["titan", "sadly", "milky", "meter", "bowed"]; 
case 509: return ["tango", "saver", "infer", "inset", "bogus"]; 
case 510: return ["anger", "bigot", "yield", "tarry", "snaky"]; 
case 511: return ["shoal", "taunt", "talky", "spiky", "least"]; 
case 512: return ["crypt", "newel", "hoist", "frond", "shyly"]; 
case 513: return ["meson", "caper", "dazed", "major", "catty"]; 
case 514: return ["soled", "stale", "clump", "stamp", "fence"]; 
case 515: return ["mealy", "llama", "pique", "filly", "wormy"]; 
case 516: return ["bally", "torus", "throe", "asset", "gruff"]; 
case 517: return ["craze", "loner", "blunt", "ethyl", "weary"]; 
case 518: return ["house", "arrow", "shift", "basin", "steer"]; 
case 519: return ["blurb", "store", "lithe", "furry", "abate"]; 
case 520: return ["risky", "slosh", "booby", "angst", "rigor"]; 
case 521: return ["croft", "metro", "tuner", "unify", "taboo"]; 
case 522: return ["frizz", "gassy", "alibi", "grasp", "grove"]; 
case 523: return ["calyx", "alias", "drove", "drown", "broth"]; 
case 524: return ["woven", "lemon", "toxic", "boast", "comet"]; 
case 525: return ["train", "tangy", "foamy", "about", "moldy"]; 
case 526: return ["gourd", "antic", "crave", "going", "caulk"]; 
case 527: return ["avert", "topic", "creel", "baton", "cream"]; 
case 528: return ["octal", "habit", "bidet", "notch", "angst"]; 
case 529: return ["salsa", "salve", "fiend", "lance", "chary"]; 
case 530: return ["risen", "piece", "frost", "filch", "mucky"]; 
case 531: return ["shape", "shiny", "chart", "spoil", "radix"]; 

    case 1: return ["ready", "point", "laser", "stain", "audio"];
    case 2: return ["cater", "drift", "stake", "voice", "study"];
    case 3: return ["salve", "gross", "entry", "chant", "rotor"];
    case 4: return ["plumb", "lapel", "carob", "speak", "quark"];
    case 5: return ["badly", "tripe", "thine", "lucid", "angle"];
    case 6: return ["plump", "chair", "sushi", "loyal", "oaten"];
    case 14: return ["logic", "clerk", "ascot", "tamer", "mound"];
    case 8: return ["koala", "audio", "brook", "chive", "extra"];
    case 9: return ["sleep", "grate", "digit", "phase", "skimp"];
    case 10: return ["green", "zippy", "other", "binge", "forth"];
    case 11: return ["never", "ounce", "equal", "treat", "moped"];
    case 12: return ["sloth", "amaze", "pizza", "money", "frill"];
    case 13: return ["bravo", "cocoa", "petty", "pager", "tease"];
    case 7: return ["horse", "tapir", "zebra", "lemur", "tiger"];
    case 1131: return ["logic", "clerk", "ascot", "tamer", "mound"];

  }

  return ["aaaaa", "aaaaa", "aaaaa", "aaaaa", "aaaaa"];

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
