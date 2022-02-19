const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getFormatedDateBeforeNDays(days){
    let today = new Date().getTime() ;
    let beforeNDay = today - days * 86400000 ;
    return formatDate(new Date(beforeNDay)) ;
}

function formatDate(date) {
   return  `${date.getDate().toString().padStart(2,"0")}-${monthNames[date.getMonth()]}-${date.getFullYear()}` ;
}

module.exports = {
    getFormatedDateBeforeNDays
}