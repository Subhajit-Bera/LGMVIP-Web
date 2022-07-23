const screen=document.getElementById("screen");
const buttons = document.querySelectorAll("button");

buttons.forEach((item)=>{
    item.onclick =() =>{
        if(item.id==="clear"){
            screen.value="";
        }else if(item.id==="back"){
            let string = screen.value.toString();
            screen.value = string.substr(0, string.length - 1);
        }else if(screen.value != "" && item.id === "equal"){
            screen.value=eval(screen.value);
        }else if(screen.value ==="" && item.id==="equal"){
            screen.value="";
        }else{
            screen.value+=item.id;
        }
    };
});