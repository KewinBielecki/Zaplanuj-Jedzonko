document.addEventListener("DOMContentLoaded" , function(){

    var displayedName = document.querySelector(".a-header__user");

    if(localStorage.getItem("savedUserName") !== null) {
        displayedName.innerText = localStorage.savedUserName;
    }

    var table = document.querySelector(".recipes-list-table tbody");

    function showRecipes() {

        var recipesTable = [];

        recipesTable = JSON.parse(localStorage.getItem("recipes"));

        for(var i = 0; i < recipesTable.length; i++){
            var newRow = document.createElement("tr");
            table.appendChild(newRow);
            for(var j = 0; j < 3; j++){
                var newCell = document.createElement("td");
                newCell.innerText = Object.values(recipesTable[i])[j];
                newRow.appendChild(newCell);
            }

            var actionsCell = document.createElement("td");

            var modifyIcon = document.createElement('span');
            var deleteIcon = document.createElement('span');
            modifyIcon.classList.add("fas");
            modifyIcon.classList.add("fa-edit");
            modifyIcon.style.color = '#E58A20';
            modifyIcon.style.paddingLeft = '8px';
            deleteIcon.classList.add("far");
            deleteIcon.classList.add("fa-trash-alt");
            deleteIcon.style.color = '#BD4932';
            deleteIcon.style.paddingLeft = '8px';

            actionsCell.appendChild(modifyIcon);
            actionsCell.appendChild(deleteIcon);

            newRow.appendChild(actionsCell);

            deleteIcon.addEventListener("click", function(){
                var toDeleteRecipeId = Number(this.parentElement.parentElement.firstElementChild.innerText);

                for(var i = 0; i < recipesTable.length; i++) {
                    if(recipesTable[i].id === toDeleteRecipeId){
                        recipesTable.splice(i, 1);
                        localStorage.setItem("recipes", JSON.stringify(recipesTable));
                        this.parentElement.parentElement.remove();
                        return;
                    }
                }
            });

            modifyIcon.addEventListener("click", function(){
                var toModifyRecipeId = this.parentElement.parentElement.firstElementChild.innerText;

                localStorage.setItem("modifyedRecipe", JSON.stringify(toModifyRecipeId));

                window.location.href = "addRecipe.html";
            });
        }


    }

    if(localStorage.getItem("recipes") !== null) {
        showRecipes();
    }
});