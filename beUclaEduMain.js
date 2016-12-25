/*
  Chrome Extension:
  UCLA BruinWalk Professor Ratings - Easy Access
  Version: 0.0.8
  Created by: Robert Ursua
              robertursuadev@gmail.com
              robertursua@yahoo.com

              and

              Preetham
              https://github.com/preethamrn

*/

// ** FUNCTIONS for be.ucla.edu pages aka class searches in catalog ** //

// ** FUNCTIONS for be.ucla.edu pages aka class searches in catalog ** //

findSearchedClasses();  
findClassPlanClasses();

var timeout = null;

document.addEventListener("DOMSubtreeModified",
function()
{
  if(timeout)clearTimeout(timeout);
  timeout = setTimeout(listener, 1000);
}, false);

// this is called whenever DOM is modifies
function listener()
{
  // run the script if it detects a class search page
  //console.log("something happend");
  var windowURL = "" + window.location.href;
  if(windowURL.includes("be.my.ucla.edu")){
    findSearchedClasses();  
    findClassPlanClasses();
  }
}

// responds to classes in class search
function findSearchedClasses(){
  var uclaClasses = document.getElementsByClassName('ClassSearchList search_results');
  
  for(var i=0;i<uclaClasses.length;i++){
    var instCont = uclaClasses[i].getElementsByClassName('span9');
    var showCourse = uclaClasses[i].getElementsByClassName('head')[0].getElementsByTagName('a')[0].getAttribute('onclick');

    var re = /"([^"]*)"/g;
    // get the subject and class number from 4th and 5th matches
    re.exec(showCourse); re.exec(showCourse); re.exec(showCourse);
    var subject = re.exec(showCourse)[1].replace(/\s/g, '-');
    var classNumber = re.exec(showCourse)[1].replace(/[\s0]/g, '');
    var className = subject + '-' + classNumber;
    
    for(var j=1;j<instCont.length;j++){
        addInstButtons(instCont[j], className);  
    }    
  }
}

// respodns to  classes in classplan
function findClassPlanClasses(){
  var classDict = {"Aerospace Studies": "AERO-ST","African American Studies": "AF-AMER","African Studies": "AFRC-ST","Afrikaans": "AFRKAAN","American Indian Studies": "AM-IND","American Sign Language": "ASL","Ancient Near East": "AN-N-EA","Anesthesiology": "ANES","Anthropology": "ANTHRO","Applied Linguistics": "APPLING","Arabic": "ARABIC","Archaeology": "ARCHEOL","Architecture and Urban Design": "ARCH-UD","Armenian": "ARMENIA","Art": "ART","Art History": "ART-HIS","Arts and Architecture": "ART-ARC","Arts Education": "ARTS ED","Asian": "ASIAN","Asian American Studies": "ASIA-AM","Astronomy": "ASTR","Atmospheric and Oceanic Sciences": "A-O-SCI","Bioengineering": "BIOENGR","Bioinformatics (Graduate)": "BIOINFO","Biological Chemistry": "BIOL-CH","Biomathematics": "BIOMATH","Biomedical Research": "BMD-RES","Biostatistics": "BIOSTAT","Central and East European Studies": "C-EE-ST","Chemical Engineering": "CH-ENGR","Chemistry and Biochemistry": "CHEM","Chicana and Chicano Studies": "CHICANO","Chinese": "CHIN","Civic Engagement": "CIVIC","Civil and Environmental Engineering": "C-EE","Classics": "CLASSIC","Communication Studies": "COMM-ST","Community Health Sciences": "COM-HLT","Comparative Literature": "COM-LIT","Computational and Systems Biology": "C-S-BIO","Computer Science": "COM-SCI","Conservation of Archaeological and Ethnographic Materials": "CAEM","Dance": "DANCE","Dentistry": "DENT","Design / Media Arts": "DESMA","Digital Humanities": "DGT-HUM","Disability Studies": "DIS-STD","Dutch": "DUTCH","Earth, Planetary, and Space Sciences": "EPS-SCI","Ecology and Evolutionary Biology": "EE-BIOL","Economics": "ECON","Education": "EDUC","Electrical Engineering": "EL-ENGR","Engineering": "ENGR","English": "ENGL","English as A Second Language": "ESL","English Composition": "ENGCOMP","Environment": "ENVIRON","Environmental Health Sciences": "ENV-HLT","Epidemiology": "EPIDEM","Ethnomusicology": "ETHNMUS","Filipino": "FILIPNO","Film and Television": "FILM-TV","French": "FRNCH","Gender Studies": "GENDER","General Education Clusters": "GE-CLST","Geography": "GEOG","German": "GERMAN","Gerontology": "GRNTLGY","Global Studies": "GLBL-ST","Graduate Student Professional Development": "GRAD-PD","Greek": "GREEK","Health Policy and Management": "HLT-POL","Hebrew": "HEBREW","Hindi-Urdu": "HIN-URD","History": "HIST","Honors Collegium": "HNRS","Human Genetics": "HUM-GEN","Hungarian": "HNGAR","Indigenous Languages of the Americas": "IL-AMER","Indo-European Studies": "I-E-STD","Indonesian": "INDO","Information Studies": "INF-STD","International and Area Studies": "I-A-STD","International Development Studies": "INTL-DV","Iranian": "IRANIAN","Islamic Studies": "ISLM-ST","Italian": "ITALIAN","Japanese": "JAPAN","Jewish Studies": "JEWISH","Korean": "KOREA","Labor and Workplace Studies": "LBR-WS","Latin": "LATIN","Latin American Studies": "LATN-AM","Law (Undergraduate)": "UG-LAW","Lesbian, Gay, Bisexual, Transgender, and Queer Studies": "LGBTQS","Life Sciences": "LIFESCI","Linguistics": "LING","Management": "MGMT","Materials Science and Engineering": "MAT-SCI","Mathematics": "MATH","Mechanical and Aerospace Engineering": "MECH-AE","Medical History": "MED-HIS","Medicine": "MED","Microbiology, Immunology, and Molecular Genetics": "MIMG","Middle Eastern Studies": "M-E-STD","Military Science": "MIL-SCI","Molecular and Medical Pharmacology": "M-PHARM","Molecular Biology": "MOL-BIO","Molecular Toxicology": "MOL-TOX","Molecular, Cell, and Developmental Biology": "MCD-BIO","Molecular, Cellular, and Integrative Physiology": "MC-IP","Music": "MUSC","Music History": "MSC-HST","Music Industry": "MSC-IND","Musicology": "MUSCLG","Naval Science": "NAV-SCI","Near Eastern Languages": "NR-EAST","Neurobiology": "NEURBIO","Neurology": "NEURLGY","Neuroscience (Graduate)": "NEURO","Neuroscience": "NEUROSC","Nursing": "NURSING","Obstetrics and Gynecology": "OBGYN","Oral Biology": "ORL-BIO","Orthopaedic Surgery": "ORTHPDC","Pathology and Laboratory Medicine": "PATH","Philosophy": "PHILOS","Physics": "PHYSICS","Physics and Biology in Medicine": "PBMED","Physiological Science": "PHYSCI","Physiology": "PHYSIOL","Polish": "POLSH","Political Science": "POL-SCI","Portuguese": "PORTGSE","Program in Computing": "COMPTNG","Psychiatry and Biobehavioral Sciences": "PSYCTRY","Psychology": "PSYCH","Public Health": "PUB-HLT","Public Policy": "PUB-PLC","Religion, Study of": "RELIGN","Romanian": "ROMANIA","Russian": "RUSSN","Scandinavian": "SCAND","Science Education": "SCI-EDU","Semitic": "SEMITIC","Serbian/Croatian": "SRB-CRO","Slavic": "SLAVC","Social Thought": "SOC-THT","Social Welfare": "SOC-WLF","Society and Genetics": "SOC-GEN","Sociology": "SOCIOL","South Asian": "S-ASIAN","Southeast Asian": "SEASIAN","Spanish": "SPAN","Statistics": "STATS","Surgery": "SURGERY","Swahili": "SWAHILI","Thai": "THAI","Theater": "THEATER","Turkic Languages": "TURKIC","University Studies": "UNIV-ST","Urban Planning": "URBN-PL","Vietnamese": "VIETMSE","World Arts and Cultures": "WL-ARTS","Yiddish": "YIDDSH"};
  var uclaClasses = document.getElementsByClassName('courseItem');

  for(var i=0;i<uclaClasses.length;i++){
    var instCont = uclaClasses[i].getElementsByClassName('hide-small');
    
    var classinfo = uclaClasses[i].getElementsByClassName('SubjectAreaName_ClassName')[0].getElementsByTagName('p');
    var subject;
    if(classinfo[0].innerHTML.indexOf(":") == -1) {
      subject = classDict[classinfo[0].innerHTML];
    } else {
      subject = classDict[classinfo[0].innerHTML.substring(classinfo[0].innerHTML.indexOf(":")+2, classinfo[0].innerHTML.length)];
    }
    var classNumber = classinfo[1].innerHTML.substring(0, classinfo[1].innerHTML.indexOf(' '));
    var className = subject + '-' + classNumber;

    for(var j=0;j<instCont.length;j++){
      if(instCont[j].tagName=='TD'&&j%2)
        addInstButtons(instCont[j], className);
    }    
  }
}


// Function for adding the button next to instructor names
function addInstButtons(instCont, className){
  // console.log(uclaClassObj.innerHTML);

  if(instCont.getElementsByClassName('inst-button-bwalk').length>0) 
    return;

  var insListStr = instCont.innerHTML;
  var instructorName = [];
  
  var numInst;

  // This block will parse all instructor names from instructor list if there are >1 instructors
  for(numInst=0;numInst<10;numInst++){
    var openBrackets = insListStr.indexOf("<b");

    // If end of instructor list is reached, exit
    if(openBrackets == -1){
      instructorName[numInst] = insListStr;
      numInst++;
      //console.log(instructorName[numInst]);
      break;
    }

    instructorName[numInst] = insListStr.substring(0,openBrackets);
    insListStr = insListStr.substring(openBrackets+4)
    //console.log(instructorName[numInst]);
  } 

  /// this removes all the instructor names. The way its tagged is kinda hard to work with
  // when adding new elements so idk. Or maybe i just didnt stackoverflow the right question :)
  // this conditional prevents the instructor table title from getting erased
  if(numInst){
    instCont.innerHTML = '';
  }


  // this readds the professor names, each between paragraph tags
  for(var i=0;i<numInst;i++){
    var pCont = document.createElement("p")
    pCont.className = "instructor-name-paragraph";
    $(pCont).append(instructorName[i]);
    pCont.title = instructorName[i];

    // creates and adds the buttons!
    var bwalkButton = document.createElement("a");
    bwalkButton.className = "inst-button-bwalk";
    bwalkButton.setAttribute("inst-name",instructorName[i]);
    bwalkButton.setAttribute("course-name",className);


    // adds the average ratings data to the buttons! but only to real professors. Not TAs 
    if(instructorName[i]!="TA"){

      pCont.appendChild(bwalkButton);
      getInstSearchRes(bwalkButton);
      //instCont.appendChild(pContForBut)
    }
    
    instCont.appendChild(pCont);
  }
}


// gets the search results page from bruin walk and
// sets the overall rating score for the professor.
function getInstSearchRes(bwalkButton){


  var instructorName = bwalkButton.getAttribute("inst-name");
  var uriInstName = encodeURI(instructorName);
  bwalkButton.addEventListener("mouseout",instButtEvLisMOut(bwalkButton));

  // Communicated to background.js so that background.js can do an xmlHttpRequest
  // that goes around the cross domain restriction for this content script
  chrome.runtime.sendMessage(
    // JSON that's sent
    {
      method: 'GET',
      action: 'xhttp',
      url: 'http://www.bruinwalk.com/search/?category=professors&q=' + uriInstName ,
      data: '',
    }, 
    // callback function after background.js replies
    function(responseHTML) {
      if(responseHTML!="error"){

        // turns HTML from response into DOM nodes assigned to temporary div
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = responseHTML.replace(/<script(.|\s)*?\/script>/g, '');

        // the else handles empty search results
        if(tempDiv.getElementsByClassName("sr-info").length==0){
          bwalkButton.innerHTML = "N/A";
          bwalkButton.setAttribute("found-tag","NOT_FOUND");
          bwalkButton.addEventListener("mouseover",instButtEvLis(bwalkButton,false,tempDiv));
          return;
        }

        var allNamesFromRes = tempDiv.getElementsByClassName("sr-info"); 
        for(var i=0; i<allNamesFromRes.length ;i++){  

          // Parse name, last name, first initial of professor from results
          var instNameFromRes = allNamesFromRes[i].innerHTML; 
          instNameFromRes = instNameFromRes.substring(instNameFromRes.indexOf('h1>')+3,instNameFromRes.indexOf('</h1'));

          // The replace fucntions remove punctations. The one at the end removes white space
          // the match tag gets the last word aka last name
          var instLastNameFromRes = instNameFromRes.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()]/g,"").match( /\s(\w+)$/ )[0].replace(/\s/g,"");
          var instFirstInFromRes = instNameFromRes.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()]/g,"")[0];

          //console.log("Comparing " + instFirstInFromRes +" "+instLastNameFromRes +" vs " + instructorName);
          //console.log(instructorName.substring(instructorName.indexOf(" ")+1)[0] + " vs " + instFirstInFromRes); 

          // If last names and first initials match
          if( instructorName.substring(0,instructorName.indexOf(","))==instLastNameFromRes
            &&instructorName.substring(instructorName.indexOf(" ")+1)[0] == instFirstInFromRes
            ){
            bwalkButton.setAttribute("found-tag",instNameFromRes);

            // Gets overall rating and attaches it to the button
            var tempStr = tempDiv.getElementsByClassName("professor-result")[i].getElementsByClassName("rating")[0];
            tempStr = tempStr.innerHTML;
            var score = tempStr.substring(tempStr.indexOf('>')+1,tempStr.indexOf('</'));
            bwalkButton.innerHTML = score;
            
            if(score < 2) bwalkButton.className = "inst-button-bwalk inst-rating-bad";
            else if(score > 3.5) bwalkButton.className = "inst-button-bwalk inst-rating-good";

            var seeMoreLink = tempDiv.getElementsByClassName("sr-info")[i].getElementsByClassName("see-more")[0];
            var instPageUrl = "http://www.bruinwalk.com" + seeMoreLink.href.substring(seeMoreLink.href.indexOf("/professors")) +"all";
            bwalkButton.href = instPageUrl;
            bwalkButton.target = "_blank";
            bwalkButton.setAttribute("inst-all-page",instPageUrl);

            bwalkButton.addEventListener("mouseover",instButtEvLis(bwalkButton));
            return;
          }
          //console.log("Comparing " + instLastNameFromRes + " vs " + instructorName.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()]/g,""));


        }
        
        // if search results finds no match
        bwalkButton.innerHTML = "N/A";
        bwalkButton.setAttribute("found-tag","NOT_FOUND");

        bwalkButton.addEventListener("mouseover",instButtEvLis(bwalkButton));
        
      }

      // if xmlHttprequest doesn't work
      else{

      }
    }
  );
}



// This returns a function for the addeventlisteners for the instructor buttons
// this function is whats called when the button is mouseovered
// This adds the popup thingy when the score button is mouseovered
// so that more details ratings can be seen SeemsGood
function instButtEvLis(instBut) {
  return function(){
    // If popover hasn't been loaded, load it
    var popupContainers = instBut.parentElement.getElementsByClassName("inst-rating-popup-cont");
    if(popupContainers.length==0){
      // if professor was found
      if(instBut.getAttribute("found-tag")!="NOT_FOUND"){

        // this uses backgroun.js to retrive the HTML text from the professors Overall ratings page
        chrome.runtime.sendMessage(
          // JSON that's sent
          {
            method: 'GET',
            action: 'xhttp',
            url: instBut.getAttribute("inst-all-page"),
            data: '',
          }, 
          function(responseHTML) {
            if(responseHTML!="error"){

              // loads html into temporary div
              var tempDiv = document.createElement('div');
              tempDiv.innerHTML = responseHTML.replace(/<script(.|\s)*?\/script>/g, '');

              // creates pop-up container
              var popupCont = document.createElement("div");
              popupCont.className = "inst-rating-popup-cont show popover clickover fade bottom in";

              // popup proper
              var popup = document.createElement("div");
              popup.className = "inst-rating-popup popover-content";

              // Creates div for popup title
              var titleDiv = document.createElement("div");
              titleDiv.className = "inst-rating-title-div";
              titleDiv.append("Showing Bruin Walk results for: " + instBut.getAttribute("found-tag"));
              popup.appendChild(titleDiv);

              // Calls another function to create the ratings table for this professor
              var instRatingTable = createGenInstRatingTable(tempDiv.getElementsByClassName("rating row"));
              popup.appendChild(instRatingTable);

              // Calls another function to create the grade-distribution for this course, if available
              var classGradeDist = createClassGradeDist(instBut);
              popup.appendChild(classGradeDist);

              // Creates div for popup footer
              var footerDiv = document.createElement("div");
              footerDiv.className = "inst-rating-footer-div";
              footerDiv.append("Click to see full Bruin Walk page");
              popup.appendChild(footerDiv);

              popupCont.appendChild(popup);
              $(popupCont).insertAfter(instBut);
            }
          }
        );
      }

      //   if professor wasnt found at bruinwalk
      else{
        // creates pop-up container
        var popupCont = document.createElement("div");
        popupCont.className = "inst-rating-popup-cont show popover clickover fade bottom in";

        var popup = document.createElement("div");
        popup.className = "inst-rating-popup popover-content inst-nonexistent";

        // Creates div for popup title
        var titleDiv = document.createElement("div");
        titleDiv.className = "inst-rating-title-div-nf";
        titleDiv.append("This professor cannot be found at BruinWalk. Click to see search results");
        popup.appendChild(titleDiv);

        instBut.href = 'http://www.bruinwalk.com/search/?category=professors&q=' + encodeURI(instBut.getAttribute("inst-name"));
        instBut.target = "_blank";

        popupCont.appendChild(popup);
        $(popupCont).insertAfter(instBut);
      }
    }
    // if details have already been loaded, no need to reload.
    // this also makes the popup appear when the button is mouseovered
    else{
      popupContainers[0].className = "inst-rating-popup-cont show popover clickover fade bottom in";

    var popups = instBut.parentElement.getElementsByClassName("inst-rating-popup-cont");
      for(var i=1;i<popups.length;i++){
        $(popups[i]).remove();
      }
    }
  };
}

// creates General instructor ratings from bwalk for popups
function createGenInstRatingTable(ratingRows){
  var titles = ['Overall:','Easiness:','Workload:','Clarity:','Helpfulness:']

  var table = document.createElement('table');
  table.className = "inst-rating-table";
  for(var i=0;i<ratingRows.length;i++){
    var value = ratingRows[i].getElementsByClassName("value")[0].textContent;

    var row = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    td1.append(titles[i]);
    td2.append(value);

    if(i%2)
      row.style.backgroundColor = '#EAEAEA';
    row.appendChild(td1);
    row.appendChild(td2);
    table.appendChild(row);
  }

  
  if(ratingRows.length==0){
    var row = document.createElement("tr");
    var td = document.createElement("td");
    td.append("No ratings recorded")
    row.appendChild(td);
    table.appendChild(row);
  }

  return table;
}


// creates Grades table from bwalk for popups
function createClassGradeDist(instBut){

  var instPageUrl = "http://www.bruinwalk.com/professors/" + instBut.getAttribute("found-tag").replace(/\s/g, '-').toLowerCase() +"/"+ instBut.getAttribute("course-name").toLowerCase() +"/";
  var gradesTable = document.createElement('table');
  gradesTable.className = "grades-dist-table";
  // this uses backgrouns.js to retrive the HTML text from the course page
  chrome.runtime.sendMessage(
    // JSON that's sent
    {
      method: 'GET',
      action: 'xhttp',
      url: instPageUrl,
      data: '',
    }, 
    function(responseHTML) {

      var tempDiv = document.createElement("div");
      tempDiv.innerHTML = responseHTML;

      var allScores = tempDiv.getElementsByClassName('graph-body');
      if(allScores.length > 0) {
        var titleRow = document.createElement("tr");
        titleRow.style.backgroundColor = '#3496E1';
        var titleCell = document.createElement("td");
        titleCell.className = "grades-dist-table-title-cell";
        titleCell.append("Grades for this course under this professor: ");
        titleCell.colSpan = "13";
        titleRow.appendChild(titleCell);
        gradesTable.appendChild(titleRow);

        var scoresString = allScores[0].getElementsByClassName('bar-fill has-tip tip-left');
        var scores = [];
        var grades = ['+', 'A', '-', '+', 'B', '-', '+', 'C', '-', '+', 'D', '-', 'F'];
        var row1 = document.createElement("tr");
        var row2 = document.createElement("tr");
        var maxScore = 0;

        for(var i=0; i<scoresString.length; i++) {
          scores[i] = parseInt(scoresString[i].getAttribute('title'));
          if(scores[i]>maxScore)
            maxScore = scores[i];
        }



        for(var i=0; i<scoresString.length; i++) {
          var td1 = document.createElement("td");
          td1.className = 'grades-dist-bar-cell';

          var bar = document.createElement("div");
          bar.style.height = String(Math.floor(scores[i]/maxScore*30))+"px";
          bar.style.width = "5px";
          bar.className = "grades-dist-bar";

          var topBar = document.createElement("div");
          topBar.style.height = String(35-Math.floor(scores[i]/maxScore*30))+"px";
          topBar.style.width = "5px";
          topBar.style.background = '#FFFFFF';

          td1.appendChild(topBar);
          td1.appendChild(bar);
          row1.appendChild(td1);

          var td2 = document.createElement("td");
          td2.className = 'grades-dist-grade-label-cell';
          td2.append(grades[i]);
          row2.appendChild(td2);
        }
        gradesTable.appendChild(row1);
        gradesTable.appendChild(row2);


      } 
      // the class doesn't have grades
      else {
        var titleRow = document.createElement("tr");
        var titleCell = document.createElement("td");
        titleRow.style.backgroundColor = '#3496E1';
        titleCell.className = "grades-dist-table-title-cell";
        titleCell.append("No grades recorded.");
        titleRow.appendChild(titleCell);
        gradesTable.appendChild(titleRow);
      }

    }
  );
  return gradesTable;
}


// Adds mouseout listener that makes popups disappear
function instButtEvLisMOut(instBut) {
  return function(){
    instBut.parentElement.getElementsByClassName("inst-rating-popup-cont")[0].className="inst-rating-popup-cont hide popover clickover fade bottom in";

    var popups = instBut.parentElement.getElementsByClassName("inst-rating-popup-cont");
    for(var i=1;i<popups.length;i++){
      $(popups[i]).remove();
    }
  }
}
