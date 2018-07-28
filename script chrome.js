function injectScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = true;
        script.src = src;
        script.addEventListener('load', resolve);
        script.addEventListener('error', () => reject('Error loading script.'));
        script.addEventListener('abort', () => reject('Script loading aborted.'));
        document.head.appendChild(script);
    });
}

injectScript("https://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js")
    .then(() => {
	 start();
        console.log('Script loaded!');
    }).catch(error => {
        console.log(error);
    });

var numQustions;
var currentQuestion;
var category = "A";

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}
function randomQuastion() {
    var random = Math.floor(Math.random() * numQustions - 1);
    while (!$("#rpQuestions_ctl" + pad(random, 2) + "_lblCategories").text().includes(category))
        random = Math.floor(Math.random() * numQustions - 1);
    return random;
}
function showLayer() {
    var myLayer = document.createElement('p');
    myLayer.id = 'answer';
    myLayer.style.position = 'relative';
    myLayer.style.width = 300;
    myLayer.style.height = 300;
    myLayer.style.padding = '10px';
    myLayer.style.background = '#cccccc';
    myLayer.style.display = 'block';
    myLayer.style.zIndex = 99;
    myLayer.innerHTML = '';
    document.getElementsByClassName("PrintTest")[0].appendChild(myLayer);
    var btn = document.createElement('BUTTON');
    btn.id = 'next';
    btn.style.position = 'relative';
    btn.style.width = 300;
    btn.style.height = 300;
    btn.style.padding = '10px';
    btn.style.background = '#00ff00';
    btn.style.display = 'block';
    btn.style.zIndex = 99;
    btn.innerHTML = 'Следно';
    document.getElementsByClassName("PrintTest")[0].appendChild(btn);
}
    function start() {
        $(".PrintTest").css({
            "padding-right": "15px",
            "padding-left": "15px",
            "margin-right": "auto",
            "margin-left": "auto"
        });
        showLayer();
        numQustions = $(".PrintTest > div").length;
        for (var i = 0; i < numQustions; i++) {
            $("#rpQuestions_ctl" + pad(i, 2) + "_phColumn td > img:nth-child(2)").hide();
            $("#rpQuestions_ctl"+pad(i, 2)+"_ucEmbeddedAnswer_lblCorrectAnswer").hide();
            $("#rpQuestions_ctl" + pad(i, 2) + "_phColumn > div:first-child > div > div:nth-child(3) span").hide();
        }
        $(".PrintTest > div").each(function (index) {
            $(this).hide();
        });
        currentQuestion = randomQuastion();
        $(".PrintTest > div:eq(" + currentQuestion + ")").show();

        $("#next").click(function () {
            if ($("#rpQuestions_ctl"+ pad(currentQuestion, 2)+"_ucMatchingAnswers_hfAnswer").length) {
                var numAnswers = $("#rpQuestions_ctl" + pad(currentQuestion, 2) + "_phColumn input[maxlength=2]").length;
                var correct=true;
                for(var i=0;i<numAnswers;i++){
                    if($("#rpQuestions_ctl"+pad(currentQuestion, 2)+"_ucMatchingAnswers_rpQuestions_ctl"+pad(i, 2)+"_tbCorrectAnswer").val() !=
                        $("#rpQuestions_ctl"+pad(currentQuestion, 2)+"_ucMatchingAnswers_rpQuestions_ctl"+pad(i, 2)+"_lblCorrectAnswer").text()){
                        correct=false;
                        break;
                    }
                }
                if(correct){
                    $("#rpQuestions_ctl" + pad(currentQuestion, 2) + "_phColumn input").each(function () {
                        $(this).val("");
                    })
                    $(".PrintTest > div:eq(" + currentQuestion + ")").hide();
                    currentQuestion = randomQuastion();
                    $(".PrintTest > div:eq(" + currentQuestion + ")").show();
                    $("#answer").text("");
                }
                else
                {
                    $("#answer").text("Грешно");
                }
            }
            else if($("#rpQuestions_ctl"+pad(currentQuestion, 2)+"_ucEmbeddedAnswer_tbAnswer").length){
                if($("#rpQuestions_ctl"+pad(currentQuestion, 2)+"_ucEmbeddedAnswer_tbAnswer").val() == $("#rpQuestions_ctl"+pad(currentQuestion, 2)+"_ucEmbeddedAnswer_lblCorrectAnswer").text().replace( /^\D+/g, '')){
                    $("#rpQuestions_ctl"+pad(currentQuestion, 2)+"_ucEmbeddedAnswer_tbAnswer").val("");
                    $(".PrintTest > div:eq(" + currentQuestion + ")").hide();
                    currentQuestion = randomQuastion();
                    $(".PrintTest > div:eq(" + currentQuestion + ")").show();
                    $("#answer").text("");
                }
                else{
                    $("#answer").text($("#rpQuestions_ctl"+pad(currentQuestion, 2)+"_ucEmbeddedAnswer_lblCorrectAnswer").text());
                }
            }
            else {
                $(this).prop('checked', false);
                $(".PrintTest > div:eq(" + currentQuestion + ")").hide();
                currentQuestion = randomQuastion();
                $(".PrintTest > div:eq(" + currentQuestion + ")").show();
                $("#answer").text("");
            }
            return false;
        })
        $("input").each(function () {
            if ($(this).is(":checkbox")) {
                $(this).click(function () {
                    if ($(this).parent().parent().find("img:hidden").length)
                        $("#answer").text("Точно");
                    else {
                        $(this).prop('checked', false);
                        $("#answer").text($("#rpQuestions_ctl" + pad(currentQuestion, 2) + "_phColumn").find("img:hidden").parent().find("span").text());
                    }

                })
            }
        });
    }