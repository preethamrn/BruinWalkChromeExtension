/*
  Chrome Extension:
  UCLA BruinWalk Professor Ratings - Easy Access
  Version: 0.0.4
  Created by: Robert Ursua
              robertursuadev@gmail.com
              robertursua@yahoo.com

*/

// ** FUNCTIONS for sa.ucla.edu pages aka class searches in catalog ** //
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
  if(windowURL.includes("sa.ucla.edu"))
    findExistingClasses();
}

// 
function findExistingClasses(){
  var uclaClasses = document.getElementsByClassName('row-fluid class-title');
  var subject = document.getElementById('spanSearchResultsHeader').textContent.match(/\(([^()]*)\)$/i)[1].replace(/\s/g, '-');

  for(var i=0;i<uclaClasses.length;i++){
    var instCont = uclaClasses[i].getElementsByClassName('instructorColumn');
    var classNumber = uclaClasses[i].getElementsByClassName('head')[0].textContent;
    classNumber = classNumber.substring(0, classNumber.indexOf(' '))
    var className = subject + '-' + classNumber;

    for(var j=1;j<instCont.length;j++) { //start from 1 because the first instructorColumn isn't an actual instructor
      if(instCont[j].hasAttribute("buttons-added")){
        var a = "LUL";
      }
      else{
          instCont[j].setAttribute("buttons-added","true");
          addInstButtons(instCont[j], className);
      }
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

  //console.log(insListStr);

  // This block will parse all instructor names from instructor list
  // it finds all text between > and <
  for(numInst=0;numInst<10;numInst++){
    var closeBrackets = insListStr.indexOf(">");
    var openBrackets = insListStr.substring(closeBrackets+1).indexOf("<");

    // If end of instructor list is reached, exit
    if(openBrackets == -1){
      break;
    }

    instructorName[numInst] = insListStr.substring(closeBrackets+1).substring(0,openBrackets);
    insListStr = insListStr.substring(closeBrackets+1).substring(openBrackets+1);
    //console.log(instructorName[numInst]);

  }

  /// this removes all the instructor names. The way its tagged is kinda hard to work with
  // when adding new elements so idk. Or maybe i just didnt stackoverflow the right question :)
  // this conditional prevents the instructor table title from getting erased
  if(numInst)
    while (instCont.firstChild) {
      instCont.removeChild(instCont.firstChild);
    }

  // this re-adds the professor names, each between paragraph tags
  for(var i=0;i<numInst;i++){
    var pCont = document.createElement("p")
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

        // if Search result matches!
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
    var popupContainers = instBut.parentElement.getElementsByClassName("inst-rating-popup-cont");
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
              popup.style.width = "16em";
              console.log(popup.style.paddingRight);
              popup.style.paddingRight = "4em";
              console.log(popup.style.paddingRight);
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
                instBut.href = "http://www.bruinwalk.com/professors/" + instNameFromRes.replace(/\s/g, '-').toLowerCase() +"/all/";
                table.append("This instructor has no recorded ratings for this class (click to see ratings for other classes)");
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
              $(popupCont).insertAfter($(instBut));
            }
          }
        );
      }

      //   if professor wasnt found at bruinwalk
      else{
        instBut.href = "http://www.bruinwalk.com/professors/" + instNameFromRes.replace(/\s/g, '-').toLowerCase() +"/all/";
        // creates pop-up container
        var popupCont = document.createElement("div");
        popupCont.className = "inst-rating-popup-cont show popover clickover fade bottom in";

        var popup = document.createElement("div");
        popup.className = "inst-rating-popup popover-content inst-nonexistent";
        popup.textContent = instNameFromRes + " cannot be found for this class on ";
        popup.style.width = "16em";

        var bruinWalkLink = document.createElement("a");
        bruinWalkLink.href = "http://www.bruinwalk.com";
        bruinWalkLink.textContent = "BruinWalk";
        bruinWalkLink.target = "_blank";
        popup.appendChild(bruinWalkLink);

        popupCont.appendChild(popup);
        $(popupCont).insertAfter($(instBut));
      
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


function instButtEvLisMO(instBut) {
  return function(){
    instBut.parentElement.getElementsByClassName("inst-rating-popup-cont")[0].className="inst-rating-popup-cont hide popover clickover fade bottom in";
  }
}

function instPnameEvLisMO(profCont) {
  return function(){
    instBut.parentElement.getElementsByClassName("inst-rating-popup-cont")[0].className="inst-rating-popup-cont hide popover clickover fade bottom in";
  }
}