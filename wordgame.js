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
var previoustries =[];

function initializePage() {
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
  console.log(key);
  lastSelectedColumn = getLastSelectedcolumn();

  if (key=="Backspace") {
    if (lastSelectedColumn>=0) resetColumn(lastSelectedColumn);
    console.log("backspace");
  }
  else if (key=="Enter"){
    if (getLastSelectedcolumn() == wordlength-1) submitanswers();
  }
  else if (lastSelectedColumn < wordlength  && columnlists[lastSelectedColumn+1].indexOf(key) >-1){
    console.log(key);
    resetColumn(lastSelectedColumn+1);
    keyRow = getKeyRow(lastSelectedColumn+1,key);
    console.log(keyRow, lastSelectedColumn+1);
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
  console.log("getLastSelectedcolumn()");
  for (i=wordlength-1; i>-1; i--){
    for (j=gridsize-1; j>-1; j--){
      console.log(i,j,grid.rows[j].cells[i].classList);
      if (grid.rows[j].cells[i].classList.contains("selected")) {
        console.log("Column " + i )
        return i;
      }
    }
  }
  return -1;
}



function processcellclick(x,y){
  console.log("cell " + x + "," + y + " clicked");
    selectedCell = grid.rows[y].cells[x]
    console.log("NBBBB " + selectedCell);
    console.log(selectedCell);
    allSelectedCells = document.querySelectorAll("td.selected");

    if (selectedCell.classList.contains("selected")) return;

    resetColumn(x);
    selectCell(selectedCell);
    console.log(inputletters);
  
}



function selectCell(cell) {
  console.log("selecting" + cell);
  if (cell.classList.contains("selected")) {
    return "ERROR";
  }
  cell.classList.add("selected");
  inputletters[cell.cellIndex] = 
  cell.innerHTML;

}

function resetColumn(column) {
  console.log("resetting column " + column);
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
 
  }
}

function automaticallyDoLastWord(){
  for (i=0; i<wordlength; i++){
    console.log("DEBYGGG");
    console.log(grid);
    console.log("i="+i);
    inputletters[i]=grid.rows[0].cells[i].innerHTML;
    grid.rows[0].cells[i].classList.add("selected");

    console.log(inputletters);
  }
  console.log(inputletters);
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
  for (i = 0; i < score; i++) {
    var row = answertable.insertRow(0);
    for (j = 0; j < wordlength; j++) {
      var cell = row.insertCell(-1);
      cell.innerHTML = attempts[i][j];
      if (rightwrong[i] && j>=matchcount[i]){
        cell.classList.add("wronganswer");
      }
      if (rightwrong[i] && j<matchcount[i]){
        cell.classList.add("startingright");
      }
      if(!rightwrong[i]){
        cell.classList.add("rightanswer");
      }
  
    }
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


var bigwordlist5 = ["aback","abaft","abase","abash","abate","abbey","abbot","abeam","abhor","abide","abode","abort","about","above","abuse","abuzz","abyss","acorn","acrid","actor","acute","adage","adapt","adder","addle","adept","adieu","adios","adman","admit","admix","adobe","adopt","adore","adorn","adult","aegis","aerie","affix","afire","afoot","afoul","after","again","agape","agate","agave","agent","aggro","agile","aging","aglow","agony","agree","ahead","aided","aired","aisle","alack","alarm","album","alder","alert","algae","algal","alias","alibi","alien","align","alike","alive","alkyd","allay","alley","allot","allow","alloy","aloft","aloha","alone","along","aloof","aloud","alpha","altar","alter","amass","amaze","amber","ambit","amble","amend","amide","amigo","amine","amino","amiss","amity","among","amour","ample","amply","amuse","anent","angel","anger","angle","angry","angst","anion","anise","ankle","annex","annoy","annul","anode","antic","antsy","anvil","aorta","apace","apart","aphid","apish","apnea","apple","apply","April","apron","aptly","arbor","arced","ardor","areal","arena","argon","argot","argue","arise","armed","armor","aroma","arras","array","arrow","arson","ascot","ashen","aside","askew","aspen","aspic","assay","asset","aster","astir","atilt","atlas","atoll","atone","attar","attic","audio","audit","auger","aught","augur","aural","auric","auxin","avail","avast","avert","avian","avoid","await","awake","award","aware","awash","awful","awing","axial","axiom","azure","babel","baccy","bacon","badge","badly","bagel","baggy","bairn","baize","baked","baker","baldy","balky","bally","balmy","balsa","banal","bandy","banjo","banns","bared","barge","barmy","baron","basal","based","basic","basil","basin","basis","basso","baste","batch","bated","bathe","batik","baton","batty","baulk","bawdy","bayou","beach","beady","beard","beast","beaut","bebop","bedim","beech","beefy","beery","befit","befog","beget","begin","begum","beige","being","belay","belch","belie","belle","belly","below","bench","beret","berry","berth","beryl","beset","besom","betel","bevel","bezel","bible","biddy","bidet","bight","bigot","bijou","bilge","billy","binge","bingo","biota","biped","birch","birth","bison","biter","bitty","black","blade","blame","bland","blank","blare","blase","blast","blaze","bleak","blear","bleat","bleed","bleep","blend","bless","blimp","blind","blini","blink","bliss","blitz","bloat","block","bloke","blond","blood","bloom","blown","blowy","bluff","blunt","blurb","blurt","blush","board","boast","bobby","boffo","bogey","boggy","bogus","bolus","bonce","bongo","bonny","bonus","booby","boost","booth","booty","booze","boozy","borax","bored","borer","boron","bosom","boson","bossy","botch","bough","bound","bowed","bowel","bower","boxed","boxer","brace","bract","braid","brain","brake","brand","brash","brass","brave","bravo","brawl","brawn","braze","bread","break","bream","breed","breve","bribe","brick","bride","brief","brier","brill","brine","bring","brink","briny","brisk","broad","broil","broke","bronc","brood","brook","broom","broth","brown","bruin","bruit","brunt","brush","brute","buddy","budge","buggy","bugle","build","built","bulge","bulgy","bulky","bully","bumpy","bunch","bunny","burgh","burly","burnt","burro","bursa","burst","busby","bushy","busty","butte","butty","buxom","buyer","bylaw","byway","cabal","caber","cabin","cable","cacao","cache","caddy","cadet","cadge","cadre","cagey","cairn","calla","calve","calyx","camel","cameo","campy","canal","candy","canny","canoe","canon","canto","caper","capon","carat","caret","cargo","carob","carol","carom","carry","carve","cased","caste","catch","cater","catty","caulk","cause","cavil","cease","cecal","cecum","cedar","cello","chafe","chaff","chain","chair","chalk","champ","chant","chaos","chard","charm","chart","chary","chase","chasm","cheap","cheat","check","cheek","cheep","cheer","chert","chess","chest","chewy","chick","chide","chief","child","chili","chill","chime","chimp","china","chine","chino","chirp","chive","chock","choir","choke","chomp","chord","chore","chuck","chuff","chump","chunk","churl","churn","chute","chyme","cider","cigar","cinch","circa","cissy","civet","civic","civil","clack","claim","clamp","clang","clank","clash","clasp","class","clean","clear","cleat","cleft","clerk","click","cliff","climb","clime","cling","clink","cloak","clock","clomp","clone","close","cloth","cloud","clout","clove","clown","cluck","clump","clunk","coach","coast","cobra","cocci","cocky","cocoa","coder","codex","colic","colon","color","combo","comer","comet","comfy","comic","comma","conch","condo","conga","conic","copra","copse","coral","corer","corgi","corny","corps","couch","cough","count","coupe","court","coven","cover","covet","covey","cower","coyly","coypu","cozen","crack","craft","cramp","crane","crank","crape","crash","crass","crate","crave","crawl","craze","crazy","creak","cream","credo","creed","creek","creel","creep","crepe","cress","crest","crick","crier","crime","crimp","crisp","croak","crock","croft","crone","crony","crook","croon","cross","croup","crowd","crown","crude","cruel","cruet","crumb","cruse","crush","crust","crypt","cubic","cubit","cumin","cupid","cuppa","cured","curie","curio","curly","curry","curse","curve","curvy","cushy","cycle","cyder","cynic","dacha","daddy","daily","dairy","daisy","dally","dance","dandy","dated","datum","daunt","davit","dazed","deary","death","debar","debit","debug","debut","decaf","decal","decay","decor","decoy","decry","defer","degas","deify","deign","deism","deist","deity","delay","delft","delta","delve","demob","demon","demur","denim","dense","depot","depth","derby","deter","detox","deuce","devil","dhoti","diary","dicey","digit","dimer","dimly","dinar","diner","dingo","dingy","dinky","diode","dirge","dirty","disco","dishy","ditch","ditto","ditty","divan","diver","divot","divvy","dizzy","dodge","dodgy","doggy","dogie","dogma","doily","doing","dolly","dolor","domed","donor","doped","dopey","dosed","dotty","doubt","dough","douse","dowdy","dowel","dower","downy","dowry","dowse","doyen","dozen","draft","drain","drake","drama","drape","drawl","drawn","dread","dream","drear","dregs","dress","dried","drier","drift","drill","drink","drive","droll","drone","drool","droop","dross","drove","drown","drunk","drupe","dryad","dryer","dryly","ducal","ducat","duchy","ducky","dully","dummy","dumpy","duple","durum","dusky","dusty","duvet","dwarf","dweeb","dwell","dying","eager","eagle","eared","early","earth","eased","easel","eater","eaves","ebony","eclat","edema","edged","edger","edict","edify","educe","eerie","egret","eider","eight","eject","eland","elate","elbow","elder","elect","elegy","elfin","elide","elite","elope","elude","elver","elves","email","embed","ember","emcee","emend","emery","emote","empty","enact","ended","endow","endue","enema","enemy","enjoy","ennui","ensue","enter","entry","envoy","epoch","epoxy","equal","equip","erase","erect","ergot","erode","error","erupt","essay","ester","ether","ethic","ethos","ethyl","etude","evade","event","every","evict","evoke","exact","exalt","excel","exert","exile","exist","expat","expel","extol","extra","exude","exult","fable","faced","facet","faddy","faded","faint","fairy","faith","faker","fakir","false","famed","fancy","farad","farce","fatal","fated","fatty","fatwa","fault","fauna","favor","fazed","feast","fecal","feces","feign","feint","fella","felon","femur","fence","feral","ferny","ferry","fetal","fetch","fetid","fetus","fever","fewer","fiber","fichu","field","fiend","fiery","fifth","fifty","fight","filch","filer","filly","filmy","filth","final","finch","finer","finis","fired","first","firth","fishy","fitly","fiver","fixed","fixer","fizzy","fjord","flack","flail","flair","flake","flaky","flame","flank","flare","flash","flask","fleck","fleet","flesh","flick","flier","flies","fling","flint","flirt","float","flock","flood","floor","flora","floss","flour","flout","fluff","fluid","fluke","fluky","flume","flunk","flush","flute","foamy","focal","focus","foggy","foist","folio","folly","foray","force","forge","forgo","forte","forth","forty","forum","found","fount","foyer","frail","frame","franc","frank","fraud","freak","fresh","friar","fried","fries","frill","frisk","frizz","frock","frond","front","frost","froth","frown","fruit","frump","fryer","fudge","fugal","fugue","fully","fumed","funky","funny","furor","furry","furze","fused","fusee","fussy","fusty","futon","fuzzy","gabby","gable","gaffe","gaily","gamin","gamma","gammy","gamut","gassy","gator","gaudy","gaunt","gauze","gauzy","gavel","gawky","gecko","gelid","genie","genre","genus","geode","getup","ghost","ghoul","giant","giddy","gimpy","girth","given","giver","glace","glade","gland","glans","glare","glass","glaze","gleam","glean","glide","glint","glitz","gloat","globe","gloom","glory","gloss","glove","glued","gluey","gluon","glyph","gnarl","gnash","gnome","godly","gofer","going","golly","goner","goody","gooey","goofy","goose","gorge","gorse","gouge","gourd","gouty","grace","grade","graft","grail","grain","grand","grant","grape","graph","grasp","grass","grate","grave","gravy","graze","great","grebe","greed","green","greet","grief","grill","grime","grimy","grind","gripe","grist","groan","groat","groin","groom","grope","gross","group","grout","grove","growl","grown","gruel","gruff","grump","grunt","guano","guard","guava","guess","guest","guide","guild","guile","guilt","guise","gulag","gulch","gully","gumbo","gummy","gunny","guppy","gushy","gusto","gusty","gutsy","gypsy","habit","haiku","hairy","halal","hallo","halon","halve","hammy","handy","haply","happy","hardy","harem","harpy","harry","harsh","haste","hasty","hatch","hated","hater","haunt","haven","havoc","hazel","heady","heard","heart","heath","heave","heavy","hedge","hefty","heist","helix","hello","helot","helve","hence","henna","heron","hertz","hewer","hexed","hiker","hilly","hinge","hippo","hired","hirer","hitch","hoard","hoary","hobby","hogan","hoist","hokey","hokum","holey","holly","homer","homey","honey","honor","hooch","hooey","hooky","horde","horse","hotel","hotly","hound","houri","house","hovel","hover","howdy","hubby","huffy","hullo","human","humid","humor","humph","humus","hunch","hurry","husky","hutch","hydra","hyena","hymen","icily","icing","ictus","ideal","idiom","idler","idyll","igloo","ileum","ilium","image","imago","imbue","impel","imply","inane","inapt","incur","index","indie","inept","inert","infer","infix","infra","ingot","inlay","inlet","inner","input","inset","inter","inure","ionic","irate","irony","islet","issue","itchy","ivied","ivory","jabot","jaded","japan","jaunt","jawed","jazzy","jelly","jemmy","jenny","jerky","jetty","jewel","jiffy","jihad","jimmy","jingo","jinks","joint","joist","joker","jolly","joule","joust","jowly","judge","juice","juicy","julep","jumbo","jumpy","junco","junta","juror","kabob","kapok","kappa","kaput","karat","karma","kayak","kazoo","kebab","ketch","keyed","khaki","kinda","kiosk","kitty","klutz","knack","knave","knead","kneel","knell","knife","knish","knock","knoll","known","koala","kooky","kraal","krill","krona","krone","kudos","kudzu","label","labor","laced","laden","ladle","lager","laird","laity","lanai","lance","lanky","lapel","lapin","lapse","larch","large","largo","larva","laser","lasso","latch","later","latex","lathe","latte","laugh","laxly","layer","layup","leach","leafy","leaky","learn","lease","leash","least","leave","ledge","leech","leery","lefty","legal","leggy","lemma","lemon","lemur","lento","leper","letch","letup","levee","level","lever","lexis","libel","licit","liege","lifer","light","liked","liken","lilac","limbo","limey","limit","lined","linen","liner","lingo","lipid","lisle","liter","lithe","liven","liver","livid","llama","llano","loamy","loath","lobar","lobby","lobed","local","locum","locus","lodge","lofty","logic","lolly","loner","loony","loopy","loose","lorry","loser","lotto","lotus","lough","louse","lousy","loved","lover","lower","lowly","loyal","lucid","lucky","lucre","lumen","lumpy","lunar","lunch","lunge","lupus","lurch","lurid","lusty","lying","lymph","lynch","lyric","ma'am","macaw","macho","macro","madam","madly","mafia","magic","magma","maize","major","maker","mamba","mambo","mange","mango","mangy","mania","manic","manly","manna","manor","manse","manta","maple","march","March","marge","maria","marry","marsh","maser","mason","match","mated","mater","matey","matte","matzo","mauve","maven","maxim","maybe","mayor","mealy","meaty","mecca","medal","medic","melee","melon","mercy","merge","merit","merry","meson","messy","metal","meter","metro","mezzo","micro","middy","midge","midst","might","milch","miler","milky","mimic","mince","mined","miner","mingy","minim","minor","minty","minus","mired","mirth","miser","misty","miter","mixed","mixer","mocha","modal","model","modem","mogul","moire","moist","molar","moldy","molly","momma","mommy","money","month","mooch","moody","moose","moped","moral","moray","morel","mosey","mossy","motel","motet","motif","motor","motto","moult","mound","mount","mourn","mouse","mousy","mouth","moved","mover","movie","mower","moxie","mucky","mucus","muddy","mufti","muggy","mulch","mulct","mummy","mumps","munch","mural","murky","mushy","music","musky","mussy","musty","muted","myrrh","nabob","nacho","nacre","nadir","naiad","naive","naked","nanny","nappy","nasal","nasty","natal","natty","naval","navel","navvy","neath","needy","ne'er","neigh","nerve","nervy","never","nevus","newel","newly","newsy","nexus","niche","niece","nifty","night","ninja","ninny","ninth","nippy","niter","noble","nobly","nohow","noise","noisy","nomad","nonce","noose","north","nosed","notch","noted","novel","nubby","nudge","nurse","nutty","nylon","nymph","oaken","oakum","oasis","oaten","obese","occur","ocean","ocher","octal","octet","oddly","odium","offal","offer","often","ohmic","oiled","okapi","olden","older","oldie","olive","omega","onion","onset","oomph","opera","opine","opium","optic","orate","orbit","order","organ","oriel","orris","osier","other","otter","ounce","outdo","outer","outgo","outre","ovary","ovate","overt","ovoid","ovule","owing","owlet","owned","owner","oxbow","oxide","ozone","pacer","padre","paean","pagan","pager","paint","pally","palmy","palsy","panda","panel","panic","panto","papal","papaw","paper","parch","parer","parka","parry","parse","party","pasha","passe","pasta","paste","pasty","patch","pater","patio","patsy","patty","pause","paved","payee","payer","peace","peach","peaky","pearl","peaty","pecan","pedal","peeve","pekoe","penal","penny","peony","peppy","perch","peril","perky","perry","pesky","pesto","petal","peter","petty","pewee","phage","phase","phial","phlox","phone","phony","photo","piano","picky","picot","piece","piety","piggy","pilaf","pilot","pinch","pinko","pinny","pinon","pinto","pious","piper","pipit","pique","piste","pitch","pithy","piton","pitta","pivot","pixel","pixie","pizza","place","plaid","plain","plait","plane","plank","plant","plash","plate","platy","plaza","plead","pleat","plebe","plonk","pluck","plumb","plume","plump","plumy","plunk","plush","poach","poesy","point","poise","poker","polar","polio","polka","polyp","pooch","poppy","porch","porgy","posed","poser","posit","posse","potty","pouch","pound","power","prang","prank","prate","prawn","preen","press","price","pride","prime","primp","print","prion","prior","prism","privy","prize","probe","prole","prone","prong","proof","prose","prosy","proud","prove","prowl","proxy","prude","prune","psalm","pshaw","pubes","pubic","pubis","pudgy","puffy","pukka","pulpy","pulse","punch","pupal","pupil","puppy","puree","purge","purse","pushy","putty","pygmy","pylon","quack","quaff","quail","quake","qualm","quark","quart","quash","quasi","queen","queer","quell","quern","query","quest","queue","quick","quiet","quiff","quill","quilt","quint","quire","quirk","quirt","quite","quoin","quoit","quota","quote","rabbi","rabid","racer","radar","radio","radix","radon","rainy","raise","rajah","rally","ramie","ranch","ranee","range","rangy","rapid","raspy","ratio","ratty","ravel","raven","raver","rayon","razed","razor","reach","react","ready","realm","rearm","rebel","rebus","rebut","recap","recce","recto","recur","reedy","reeve","refer","refit","regal","reign","relax","relay","relic","remit","renal","renew","repay","repel","reply","rerun","reset","resin","retch","retie","retro","retry","reuse","revel","revue","rheum","rhino","rhyme","ricer","rider","ridge","rifle","right","rigid","rigor","riled","rimed","rinse","ripen","risen","riser","risky","ritzy","rival","river","rivet","riyal","roach","roast","robed","robin","robot","rocky","rodeo","rogue","roman","rondo","roomy","roost","roper","ropey","rosin","rotor","rouge","rough","round","rouse","route","rover","rowan","rowdy","rowel","rower","royal","ruble","ruddy","rugby","ruled","ruler","rumba","rummy","rumor","runic","runny","runty","rupee","rural","rushy","rusty","rutty","saber","sable","sabot","sabra","sadhu","sadly","sahib","saint","salad","sally","salon","salsa","salty","salve","salvo","samba","sandy","sappy","saran","sassy","satin","satyr","sauce","saucy","sauna","saute","saved","saver","savor","savoy","savvy","scald","scale","scalp","scaly","scamp","scant","scape","scare","scarf","scarp","scary","scene","scent","schwa","scion","scoff","scold","scone","scoop","scoot","scope","score","scorn","scour","scout","scowl","scrag","scram","scrap","scree","screw","scrim","scrip","scrod","scrub","scrum","scuba","scuff","scull","scurf","seamy","sebum","sedan","sedge","sedgy","seedy","segue","seine","seize","senna","sense","sepal","sepia","serge","serif","serum","serve","servo","setup","seven","sever","sewed","sewer","shack","shade","shady","shaft","shake","shaky","shale","shame","shank","shape","shard","share","shark","sharp","shave","shawl","sheaf","shear","sheen","sheep","sheer","sheet","sheik","shelf","shell","shift","shill","shine","shiny","shire","shirk","shirt","shoal","shoat","shock","shook","shoot","shore","short","shout","shove","showy","shred","shrew","shrub","shrug","shuck","shunt","shush","shyly","sibyl","sidle","siege","sieve","sight","sigma","silky","silly","silty","since","sinew","singe","sinus","siren","sisal","sitar","sixth","sixty","sized","skate","skeet","skein","skier","skiff","skill","skimp","skint","skirt","skive","skulk","skull","skunk","slack","slain","slake","slang","slant","slash","slate","slave","sleek","sleep","sleet","slice","slick","slide","slime","slimy","sling","slink","sloop","slope","slosh","sloth","slump","slurp","slush","slyly","smack","small","smart","smash","smear","smell","smelt","smile","smirk","smite","smith","smock","smoke","smoky","snack","snafu","snail","snake","snaky","snare","snarl","sneak","sneer","snick","snide","sniff","snipe","snood","snoop","snoot","snore","snort","snout","snowy","snuff","soapy","sober","softy","soggy","solar","soled","solid","solve","sonar","sonic","sonny","sooth","sooty","soppy","sorry","sough","sound","soupy","souse","south","sower","space","spade","spank","spare","spark","spasm","spate","spawn","speak","spear","speck","speed","spell","spend","spent","spice","spicy","spiel","spiff","spike","spiky","spill","spine","spiny","spire","spite","splat","splay","split","spoil","spoke","spoof","spook","spool","spoon","spoor","spore","sport","spout","sprat","spray","spree","sprig","sprog","spume","spunk","spurn","spurt","squab","squad","squat","squib","squid","stack","staff","stage","stagy","staid","stain","stair","stake","stale","stalk","stall","stamp","stand","staph","stare","stark","start","stash","state","stave","stead","steak","steal","steam","steed","steel","steep","steer","stein","stern","stick","stiff","stile","still","stilt","sting","stink","stint","stoat","stock","stogy","stoic","stoke","stole","stoma","stomp","stone","stony","stool","stoop","store","stork","storm","story","stoup","stout","stove","strap","straw","stray","strep","strew","stria","strip","strop","strum","strut","stuck","study","stuff","stump","stung","stunt","style","suave","sudsy","suede","sugar","suite","sulfa","sulky","sully","sumac","sunny","sunup","super","supra","surge","surly","sushi","swain","swami","swamp","swank","sward","swarm","swash","swath","swear","sweat","swede","sweep","sweet","swell","swept","swift","swill","swine","swing","swipe","swirl","swish","swoon","swoop","sword","sworn","sylph","synod","syrup","tabby","table","taboo","tabor","tacit","tacky","taffy","taint","taken","taker","talky","tally","talon","talus","tamed","tamer","tango","tangy","tansy","taped","taper","tapir","tardy","tarot","tarry","taste","tasty","tater","tatty","taunt","taupe","tawny","taxer","teach","teary","tease","teddy","teeny","teeth","telex","telly","tempo","tempt","tench","tenet","tenon","tenor","tense","tenth","tepee","tepid","terry","terse","testy","tetra","thane","thank","theft","their","theme","there","therm","these","theta","thick","thief","thigh","thine","thing","think","third","thole","thong","thorn","those","three","throb","throe","throw","thrum","thumb","thump","thyme","tiara","tibia","tidal","tiger","tight","tilde","tiled","tiler","timed","timer","timid","tinge","tinny","tipsy","tired","titan","titer","tithe","title","tizzy","toady","toast","today","toddy","token","tonal","toned","toner","tongs","tonic","tonne","tooth","topaz","topee","topic","toque","torch","torso","torte","torus","total","totem","toter","touch","tough","towel","tower","toxic","toxin","trace","track","tract","trade","trail","train","trait","tramp","trash","trawl","tread","treat","treed","trend","tress","trews","triad","trial","tribe","trice","trick","tried","trier","trike","trill","tripe","trite","troll","troop","trope","troth","trout","trove","truce","truck","truly","trump","trunk","truss","trust","truth","tryst","tubal","tubby","tubed","tuber","tulip","tulle","tumid","tummy","tumor","tuner","tunic","tunny","turps","tutor","twain","twang","tweak","tweed","tweet","twice","twill","twine","twirl","twist","tying","udder","ukase","ulcer","ulnar","ultra","umbel","umber","umbra","unbar","uncle","uncut","under","undue","unfed","unfit","unify","union","unite","unity","unlit","unman","unpin","unsay","untie","until","unwed","unzip","upend","upper","upset","urban","urine","usage","usher","using","usual","usurp","usury","utter","uvula","vague","valet","valid","valor","value","valve","vapid","vapor","vault","vaunt","vegan","velar","velum","venal","venom","venue","verge","verse","verso","verve","vetch","vexed","viand","vicar","video","vigil","vigor","villa","vinyl","viola","viper","viral","vireo","virus","visit","visor","vista","vital","vivid","vixen","vocal","vodka","vogue","voice","voile","vomit","voter","vouch","vowel","wacko","wacky","wader","wafer","wager","wagon","waist","waive","waken","wally","waltz","wanly","warty","washy","waste","watch","water","waver","waxed","waxen","weary","weave","wedge","weedy","weeny","weepy","weigh","weird","welsh","whack","whale","wharf","wheal","wheat","wheel","whelk","whelm","whelp","where","which","whiff","while","whine","whiny","whirl","whisk","whist","white","whole","whoop","whorl","whose","whoso","widen","widow","width","wield","wight","wimpy","wince","winch","windy","wiper","wired","wispy","witch","withe","witty","woman","wonky","woody","wooer","woozy","wordy","world","wormy","worry","worse","worst","worth","wound","woven","wrack","wrath","wreak","wreck","wrest","wring","wrist","write","wrong","wroth","wryly","xenon","xerox","xylem","yacht","yahoo","yearn","yeast","yield","yodel","yogic","yokel","young","youth","yucca","yucky","yummy","zebra","zesty","zilch","zippy","zloty","zonal"];

initializePage();
startNewGame();
