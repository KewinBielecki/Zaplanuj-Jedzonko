document.addEventListener("DOMContentLoaded" , function(){

    var displayedName = document.querySelector(".a-header__user");

    if(localStorage.getItem("savedUserName") !== null) {
        displayedName.innerText = localStorage.savedUserName;
    }

    //pola input
    var recipeName = document.querySelector(".a-recipeName");
    var description = document.querySelector(".a-recipeDescription");
    var ingredient = document.querySelector(".a-recipeIngredients");
    var method = document.querySelector(".a-recipeInstruction");

//lista nowych
    var newIngredientsList = document.querySelector("#ingredients");
    var newMethodList = document.querySelector("#instruction");

//przyciski
    var addIngredientBtn = document.querySelector(".btnIng");
    var addMethodBtn = document.querySelector(".a-btnPlus");
    var saveRecipeBtn = document.querySelector(".a-saveBTN");


    var modifyedRecipeIndex = -1;
    if(localStorage.getItem("modifyedRecipe") !== null) {
        var recipesTable = JSON.parse(localStorage.getItem("recipes"));
        var toModifyRecipeId = Number(JSON.parse(localStorage.getItem("modifyedRecipe")));

        for(var i = 0; i < recipesTable.length; i++) {
            if(recipesTable[i].id === toModifyRecipeId) {
                console.log("i: ", i);
                modifyedRecipeIndex = i;
                recipeName.value = recipesTable[i].recipeTitle;
                description.value = recipesTable[i].recipeDescription;

                for(var j = 0; j < recipesTable[i].ingredients.length; j++) {
                    renderSingleIngredient(recipesTable[i].ingredients[j]);
                }

                for(var j = 0; j < recipesTable[i].methods.length; j++) {
                    renderSingleMethod(recipesTable[i].methods[j]);
                }

                localStorage.removeItem("modifyedRecipe");

                break;

            }
        }
    }


//obiekt przepisu
    var newRecipe = {
        id: 0,
        recipeTitle: "",
        recipeDescription: "",
        ingredients: [],
        methods: []
    };
    
    function setUniqueId() {
        if (JSON.parse(localStorage.getItem("recipes")) !== null) {
            var recipesTable = JSON.parse(localStorage.getItem("recipes"));
            recipesTable.sort(function (a, b) {
                return b.id - a.id;
            });
            return recipesTable[0].id;
        } else {
            return 1;
        }
    }

    var idCounter = setUniqueId();

    var beingModifiedIngredient = false;
    var beingModifiedMethod = false;
    var modifiedIngredientLi = null;
    var modifiedMethodLi = null;

//renderowanie nowych składników na liście
    function renderSingleIngredient(ingredientValue) {

        if(beingModifiedIngredient) {
            var newLi = modifiedIngredientLi;
            newLi.style.opacity = 1;
            beingModifiedIngredient = false;
        } else {
            var newLi = document.createElement("Li");
            newIngredientsList.appendChild(newLi);
        }

        newLi.innerText = ingredientValue;

        var modifyIconIng = document.createElement('span');
        var deleteIconIng = document.createElement('span');
        modifyIconIng.classList.add("fas");
        modifyIconIng.classList.add("fa-edit");
        modifyIconIng.style.color = '#E58A20';
        modifyIconIng.style.paddingLeft = '8px';
        deleteIconIng.classList.add("far");
        deleteIconIng.classList.add("fa-trash-alt");
        deleteIconIng.style.color = '#BD4932';
        deleteIconIng.style.paddingLeft = '8px';
        newLi.appendChild(modifyIconIng);
        newLi.appendChild(deleteIconIng);

        modifyIconIng.addEventListener('click', function () {
            ingredient.value = this.parentElement.innerText;
            beingModifiedIngredient = true;
            modifiedIngredientLi = this.parentElement;
            this.parentElement.style.opacity = .5;
        });

        deleteIconIng.addEventListener('click', function () {
            this.parentElement.remove()
        });
    }

    function validateIngredient() {
        if(ingredient.value === "") {
            alert("Aby dodać składnik musisz uzupełnić pole SKŁADNIKI.");
            return false;
        } else if(ingredient.value.length > 50) {
            alert("Za dużo znaków! Pole SKŁADNIKI może zawierać maksymalnie 50 znaków.");
            return false;
        }
        return true;
    }

//guzik dodawania nowego składnika
    addIngredientBtn.addEventListener("click", function(e) {
        e.preventDefault();
        if(validateIngredient() === false) {
            return;
        }
        // renderowanie elementu na liście
        renderSingleIngredient(ingredient.value);
        ingredient.value = "";

    });

//to samo dla methods
//renderowanie nowych instrukcji na liście
    function renderSingleMethod(methodValue) {

        if(beingModifiedMethod) {
            var newLi = modifiedMethodLi;
            newLi.style.opacity = 1;
            beingModifiedMethod = false;
        } else {
            var newLi = document.createElement("Li");
            newMethodList.appendChild(newLi);
        }

        newLi.innerText = methodValue;

        var modifyIconInst = document.createElement('span');
        var deleteIconInst = document.createElement('span');
        modifyIconInst.classList.add("fas");
        modifyIconInst.classList.add("fa-edit");
        modifyIconInst.style.color = '#E58A20';
        modifyIconInst.style.paddingLeft = '8px';
        deleteIconInst.classList.add("far");
        deleteIconInst.classList.add("fa-trash-alt");
        deleteIconInst.style.color = '#BD4932';
        deleteIconInst.style.paddingLeft = '8px';
        newLi.appendChild(modifyIconInst);
        newLi.appendChild(deleteIconInst);

        modifyIconInst.addEventListener('click', function () {
            method.value = this.parentElement.innerText;
            beingModifiedMethod = true;
            modifiedMethodLi = this.parentElement;
            this.parentElement.style.opacity = .5;
        });

        deleteIconInst.addEventListener('click', function () {
            this.parentElement.remove()
        });
    }

    function validateMethod() {
        if(method.value === "") {
            alert("Aby dodać instrukcję musisz uzupełnić pole INNSTRUKCJE.");
            return false;
        } else if(method.value.length > 150) {
            alert("Za dużo znaków! Pole INSTRUKCJE może zawierać maksymalnie 150 znaków.");
            return false;
        }
        return true;
    }

//guzik dodawania nowej instrukcji
    addMethodBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if(validateMethod() === false) {
            return;
        }
        // renderujemy element na liście
        renderSingleMethod(method.value);
        method.value = "";
    });

//funkcja pomocnicza- odbiera obiekt newRecipe i dodaje go do localStorage
    function saveRecipeToLocalStorage(newObject) {
        var dataFromLocalStorage = [];
        // czy localStorage posiada dane
        // jeśli są to z getItem dostaniemy wartość w postaci JSON
        if (localStorage.getItem("recipes") != null){
            // dlatego konwertujemy do obiektu lub tablicy  i zapisujemy do zmiennej
            dataFromLocalStorage = JSON.parse(localStorage.getItem("recipes"));
            // dodajemy nowy obiekt
            dataFromLocalStorage.push(newObject);
            // zapisanie do LS w formie stringa
            localStorage.setItem("recipes", JSON.stringify(dataFromLocalStorage));
        } else {
            // jeśli nie ma, to tworzymy nową wartość w localStorage i dodajemy dane
            dataFromLocalStorage.push(newObject);
            localStorage.setItem("recipes", JSON.stringify(dataFromLocalStorage));
        }
        //wyświetlamy komunikat ze przepis zapisany
        alert("Zapisałeś swój przepis!");
    }

    function validateRecipe() {
        if(recipeName.value === "") {
            alert("Wprowadź nazwę przepisu!");
            return false;
        }
        if(recipeName.value.length > 50) {
            alert("Nazwa przepisu jest za długa! Maksymalna liczba znaków to 50.");
            return false;
        }
        if(description.value.length > 360) {
            alert("Opis przepisu jest za długi! Maksymalna liczba znaków to 360.");
            return false;
        }
        if(newMethodList.children.length === 0){
            alert("Twój przepis nie zawiera żadnych instrukcji! Uzupełnij pole INSTRUKCJE i dodaj klikając 'PLUS'.");
            return false;
        }
        if(newIngredientsList.children.length === 0) {
            alert("Twój przepis nie zawiera żadnych składników! Uzupełnij pole SKŁADNIKI i dodaj klikając 'PLUS'.");
            return false;
        }
        return true;
    }

    saveRecipeBtn.addEventListener("click", function (e) {
        e.preventDefault();

        if(validateRecipe() === false) {
            return;
        }

        if(modifyedRecipeIndex >= 0) {
            var recipesTable = JSON.parse(localStorage.getItem("recipes"));

            recipesTable[modifyedRecipeIndex].ingredients = [];
            recipesTable[modifyedRecipeIndex].methods = [];

            recipesTable[modifyedRecipeIndex].recipeTitle = recipeName.value;
            recipesTable[modifyedRecipeIndex].recipeDescription = description.value;

            Array.from(newMethodList.children).forEach(function(li){
                recipesTable[modifyedRecipeIndex].methods.push(li.innerText);
                li.remove();
            });

            Array.from(newIngredientsList.children).forEach(function(li){
                recipesTable[modifyedRecipeIndex].ingredients.push(li.innerText);
                li.remove();
            });

            localStorage.setItem("recipes", JSON.stringify(recipesTable));

            recipeName.value = "";
            description.value = "";
            modifyedRecipeIndex = -1;

        } else {

            newRecipe.id = ++idCounter;
            newRecipe.recipeTitle = recipeName.value;
            newRecipe.recipeDescription = description.value;
            Array.from(newMethodList.children).forEach(function (li) {
                newRecipe.methods.push(li.innerText);
                li.remove();
            });
            Array.from(newIngredientsList.children).forEach(function (li) {
                newRecipe.ingredients.push(li.innerText);
                li.remove();
            });
            saveRecipeToLocalStorage(newRecipe);

            recipeName.value = "";
            description.value = "";
            newRecipe.recipeTitle = "";
            newRecipe.recipeDescription = "";
            newRecipe.methods = [];
            newRecipe.ingredients = [];
        }
    });

});

