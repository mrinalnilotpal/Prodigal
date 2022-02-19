const { default: axios } = require("axios");

async function fetchData(fromDate,toDate=null){
    let URL = `https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?frmdt=${fromDate}` ;
    
    if(toDate)
        URL = `${URL}&todt=${toDate}` ;
    
    console.log(URL)

    try {
        let res  = await axios(URL);
        return res.data ;
    } catch(error) {
        console.error(error);
        return null ;
    }
}

module.exports = fetchData ;