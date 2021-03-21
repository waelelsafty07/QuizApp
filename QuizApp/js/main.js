/***
 * select query
 */
var countspan = document.querySelector('.count span');
var bulletSpanCounter = document.querySelector('.spans');
var quiztitle = document.querySelector('.quiz-area');
var answerArea = document.querySelector('.answers-area');
var submitButton = document.querySelector('.submit-button');
var rmBullets = document.querySelector('.bullets');
var results = document.querySelector('.results');
var countdownElemnt = document.querySelector('.count-down');
var index = 0;
var correctAnswer = 0;

function getQuestion() {
    var myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = () => {
        if (myRequest.readyState === 4 && myRequest.status === 200) {
            questionObject = JSON.parse(myRequest.responseText);
            var questionCount = questionObject.length;
            // Create Bullets
            CreateBullets(questionCount);
            // Add Data 
            AddData(questionObject[index], questionCount);

            countdown(5,questionCount);
            // check answer
            submitButton.onclick = function () {

                var RightAnswer = questionObject[index].correct_answer;

                index++;

                checkAnswer(RightAnswer, questionCount);

                // Remove pervious Question 
                quiztitle.innerHTML = '';
                answerArea.innerHTML = '';

                //add new question
                AddData(questionObject[index], questionCount);
                // Bullets
                handleBullets();
                clearInterval(countdownInterval);
                countdown(5,questionCount);
                // Show Result
                showResult(questionCount);
            }
        }
    }
    myRequest.open('GET', 'js/Quesstion_Json.json', true);
    myRequest.send();

}
getQuestion();

function CreateBullets(num) {
    countspan.innerHTML = num;


    for (var i = 0; i < num; i++) {
        //create spans bullets
        var theBullet = document.createElement("span");
        //First Bullet
        if (i === 0)
            theBullet.className = "on";
        // append bullets
        bulletSpanCounter.appendChild(theBullet);
    }
}


function AddData(obj, count) {
    if (index < count) {
        // create h2 Questipon title
        var questiontitle = document.createElement("h2");

        // create h2 Questipon text
        var questiontext = document.createTextNode(obj.question);

        // append text to h2 
        questiontitle.appendChild(questiontext);
        // append h2 to quiz area
        quiztitle.appendChild(questiontitle);

        var j = 1
        // Create Data
        for (key in obj.answers) {
            // create div
            var mainDiv = document.createElement('div');
            // add class
            mainDiv.className = "answers";
            // create input radio 
            var radio = document.createElement('input');
            // radio type + name + id
            radio.name = 'questions';
            radio.type = 'radio';
            radio.id = `answer_${j}`;
            radio.dataset.answer = obj.answers[key];

            if (j === 1)
                radio.checked = true;
            // label
            thelabel = document.createElement('label');
            thelabel.htmlFor = `answer_${j}`;

            thelabelText = document.createTextNode(obj.answers[key]);

            thelabel.appendChild(thelabelText);
            mainDiv.appendChild(radio);
            mainDiv.appendChild(thelabel);
            answerArea.appendChild(mainDiv);
            j++;
        }
    }
}

function checkAnswer(right, count) {
    var answers = document.getElementsByName("questions");
    var chooseAnswer;
    for (var i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            chooseAnswer = answers[i].dataset.answer;
        }
    }

    if (right == chooseAnswer) {
        correctAnswer++;
    }

}

function handleBullets() {
    var bulletSpan = document.querySelectorAll(".bullets .spans span");
    var array = Array.from(bulletSpan);
    array.forEach((span, indexspan) => {
        if (index == indexspan) {
            span.className = "on";
        }
    })
}

function showResult(count)
{
    var theResult;
    if(index === count ){
        quiztitle.remove();
        answerArea.remove();
        submitButton.remove();
        rmBullets.remove();
        if(correctAnswer > (count/2) && correctAnswer < count )
        {
            theResult= `<span class="good">Good</span>, ${correctAnswer} From ${count}`;
        }else if(correctAnswer === count){
            theResult= `<span class="perfect">Perfect</span>, ${correctAnswer} From ${count}`;
        }else
        {
            theResult= `<span class="bad">Bad</span>, ${correctAnswer} From ${count}`;
        }
        results.innerHTML=theResult;
    }
}

function countdown(duration, count)
{
    if(index < count)
    {
        var minutes,seconds;
        countdownInterval=setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ?`0${minutes}` : minutes;
            seconds = seconds < 10 ?`0${seconds}` : seconds;
            countdownElemnt.innerHTML = `${minutes}:${seconds}`;
            if(--duration < 0)
            {
                clearInterval(countdownInterval);
                submitButton.click();
                console.log("Finshed");
            }
        },1000);
    }
}