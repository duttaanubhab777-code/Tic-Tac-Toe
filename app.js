let boxes = document.querySelectorAll(".box");
let resetBtn=document.querySelector("#reset");
let msgContainer =document.querySelector(".msg-container")
let newGameBtn= document.querySelector("#newBtn");

let drawContainer = document.querySelector(".draw-container")
let drawBtn =document.querySelector("#draw-btn")


let turnO = true
const winPaterrens = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,4,6],
    [2,5,8],
    [3,4,5],
    [6,7,8]
];


const drawPaterrens = [
    [0,2,5,6,7],
    [1,3,4,6,8],
    [1,3,5,6,8],
    [0,2,3,5,7],
    [0,1,5,6,7],
    [1,2,3,7,8],
    [0,2,3,7,8],
    [1,2,3,6,8],
    [0,1,5,6,8],
    [0,1,4,5,6],
    [0,2,4,5,7],
    [2,3,4,7,8],
    [0,4,5,6,7],
    [1,2,3,4,8],
    [0,2,3,4,7],
    [1,4,5,6,8]
    
];

const resetGame =() =>{
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
    drawContainer.classList.add("hide");
    
       
        
    
};

boxes.forEach((box)=>{
    box.addEventListener("click",()=>{
        if(turnO) {
        box.innerText = "O";
        box.style.color ="blue"
            turnO = false;
        }else {
        box.innerText = "X";
            turnO = true;
            box.style.color="black"
        
            
        }
        
        box.disabled = true;
        checkWinner();
        checkDraw();
    });
}
    );
   
    const disableBoxes=() =>{
        for(let box of boxes) {
            box.disabled=true;
        }
    }

const enableBoxes=() =>{
        for(let box of boxes) {
            box.disabled=false;
            box.innerText =""
        }
    }
    

    
    const showWinner = (winner) => {
        msg.innerText=`🎉 Congratulations Winner Is ${winner}🎉`;
        msgContainer.classList.remove("hide");
        disableBoxes();
    }
    
    
    const draw = () => {
        msg.innerText=`The Game Is Draw!!`
        
        drawContainer.classList.remove("hide");
        disableBoxes();
    }
    
    
    
    const checkDraw =() =>{
        for(let pattern of drawPaterrens){
        let posaVal = boxes[pattern[0]].innerText;
        let posbVal = boxes[pattern[1]].innerText;
        let poscVal = boxes[pattern[2]].innerText;
        
        let posdVal = boxes[pattern[3]].innerText;
        let poseVal = boxes[pattern[4]].innerText;
        
        if(posaVal !=""&& posbVal!=""&& poscVal !=""&& posdVal !="" && poseVal !="") {
        if(posaVal === posbVal &&   posbVal== poscVal && poscVal === posdVal && posdVal === poseVal 
            
            ) {
        
        draw();
        
            
        }
            
        }
            
        }
    }
    
    
    
    
    const checkWinner =() =>{
        for(let pattern of winPaterrens){
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;
        
        if(pos1Val !=""&& pos2Val!=""&& pos3Val !="") {
        if(pos1Val === pos2Val && pos2Val=== pos3Val) {
        
        showWinner(pos1Val);
        
            
        }
            
        }
            
        }
    }
    
    
    newGameBtn.addEventListener("click",resetGame)
    
   resetBtn.addEventListener("click",resetGame) 

drawBtn.addEventListener("click",resetGame) 
   

