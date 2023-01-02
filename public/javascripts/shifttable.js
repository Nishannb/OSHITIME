const ths= document.querySelectorAll('th')
const td= document.querySelectorAll('td')
const form = document.querySelector(".popup-form")
const table= document.querySelector('table')
const input= document.querySelector("#change")
const dateInput= document.querySelector("#date")
const nameInput= document.querySelector("#employ-name")
const submitBtn = document.querySelector(".submit")
const workPeriod = document.querySelector("#workPeriod")
const dropDownMenu = document.querySelector("#timeperiod")







for (tds of td){   
    tds.addEventListener("dblclick", async function(e){
        input.value= e.srcElement.innerHTML
        dateInput.value =(table.rows[0].children[this.cellIndex]).innerHTML
        nameInput.value=(table.rows[this.parentElement.rowIndex].children[0]).innerHTML 
        // workPeriod.value = dropDownMenu.value
        form.style.top=`${e.clientY}px`
        form.style.left=`${(e.clientX)}px`
        form.classList.toggle("show")
    })
}


// Initial week period display //

// let date = Date()
// for (i=86400000; i<=518400000; i= i + 86400000){
//     if (String(date).slice(0,3) !=='Mon'){
//         date = Date.now() + i
//         date = new Date(date)
//     }
// }

// date = String(date).slice(0,15)
// let testDate = new Date(date).getTime() + 518400000
// testDate = new Date(testDate)

// dateDisplay.innerHTML = `${date} - ${String(testDate).slice(0,15)}`

// // Initial week period display //

// let addedMilSecond = 0
// const tableHeading = function (){
//     for (let th of ths){
//         let tableHeading = dateDisplay.innerHTML.slice(0,15)
//         tableHeading= new Date(tableHeading).getTime()
//         if(th.innerHTML !== "Name/Day"){
//             tableHeading = tableHeading + addedMilSecond
//             th.innerHTML = String(new Date (tableHeading)).slice(0,10)
//             addedMilSecond = addedMilSecond + 86400000
//         }
//     }
// addedMilSecond =0
// }

// tableHeading()

// submitBtn.addEventListener('click', function(e){
//     e.preventDefault()
//     form.classList.toggle("show")

//     //access table data
//     console.log(this.parentNode[0].value)
//     console.log(this.parentNode[1].value)
//     console.log(this.parentNode[2].value)
//     //access table data
// })

