
let date = new Date()

let mode = "board"

let filter_select = -1

let log = [] //масив для записей изменений юзером(лог работы)

let img = ["img/1.jpg","img/2.jpg","img/3.jpg","img/4.jpg","img/5.jpg","img/6.jpg",]

let cards = [
    ['title1','01.02.2022','Lorem ipsum1',[1,0],0],
    ['title2','01.02.2022','Lorem ipsum2',[0,1],0],
    ['title3','01.02.2022','Lorem ipsum3',[],0]
]

let boards=[
    ['To do','#fbf2f2',[0]],
    ['Doing','#fbf2f2',[1]],
    ['Done','#fbf2f2',[2]]
]

let tags=[
    '#f55',
    '#4ad',
    '#5f5',
    '#ff5'
]

let users=[]

$.ajax({
    url: 'https://randomuser.me/api/?inc=gender,name,picture&results=5',
    dataType: 'json',
    success: function(data) {
      for(let i=0;i<=data.info.results-1;i++ ){
        users.push([data.results[i].name.first+' '+data.results[i].name.last,data.results[i].gender,data.results[i].picture.thumbnail])  
    }
    user_update() 
   update_window() 
    }
});

function clear_mama(){ 
    document.querySelector(".mama").innerHTML = ""
}

function change_filter(val){
    let tag_sel = tags.indexOf(val) 
    if(tag_sel!=-1){
        filter_select=tag_sel
        update_window()
    } else {
        filter_select=-1
        update_window()
    }
}

function change_mode(val){
    mode = val
    update_window()
}

function create_boards(){
    let mama        = document.querySelector('.mama'),
        board_tmp   = document.querySelector('#board_tmp'),
        card_tmp    = document.querySelector('#card_tmp'),
        filter      = document.querySelector(".filter"), 
        temp_fil    = "<option selected> tag filter </option>";

    filter.innerHTML = ""

    if(filter_select==-1){
        tags.forEach(e=>{ 
            temp_fil += `<option style="background-color:${e};">${e}</option>`
        })
    } else {
        temp_fil    = "<option>tag filter</option>"
        for (var i = 0; i < tags.length; i++) {
            if(i!=filter_select){
                temp_fil += `<option style="background-color:${tags[i]};">${tags[i]}</option>`
            } else {
                temp_fil += `<option selected style="background-color:${tags[i]};">${tags[i]}</option>`
            }
            
        }
    }

    filter.insertAdjacentHTML("afterbegin", temp_fil) 



    if('content' in document.createElement('template')){
        for (let i = 0; i <= boards.length - 1; i++) {
            let clone_board = board_tmp.content.cloneNode(true);

            clone_board.querySelector('.content__board').id = `b${i}` 
            clone_board.querySelector('.board').style = `background-color: ${boards[i][1]};`
            clone_board.querySelector('a').setAttribute('onclick',`modal_opent('edit_board',${i})`)
            clone_board.querySelector('h1').innerHTML =boards[i][0]
            clone_board.querySelector('.add_card').setAttribute('onclick',`modal_opent('create_card',${i})`)

            if (boards[i][2].length!=0) {
                for (let j = 0; j <= boards[i][2].length - 1; j++) {
                    if(filter_select==-1 || cards[boards[i][2][j]][3].indexOf(filter_select)!=-1){
                        let clone_card=card_tmp.content.cloneNode(true)
                       
                        clone_card.querySelector('p').innerHTML=cards[boards[i][2][j]][0]
                        clone_card.querySelector('.avatar').src = users[cards[boards[i][2][j]][4]][2]
                        clone_card.querySelector(".fa-align-left").setAttribute('onclick',`modal_opent('edit_card',${boards[i][2][j]})`)

                        clone_card.querySelector('.card').id = "c"+boards[i][2][j] 
                        cards[boards[i][2][j]][3].forEach(element=>{
                            let tag = document.createElement("div")
                            tag.className = "tag"
                            tag.style = `background-color: ${tags[element]};`
                            clone_card.querySelector('.tags').appendChild(tag)
                        })
                        clone_card.querySelector(".data").append(cards[boards[i][2][j]][1])
                        clone_board.querySelector('.content__board').appendChild(clone_card) 
                    }
                }
            }
            mama.appendChild(clone_board)
        }
    }
}

function pre_create_card(id_board){
    let in_title        = document.getElementById("in_title"),
        in_description  = document.getElementById("in_description"),
        in_date         = document.getElementById("in_date"),
        select_user     = document.getElementById("select_user"),
        select_tag      = document.getElementById("select_tag"),
        ds              = in_date.value.split("-"),
        l_tags          = [],
        user_id         = 0;


    select_tag.value.split(",").forEach(e=>{
        if (e!="") {l_tags.push(parseInt(e, 10))}
    })
    for (let i = 0; i < users.length; i++) { 
        if(users[i][0]==select_user.value){
            user_id = i
        }
    }

    if (in_title.value!="" && check_title(in_title.value) && in_description.value!="" && check_date(in_date.value) && boards[id_board][2].length<10) { //проверки
        cards.push([in_title.value, `${ds[2]}.${ds[1]}.${ds[0]}` ,in_description.value, l_tags, user_id]) 
        boards[id_board][2].push(cards.length-1) 
        log.push("Создана задача - "+in_title.value) 
        update_window()
        modal_close()
    }

}

function check_title(title, id=-1){ // что бы не повторялось имя карточки
    let flip = true

    for (var i = 0; i < cards.length; i++) {
        if((id==-1 && cards[i][0]==title) || (parseInt(id,10)!=i && cards[i][0]==title)){
            flip = false;
            alert("Имя занято")
        }
    }
    return flip;
}
function check_date(ldate){ // проверка даты 
    let ds = ldate.split("-"),
        flip = false;
    if (parseInt(ds[0],10)>date.getFullYear()-1 ) {
        if (parseInt(ds[1],10)>date.getMonth()+1 ) {
            flip = true
        } else if (parseInt(ds[1],10)==date.getMonth()+1 && parseInt(ds[2],10)>date.getDate()-1) {
            flip = true
        } else {
            alert("Date < new")
        }
    } else {
        alert("Date < new")

    }
    return flip;
}

function modal_opent(mod,id=0) {
    let modal   = document.querySelector('.modal'),
        overlay = document.querySelector('.overlay'),
        content = document.querySelector('.modal__content')
        title   = modal.querySelector("h2");

    modal.classList.add("active")
    overlay.classList.add("active")
    if(mod=="users"){
        title.innerHTML = "Users";
        let ul = document.createElement("ul"),
            a  = document.createElement("a");
        a.classList.add("add_user")
        a.setAttribute("href","#")
        a.setAttribute("onclick", "add_user()")
        a.innerHTML = "Add user"
        ul.classList.add("list_users")
        content.appendChild(ul)
        content.appendChild(a)
        user_update()
    } else if(mod=="create_card") {
        title.innerHTML = "Create new task";

        let user_sel = "",
            tag_sel = "";
        users.forEach(e=>{
            user_sel += `<option>${e[0]}</option>`        
        })
        for (var i = 0; i < tags.length; i++) {
            tag_sel += `<div class="tag_sel" id="t${i}" onclick="select_tag(${i})" style="background-color: ${tags[i]};"></div>`  
        }

        let temp = `
        <ul>
            <li>
                <p>
                    <label htmlFor="in_title">
                    Title
                    </label>
                    <input type="text" maxlength="20" name="in_title" id="in_title">
                </p>
            </li>
            <li>
                <p>
                    <label htmlFor="in_description">
                    Description
                    </label>
                    <textarea maxlength="2000" name="in_description" id="in_description"></textarea>
                </p>
            </li>
            <li>
                <p>
                    <label htmlFor="in_date">
                    Date
                    </label>
                    <input type="date" value="${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}" min="${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}" name="in_date" id="in_date">
                </p>
            </li>
            <li>
                <p>
                    <label htmlFor="select_user">
                    Select user
                    </label>
                    <select name="select_user" id="select_user">
                    ${user_sel}
                    </select>
                </p>
            </li>
            <li>
                <p>
                    <div class="tags">
                        ${tag_sel}
                    </div>
                    <input type="hidden" name="select_tag" id="select_tag" value="">
                </p>    
            </li>
            <li>
                <p>
                    <input type="button" onclick="pre_create_card(${id})" value="Create card">
                </p>    
            </li>
        </ul>
        `
        

        content.insertAdjacentHTML("afterbegin", temp)

    } else if(mod=="setting") {
        title.innerHTML = "Setting";
        let tag_sel = "",
            img_sel = "",
            log_li ='';
        log.forEach(e=>{ 
            log_li+=`<li>${e}</li>`
        })
        for (var i = 0; i < tags.length; i++) {
            tag_sel += `<div class="tag_sel" id="t${i}" onclick="del_tag(${i})" style="background-color: ${tags[i]};"></div>`  
        }
        for (var i = 0; i < img.length; i++) {
            img_sel += `<div class="img_sel" id="i${i}" onclick="select_img(${i})" style="background-image: url(${img[i]});"></div>`  
        
        }
        let temp = `
            <ul>${log_li}</ul>
            <div class="tags" id="tag__setings">
                ${tag_sel}
            </div>
            <ul>
                <li>
                    <p>
                        <input type="color" id="color_tag" value="">
                    </p>    
                </li>  
                <li>
                    <p>
                        <input type="button" onclick="create_tag()" value="Create tag">
                    </p>    
                </li>
            </ul>
            <div class="img" id="img__setings">
                ${img_sel}
            </div>
            `
        content.insertAdjacentHTML("afterbegin", temp)
    } else if(mod=="edit_board"){
        title.innerHTML = `Edit board ${boards[id][0]}`
        let temp = `
            <ul>
                <li>
                    <p>
                        <input type="color" id="color_board" value="${boards[id][1]}">
                    </p>    
                </li>  
                <li>
                    <p>
                        <input type="button" onclick="change_color_board(${id})" value="Save">
                    </p>    
                </li>
                <li>
                    <p>
                        <input type="button" onclick="delete_board(${id})" value="Delete">
                    </p>    
                </li>
            </ul>`

        content.insertAdjacentHTML("afterbegin", temp)
    } else if(mod=="create_board"){
        title.innerHTML = `Create board`
        let temp = `
            <ul>
                <li>
                    <p>
                        <input type="text" id="title_board" value="">
                    </p>    
                </li>  
                <li>
                    <p>
                        <input type="button" onclick="create_board()" value="create">
                    </p>    
                </li>
            </ul>`

        content.insertAdjacentHTML("afterbegin", temp)
    }else if(mod=="edit_card") {
        title.innerHTML = "Edit task "+cards[parseInt(id,10)][0];

        let user_sel = "",
            tag_sel = "";
        users.forEach(e=>{
            if(users[cards[id][4]][0]==e[0]){
                user_sel += `<option selected>${e[0]}</option>` 
            } else{
                user_sel += `<option>${e[0]}</option>` 
            }
        })
        for (var i = 0; i < tags.length; i++) {
            if(cards[id][3].indexOf(i)!=-1){
                tag_sel += `
                <div class="tag_sel" id="t${i}" onclick="select_tag(${i})" style="background-color: ${tags[i]};">
                    <i class="fas fa-check"></i>
                </div>`  
            } else {
                tag_sel += `<div class="tag_sel" id="t${i}" onclick="select_tag(${i})" style="background-color: ${tags[i]};"></div>`  
            }
        }

        let temp = `
        <ul>
            <li>
                <p>
                    <label htmlFor="in_title">
                    Title
                    </label>
                    <input type="text" maxlength="20" name="in_title" id="in_title" value="${cards[id][0]}">
                </p>
            </li>
            <li>
                <p>
                    <label htmlFor="in_description">
                    Description
                    </label>
                    <textarea maxlength="2000" name="in_description" id="in_description" >${cards[id][2]}</textarea>
                </p>
            </li>
            <li>
                <p>
                    <label htmlFor="in_date">
                    Date
                    </label>
                    <input type="date" value="${cards[id][1].split(".")[2]}-${cards[id][1].split(".")[1]}-${cards[id][1].split(".")[0]}" min="${date.getFullYear()}-0${date.getMonth()+1}-${date.getDate()}" name="in_date" id="in_date">
                </p>
            </li>
            <li>
                <p>
                    <label htmlFor="select_user">
                    Select user
                    </label>
                    <select name="select_user" id="select_user">
                    ${user_sel}
                    </select>
                </p>
            </li>
            <li>
                <p>
                    <div class="tags">
                        ${tag_sel}
                    </div>
                    <input type="hidden" name="select_tag" id="select_tag" value="${cards[id][3]}">
                </p>    
            </li>
            <li>
                <p>
                    <input type="button" onclick="save_edit_card(${id})" value="Save card">
                </p>    
            </li>
            <li>
                <p>
                    <input type="button" onclick="delete_card(${id})" value="Delete card">
                </p>    
            </li>
        </ul>
        `
        

        content.insertAdjacentHTML("afterbegin", temp)

    }
}

function delete_card(id){
    log.push(`Удалина task ${cards[parseInt(id,10)][0]}`)
    cards.splice(parseInt(id,10),1)
    boards.forEach(e=>{
        if(e[2].indexOf(id)!=-1){
            e[2].splice(e[2].indexOf(id),1)
        }
    })
    update_window()
    modal_close()
}

function save_edit_card(id){
    let in_title        = document.getElementById("in_title"),
        in_description  = document.getElementById("in_description"),
        in_date         = document.getElementById("in_date"),
        select_user     = document.getElementById("select_user"),
        select_tag      = document.getElementById("select_tag"),
        ds              = in_date.value.split("-"),
        l_tags          = [],
        user_id         = 0;


    select_tag.value.split(",").forEach(e=>{
        if (e!="") {l_tags.push(parseInt(e, 10))}
    })
    for (var i = 0; i < users.length; i++) {
        if(users[i][0]==select_user.value){
            user_id = i
        }
    }

    if (in_title.value!="" && check_title(in_title.value,id) && in_description.value!="" && check_date(in_date.value)) {
        cards[id] = [in_title.value, `${ds[2]}.${ds[1]}.${ds[0]}` ,in_description.value, l_tags, user_id]
        log.push("изменена задача - "+in_title.value)
        update_window()
        modal_close()
    }
}

function create_board(){ //запись нового борда в масив
    let title = document.getElementById("title_board").value,
        flip  = true;
    boards.forEach(e=>{
        if(e[0]==title){
            flip = false
        }
    })
    if(flip && boards.length<6){
        boards.push([title, '#fbf2f2',[]])
        log.push("Создан борд с именем: "+title)
        update_window()
        modal_close()
    } else {
        alert("Имя занято или максимум бордов!")
    }
}

function change_color_board(id){
    boards[parseInt(id,10)][1] = document.getElementById("color_board").value
    log.push(`Цвет у доски ${boards[parseInt(id,10)][0]} изменён на: `+document.getElementById("color_board").value)
    update_window()
}

function delete_board(id){
    if([0,1,2].indexOf(parseInt(id,10))!=-1){
        alert("Нельзя удалять первые 3 борда!")
    } else if (boards[parseInt(id,10)][2].length==0) {
        log.push(`Удалина доска ${boards[parseInt(id,10)][0]}`)
        boards.splice(parseInt(id,10),1)
        update_window()
        modal_close()
    } else {
        alert("Нельзя удалять не пустой борд!")
    }
}

function create_tag(){
    let in_tag = document.querySelector("#color_tag")
    if (!tags.includes(in_tag.value) && tags.length<10) {
        tags.push(in_tag.value)
        log.push(`Создан тег с цветом: ${in_tag.value}`)
        fill_tags()
    } else {
        alert(in_tag.value)
    }
    
}

function fill_tags(){
    let setting_tags = document.querySelector("#tag__setings")
    setting_tags.innerHTML=""
    let tag_sel = "";
    for (var i = 0; i < tags.length; i++) {
        tag_sel += `<div class="tag_sel" id="t${i}" onclick="del_tag(${i})" style="background-color: ${tags[i]};"></div>`  
    }
    setting_tags.insertAdjacentHTML("afterbegin",tag_sel) 
}

function del_tag(id){
    if(tags.length>2){
        if (confirm("Удалить "+ ++id)) {
            log.push(`Удалён tag: ${tags[--id]}`)
            tags.splice(id,1)

            cards.forEach(e=>{
                if(e[3].indexOf(id)!=-1){
                    e[3].splice(e[3].indexOf(id),1)
                }
                e[3].forEach(el=>{
                    if(el>=id){
                        el-=1
                    }
                })
            })

            fill_tags()
            update_window()
        }
    }
}

function modal_close(){
    let modal   = document.querySelector('.modal'),
        overlay = document.querySelector('.overlay'),
        content = document.querySelector('.modal__content');

        modal.classList.remove("active")
        overlay.classList.remove("active")
        setTimeout(function() {content.innerHTML = ""}, 400);
        

}
function select_img(id){
    let body    = document.querySelector("body"),
        limg     = document.querySelector("#i"+id),
        img_sel = document.querySelectorAll(".img_sel");
    img_sel.forEach(e=>{
        e.innerHTML = ""
    })

    limg.insertAdjacentHTML("afterbegin", `<i class="fas fa-check"></i>`)

    body.style = `background-image: url(${img[id]});`


}

function select_tag(id){
    let in_select = document.querySelector("#select_tag"),
        tag_sel   = document.querySelector("#t"+id);
    if(in_select.value!=""){
        if (in_select.value.split(",")[1]!=null) {
            if(in_select.value.split(",")[0]==id){
                if(in_select.value.split(",")[1]!=null){
                in_select.value = `${in_select.value.split(",")[1]}`
                tag_sel.innerHTML = ""
                } else {
                    in_select.value = ""
                    tag_sel.innerHTML = ""
                }
            } else if (in_select.value.split(",")[1]==id){
                in_select.value = `${in_select.value.split(",")[0]}`
                tag_sel.innerHTML = ""
            } else {
                alert("Tag max 2")
            }
        } else if(in_select.value.split(",")[0]==id){
            in_select.value = ""
            tag_sel.innerHTML = ""
        } else {
            in_select.value = `${in_select.value.split(",")[0]},${id}`
            tag_sel.insertAdjacentHTML("afterbegin", `<i class="fas fa-check"></i>`)
        }
    } else {
        in_select.value = id
        tag_sel.insertAdjacentHTML("afterbegin", `<i class="fas fa-check"></i>`)
    }
}


function user_delit(k){
    if(users.length>1){
        log.push(`Удалён пользователь: ${users[k][0]}`)
        cards.forEach(e=>{
            if(e[4]==k)
            e[4]=0
        })
        users.splice(k,1)
        user_update()
        update_window()
    } else {
        alert("Должен быть хотя бы 1 пользователь!")
    }
}

function user_update(){ //перерисовуем везде где есть юзер
    let users_UI    = document.querySelector(".users"),
        list_user   = document.querySelector(".list_users");

    users_UI.innerHTML = "";
    if (list_user!=null) {
        list_user.innerHTML = ""
    }

    users.forEach(element => {
        let avatar = document.createElement("img");
        avatar.classList.add("avatar")
        avatar.src = element[2]

        users_UI.appendChild(avatar);
        if (list_user!=null) {
            let li     = document.createElement("li")
                avatar = document.createElement("img"),
                p      = document.createElement("p"),
                a      = document.createElement("a");

            avatar.classList.add("avatar")
            avatar.src = element[2]

            p.innerHTML = `${element[0]} ${element[1]}`

            a.innerHTML = 'X'
            a.setAttribute("href","#")
            a.setAttribute("onclick", `user_delit(${document.querySelector('.list_users').querySelectorAll('li').length})`);
            
            li.appendChild(avatar)
            li.appendChild(p)
            li.appendChild(a)

            list_user.appendChild(li)
        }
    });
}


function add_user(){
    if (users.length<10){
    $.ajax({
        url: 'https://randomuser.me/api/?inc=gender,name,picture&results=1',
        dataType: 'json',
        success: function(data) {
          for(let i=0;i<=data.info.results-1;i++ ){
            users.push([data.results[i].name.first+' '+data.results[i].name.last,data.results[i].gender,data.results[i].picture.thumbnail])  
        }
        log.push(`Добавлен пользователь: ${users[users.length-1][0]}`)
        user_update()
        }
      });
    } else {
        alert("Max users!")
    }
}



function dragstart_handler(ev) { //то что берём
    ev.dataTransfer.setData("application/my-app", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
}
function dragover_handler(ev) { //над чем проводим
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move"
}
function drop_handler(ev) { //куда вставляем
    ev.preventDefault();
    const data = ev.dataTransfer.getData("application/my-app");
    

    let re = new RegExp("b[0-9]")//шаблон что бы найти айдишник борды

    if(ev.target.parentElement.id.search(re)!=-1){ 
        //серидина карточки
        let center = ev.target.getBoundingClientRect().y+(ev.target.getBoundingClientRect().height/2)
        if(center>ev.clientY)
            {//поиск координаты мышки
            ev.target.parentElement.insertBefore(document.getElementById(data),ev.target);
        } else {
            //вставляем после этой карточки
            ev.target.parentElement.insertBefore(document.getElementById(data),ev.target.nextSibling);
        }
        let board = ev.target.parentElement
        boards[parseInt(board.id.substring(1),10)][2]=[]
        for(let i = 0; i<=board.children.length-1; i++){
            boards[parseInt(board.id.substring(1),10)][2].push(parseInt(board.children[i].id.substring(1),10))
        }
        for (let i = 0; i < boards.length; i++) {
            if(i!=parseInt(board.id.substring(1),10)){
                let ind = boards[i][2].indexOf(parseInt(data.substring(1),10))
                if(ind!=-1){
                    boards[i][2].splice(ind,1)
                }
            }
        }
        
    } else if (ev.target.id.search(re)!=-1){
        ev.target.appendChild(document.getElementById(data));
        let board = ev.target
        boards[parseInt(board.id.substring(1),10)][2]=[]
        for(let i = 0; i<=board.children.length-1; i++){
            boards[parseInt(board.id.substring(1),10)][2].push(parseInt(board.children[i].id.substring(1),10))
        }
        for (let i = 0; i < boards.length; i++) {
            //проверяем что бы не дублировались карточки
            if(i!=parseInt(board.id.substring(1),10)){
                let ind = boards[i][2].indexOf(parseInt(data.substring(1),10))
                if(ind!=-1){
                    boards[i][2].splice(ind,1)
                }
            }
        }
    }
}


function update_window(){
    clear_mama()
    if(mode=="board"){
        create_boards()
    } else {
        create_calendar()
    }
}



function create_calendar(){
    let cal_date = new Date() //создание нового экзэмпляра даты
    let mama = document.querySelector('.mama'),
        temp = "";
    temp = `<table border="1">
                <caption>Calendar 0${cal_date.getMonth()+1}.${cal_date.getFullYear()}</caption>
                <tr>
                <th>Sunday</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
            </tr>`
    for (let i = 0; i < 6; i++) {
        temp += "<tr>"
        for (let j = 0; j < 7; j++) {
            if (cal_date.getDay()==j ) {
                temp+=`<th><ul><li>${cal_date.getDate()}</li>`
                cards.forEach(e=>{
                    let d = e[1].split(".")
                    if(cal_date.getDate()==parseInt(d[0],10) && cal_date.getMonth()+1==parseInt(d[1],10) && cal_date.getFullYear()==parseInt(d[2],10)){
                        temp+=`<li>${e[0]}</li>`
                    }
                })
                temp+="<ul></ul></th>"
                cal_date.setDate(cal_date.getDate()+1)
            } else {
                temp+=`<th>   </th>`
            }
        }
        temp += "</tr>"

    }
            

    temp+="</table>"


    mama.insertAdjacentHTML("afterbegin",temp)
}




