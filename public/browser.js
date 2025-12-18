
document.addEventListener("click",function(e){
    if(e.target.classList.contains("edit-me")){
       let res= prompt("enter the value")


axios.post('/update-item',{text:res, id:e.target.getAttribute("data-id")}).then(function(){
e.target.parentElement.parentElement.querySelector('.list-item').innerHTML=res
}).catch(function(){
console.log("error")
})
}

if(e.target.classList.contains("delete-me")){
      confirm("do you want to delete")


axios.post('/delete-item',{ id:e.target.getAttribute("data-id")}).then(function(){
e.target.parentElement.parentElement.remove()
}).catch(function(){
console.log("error")
})
}
})
    
