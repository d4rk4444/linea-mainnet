import axios from "axios";
import { table } from "table";
import { log, privateToAddress } from "../src/other.js";
import { getProvider } from "../src/web3.js";
import { randomSwapETHToTokenAll } from "./random.js";
import * as dotenv from "dotenv";
dotenv.config();

const dataProject = {
    Sync: '0x80e38291e06339d10AAB483C65695D004dBD5C69',
    LineaSwap: '0x3228d205A96409a07A44D39916b6EA7B765D61F4',
    Echo: '0xF82537FB6c56A3b50092d3951f84F5F6c835b4F5',
    Horizen: '0x272E156Df8DA513C69cB41cC7A99185D53F926Bb',
    Izumi: '0x032b241De86a8660f1Ae0691a4760B426EA246d7',
    Lineans: '0xda4c3eb39707ad82ea7a31afd42bdf850fed8f41',
};

const getDayWeekMonthStat = async(data) => {
    let days = [];
    let weeks = [];
    let months = [];
    let firstTx;
    let lastTx;

    let firstDate = new Date(data[0].timeStamp * 1000);
    for (let i = 0; i < data.length; i++) {
        const txInfo = data[i];
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const currentDate = new Date(data[i].timeStamp * 1000);

        if (txInfo.txreceipt_status == '1') {
            const date = new Date(txInfo.timeStamp * 1000);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            const dayN = `${day}-${month}-${year}`;
            const monthN = `${month}-${year}`;

            if (!days.includes(dayN)) {
                days.push(dayN);
            }
            if (!months.includes(monthN)) {
                months.push(monthN);
            }

            const diffDate = Math.abs(firstDate - currentDate);
            if (diffDate >= oneWeek) {
                weeks.push(data[i].timeStamp);
                firstDate = currentDate;
            }

            if (i == 0) {
                firstTx = dayN;
            } else if (i == data.length - 1) {
                lastTx = dayN;
            }
        }
    }

    const dayWeekMonth = `${days.length}/${weeks.length}/${months.length}`;

    return { firstTx, lastTx, dayWeekMonth };
}

export const getStatsTable = async(doTx, arrAddress) => {
    const w3 = getProvider();
    const API = process.env.LINEASCAN_API_KEY;

    let dataTabl = [];
    const title = ['#', 'address', 'n tx', 'first tx', 'last tx', 'd/w/m'];
    for (const project in dataProject) {
        title.push(project);
    }
    dataTabl.push(title);

    for (let i = 0; i < arrAddress.length; i++) {
        const address = privateToAddress(arrAddress[i]);
        const url = `https://api.lineascan.build/api?module=account&action=txlist&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=${API}`;
        const data = (await axios.get(url)).data.result;
        const contracts = Object.values(dataProject);

        let dataAddress = [i + 1, address, data.length];
        for (let i = dataAddress.length; i < title.length; i++) {
            dataAddress.push(0);
        }
        if (data.length != 0) {
            const dataDate = await getDayWeekMonthStat(data);
            dataAddress.splice(3, 3, dataDate.firstTx, dataDate.lastTx, dataDate.dayWeekMonth);
        }
        dataTabl.push(dataAddress);

        for (const txInfo of data) {
            if (txInfo.txreceipt_status == '1' && contracts.includes(w3.utils.toChecksumAddress(txInfo.to))) {
                const index = contracts.findIndex(e => e == w3.utils.toChecksumAddress(txInfo.to));
                dataAddress[6 + index] += 1;
            }
        }

        if (i == arrAddress.length - 1 && doTx) {
            const arrActivity = dataAddress.slice(6, contracts.length - 1);
            const zeroActivityProject = [];
            for (let n = 0; n < arrActivity.length; n++) {
                if (arrActivity[n] == 0) {
                    zeroActivityProject.push(Object.keys(dataProject)[n]);
                }
            }

            if (zeroActivityProject.length == 0) {
                log ('log', 'You don\'t have projects without activity', 'yellow');
            } else {
                log('info', `Projects with 0 activity: ${zeroActivityProject}`);
                await randomSwapETHToTokenAll(zeroActivityProject, arrAddress[i]);
            }
        }
    }
    
    if (!doTx) {
        log('info', `\n${table(dataTabl)}`);
    }
}