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
    case 0: return ["ladle", "llama", "smelt", "trump", "chary"];
    case 1: return ["rhino", "grief", "stair", "spend", "besom"];
    case 2: return ["layup", "fetch", "pasty", "swing", "nervy"];
    case 3: return ["whist", "lunge", "serum", "stogy", "daisy"];
    case 4: return ["homer", "drain", "filth", "droll", "afoot"];
    case 5: return ["lemur", "whale", "spent", "leech", "steel"];
    case 6: return ["haven", "skint", "slime", "spawn", "igloo"];
    case 7: return ["elder", "bread", "guess", "acute", "flour"];
    case 8: return ["mousy", "tress", "state", "tango", "smelt"];
    case 9: return ["cinch", "rivet", "legal", "depot", "hoard"];
    case 10: return ["quash", "cocky", "creek", "polio", "pilot"];
    case 11: return ["budge", "tibia", "scare", "whoop", "evade"];
    case 12: return ["showy", "bunny", "wrack", "sower", "sedan"];
    case 13: return ["saver", "erect", "scion", "ducky", "gleam"];
    case 14: return ["plant", "ditty", "sized", "gushy", "learn"];
    case 15: return ["shale", "molar", "ennui", "every", "homer"];
    case 16: return ["twine", "shawl", "singe", "aphid", "aptly"];
    case 17: return ["pulpy", "ohmic", "above", "roost", "snack"];
    case 18: return ["needy", "relay", "girth", "velum", "flask"];
    case 19: return ["haply", "spoon", "tibia", "brine", "impel"];
    case 20: return ["whelm", "sidle", "shade", "etude", "slate"];
    case 21: return ["ditto", "lemma", "squib", "heist", "payer"];
    case 22: return ["craft", "clone", "bowel", "bliss", "pasty"];
    case 23: return ["squib", "inert", "groom", "aegis", "porch"];
    case 24: return ["loyal", "abuzz", "tread", "finch", "scrub"];
    case 25: return ["fiver", "acrid", "cheek", "wight", "vigor"];
    case 26: return ["mafia", "splat", "flora", "handy", "abuse"];
    case 27: return ["mealy", "bushy", "phlox", "radon", "hated"];
    case 28: return ["solve", "faint", "augur", "libel", "funny"];
    case 29: return ["vireo", "manly", "cress", "taboo", "abate"];
    case 30: return ["sitar", "class", "yodel", "slain", "hatch"];
    case 31: return ["shook", "jihad", "ashen", "bulky", "whelk"];
    case 100: return ["apace", "vista", "teeth", "helix", "found"];
    case 101: return ["decry", "rumor", "upper", "coral", "pizza"];
    case 102: return ["inter", "squid", "larch", "power", "chewy"];
    case 103: return ["creed", "tetra", "crisp", "fling", "miner"];
    case 104: return ["potty", "resin", "chump", "piano", "tenet"];
    case 105: return ["youth", "grate", "pasty", "palsy", "faith"];
    case 106: return ["fewer", "showy", "slush", "vexed", "wonky"];
    case 107: return ["oaken", "tonal", "sonny", "gorge", "fitly"];
    case 108: return ["aging", "downy", "faint", "owner", "faith"];
    case 109: return ["ratty", "polio", "abyss", "fever", "abbey"];
    case 110: return ["uncut", "lucid", "gnash", "torus", "buggy"];
    case 111: return ["opine", "pudgy", "tilde", "stair", "slate"];
    case 112: return ["risky", "mania", "check", "loose", "tacky"];
    case 113: return ["sense", "derby", "blame", "alter", "field"];
    case 114: return ["roach", "liked", "snack", "fjord", "grown"];
    case 115: return ["sumac", "copse", "place", "titan", "fatwa"];
    case 116: return ["brunt", "riser", "hoary", "drape", "foyer"];
    case 117: return ["sassy", "enter", "valve", "filer", "jelly"];
    case 118: return ["hefty", "bruin", "dowse", "minus", "buggy"];
    case 119: return ["point", "cheap", "rabbi", "lower", "scout"];
    case 120: return ["adopt", "payer", "dimly", "levee", "ranch"];
    case 121: return ["owner", "pause", "basil", "civic", "input"];
    case 122: return ["wharf", "bliss", "adorn", "addle", "merry"];
    case 123: return ["bebop", "slyly", "sleet", "shyly", "oldie"];
    case 124: return ["axial", "growl", "drawl", "covey", "train"];
    case 125: return ["broad", "agree", "swirl", "mount", "folio"];
    case 126: return ["finch", "shrug", "comer", "tress", "globe"];
    case 127: return ["twirl", "gamut", "candy", "shame", "study"];
    case 128: return ["merry", "creek", "sewer", "glans", "testy"];
    case 129: return ["alley", "delta", "niche", "bogey", "dryly"];
    case 130: return ["trail", "dazed", "wonky", "molly", "tenth"];
    case 131: return ["foggy", "amide", "askew", "gluon", "whisk"];
    case 200: return ["xylem", "holly", "coupe", "lymph", "edict"];
    case 201: return ["wacko", "drake", "kaput", "sassy", "depth"];
    case 202: return ["ruddy", "flint", "ditch", "drupe", "sling"];
    case 203: return ["grimy", "least", "skive", "flume", "below"];
    case 204: return ["beige", "raise", "retry", "valor", "ready"];
    case 205: return ["crape", "vixen", "kooky", "snail", "newsy"];
    case 206: return ["amide", "arrow", "nappy", "taint", "skunk"];
    case 207: return ["crier", "lofty", "shady", "sepal", "whose"];
    case 208: return ["slant", "craft", "cumin", "place", "bayou"];
    case 209: return ["elope", "lanai", "often", "dread", "servo"];
    case 210: return ["aroma", "wheal", "speck", "boxed", "flare"];
    case 211: return ["tally", "tutor", "sweet", "throb", "piper"];
    case 212: return ["tetra", "payer", "alert", "jerky", "newel"];
    case 213: return ["claim", "demon", "petal", "liver", "flake"];
    case 214: return ["waken", "skimp", "found", "manor", "graph"];
    case 215: return ["ohmic", "treat", "coder", "souse", "there"];
    case 216: return ["trews", "curvy", "pearl", "scrub", "adapt"];
    case 217: return ["avast", "snake", "edify", "tumor", "scull"];
    case 218: return ["arson", "natal", "tower", "brief", "crime"];
    case 219: return ["cocky", "shame", "north", "prime", "vouch"];
    case 220: return ["axiom", "clink", "bidet", "price", "unlit"];
    case 221: return ["vegan", "dopey", "brood", "quail", "spiff"];
    case 222: return ["dross", "trump", "foyer", "vireo", "clink"];
    case 223: return ["macho", "sprig", "remit", "kudzu", "dimly"];
    case 224: return ["shaky", "throw", "caper", "enjoy", "unfit"];
    case 225: return ["roper", "gamma", "pride", "wince", "china"];
    case 226: return ["belch", "mucky", "swing", "stave", "lunch"];
    case 227: return ["klutz", "decaf", "troth", "penal", "sloop"];
    case 228: return ["waver", "retry", "joust", "anger", "cured"];
    case 229: return ["thine", "given", "boxed", "crate", "scale"];
    case 230: return ["limey", "greet", "bigot", "hyena", "joust"];
    case 231: return ["usage", "drone", "swell", "scalp", "nonce"];
    case 300: return ["palsy", "risen", "skirt", "cress", "robot"];
    case 301: return ["badly", "ethos", "gleam", "glass", "tango"];
    case 302: return ["satyr", "video", "dowdy", "swami", "fated"];
    case 303: return ["peaty", "torch", "fault", "crimp", "raise"];
    case 304: return ["dally", "filly", "rupee", "queer", "nobly"];
    case 305: return ["slosh", "yucky", "shard", "fatal", "glade"];
    case 306: return ["poker", "louse", "crock", "joker", "decry"];
    case 307: return ["cavil", "class", "nasal", "heady", "umbra"];
    case 308: return ["event", "duvet", "reeve", "cruel", "gloss"];
    case 309: return ["scram", "dweeb", "banal", "flask", "aught"];
    case 310: return ["rover", "erase", "adapt", "nadir", "angle"];
    case 311: return ["theft", "liter", "boxer", "organ", "thrum"];
    case 312: return ["vital", "retie", "knead", "extol", "owner"];
    case 313: return ["metal", "night", "aloha", "dough", "faker"];
    case 314: return ["mound", "blade", "chord", "sniff", "teary"];
    case 315: return ["ounce", "drunk", "hello", "dopey", "spurn"];
    case 316: return ["spice", "tract", "relax", "plume", "parse"];
    case 317: return ["fresh", "elves", "maker", "blurb", "phone"];
    case 318: return ["bathe", "stake", "chunk", "heard", "deign"];
    case 319: return ["friar", "elves", "afoot", "equal", "place"];
    case 320: return ["dough", "hunch", "clunk", "apart", "corgi"];
    case 321: return ["forge", "douse", "under", "dwarf", "abbey"];
    case 322: return ["roper", "ember", "style", "roomy", "doily"];
    case 323: return ["farce", "moose", "salty", "sinus", "mince"];
    case 324: return ["pesto", "spice", "satyr", "valor", "attar"];
    case 325: return ["gushy", "there", "saved", "trust", "elect"];
    case 326: return ["crude", "fauna", "shoal", "aorta", "scaly"];
    case 327: return ["uvula", "cigar", "allot", "honey", "theta"];
    case 328: return ["peeve", "tress", "dusky", "feast", "ideal"];
    case 329: return ["dream", "softy", "nerve", "eject", "black"];
    case 330: return ["recur", "image", "junta", "mount", "prism"];
    case 331: return ["movie", "black", "fishy", "chore", "basin"];
    case 400: return ["nervy", "hairy", "fired", "drupe", "canon"];
    case 401: return ["lobed", "those", "chunk", "drown", "beget"];
    case 402: return ["loner", "heavy", "stilt", "maria", "gorse"];
    case 403: return ["quest", "scope", "faker", "scale", "timer"];
    case 404: return ["joule", "delay", "guilt", "epoxy", "grape"];
    case 405: return ["lurch", "delay", "gawky", "arrow", "hirer"];
    case 406: return ["prize", "spare", "sheik", "drawn", "lumpy"];
    case 407: return ["dosed", "clang", "spurt", "ripen", "trend"];
    case 408: return ["eight", "trend", "globe", "surly", "tramp"];
    case 409: return ["yokel", "sulky", "ocher", "toque", "idler"];
    case 410: return ["nylon", "setup", "mirth", "quote", "elate"];
    case 411: return ["grail", "among", "inane", "leech", "quaff"];
    case 412: return ["banns", "hunch", "speak", "crime", "whose"];
    case 413: return ["niche", "hoard", "spoke", "jumbo", "noisy"];
    case 414: return ["sonny", "scion", "unfed", "spunk", "skein"];
    case 415: return ["fumed", "krill", "happy", "jazzy", "ferry"];
    case 416: return ["spate", "swoop", "spiff", "mouse", "mourn"];
    case 417: return ["heave", "reset", "aptly", "bunny", "teeth"];
    case 418: return ["serif", "avian", "beery", "whist", "extra"];
    case 419: return ["elegy", "gable", "pupal", "uncle", "dance"];
    case 420: return ["smear", "ditto", "cruel", "scare", "disco"];
    case 421: return ["edged", "silky", "salsa", "agree", "noble"];
    case 422: return ["crypt", "lotus", "wharf", "aired", "slant"];
    case 423: return ["thump", "might", "rabbi", "shill", "talon"];
    case 424: return ["suite", "slate", "llama", "clone", "adept"];
    case 425: return ["ozone", "alien", "reuse", "champ", "small"];
    case 426: return ["gnarl", "prawn", "later", "knoll", "gruel"];
    case 427: return ["cough", "fumed", "tango", "rotor", "whole"];
    case 428: return ["built", "angst", "libel", "error", "sprig"];
    case 429: return ["drier", "drunk", "larch", "spell", "llama"];
    case 430: return ["girth", "saucy", "noisy", "bevel", "baker"];
    case 431: return ["bugle", "video", "waste", "abaft", "piper"];
    case 500: return ["robot", "refer", "refit", "divot", "quite"];
    case 501: return ["thick", "glove", "beige", "admit", "mamba"];
    case 502: return ["viper", "voice", "dozen", "smear", "apple"];
    case 503: return ["macro", "snout", "phony", "amber", "relax"];
    case 504: return ["buxom", "dirge", "frill", "dummy", "chart"];
    case 505: return ["filmy", "quasi", "miser", "fugue", "crest"];
    case 506: return ["eager", "amend", "abate", "amaze", "dowse"];
    case 507: return ["apnea", "spine", "slate", "table", "entry"];
    case 508: return ["aphid", "tansy", "karat", "rebel", "slurp"];
    case 509: return ["chomp", "crypt", "aback", "raise", "dowry"];
    case 510: return ["amine", "gully", "brawn", "cease", "meter"];
    case 511: return ["rowdy", "auger", "maser", "booty", "force"];
    case 512: return ["abuse", "stoma", "overt", "comic", "creep"];
    case 513: return ["extol", "trout", "worse", "barge", "raspy"];
    case 514: return ["chuck", "aspen", "cabal", "octet", "blink"];
    case 515: return ["whist", "haste", "fauna", "squab", "curio"];
    case 516: return ["bitty", "scour", "libel", "dowse", "spire"];
    case 517: return ["flour", "paint", "cinch", "armor", "dishy"];
    case 518: return ["chyme", "clove", "speak", "rebel", "feint"];
    case 519: return ["quota", "peace", "chick", "pilot", "crowd"];
    case 520: return ["wrest", "quasi", "sugar", "mayor", "smell"];
    case 521: return ["draft", "quasi", "mummy", "odium", "speck"];
    case 522: return ["kazoo", "yahoo", "unity", "aptly", "vital"];
    case 523: return ["cloak", "spate", "drove", "clunk", "wagon"];
    case 524: return ["plump", "crowd", "posed", "lyric", "agony"];
    case 525: return ["focal", "early", "curly", "idyll", "arrow"];
    case 526: return ["agent", "clock", "liege", "quack", "tiara"];
    case 527: return ["homey", "gluon", "gamut", "about", "vegan"];
    case 528: return ["class", "tress", "abort", "tench", "oxbow"];
    case 529: return ["state", "lifer", "scoff", "nurse", "staid"];
    case 530: return ["slimy", "guppy", "churl", "hyena", "rigid"];
    case 531: return ["homer", "facet", "faker", "audit", "aorta"];
    case 600: return ["banjo", "shrew", "bumpy", "graft", "world"];
    case 601: return ["potty", "troll", "covet", "noisy", "mocha"];
    case 602: return ["infer", "liver", "sheik", "noble", "easel"];
    case 603: return ["tamer", "lucky", "coyly", "noose", "child"];
    case 604: return ["heard", "astir", "bebop", "saved", "franc"];
    case 605: return ["extol", "segue", "ocean", "fuzzy", "japan"];
    case 606: return ["sandy", "daisy", "grill", "livid", "lupus"];
    case 607: return ["tight", "paper", "greet", "ether", "risky"];
    case 608: return ["spend", "quite", "award", "purse", "pluck"];
    case 609: return ["skint", "husky", "hired", "feast", "laden"];
    case 610: return ["broil", "repay", "marry", "fixer", "vista"];
    case 611: return ["mourn", "haven", "aphid", "trite", "brass"];
    case 612: return ["scone", "glove", "scone", "gnome", "sheer"];
    case 613: return ["alley", "stark", "goose", "chest", "clank"];
    case 614: return ["comet", "ardor", "stale", "joist", "aloha"];
    case 615: return ["sharp", "baize", "chafe", "waver", "homey"];
    case 616: return ["gamma", "grace", "niche", "doped", "paean"];
    case 617: return ["cower", "piety", "force", "prosy", "lasso"];
    case 618: return ["attic", "spire", "might", "dingy", "maybe"];
    case 619: return ["dowel", "leggy", "silky", "thine", "trite"];
    case 620: return ["remit", "staid", "scowl", "maxim", "elect"];
    case 621: return ["witty", "sushi", "maple", "campy", "vogue"];
    case 622: return ["freak", "naive", "spree", "snowy", "icing"];
    case 623: return ["bison", "ocher", "leery", "tipsy", "elbow"];
    case 624: return ["lusty", "upend", "bride", "doped", "bleep"];
    case 625: return ["adage", "squid", "nifty", "glide", "tonic"];
    case 626: return ["edger", "softy", "tardy", "boxed", "treed"];
    case 627: return ["ether", "groin", "movie", "splat", "lunge"];
    case 628: return ["query", "blunt", "devil", "plant", "floor"];
    case 629: return ["metro", "train", "berry", "parry", "sheen"];
    case 630: return ["vixen", "smart", "anvil", "motif", "tepee"];
    case 631: return ["puree", "rimed", "junta", "nexus", "stilt"];
    case 700: return ["mucus", "grave", "admit", "shack", "saver"];
    case 701: return ["quash", "bruin", "metal", "brush", "satin"];
    case 702: return ["sappy", "study", "chary", "brush", "rigid"];
    case 703: return ["naked", "pouch", "wring", "dotty", "emery"];
    case 704: return ["droll", "utter", "watch", "afoul", "spiny"];
    case 705: return ["sahib", "crone", "goner", "stake", "guise"];
    case 706: return ["touch", "grout", "nappy", "lowly", "taunt"];
    case 707: return ["tulip", "blond", "merit", "clean", "bloat"];
    case 708: return ["igloo", "swain", "shirt", "gooey", "catty"];
    case 709: return ["wight", "clerk", "naval", "truck", "fusty"];
    case 710: return ["rinse", "basic", "poppy", "brink", "nasty"];
    case 711: return ["baize", "parse", "dregs", "befit", "brass"];
    case 712: return ["piety", "forte", "tidal", "dotty", "quake"];
    case 713: return ["rayon", "break", "shelf", "puppy", "humor"];
    case 714: return ["roman", "folio", "midst", "milch", "carol"];
    case 715: return ["straw", "staff", "gooey", "sinew", "lifer"];
    case 716: return ["tempt", "tweet", "chirp", "snail", "dregs"];
    case 717: return ["booby", "rhino", "croup", "jerky", "issue"];
    case 718: return ["short", "worst", "never", "cider", "sleet"];
    case 719: return ["blimp", "apace", "gourd", "bleed", "crime"];
    case 720: return ["brute", "tilde", "binge", "broke", "piggy"];
    case 721: return ["villa", "droop", "hired", "apron", "prion"];
    case 722: return ["irate", "ditto", "ether", "sahib", "quill"];
    case 723: return ["ruble", "crock", "sewer", "botch", "gourd"];
    case 724: return ["unzip", "cairn", "decay", "trawl", "ready"];
    case 725: return ["quake", "mocha", "swing", "quake", "inure"];
    case 726: return ["tummy", "waxen", "squib", "tater", "waltz"];
    case 727: return ["swamp", "toxic", "ended", "rural", "ferry"];
    case 728: return ["crime", "tiger", "wacko", "shiny", "caper"];
    case 729: return ["tweak", "cello", "dowse", "phage", "amaze"];
    case 730: return ["fewer", "peach", "thief", "solar", "addle"];
    case 731: return ["scoot", "silty", "river", "rupee", "truly"];
    case 800: return ["clasp", "fuzzy", "quail", "mucky", "spoor"];
    case 801: return ["belly", "wring", "bated", "bilge", "reedy"];
    case 802: return ["newsy", "cress", "elfin", "gawky", "laser"];
    case 803: return ["fault", "stall", "gable", "abhor", "stoke"];
    case 804: return ["parer", "liked", "cress", "caddy", "welsh"];
    case 805: return ["avian", "jumpy", "daily", "fused", "recur"];
    case 806: return ["sunup", "salvo", "talon", "hinge", "third"];
    case 807: return ["grown", "noise", "fraud", "rapid", "voice"];
    case 808: return ["wheat", "ruled", "theft", "mooch", "guava"];
    case 809: return ["float", "wrath", "dough", "cobra", "drupe"];
    case 810: return ["agile", "flash", "smash", "azure", "treat"];
    case 811: return ["afoot", "bumpy", "prime", "salsa", "heath"];
    case 812: return ["ample", "cater", "witch", "clown", "farce"];
    case 813: return ["piety", "messy", "lower", "pekoe", "livid"];
    case 814: return ["paved", "sinew", "maven", "petal", "gross"];
    case 815: return ["quash", "super", "scuba", "upset", "frond"];
    case 816: return ["knife", "rondo", "forgo", "poesy", "bower"];
    case 817: return ["shawl", "skimp", "shirk", "molly", "fauna"];
    case 818: return ["jetty", "patsy", "crave", "ridge", "myrrh"];
    case 819: return ["swami", "slant", "gypsy", "gnarl", "whale"];
    case 820: return ["spite", "piper", "drove", "dolly", "flout"];
    case 821: return ["fused", "tight", "stalk", "given", "growl"];
    case 822: return ["chimp", "daisy", "mambo", "rally", "dogma"];
    case 823: return ["inner", "mogul", "gator", "slant", "bitty"];
    case 824: return ["twine", "hedge", "oaken", "fjord", "barmy"];
    case 825: return ["grain", "valve", "agape", "heave", "crust"];
    case 826: return ["expel", "edger", "blood", "lingo", "close"];
    case 827: return ["solid", "whisk", "briny", "ritzy", "shyly"];
    case 828: return ["angel", "sushi", "chive", "stair", "oaten"];
    case 829: return ["gumbo", "muggy", "teeth", "datum", "levee"];
    case 830: return ["amigo", "enemy", "prune", "pecan", "weary"];
    case 831: return ["yokel", "shout", "panic", "candy", "truly"];
    case 900: return ["trump", "greed", "quasi", "evade", "spiky"];
    case 901: return ["aglow", "gamut", "shout", "scald", "early"];
    case 902: return ["harpy", "sandy", "pecan", "cargo", "check"];
    case 903: return ["quote", "pearl", "press", "haply", "scold"];
    case 904: return ["elope", "laird", "yearn", "thorn", "stuff"];
    case 905: return ["waver", "muddy", "minor", "older", "fifth"];
    case 906: return ["bleep", "runny", "north", "perky", "mooch"];
    case 907: return ["burro", "pubis", "allow", "eater", "dregs"];
    case 908: return ["muggy", "gumbo", "dwell", "lousy", "spunk"];
    case 909: return ["groat", "theta", "scour", "being", "forum"];
    case 910: return ["weird", "beige", "clean", "giddy", "input"];
    case 911: return ["gofer", "greet", "naval", "harpy", "trial"];
    case 912: return ["haunt", "dinar", "rocky", "cress", "prude"];
    case 913: return ["upset", "drunk", "knack", "pluck", "stoke"];
    case 914: return ["croup", "waive", "braze", "chili", "pesky"];
    case 915: return ["jumpy", "crest", "trunk", "poise", "inner"];
    case 916: return ["brown", "tasty", "silly", "bluff", "hubby"];
    case 917: return ["lemma", "devil", "baize", "sweet", "limit"];
    case 918: return ["prank", "river", "conch", "bight", "eagle"];
    case 919: return ["beady", "inlay", "blown", "spurn", "yearn"];
    case 920: return ["scamp", "queer", "motto", "blast", "cabin"];
    case 921: return ["nadir", "rouse", "mango", "rouse", "sixty"];
    case 922: return ["worth", "onion", "quirk", "gross", "caddy"];
    case 923: return ["axial", "evade", "rerun", "worst", "tonic"];
    case 924: return ["spree", "cling", "whist", "vigor", "manta"];
    case 925: return ["slake", "tapir", "beady", "slush", "trash"];
    case 926: return ["shard", "usage", "twine", "glass", "vital"];
    case 927: return ["ratio", "fount", "grant", "daunt", "tease"];
    case 928: return ["clown", "colic", "inner", "jimmy", "savvy"];
    case 929: return ["limit", "gassy", "pearl", "wimpy", "speak"];
    case 930: return ["vapid", "naked", "fleck", "month", "sweat"];
    case 931: return ["spice", "wager", "quiet", "polar", "prime"];
    case 1000: return ["brand", "spoke", "until", "roast", "sully"];
    case 1001: return ["jumpy", "bored", "upend", "dolly", "rocky"];
    case 1002: return ["jolly", "badge", "soled", "stuff", "woven"];
    case 1003: return ["vital", "below", "olden", "gutsy", "roomy"];
    case 1004: return ["frump", "agony", "lever", "thigh", "liked"];
    case 1005: return ["honey", "visor", "cheep", "swing", "nymph"];
    case 1006: return ["frizz", "bugle", "delve", "spare", "crock"];
    case 1007: return ["unlit", "finch", "equip", "prone", "kayak"];
    case 1008: return ["futon", "sooty", "belle", "viand", "gamin"];
    case 1009: return ["dowry", "diver", "adieu", "pesky", "clash"];
    case 1010: return ["sough", "weepy", "stock", "equal", "guile"];
    case 1011: return ["baton", "stare", "allow", "sunny", "bugle"];
    case 1012: return ["rough", "paean", "burly", "quasi", "fries"];
    case 1013: return ["cable", "hefty", "plush", "peace", "swarm"];
    case 1014: return ["segue", "coupe", "feign", "hooky", "quash"];
    case 1015: return ["hobby", "label", "medal", "dummy", "genie"];
    case 1016: return ["slink", "payee", "sheep", "reuse", "suite"];
    case 1017: return ["terse", "debit", "allot", "cocky", "fresh"];
    case 1018: return ["pulpy", "stalk", "slang", "dumpy", "union"];
    case 1019: return ["retie", "boxer", "burnt", "first", "wispy"];
    case 1020: return ["annul", "stick", "feint", "moire", "debar"];
    case 1021: return ["dweeb", "valor", "erode", "mirth", "snuff"];
    case 1022: return ["booby", "worse", "sheep", "moldy", "booby"];
    case 1023: return ["kabob", "gauzy", "heist", "deuce", "eight"];
    case 1024: return ["stung", "mania", "drawn", "adore", "quiet"];
    case 1025: return ["toxic", "roost", "float", "ruddy", "rumor"];
    case 1026: return ["ulnar", "react", "pushy", "abort", "fluff"];
    case 1027: return ["visit", "abode", "tatty", "snoot", "defer"];
    case 1028: return ["owing", "aired", "opine", "amigo", "milky"];
    case 1029: return ["white", "whack", "splay", "pacer", "wheal"];
    case 1030: return ["forge", "agony", "rumor", "teary", "guild"];
    case 1031: return ["cream", "glare", "ascot", "child", "moxie"];
    case 1100: return ["plank", "crave", "thick", "moved", "dying"];
    case 1101: return ["grist", "lofty", "pupal", "servo", "matzo"];
    case 1102: return ["labor", "fewer", "primp", "plumy", "wrath"];
    case 1103: return ["saint", "dusky", "cross", "augur", "wince"];
    case 1104: return ["strip", "groin", "wispy", "acorn", "jinks"];
    case 1105: return ["sedan", "topic", "decaf", "opine", "trace"];
    case 1106: return ["dirge", "album", "boson", "famed", "robin"];
    case 1107: return ["prior", "prune", "mourn", "jaded", "drama"];
    case 1108: return ["guava", "daunt", "rebel", "matzo", "burnt"];
    case 1109: return ["spool", "aglow", "braze", "width", "trail"];
    case 1110: return ["slide", "tumor", "tried", "glitz", "canal"];
    case 1111: return ["relax", "unity", "crane", "twang", "sixty"];
    case 1112: return ["flute", "penny", "tubed", "olive", "model"];
    case 1113: return ["dimer", "assay", "biddy", "valor", "clone"];
    case 1114: return ["rapid", "enjoy", "beget", "puppy", "trove"];
    case 1115: return ["skimp", "exude", "vicar", "parer", "using"];
    case 1116: return ["armed", "stoic", "avoid", "poppy", "leggy"];
    case 1117: return ["grist", "hilly", "until", "stoke", "skeet"];
    case 1118: return ["dweeb", "verge", "urine", "bulky", "heron"];
    case 1119: return ["yield", "weedy", "motel", "admit", "chant"];
    case 1120: return ["shell", "stare", "booty", "green", "juicy"];
    case 1121: return ["eagle", "smoky", "egret", "dummy", "local"];
    case 1122: return ["eerie", "repel", "cliff", "fifth", "gouge"];
    case 1123: return ["abide", "alarm", "flout", "wheal", "daisy"];
    case 1124: return ["piper", "other", "trick", "croup", "refit"];
    case 1125: return ["alter", "theta", "radar", "botch", "papal"];
    case 1126: return ["royal", "tying", "brand", "seven", "chalk"];
    case 1127: return ["trite", "roach", "brace", "terse", "coral"];
    case 1128: return ["rowdy", "edict", "doubt", "slime", "fusty"];
    case 1129: return ["mover", "clack", "slope", "bower", "given"];
    case 1130: return ["coach", "nymph", "torus", "marsh", "icily"];
    case 1131: return ["rouse", "seedy", "stave", "whole", "occur"];
    case 1200: return ["maria", "epoch", "grasp", "visit", "famed"];
    case 1201: return ["gross", "inter", "salsa", "close", "bushy"];
    case 1202: return ["dated", "sandy", "dinky", "stiff", "throb"];
    case 1203: return ["frump", "clang", "locus", "start", "muggy"];
    case 1204: return ["odium", "thumb", "repel", "cushy", "chunk"];
    case 1205: return ["tizzy", "point", "shrug", "along", "lemma"];
    case 1206: return ["dweeb", "terse", "evict", "outdo", "wince"];
    case 1207: return ["peaty", "foyer", "track", "brine", "toxic"];
    case 1208: return ["phone", "realm", "tater", "sibyl", "salon"];
    case 1209: return ["sleep", "corps", "filmy", "bursa", "train"];
    case 1210: return ["merge", "blare", "phony", "round", "qualm"];
    case 1211: return ["roach", "peace", "slosh", "dough", "grout"];
    case 1212: return ["arena", "fugue", "whiny", "sense", "grime"];
    case 1213: return ["phony", "anode", "rainy", "woozy", "comma"];
    case 1214: return ["brash", "ennui", "edged", "stuff", "hardy"];
    case 1215: return ["oaten", "sedge", "trace", "think", "broom"];
    case 1216: return ["cedar", "lever", "whose", "lingo", "rerun"];
    case 1217: return ["diver", "music", "tamed", "prate", "deuce"];
    case 1218: return ["overt", "eerie", "tally", "crone", "mufti"];
    case 1219: return ["moult", "whist", "ahead", "hydra", "shush"];
    case 1220: return ["green", "unfed", "magic", "lobed", "woody"];
    case 1221: return ["vivid", "murky", "taken", "mouse", "drift"];
    case 1222: return ["pager", "stove", "modal", "noose", "sewer"];
    case 1223: return ["batty", "faker", "mulch", "koala", "hilly"];
    case 1224: return ["aglow", "crock", "homer", "water", "erect"];
    case 1225: return ["thing", "maven", "wired", "dirge", "grasp"];
    case 1226: return ["guppy", "crisp", "hurry", "bread", "filer"];
    case 1227: return ["chasm", "graph", "piano", "prose", "retro"];
    case 1228: return ["skulk", "smile", "mercy", "tuber", "nudge"];
    case 1229: return ["nexus", "meter", "comfy", "comic", "phony"];
    case 1230: return ["whelk", "lupus", "stuff", "birth", "cling"];
    case 1231: return ["north", "pinch", "theft", "hurry", "sloth"];

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
