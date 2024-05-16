let container = document.getElementById("container");

document.getElementById("nav-btn-newSzallas").onclick = () =>{
    ShowForm();
}
document.getElementById("nav-btn-szallas").onclick = async ()=>{ 
    let data = await MyRequest("https://www.nodejs.sulla.hu/data", "GET")
    ShowCards(data)
};

document.body.onload = async () => {
    let data = await MyRequest("https://www.nodejs.sulla.hu/data", "GET");
    ShowCards(data);
}


function ShowCards(data){
    container.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        let body = `hostname:${data[i].hostname}<br>Location:${data[i].location}<br>Price:${data[i].price}Ft/night<br>Minimum Nights:${data[i].minimum_nights}`
        container.appendChild(CreateCard(data[i].id,data[i].name, body));
    }
}

function ShowForm(params) {
    container.innerHTML = "";
    let formDiv = document.createElement("div");
    let nameInput = document.createElement("input");
    let locationInput = document.createElement("input");
    let priceInput = document.createElement("input");
    let minimum_nightsInput = document.createElement("input");
    let csinaljadBtn = document.createElement("button");

    formDiv.classList.add("form");
    nameInput.placeholder = "Name";
    locationInput.placeholder = "Location";
    priceInput.placeholder = "Price";
    minimum_nightsInput.placeholder = "Minimum Nights";
    csinaljadBtn.innerHTML = "Csinaljad";

    nameInput.classList.add("form-control");
    locationInput.classList.add("form-control");
    priceInput.classList.add("form-control");
    minimum_nightsInput.classList.add("form-control");
    csinaljadBtn.classList.add("btn");

    csinaljadBtn.onclick = Mypost;

    formDiv.appendChild(nameInput);
    formDiv.appendChild(locationInput);
    formDiv.appendChild(priceInput);
    formDiv.appendChild(minimum_nightsInput);
    formDiv.appendChild(csinaljadBtn);

    container.appendChild(formDiv);
}

async function Mypost() {
    let name = document.querySelector(".form input[placeholder='Name']").value;
    let location = document.querySelector(".form input[placeholder='Location']").value;
    let price = document.querySelector(".form input[placeholder='Price']").value;
    let minimum_nights = document.querySelector(".form input[placeholder='Minimum Nights']").value;
    if (name != "" && location != "" && price != "" && minimum_nights != "") {
        let data = {
            name: name,
            location: location,
            price: price,
            minimum_nights: minimum_nights
        }
    
        MyRequest("https://www.nodejs.sulla.hu/data", "POST", JSON.stringify(data));
        let response = await MyRequest("https://www.nodejs.sulla.hu/data", "GET");
        ShowCards(response);
    }
    else{
        alert("Minden mezőt ki kell tölteni!")
    }
   
}

async function MyRequest(URL, method, body = null) {
    let data = await fetch(URL, {
        body:body,
        method:method,
        body:body,
        headers: {
            "Content-Type": "application/json"
        }
    });

    return await data.json();

}

function CreateCard(id,header, body) {
    let card = document.createElement("div");
    let card_header = document.createElement("div");
    let card_body = document.createElement("div");
    let p = document.createElement("p");
    let card_footer = document.createElement("div");
    let btn_szerkesztes = document.createElement("div");
    let btn_törles = document.createElement("div");

    card.classList.add("card");
    card_header.classList.add("card-header");
    card_body.classList.add("card-body");
    card_footer.classList.add("card-footer");
    btn_szerkesztes.classList.add("btn");
    btn_törles.classList.add("btn");

    card_header.innerHTML = header;
    p.innerHTML = body;
    btn_törles.innerHTML = "Törlés";
    btn_szerkesztes.innerHTML = "Szerkesztés";

    card.appendChild(card_header);
    card.appendChild(card_body);
    card.appendChild(card_footer);
    card_footer.appendChild(btn_szerkesztes);
    card_footer.appendChild(btn_törles);
    card_body.appendChild(p);

    btn_törles.addEventListener("click", async () => {
        MyRequest(`https://www.nodejs.sulla.hu/data/${id}`, "DELETE");
        let data = await MyRequest("https://www.nodejs.sulla.hu/data", "GET");
        ShowCards(data);
    });

    btn_szerkesztes.addEventListener("click", async () => {
        let data = await MyRequest(`https://www.nodejs.sulla.hu/data/${id}`, "GET");
        ShowForm();
        document.querySelector(".form input[placeholder='Name']").value = data.name;
        document.querySelector(".form input[placeholder='Location']").value = data.location;
        document.querySelector(".form input[placeholder='Price']").value = data.price;
        document.querySelector(".form input[placeholder='Minimum Nights']").value = data.minimum_nights;

        let csinaljadBtn = document.querySelector(".form button");
        csinaljadBtn.onclick = async () => {
            let name = document.querySelector(".form input[placeholder='Name']").value;
            let location = document.querySelector(".form input[placeholder='Location']").value;
            let price = document.querySelector(".form input[placeholder='Price']").value;
            let minimum_nights = document.querySelector(".form input[placeholder='Minimum Nights']").value;
            if (name != "" && location != "" && price != "" && minimum_nights != "") {
                let data = {
                    name: name,
                    location: location,
                    price: price,
                    minimum_nights: minimum_nights
                }
                MyRequest(`https://www.nodejs.sulla.hu/data/${id}`, "PUT", JSON.stringify(data));
                let response = await MyRequest("https://www.nodejs.sulla.hu/data", "GET");
                ShowCards(response);
            }
            else{
                alert("Minden mezőt ki kell tölteni!")
            }
        }
    });

    btn_szerkesztes.addEventListener("click", async () => {

    });
    return card;
}