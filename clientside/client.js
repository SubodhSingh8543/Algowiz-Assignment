
const WebSocket = require('ws');
require("dotenv").config();

const client = new WebSocket(`${process.env.URL.trim()}`);
let receivedUpdates = [];
let orderBook = {};
let timeid;
let count = 0;
let tempStr = []

const isDuplicateOrRedundant = (update) => {
    return receivedUpdates.some(existingUpdate =>
        existingUpdate.AppOrderID === update.AppOrderID &&
        existingUpdate.price === update.price &&
        existingUpdate.triggerPrice === update.triggerPrice &&
        existingUpdate.priceType === update.priceType &&
        existingUpdate.productType === update.productType &&
        existingUpdate.status === update.status &&
        existingUpdate.exchange === update.exchange &&
        existingUpdate.symbol === update.symbol
    );
};

const determineAction = (update) => {
    if (orderBook[update.AppOrderID]) {
        if (update.status === 'complete' && update.priceType === 'MKT') return 'modifyOrder';
        if (update.status === 'open' && update.priceType === 'LMT') return 'modifyOrder';
        if (update.status === 'pending' && (update.priceType === 'SL-LMT' || update.priceType === 'SL-MKT')) return 'modifyOrder';
    } else {
        if (update.status === 'complete' && update.priceType === 'MKT') return 'placeOrder';
        if (update.status === 'open' && update.priceType === 'LMT') return 'placeOrder';
        if (update.status === 'pending' && ['SL-LMT', 'SL-MKT'].includes(update.priceType)) return 'placeOrder';
        if (update.status === 'cancelled' && ['LMT', 'SL-LMT', 'SL-MKT'].includes(update.priceType)) return 'cancelOrder';
    }
    return null;
};

const logActivity = (activity, orderID) => {
    const timestamp = new Date().toISOString();
    console.log(`At ${timestamp}: ${activity} for order ID ${orderID}`);
};

const handleUpdate = (update) => {
    if (!isDuplicateOrRedundant(update)) {
        receivedUpdates.push(update);
        tempStr.push(update);
        const action = determineAction(update);
        if (action) {
            logActivity(`Action taken: ${action}`, update.AppOrderID);
            orderBook[update.AppOrderID] = update;
        }
    } else {
        logActivity('Filtered redundant update', update.AppOrderID);
    }
};

timeid = setInterval(() => {
    if (tempStr.length > 0) console.log(tempStr[tempStr.length - 1]);
    tempStr = [];
}, 1000)

client.on('message', (data) => {

    // console.log("\n");
    const parsedData = JSON.parse(data);
    handleUpdate(parsedData.update);
    console.log(parsedData.logs + "\n");

});

client.on('open', () => {
    console.log('WebSocket client connected');
});

client.on('close', () => {
    clearInterval(timeid);
    console.log('WebSocket client disconnected');
});

client.on('error', (error) => {
    clearInterval(timeid);
    console.error(`WebSocket error: ${error}`);
});
