document.addEventListener("DOMContentLoaded" , function(){

    var leftBtn = document.querySelector(".l-btn_left");
    var rightBtn = document.querySelector(".l-btn_right");
    var listItems = document.querySelectorAll(".l-carousel__list li");

    var indexOfVisibleImg = 0;

    listItems[0].classList.add("l-visible");

    leftBtn.addEventListener("click", function(){
        listItems[indexOfVisibleImg--].classList.remove("l-visible");
        if(indexOfVisibleImg < 0){
            indexOfVisibleImg = listItems.length - 1;
        }
        listItems[indexOfVisibleImg].classList.add("l-visible");
    });

    rightBtn.addEventListener("click", function(){
        listItems[indexOfVisibleImg++].classList.remove("l-visible");
        if(indexOfVisibleImg >= listItems.length){
            indexOfVisibleImg = 0;
        }
        listItems[indexOfVisibleImg].classList.add("l-visible");
    });

});