/*DOM variables*/

/*containers*/
const lettersContainer  = document.getElementById("letters_container");
const hangmanContainer  = document.getElementById("hangman_container");
const gameContainer     = document.getElementById("game_container");
const lettersParagraph  = document.getElementById("letters_para");

/*popups*/
const initPopUp         = document.getElementById("init_popup");
const winPopup          = document.getElementById("win");
const losePopUp         = document.getElementById("lose");
const backgroundColor   = document.getElementById("popup_bg");



/*game elements*/
const word              = document.getElementById("word");
const numOfGuesses      = document.getElementById("guesses_left"); 
const lettersGussed     = document.getElementById("letters_guessed");
const hint              = document.getElementById("hint");

/*canvas*/
let image               = document.getElementById("hangman_images1");
const hangman           = document.getElementById("hangman_canvas");
let canvasContext       = hangman.getContext("2d");
/*html output*/
let lettersHtml         = '';
let output;

/*Game variables*/
const listOfLetters     = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const listOfWords       = ["java", "soccer", "orange", "spaghetti", "bcit"];
let listOfHints         = ["an object oriented programming language", "a sport where the ball is handled with the player's feet", "a colour and a fruit", "a type of pasta", "the acronym for a polytechnic school located in the lower main land"];
let wordToGuess;
let maskedWord          = "";
let guessesLeft;
let mistakes = 1;
let guessedLetters;
let gameEnd;
let hintText;

/*animation elements*/
const correct           = document.getElementById("correct");
const incorrect           = document.getElementById("incorrect");
let animationHandler = null;
/*-----------------------------------------------*/

gameContainer.style.display = 'none';
document.getElementById("start").addEventListener("click",function() {
    initPopUp.style.display = 'none';
    init();
    
})
/*buttons to restart game*/
document.getElementById("play_again").addEventListener("click", function(){
    gameReset();
    init();
});

document.getElementById("try_again").addEventListener("click", function(){
    gameReset();
    init();
});
/*---------------------------------------------------------------------*/   





//button interaction with guessing
lettersContainer.addEventListener("click", function(event) {
    if(!gameEnd)
        if(event.target.nodeName == 'BUTTON'){

            let btnVal = event.target.value;
            console.log(btnVal); 
            let letter = btnVal.toLowerCase();

            guessedLetters.push(letter);
            console.log(guessedLetters.toString());    
            lettersParagraph.innerHTML = `<b>${guessedLetters.toString()}</b>`;
            console.log(lettersParagraph.innerHTML)
            disableButton(event.target);
            guess(letter);
            numOfGuesses.innerHTML = `Guesses Left: <h2>${guessesLeft}</h3>`;   
            
            if(guessesLeft == 0){
                document.getElementById("lose_heading").innerHTML = `The word was ${wordToGuess}`;
                backgroundColor.style.display = "block";
                losePopUp.style.display = "block";  
                gameEnd = true; 
                
            } 
            else if(guessesLeft >= 0 && !maskedWord.includes("_")){
                gameEnd = true;
                document.getElementById("win_heading").innerHTML = `The word was ${wordToGuess}`;
                backgroundColor.style.display = "block";
                winPopup.style.display = "block";
                gameEnd = true; 
                  
            } else{
                console.log(maskedWord);
            }
            
    } 
});

/*functions*/


//disable button function
function disableButton(btn){
    let btnObj = document.getElementById(btn.id);
    btnObj.disabled = true;
    btnObj.style.backgroundColor    = "grey";
    btnObj.style.color              = "white";

}

//generate word function and display the maskedWord
function generateWord() {
    let randomIndex = Math.floor(Math.random() * listOfWords.length);
    wordToGuess = listOfWords[randomIndex];
    hintText    = listOfHints[randomIndex];
    console.log(`Word to Guess: ${wordToGuess}`);
    for(let i = 0; i < wordToGuess.length; i++) {
        let blankSpace = " ";
        let nextChar = wordToGuess.charAt(i) === blankSpace ? blankSpace : "_";
        maskedWord += nextChar;
        
    }   
    
    word.innerHTML = maskedWord;
    hint.innerHTML += `<p>${hintText}</p>`;
    console.log(maskedWord);
    /*
    console.log(maskedWord.length);
    console.log(maskedWord.trim().length);
    */
    
}


//guess
function guess(letter){
    
    if(wordToGuess.includes(letter)){
                
        let matchingIndexes = [];
        console.log(`${wordToGuess} contains letter: ${letter.toLowerCase()}`);
        
        for(let i = 0; i < wordToGuess.length; i++){
            
            if(wordToGuess.charAt(i) == letter){
                matchingIndexes.push(i);

            }
        }
        
        matchingIndexes.forEach(function(index){
            maskedWord = replaceAt(maskedWord, index, letter);  
        });
        word.innerHTML = maskedWord;
        correct.innerHTML = `<h2>"${letter}" was Correct!</h2><h2>Good Job!</h2>`;
        reset(incorrect);
        slideOut(correct);
    } else {
        console.log(`${wordToGuess} doesn't contain letter: ${letter.toLowerCase()}`);
        guessesLeft--;
        mistakes++;
        console.log(mistakes);
        draw(mistakes);
        incorrect.innerHTML = `<h2>"${letter}" was Incorrect!</h2><h2>Try Again.</h2>`;
        reset(correct);
        slideOut(incorrect);
    }
       
}

//Since strings are immutable I found this function someone made at https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript?rq=1
function replaceAt(word, index, letter){
    
    //console.log(word.substring(0,index) + letter + word.substring(index, word.length));
    return word.substring(0,index) + letter + word.substring((index + 1) , word.length);
}

function draw(imageNum){
    image = document.getElementById(`hangman_images${imageNum}`);
   
    console.log(image.src);
    canvasContext.drawImage(image, 50, 0);
    
}

/*initalization and reset functions*/
function init(){
    backgroundColor.style.display   = 'none';
    winPopup.style.display          = 'none';
    losePopUp.style.display         = 'none';
    gameContainer.style.display     = 'grid';
    lettersHtml                     += '<div style="float: left;">';
    listOfLetters.forEach(function(letter){
        lettersHtml += `<button type="button" class="letterBtn" id="${letter}" value="${letter}">${letter}</button>`;  
    
    });
    lettersHtml                     += '</div>';
    lettersGussed.innerHTML;
    lettersContainer.innerHTML      = lettersHtml;
    

    word.innerHTML                  = "";
    
    
    gameEnd                         = false;
    guessesLeft                     = 6;
    guessedLetters                  = [];
    hint.innerHTML                  = `Hint:`;
    numOfGuesses.innerHTML          = `Number of Guesses: <h2>${guessesLeft}</h2>`;
    

    generateWord(); 
    draw(1);  
    
}

function gameReset(){
    lettersContainer.innerHTML  = "";
    lettersParagraph.innerHTML  = "";
    
    
    
    lettersHtml                 = '';
    output                      = '';
    
    
    wordToGuess                 = "";
    maskedWord                  = "";
    guessesLeft;
    mistakes = 1;
    guessedLetters;
    gameEnd;
    draw(mistakes);
    reset(correct);
    reset(incorrect);
    
    

}

/*animation functions*/
function slideOut(element){
    
    let pos = 250;
    element.style.zIndex = 2;
    clearInterval(animationHandler);
    animationHandler = setInterval(function(){
        if(pos == -80){
            
            clearInterval(animationHandler);

        } else{
            console.log("sliding out");
            pos -= 2;
            element.style.left = pos + 'px';
        }
    }, 0);
}

function reset(element){
    element.style.left = 250 + "px";
    element.style.zIndex = 1;
}

