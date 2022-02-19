const fetchData = require("./fetchData");
const fs = require("fs") ;
const sqlite3 = require("sqlite3").verbose();
const { getFormatedDateBeforeNDays } = require("./utility");
const csv = require('@fast-csv/parse');

let db = new sqlite3.Database("data.sqlite", async (err) => {
    if (err) { console.error(err.message); return; }
    console.log("Database Connected");

    let config = require("./config.json");
    console.log(config);
    if(!config || config.initialLoad === false) {
        config = {
            initialLoad : true,
            lastUpdate  : Date.now()
        } ;
        fs.writeFile("./src/config.json",JSON.stringify(config),()=>{});

        db.serialize(async () => {
            db
            .run(
                `CREATE TABLE IF NOT EXISTS mutual_fund (
                    scheme_type TEXT,
                    fund_name TEXT,
                    scheme_code INTEGER,
                    scheme_name TEXT,
                    isin_div_payout_isin_growth TEXT,
                    isin_div_reinvestment TEXT,
                    net_asset_value NUMERIC,
                    repurchase_price NUMERIC,
                    sale_price NUMERIC,
                    date TEXT
                );`
            )
            .run('DELETE FROM mutual_fund');
            if(!fs.existsSync("mutual-fund-data.csv")){
                let data = await downloadData();
                fs.writeFile("mutual-fund-data.csv", data, function(err) {
                    if(err) return console.log(err);
                    console.log("File Downloaded");
                    parseCSVFile("mutual-fund-data.csv")
                });
            } else {
                parseCSVFile("mutual-fund-data.csv")
            }
        });
    } else {
        console.log("Downloading latest Data");
        let data = await downloadLatestData();
        fs.writeFile("latest.csv", data, function(err) {
            if(err) return console.log(err);
            console.log("File Downloaded");
            parseCSVFile("latest.csv")
        });
    }
});

async function downloadData(prev){
    let data = await fetchData(
        getFormatedDateBeforeNDays(60),
        getFormatedDateBeforeNDays(1),
    );
    return data ;
}

async function downloadLatestData(){
    let data = await fetchData(
        getFormatedDateBeforeNDays(1)
    );
    return data ;
}

function parseCSVFile(filePath){
    let currentScheme = "" 
    let currentFund = "" ;
    let count = 0;
    csv.parseFile(filePath,{delimiter:";"})
        .on('error', error => console.error(error))
        .on('data', row => {
            if(row.length === 1 ) {
                if(row[0].includes("Schemes")) 
                    currentScheme = row[0]
                else 
                    currentFund = row[0]
            } else if(row.length > 1) {
                if(currentScheme === "") return ;
                if(currentFund === "") return ;
                db.serialize(()=>{
                    db.run(`INSERT INTO mutual_fund VALUES (?,?,?,?,?,?,?,?,?,?);`,
                        currentScheme,currentFund,...row,
                        (e) => {
                            if(e) console.log(e,row);
                            console.log("Row Added",(count++));
                        }
                    )
                });
            }
        })
        .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));
}