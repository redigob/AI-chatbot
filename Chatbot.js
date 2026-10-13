let content = document.querySelector(".content")
let input = document.querySelector("input")
let button = document.querySelector("button")
let ul = document.querySelector("ul")
let newPage = document.getElementById("new")


let setting = [];

try {
    setting = JSON.parse(localStorage.getItem("data")) || [];
} catch (error) {
    setting = [];
}

button.addEventListener("click",()=>{
    if(input.value == ""){
        window.alert("Enter a message")
        return
    }
    else{
        askGemini()
    }
})


async function askGemini() {
    let li1 = document.createElement("li")
    li1.className= "li1"
    li1.textContent = input.value;
    ul.appendChild(li1)
    setting.push(li1.textContent)
    save()
    let li2 = document.createElement("li")
    li2.className = "li2"
    li2.textContent = "Thinking..."
    li2.classList.add("animate")
    ul.appendChild(li2)
    content.scrollTop = content.scrollHeight;

    const apiKey = "";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
        "Authorization": "",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
            {
                role: "user",
                content: `${input.value}`
            }
        ]
    })
   });
   console.log("Response status:", response.status);
   input.value = ""
   



    const data = await response.json();
    console.log("API data:", data);
    if (!response.ok) {
      throw new Error(data.error?.message || "Request failed");
    }

    console.log(data);
    li2.textContent = data.choices[0].message.content
    setting.push(li2.textContent)
    save()
    setTimeout(()=>{
        li2.classList.remove("animate")
    },1)
    
}


function save(){
    localStorage.setItem("data",JSON.stringify(setting))
}


function load(){
    ul.innerHTML = "";
    if(setting){
        for(let i = 0 ; i < setting.length-(setting.length/2) ; i++){
            let li1 = document.createElement("li")
            li1.textContent = setting[2*i]
            li1.className= "li1"
            let li2 = document.createElement("li")
            li2.textContent = setting[2*i+1]
            li2.className= "li2"
            ul.appendChild(li1)
            ul.appendChild(li2)
        }
    }
    content.scrollTop = content.scrollHeight
}

load()

newPage.addEventListener("click",()=>{
    let confir = confirm("Start a new chat?")
    if(confir){
        setting = []
        save()
        ul.innerHTML=""
        load()
    }

}) 