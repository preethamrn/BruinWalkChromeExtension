/*
  Chrome Extension:
  UCLA BruinWalk Professor Ratings - Easy Access
  Version: 0.0.4
  Created by: Robert Ursua
              robertursuadev@gmail.com
              robertursua@yahoo.com

*/

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

    // adds the average ratings data to the buttons! but only to real professors. Not TAs 
    if(instructorName[i]!="TA"){

      pCont.appendChild(bwalkButton);
      getInstSearchRes(bwalkButton, instructorName[i], className);
      //instCont.appendChild(pContForBut)
    }
    
    instCont.appendChild(pCont);
  }
}


// gets the search results page from bruin walk and
// sets the overall rating score for the professor.
function getInstSearchRes(bwalkButton, instructorName, className){

  var uriInstName = encodeURI(instructorName);
  bwalkButton.addEventListener("mouseout",instButtEvLisMO(bwalkButton));

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
        if(tempDiv.getElementsByClassName("sr-info").length)
          var instNameFromRes = tempDiv.getElementsByClassName("sr-info")[0].innerHTML;
        else{
          bwalkButton.innerHTML = "N/A";
          bwalkButton.setAttribute("found-tag","NOT_FOUND");
          bwalkButton.addEventListener("mouseover",instButtEvLis(bwalkButton,false,tempDiv));
          return;
        }

        // Check if last name of professor from search results matches the real last name of professor
        // the replace thingies removes all punctuation, the one at the end removes whitespace
        instNameFromRes = instNameFromRes.substring(instNameFromRes.indexOf('h1>')+3,instNameFromRes.indexOf('</h1'));
        var instLastNameFromRes = instNameFromRes.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()]/g,"").match( /\s(\w+)$/ )[0].replace(/\s/g,"")  ;

        //console.log("Comparing " + instLastNameFromRes + " vs " + instructorName.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()]/g,""));

        // if Search result matches based on last name!
        if(instructorName.replace(/[.,\/#!$%\^&\*;:'{}=\-_`~()]/g,"").indexOf(instLastNameFromRes)!=-1){
          bwalkButton.setAttribute("found-tag",instNameFromRes);

          // Gets overall rating and attaches it to the button
          var tempStr = tempDiv.getElementsByClassName("rating")[0].innerHTML;
          var score = tempStr.substring(tempStr.indexOf('>')+1,tempStr.indexOf('</'));
          bwalkButton.innerHTML = score;
          if(score < 2) bwalkButton.className = "inst-button-bwalk bad";
          else if(score > 3.5) bwalkButton.className = "inst-button-bwalk good";

          bwalkButton.addEventListener("mouseover",instButtEvLis(bwalkButton,true,instNameFromRes,className));

        }
        // if it doesn't match
        else{
          bwalkButton.innerHTML = "N/A";
          bwalkButton.setAttribute("found-tag","NOT_FOUND");

          bwalkButton.addEventListener("mouseover",instButtEvLis(bwalkButton,false,instNameFromRes,className));
        }
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
function instButtEvLis(instBut,found,instNameFromRes,className) {

  return function(){
    // If popover hasn't been loaded, load it
    var popupContainers = instBut.getElementsByClassName("inst-rating-popup-cont");
    if(popupContainers.length==0){
      // if professor was found
      if(found){
        var instPageUrl = "http://www.bruinwalk.com/professors/" + instNameFromRes.replace(/\s/g, '-').toLowerCase() +"/"+ className.toLowerCase() +"/";
        instBut.href = instPageUrl;
        instBut.target = "_blank";
        //console.log(instPageUrl);

        // this uses backgroun.js to retrive the HTML text from the professors Overall ratings page
        chrome.runtime.sendMessage(
          // JSON that's sent
          {
            method: 'GET',
            action: 'xhttp',
            url: instPageUrl,
            data: '',
          }, 
          function(responseHTML) {
            if(responseHTML!="error"){
              //console.log(responseHTML);
              // loads html into temporary div
              var tempDiv = document.createElement('div');
              tempDiv.innerHTML = responseHTML.replace(/<script(.|\s)*?\/script>/g, '');

              // creates pop-up container
              var popupCont = document.createElement("div");
              popupCont.className = "inst-rating-popup-cont show popover clickover fade bottom in";

              var popup = document.createElement("div");
              popup.className = "inst-rating-popup popover-content";
              popup.style.width = "10em";
              popup.style.paddingRight = "4em";
              //popup.textContent = "Showing ";

              popup.append("Showing Bruin Walk results for: " + instBut.getAttribute("found-tag"));

              var ratingRows = tempDiv.getElementsByClassName("rating row");  
              var titles = ['Overall:','Easiness:','Workload:','Clarity:','Helpfulness:']

              var table = document.createElement('table');
              for(var i=0;i<ratingRows.length;i++){
                var value = ratingRows[i].getElementsByClassName("value")[0].textContent;

                var row = document.createElement("tr");
                var td1 = document.createElement("td");
                var td2 = document.createElement("td");
                td1.append(titles[i]);
                td2.append(value);
                row.appendChild(td1);
                row.appendChild(td2);
                table.appendChild(row);

                //console.log(i);
                //console.log(value);
              }

              if(ratingRows.length==0) {
                instPageUrl = "http://www.bruinwalk.com/professors/" + instNameFromRes.replace(/\s/g, '-').toLowerCase() +"/all/";

                // this uses backgroun.js to retrive the HTML text from the professors Overall ratings page
                chrome.runtime.sendMessage(
                  // JSON that's sent
                  {
                    method: 'GET',
                    action: 'xhttp',
                    url: instPageUrl,
                    data: '',
                  }, 
                  function(responseHTML) {
                    if(responseHTML!="error"){
                      //console.log(responseHTML);
                      // loads html into temporary div
                      var allratingstempDiv = document.createElement('div');
                      allratingstempDiv.innerHTML = responseHTML.replace(/<script(.|\s)*?\/script>/g, '');

                      var ratingRows = allratingstempDiv.getElementsByClassName("rating row");  
                      var titles = ['Overall:','Easiness:','Workload:','Clarity:','Helpfulness:']

                      for(var i=0;i<ratingRows.length;i++){
                        var value = ratingRows[i].getElementsByClassName("value")[0].textContent;

                        var row = document.createElement("tr");
                        var td1 = document.createElement("td");
                        var td2 = document.createElement("td");
                        td1.append(titles[i]);
                        td2.append(value);
                        row.appendChild(td1);
                        row.appendChild(td2);
                        table.appendChild(row);

                        //console.log(i);
                        //console.log(value);
                      }

                      if(ratingRows.length==0) {
                        table.append("This instructor has no recorded ratings");
                      }
                    }
                  }
                );
              }
              
              table.style.marginTop = "10px";
              popup.appendChild(table);
              
              var allScores = tempDiv.getElementsByClassName('graph-body');
              var gradesTable = document.createElement('table');
              if(allScores.length > 0) {
                var scores = allScores[0].getElementsByClassName('bar-fill has-tip tip-left');
                var grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
                var gradeGoodThresholds = [50, 40, -20, -10, -10]; //array of good scores for each letter grade (negative means less is better)
                var gradeBadThresholds = [-15, -20, 30, 20, 15]; //array of good scores for each letter grade (negative means less is better)

                var row;
                var sum = 0;
                for(var i=0; i<scores.length; i++) {
                    var value = scores[i].getAttribute('title');

                    if(i%3 == 0) row = document.createElement("tr");
                    var td1 = document.createElement("td");
                    var td2 = document.createElement("td");
                    td1.append(grades[i]);
                    td2.append(value);
                    sum += parseFloat(value.substring(0, value.indexOf('%')));
                    row.appendChild(td1);
                    row.appendChild(td2);
                    if(i%3 == 2 || i==scores.length-1) {
                      var j = Math.floor(i/3);
                      if((gradeGoodThresholds[j] > 0 && sum > gradeGoodThresholds[j]) || (gradeGoodThresholds[j] < 0 && sum < -gradeGoodThresholds[j])) row.style.background = '#00FF00';
                      else if((gradeBadThresholds[j] > 0 && sum > gradeBadThresholds[j]) || (gradeBadThresholds[j] < 0 && sum < -gradeBadThresholds[j])) row.style.background = '#FF0000';
                      gradesTable.appendChild(row);
                      sum = 0;
                    }
                }
              } 
              // the class doesn't have grades
              else {
                gradesTable.append("This instructor has no recorded grades for this class");
              }

              gradesTable.style.marginTop = "10px";
              popup.appendChild(gradesTable);

              var footer = document.createElement("p");
              footer.append("Click to see full Bruin Walk page");
              footer.className = "inst-rating-popup-footer";
              popup.appendChild(footer);

              popupCont.appendChild(popup);
              instBut.appendChild(popupCont);
            }
          }
        );
      }

      // if professor wasnt found at bruinwalk
      else {
        instBut.href = "http://www.bruinwalk.com/professors/" + instNameFromRes.replace(/\s/g, '-').toLowerCase() +"/all/";
        // creates pop-up container
        var popupCont = document.createElement("div");
        popupCont.className = "inst-rating-popup-cont show popover clickover fade bottom in";

        var popup = document.createElement("div");
        popup.className = "inst-rating-popup popover-content inst-nonexistent";
        popup.textContent = "This professor cannot be found on ";
        popup.style.width = "10em";

        var bruinWalkLink = document.createElement("a");
        bruinWalkLink.href = "http://www.bruinwalk.com";
        bruinWalkLink.textContent = "BruinWalk";
        bruinWalkLink.target = "_blank";
        popup.appendChild(bruinWalkLink);

        popupCont.appendChild(popup);
        instBut.appendChild(popupCont);
      }
    }
    // if details have already been loaded, no need to reload.
    // this also makes the popup appear when the button is mouseovered
    else{
      popupContainers[0].className = "inst-rating-popup-cont show popover clickover fade bottom in";

      var popups = instBut.getElementsByClassName("inst-rating-popup-cont");
      for(var i=1;i<popups.length;i++){
        $(popups[i]).remove();
      }
    }
  };
}


function instButtEvLisMO(instBut) {
  return function(){
    instBut.getElementsByClassName("inst-rating-popup-cont")[0].className="inst-rating-popup-cont hide popover clickover fade bottom in";
  }
}