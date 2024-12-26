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
  //   if (!(bigwordlist5.includes(inputstring))){
  //     sp = document.getElementById("scorepane")
  //     sp.innerHTML = "\""+inputstring+"\" is not a Fivestir Word <br>" +sp.innerHTML
  //     return;

  //   }
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
  switch (monthday) {

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

case 600: return ["craft", "conch", "junta", "drive", "stove"]; 
case 601: return ["dolly", "gaunt", "admit", "bleak", "tango"]; 
case 602: return ["voter", "sneer", "cramp", "enjoy", "crank"]; 
case 603: return ["meson", "skulk", "billy", "batty", "gaudy"]; 
case 604: return ["tenth", "hardy", "teach", "flaky", "float"]; 
case 605: return ["harry", "sepia", "tangy", "chill", "howdy"]; 
case 606: return ["laced", "valor", "check", "plaza", "tripe"]; 
case 607: return ["excel", "ashen", "lotus", "preen", "spiff"]; 
case 608: return ["flint", "churn", "stunt", "sumac", "armed"]; 
case 609: return ["keyed", "beefy", "horde", "waver", "gusty"]; 
case 610: return ["idler", "prior", "spoor", "scold", "quilt"]; 
case 611: return ["riled", "civic", "ricer", "early", "aloud"]; 
case 612: return ["scene", "setup", "adopt", "haiku", "eject"]; 
case 613: return ["stand", "maple", "adorn", "feint", "hiker"]; 
case 614: return ["hazel", "purse", "month", "bored", "final"]; 
case 615: return ["crazy", "flora", "worth", "warty", "rajah"]; 
case 616: return ["maser", "smelt", "jawed", "mumps", "spoof"]; 
case 617: return ["demon", "hurry", "swell", "bacon", "floss"]; 
case 618: return ["shrub", "hence", "poser", "stand", "dozen"]; 
case 619: return ["halon", "coven", "itchy", "worth", "daisy"]; 
case 620: return ["polka", "crush", "ahead", "homey", "gruel"]; 
case 621: return ["lupus", "cliff", "axiom", "cross", "vireo"]; 
case 622: return ["withe", "indie", "spade", "feces", "human"]; 
case 623: return ["finer", "fiber", "hence", "avail", "prose"]; 
case 624: return ["grant", "sleep", "curve", "rebus", "anise"]; 
case 625: return ["brake", "dolly", "maybe", "elegy", "human"]; 
case 626: return ["shrug", "skint", "steal", "angel", "golly"]; 
case 627: return ["siren", "whelp", "slope", "waste", "bluff"]; 
case 628: return ["wordy", "dazed", "loose", "pearl", "razor"]; 
case 629: return ["price", "dogma", "rerun", "flies", "depot"]; 
case 630: return ["skive", "owner", "baton", "hyena", "boson"]; 
case 631: return ["waver", "basil", "sting", "pique", "payee"]; 
case 700: return ["amber", "torso", "exult", "untie", "wormy"]; 
case 701: return ["vapor", "gulch", "blond", "laity", "cocoa"]; 
case 702: return ["guppy", "tansy", "stove", "apply", "ardor"]; 
case 703: return ["lowly", "bloom", "feast", "renew", "foray"]; 
case 704: return ["gaily", "thigh", "murky", "movie", "bruin"]; 
case 705: return ["clash", "daddy", "shaft", "hatch", "radar"]; 
case 706: return ["blurt", "aloha", "mamba", "ultra", "learn"]; 
case 707: return ["annul", "fetus", "fount", "muddy", "pylon"]; 
case 708: return ["glans", "biped", "blend", "miser", "vexed"]; 
case 709: return ["rogue", "quest", "paste", "ascot", "pupil"]; 
case 710: return ["lobed", "yield", "risen", "coral", "bison"]; 
case 711: return ["grain", "brawn", "grump", "kitty", "relic"]; 
case 712: return ["quash", "awful", "lease", "puppy", "fused"]; 
case 713: return ["sepia", "laird", "dandy", "stoop", "elfin"]; 
case 714: return ["verve", "tummy", "preen", "small", "heron"]; 
case 715: return ["plank", "feint", "fatwa", "motor", "kooky"]; 
case 716: return ["woman", "enter", "deign", "sadly", "fauna"]; 
case 717: return ["banjo", "steam", "gaudy", "flora", "quell"]; 
case 718: return ["avail", "steak", "skein", "spool", "scape"]; 
case 719: return ["shred", "sweat", "souse", "ulcer", "lapel"]; 
case 720: return ["modal", "acorn", "fifty", "truce", "balmy"]; 
case 721: return ["larva", "ratio", "crazy", "scoff", "crape"]; 
case 722: return ["topaz", "waken", "posed", "syrup", "bugle"]; 
case 723: return ["prune", "awful", "bunny", "trash", "clang"]; 
case 724: return ["blond", "genus", "fault", "nervy", "exert"]; 
case 725: return ["girth", "vapor", "blurb", "modal", "krill"]; 
case 726: return ["sheet", "brawl", "blank", "afoot", "mulch"]; 
case 727: return ["wedge", "broth", "newly", "bevel", "modem"]; 
case 728: return ["diver", "grape", "trail", "mafia", "cable"]; 
case 729: return ["bribe", "gouty", "ditto", "sneak", "natal"]; 
case 730: return ["oaken", "comic", "plaza", "adore", "earth"]; 
case 731: return ["combo", "rogue", "break", "copra", "noisy"]; 
case 800: return ["vomit", "whirl", "worth", "homer", "osier"]; 
case 801: return ["suede", "flaky", "atoll", "still", "razed"]; 
case 802: return ["bread", "prosy", "drool", "liner", "graph"]; 
case 803: return ["sword", "glaze", "slurp", "recur", "crook"]; 
case 804: return ["often", "stink", "lying", "charm", "swing"]; 
case 805: return ["crank", "flask", "runny", "sloop", "skill"]; 
case 806: return ["verge", "crimp", "drift", "layer", "raver"]; 
case 807: return ["faker", "brine", "affix", "kneel", "boast"]; 
case 808: return ["shred", "sassy", "jiffy", "withe", "erupt"]; 
case 809: return ["modem", "withe", "great", "owner", "offer"]; 
case 810: return ["juicy", "birch", "brick", "flesh", "harry"]; 
case 811: return ["gabby", "flair", "tarry", "filmy", "twist"]; 
case 812: return ["avert", "croon", "molar", "occur", "abyss"]; 
case 813: return ["retro", "brash", "offer", "sonny", "power"]; 
case 814: return ["break", "cater", "sense", "scout", "kitty"]; 
case 815: return ["newly", "crier", "pulpy", "proud", "digit"]; 
case 816: return ["ovoid", "papal", "cower", "radio", "dopey"]; 
case 817: return ["sward", "miser", "tract", "spine", "saucy"]; 
case 818: return ["quash", "taffy", "clown", "askew", "bread"]; 
case 819: return ["clone", "easel", "dowse", "blood", "flair"]; 
case 820: return ["forgo", "faded", "lasso", "crypt", "doubt"]; 
case 821: return ["vocal", "rimed", "email", "proud", "wimpy"]; 
case 822: return ["truly", "winch", "cadre", "softy", "spool"]; 
case 823: return ["loyal", "shoat", "pearl", "dread", "savor"]; 
case 824: return ["basic", "sixty", "scram", "reply", "await"]; 
case 825: return ["exact", "flesh", "shuck", "tasty", "gruel"]; 
case 826: return ["barge", "drawl", "gaunt", "pasha", "karat"]; 
case 827: return ["abash", "drama", "rummy", "tweak", "quiff"]; 
case 828: return ["gourd", "tacit", "venue", "leave", "patch"]; 
case 829: return ["tater", "handy", "bared", "amuse", "thick"]; 
case 830: return ["venue", "halon", "ethyl", "nippy", "sebum"]; 
case 831: return ["sonar", "snare", "ghost", "gamin", "inept"]; 
case 900: return ["parch", "usher", "tatty", "glitz", "snide"]; 
case 901: return ["daunt", "beech", "fault", "meaty", "greet"]; 
case 902: return ["rifle", "jiffy", "lucre", "adore", "fiber"]; 
case 903: return ["scone", "sling", "miser", "guard", "wreak"]; 
case 904: return ["cabin", "unzip", "dandy", "preen", "crone"]; 
case 905: return ["grant", "least", "flaky", "widen", "milch"]; 
case 906: return ["decry", "daisy", "enter", "snide", "wordy"]; 
case 907: return ["elude", "haunt", "twine", "stair", "youth"]; 
case 908: return ["gofer", "mogul", "brief", "ranch", "ultra"]; 
case 909: return ["pukka", "frisk", "irate", "kabob", "agree"]; 
case 910: return ["scrum", "weave", "homer", "boson", "march"]; 
case 911: return ["sally", "geode", "rumba", "pilot", "leper"]; 
case 912: return ["wonky", "hunch", "climb", "yucca", "craft"]; 
case 913: return ["waver", "abyss", "etude", "sonic", "boron"]; 
case 914: return ["palmy", "bossy", "salve", "dicey", "flock"]; 
case 915: return ["whack", "harsh", "scuff", "tamer", "slice"]; 
case 916: return ["perch", "gummy", "oxide", "froth", "krill"]; 
case 917: return ["phase", "croak", "croup", "trawl", "stark"]; 
case 918: return ["rinse", "smear", "decry", "poppy", "payee"]; 
case 919: return ["loopy", "twist", "hired", "divvy", "pupil"]; 
case 920: return ["leach", "tress", "canon", "wheat", "mired"]; 
case 921: return ["sprig", "angst", "sabot", "mocha", "knave"]; 
case 922: return ["manic", "rugby", "raven", "bilge", "robin"]; 
case 923: return ["recur", "aired", "aired", "derby", "servo"]; 
case 924: return ["fugue", "leggy", "asset", "twain", "chasm"]; 
case 925: return ["chimp", "brain", "uvula", "brand", "brisk"]; 
case 926: return ["eerie", "canto", "seven", "colic", "fleet"]; 
case 927: return ["blank", "yucky", "pride", "dowel", "slimy"]; 
case 928: return ["goner", "feces", "stray", "smock", "endow"]; 
case 929: return ["tench", "cocoa", "paper", "slimy", "ether"]; 
case 930: return ["shred", "helix", "swing", "gushy", "rupee"]; 
case 931: return ["valet", "crude", "glove", "tamed", "astir"]; 
case 1000: return ["forum", "vivid", "limit", "stoke", "admit"]; 
case 1001: return ["field", "skier", "koala", "grown", "corny"]; 
case 1002: return ["sonar", "owing", "bread", "roman", "tamed"]; 
case 1003: return ["focal", "abyss", "solid", "hobby", "momma"]; 
case 1004: return ["genus", "stoat", "alley", "pause", "hated"]; 
case 1005: return ["hater", "lapel", "flake", "bunny", "clasp"]; 
case 1006: return ["spine", "larch", "boron", "aside", "cured"]; 
case 1007: return ["arise", "filth", "stung", "unlit", "creep"]; 
case 1008: return ["trace", "crank", "hound", "bathe", "spawn"]; 
case 1009: return ["chore", "torus", "attic", "plump", "hoary"]; 
case 1010: return ["trove", "latch", "sooty", "briny", "dowel"]; 
case 1011: return ["divan", "slake", "denim", "bring", "trend"]; 
case 1012: return ["primp", "waxen", "blond", "comer", "guise"]; 
case 1013: return ["urban", "knife", "decay", "faker", "chain"]; 
case 1014: return ["great", "trope", "picky", "bushy", "liner"]; 
case 1015: return ["leech", "idyll", "sloop", "zesty", "balsa"]; 
case 1016: return ["suede", "ideal", "aloft", "whose", "payer"]; 
case 1017: return ["vireo", "bigot", "offer", "maybe", "locus"]; 
case 1018: return ["spiny", "labor", "welsh", "fried", "coupe"]; 
case 1019: return ["belch", "slake", "decay", "mouth", "radon"]; 
case 1020: return ["scour", "debut", "choke", "liken", "raver"]; 
case 1021: return ["stack", "drive", "tower", "yearn", "poppy"]; 
case 1022: return ["tract", "stint", "scour", "lithe", "brier"]; 
case 1023: return ["trail", "moved", "scald", "along", "lumpy"]; 
case 1024: return ["cheat", "plate", "cleft", "brine", "souse"]; 
case 1025: return ["nadir", "assay", "refer", "retie", "stoic"]; 
case 1026: return ["raver", "niece", "adorn", "bread", "annul"]; 
case 1027: return ["dummy", "sewer", "moire", "cable", "first"]; 
case 1028: return ["nymph", "panda", "slush", "metro", "spoof"]; 
case 1029: return ["exert", "smith", "grasp", "guile", "amide"]; 
case 1030: return ["saved", "stark", "folly", "loose", "rodeo"]; 
case 1031: return ["loner", "basal", "hinge", "venom", "whisk"]; 
case 1100: return ["sorry", "wrong", "softy", "pluck", "beryl"]; 
case 1101: return ["ulcer", "emcee", "swath", "hovel", "risky"]; 
case 1102: return ["dress", "tuber", "swept", "spent", "eaves"]; 
case 1103: return ["color", "recur", "blaze", "idyll", "peaty"]; 
case 1104: return ["clout", "niche", "theta", "guess", "radar"]; 
case 1105: return ["giddy", "furor", "primp", "wrest", "koala"]; 
case 1106: return ["shock", "relic", "souse", "wooer", "abyss"]; 
case 1107: return ["jinks", "optic", "exist", "jerky", "moult"]; 
case 1108: return ["cramp", "goose", "civil", "glide", "world"]; 
case 1109: return ["small", "asset", "biddy", "arbor", "samba"]; 
case 1110: return ["might", "learn", "fetal", "haply", "sense"]; 
case 1111: return ["ruble", "waltz", "clunk", "music", "muggy"]; 
case 1112: return ["other", "rabid", "defer", "genus", "print"]; 
case 1113: return ["waive", "vaunt", "wight", "noise", "model"]; 
case 1114: return ["pecan", "earth", "gloss", "catch", "enema"]; 
case 1115: return ["fiend", "lupus", "corny", "lager", "slick"]; 
case 1116: return ["flash", "allay", "bonus", "refer", "coyly"]; 
case 1117: return ["catch", "spoke", "grunt", "death", "snarl"]; 
case 1118: return ["spare", "foggy", "batty", "aloof", "geode"]; 
case 1119: return ["adorn", "sappy", "rouge", "sized", "grape"]; 
case 1120: return ["sting", "piano", "crawl", "plump", "myrrh"]; 
case 1121: return ["creed", "schwa", "knead", "photo", "deary"]; 
case 1122: return ["fetid", "macho", "abuse", "slack", "scorn"]; 
case 1123: return ["aloha", "pique", "among", "taxer", "basil"]; 
case 1124: return ["runny", "bevel", "rabbi", "mixer", "bowel"]; 
case 1125: return ["misty", "queen", "swipe", "upend", "icing"]; 
case 1126: return ["macro", "seize", "truth", "usurp", "bylaw"]; 
case 1127: return ["forgo", "roper", "irony", "later", "angel"]; 
case 1128: return ["velum", "bench", "otter", "grief", "conic"]; 
case 1129: return ["porch", "bylaw", "hubby", "woody", "tunic"]; 
case 1130: return ["photo", "prove", "ricer", "troth", "lurch"]; 
case 1131: return ["acute", "salty", "dummy", "dowry", "tilde"]; 
case 1200: return ["model", "recur", "rifle", "risky", "gland"]; 
case 1201: return ["lurid", "drift", "lorry", "leach", "eagle"]; 
case 1202: return ["flood", "slimy", "inlet", "swoop", "handy"]; 
case 1203: return ["early", "moved", "canon", "abbey", "drape"]; 
case 1204: return ["drier", "butte", "basic", "catty", "nippy"]; 
case 1205: return ["rabid", "prime", "vague", "ghoul", "trove"]; 
case 1206: return ["molar", "lorry", "shook", "daddy", "start"]; 
case 1207: return ["withe", "winch", "pleat", "stale", "badly"]; 
case 1208: return ["demon", "anger", "tower", "murky", "filer"]; 
case 1209: return ["dandy", "cinch", "prole", "saint", "dying"]; 
case 1210: return ["augur", "fount", "cigar", "thank", "argot"]; 
case 1211: return ["fryer", "bilge", "pound", "shale", "baggy"]; 
case 1212: return ["petal", "abaft", "haven", "motif", "boron"]; 
case 1213: return ["prude", "crick", "croft", "erode", "watch"]; 
case 1214: return ["phone", "steer", "combo", "dated", "fecal"]; 
case 1215: return ["stein", "polio", "dowry", "elate", "daisy"]; 
case 1216: return ["which", "belie", "elite", "waste", "ferry"]; 
case 1217: return ["plumy", "crime", "pubis", "feint", "toxic"]; 
case 1218: return ["inure", "babel", "thong", "crypt", "inset"]; 
case 1219: return ["whelp", "glove", "bogey", "daddy", "score"]; 
case 1220: return ["mixed", "mucky", "sauce", "shake", "rouse"]; 
case 1221: return ["racer", "beast", "serge", "ashen", "trend"]; 
case 1222: return ["marsh", "sieve", "court", "exalt", "alarm"]; 
case 1223: return ["annul", "kudos", "knock", "throw", "nasal"]; 
case 1224: return ["lipid", "rebel", "bride", "later", "tasty"]; 
case 1225: return ["ankle", "comfy", "talky", "waive", "flirt"]; 
case 1226: return ["eaves", "raspy", "dusty", "clink", "edger"]; 
case 1227: return ["scant", "thine", "pulpy", "ripen", "shade"]; 
case 1228: return ["stave", "fable", "woven", "mocha", "sally"]; 
case 1229: return ["cagey", "least", "pasha", "learn", "satyr"]; 
case 1230: return ["spank", "cynic", "label", "lodge", "krill"]; 
case 1231: return ["gnarl", "bulky", "skimp", "merge", "chute"]; 
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
