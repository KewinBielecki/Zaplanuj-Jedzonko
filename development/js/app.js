document.addEventListener("DOMContentLoaded" , function(){

    var newUserWindow = document.querySelector(".a-main__mainpanel_first-visit");
    var knownUserWindow = document.querySelector(".a-main__mainpanel_next-visit");
    var displayedName = document.querySelector(".a-header__user");
    var messageRecipes = document.querySelector(".a-next-visit-upper__messages_recipes");
    var messagePlans = document.querySelector(".a-next-visit-upper__messages_plans");
    var recipesWord = "";
    var plansWord = "";
    var lowerWindow = document.querySelector(".a-next-visit-lower");
    var table = document.querySelector("table tbody");
    var spanWeekNumber = table.previousElementSibling.firstElementChild;
    var prevBtn = document.querySelector(".a-next-visit-lower__buttons_prev");
    var nextBtn = document.querySelector(".a-next-visit-lower__buttons_next");

    Date.prototype.getWeek = function () {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };

    function lackOfPlansInfo(){
        table.parentElement.style.display = "none";
        table.parentElement.nextElementSibling.style.display = "none";

        var info = document.createElement("span");
        info.innerText = "BRAK PLANÓW!";
        info.style.fontSize = "80px";
        info.style.fontWeight = "bold";
        info.style.color = "#FFB03B";
        lowerWindow.appendChild(info);
    }

    function choosePlanToShow() {
        var myDate = new Date();
        var result = myDate.getWeek();
        var plansTable = JSON.parse(localStorage.getItem("plans"));

        for(var i = 0; i < plansTable.length; i++) {
            if(plansTable[i].weekNumber === result) {
                return result;
            }
        }

        var anotherPlanWeekNumber = result;
        var found = false;

        while(found === false) {

            if(anotherPlanWeekNumber === 52) {
                anotherPlanWeekNumber = 1;
            } else {
                anotherPlanWeekNumber++;
            }

            for(var i = 0; i < plansTable.length; i++){
                if(plansTable[i].weekNumber === anotherPlanWeekNumber) {
                    return anotherPlanWeekNumber;
                }
            }
        }
    }

    function showPlan(plan) {
        var plansTable = [];
        var planToShowTable = [];

        spanWeekNumber.innerText = plan;

        plansTable = JSON.parse(localStorage.getItem("plans"));
        var i = 0;
        while(plansTable[i] !== undefined) {
            if(plansTable[i].weekNumber === plan){
                planToShowTable = plansTable[i].plan;
                break;
            }
            i++;
        }

        for(var i = 0; i < 5; i++){
            var newRow = document.createElement("tr");
            table.appendChild(newRow);
            for(var j = 0; j < 7; j++){
                var newCell = document.createElement("td");
                newCell.innerText = planToShowTable[j][i];
                newRow.appendChild(newCell);
            }
        }


    }

    function hidePlan() {
        Array.from(table.querySelectorAll("td")).forEach(function(cell){
            cell.parentElement.remove();
        });
    }

    if(localStorage.getItem("savedUserName") !== null) {
        newUserWindow.classList.add("known-user");
        knownUserWindow.classList.add("known-user");
        displayedName.innerText = localStorage.savedUserName;

        var numberOfRecipes = 0;
        var numberOfPlans = 0;

        if(localStorage.getItem("recipes") === null) {
            numberOfRecipes = 0;
        } else {
            numberOfRecipes = JSON.parse(localStorage.getItem("recipes")).length;
        }

        if(localStorage.getItem("plans") === null) {
            numberOfPlans = 0;
        } else {
            numberOfPlans = JSON.parse(localStorage.getItem("plans")).length;
        }

        if(numberOfRecipes === 0) {
            messageRecipes.classList.add("warn");
            var warnText = document.createElement("span");
            warnText.innerText = "Pamiętaj, aby dodać przepis!";
            messageRecipes.insertBefore(warnText, messageRecipes.lastElementChild);
        } else {
            messageRecipes.classList.add("info");
            var infoText = document.createElement("span");

            if(numberOfRecipes === 1){
                recipesWord = " przepis";
            } else if(numberOfRecipes % 10 >= 2 && numberOfRecipes % 10 <= 4) {
                if(numberOfRecipes % 100 > 20 || numberOfRecipes % 100 < 10) {
                    recipesWord = " przepisy";
                } else {
                    recipesWord = " przepisów";
                }
            } else {
                recipesWord = " przepisów";
            }

            infoText.innerText = "Masz już " + numberOfRecipes + recipesWord + ", nieźle!";
            messageRecipes.insertBefore(infoText, messageRecipes.lastElementChild);
        }

        if(numberOfPlans === 0) {
            messagePlans.classList.add("warn");
            var plansWarnText = document.createElement("span");
            plansWarnText.innerText = "Pamiętaj, aby dodać plan!";
            messagePlans.insertBefore(plansWarnText, messagePlans.lastElementChild);
            lackOfPlansInfo();
        } else {
            messagePlans.classList.add("info");
            var plansInfoText = document.createElement("span");

            if(numberOfPlans === 1){
                plansWord = " plan";
            } else if(numberOfPlans % 10 >= 2 && numberOfPlans % 10 <= 4) {
                if(numberOfPlans % 100 > 20 || numberOfPlans % 100 < 10) {
                    plansWord = " plany";
                } else {
                    plansWord = " planów";
                }
            } else {
                plansWord = " planów";
            }

            plansInfoText.innerText = "Masz już " + numberOfPlans + plansWord + ", nieźle!";
            messagePlans.insertBefore(plansInfoText, messagePlans.lastElementChild);

            var planToShow = choosePlanToShow();
            showPlan(planToShow);

            prevBtn.addEventListener("click", function(){

                hidePlan();

                var anotherPlanWeekNumber = Number(spanWeekNumber.innerText);
                var found = false;
                plansTable = JSON.parse(localStorage.getItem("plans"));

                while(found === false) {

                    if(anotherPlanWeekNumber === 1) {
                        anotherPlanWeekNumber = 52;
                    } else {
                        anotherPlanWeekNumber--;
                    }

                    for(var i = 0; i < plansTable.length; i++){
                        if(plansTable[i].weekNumber === anotherPlanWeekNumber) {
                            found = true;
                            showPlan(anotherPlanWeekNumber);
                            break;
                        }
                    }
                }
            });

            nextBtn.addEventListener("click", function(){

                hidePlan();

                var anotherPlanWeekNumber = Number(spanWeekNumber.innerText);
                var found = false;
                plansTable = JSON.parse(localStorage.getItem("plans"));

                while(found === false) {

                    if(anotherPlanWeekNumber === 52) {
                        anotherPlanWeekNumber = 1;
                    } else {
                        anotherPlanWeekNumber++;
                    }

                    for(var i = 0; i < plansTable.length; i++){
                        if(plansTable[i].weekNumber === anotherPlanWeekNumber) {
                            found = true;
                            showPlan(anotherPlanWeekNumber);
                            break;
                        }
                    }
                }
            });


        }

    } else {
        var submitBtn = document.querySelector(".a-first-visit-container input[type='submit']");

        submitBtn.addEventListener("click", function(){
            var userName = document.querySelector(".a-first-visit-container input[type='text']").value;
            localStorage.setItem('savedUserName', userName);
            newUserWindow.classList.add("known-user");
            knownUserWindow.classList.add("known-user");
            displayedName.innerText = localStorage.savedUserName;

            messageRecipes.classList.add("warn");
            var warnText = document.createElement("span");
            warnText.innerText = "Pamiętaj, aby dodać przepis!";
            messageRecipes.insertBefore(warnText, messageRecipes.lastElementChild);

            messagePlans.classList.add("warn");
            var plansWarnText = document.createElement("span");
            plansWarnText.innerText = "Pamiętaj, aby dodać plan!";
            messagePlans.insertBefore(plansWarnText, messagePlans.lastElementChild);
            lackOfPlansInfo();
        });
    }

});