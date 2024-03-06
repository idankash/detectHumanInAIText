$(document).ready(function () {
    clearScreen();
});

function checkArticle(){
    // Get inputs
    let modelName = $("#modelBtn").val();
    let topicBtn = $("#topicBtn").val().trim();
    let articleText = $("#articleText").val().trim();
    
    // Validate inputs
    let errorMsg = validate_input(modelName, topicBtn, articleText);
    if(errorMsg !== ""){
        showAlert(errorMsg);
        return;
    }

    // Start loading screen 
    startLoadingScreen();
    setTimeout(() => {
        checkText(modelName, topicBtn, articleText);
    }, 200);
}

function checkText(modelName, topicBtn, articleText){
    let dataToSend = {
        text: articleText,
        model: modelName,
        topic: topicBtn
    }
    $.ajax({
        url: 'https://cors-anywhere.herokuapp.com/http://4.210.80.190:5000/detectHumanInAIText/checkText',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dataToSend),
        success: function(response, status, xhr) {
            let answer = response.answer;
            answer = answer === "1" ? "We found human edits in the article" : "We couldn't find human edits";

            $("#answerModalTitle").html(answer);
            $('#answerModal').modal('show');
            endLoadingScreen();
            clearScreen();
        },
        error: function(xhr, status, error) {
            endLoadingScreen();
            try{
                showAlert(xhr['responseJSON']['answer'], "Error Code: " + xhr.status);
            } catch(e){}
        }
    });
}

function clearScreen(){
    $("#articleText").val("");
    $('#ddListModel a[data-value=""]').click();
    $('#ddListTopic a[data-value=""]').click();
}

function validate_input(modelName, topicBtn, articleText){
    if(modelName === "")
        return "You should select a model!";
    
    if(topicBtn === "")
        return "You should select a topic!";

    if(articleText === "")
        return "You should enter text!";

    return "";
}

function startLoadingScreen(){
    $(".busyWaiting").show();
}

function endLoadingScreen(){
    $(".busyWaiting").hide();
}

function showAlert(msg, title="Error"){
    $("#errorTitle").html(title);
    $("#alertBody").html(msg);
    bootstrap.Toast.getOrCreateInstance($("#liveToast")).show()
}
