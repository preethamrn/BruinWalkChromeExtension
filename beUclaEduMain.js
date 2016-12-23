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
  var uclaClasses = document.getElementsByClassName('class-info data_row');

  for(var i=0;i<uclaClasses.length;i++){
    var instCont = uclaClasses[i].getElementsByClassName('span9');
    
    for(var j=0;j<instCont.length;j++){
        addInstButtons(instCont[j]);  
    }    
  }
}

// respodns to  classes in classplan
function findClassPlanClasses(){
  var uclaClasses = document.getElementsByClassName('coursetable');

  for(var i=0;i<uclaClasses.length;i++){
    var instCont = uclaClasses[i].getElementsByClassName('hide-small');
    
    for(var j=0;j<instCont.length;j++){
      if(instCont[j].tagName=='TD'&&j%2)
        addInstButtons(instCont[j]);  
    }    
  }
}


// Function for adding the button next to instructor names
function addInstButtons(instCont){
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
    $(pCont).append(instructorName[i].substring(0,15));
    pCont.title = instructorName[i];

    // creates and adds the buttons!
    var bwalkButton = document.createElement("a");
    bwalkButton.className = "inst-button-bwalk";

    // adds the average ratings data to the buttons! but only to real professors. Not TAs 
    if(instructorName[i]!="TA"){

      pCont.appendChild(bwalkButton);
      getInstSearchRes(bwalkButton,instructorName[i]);
      //instCont.appendChild(pContForBut)
    }
    
    instCont.appendChild(pCont);
  }
}


// gets the search results page from bruin walk and
// sets the overall rating score for the professor.
function getInstSearchRes(bwalkButton,instructorName){

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
          bwalkButton.innerHTML = tempStr.substring(tempStr.indexOf('>')+1,tempStr.indexOf('</'));

          bwalkButton.addEventListener("mouseover",instButtEvLis(bwalkButton,true,tempDiv));
        }
        // if it doesn't match
        else{
          bwalkButton.innerHTML = "N/A";
          bwalkButton.setAttribute("found-tag","NOT_FOUND");

          bwalkButton.addEventListener("mouseover",instButtEvLis(bwalkButton,false,tempDiv));
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
function instButtEvLis(instBut,found,resultDOM) {
  return function(){
    // If popover hasn't been loaded, load it
    var popupContainers = instBut.getElementsByClassName("inst-rating-popup-cont");
    if(popupContainers.length==0){
      // if professor was found
      if(found){
        var seeMoreLink = resultDOM.getElementsByClassName("sr-info")[0].getElementsByClassName("see-more")[0];
        var instPageUrl = "http://www.bruinwalk.com" + seeMoreLink.href.substring(seeMoreLink.href.indexOf("/professors")) +"all";
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

              if(ratingRows.length==0)
                table.append("This instructor has no recorded ratings");
              
              table.style.marginTop = "10px";
              popup.appendChild(table);

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

      //   if professor wasnt found at bruinwalk
      else{
        // creates pop-up container
        var popupCont = document.createElement("div");
        popupCont.className = "inst-rating-popup-cont show popover clickover fade bottom in";

        var popup = document.createElement("div");
        popup.className = "inst-rating-popup popover-content inst-nonexistent";
        popup.textContent = "This professor cannot be found at ";

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