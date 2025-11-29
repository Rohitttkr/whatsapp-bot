// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');

// // Client setup
// const client = new Client({
//     authStrategy: new LocalAuth(), // session save hoti hai, QR sirf ek baar
//     puppeteer: { headless: true } // true agar background me run karna hai
// });

// // QR code generate hone par terminal me dikhaye
// client.on('qr', (qr) => {
//     console.log('Scan the QR code:');
//     qrcode.generate(qr, { small: true });
// });

// // Successful login
// client.on('ready', () => {
//     console.log('✅ WhatsApp bot is ready!');
// });

// // Auto message example
// client.on('ready', async () => {
//     const number = '919311622527'; // target number
//     const chatId = number + '@c.us';
//     const message = 'Boss is Checking Something!';

//     let i = 9;

//     while(i < 10){
//         await client.sendMessage(chatId, message);
//         i++;
//     }

//     // Send message
//     // await client.sendMessage(chatId, message);
//     console.log(`Message sent to ${number}`);
// });

// // Start client
// client.initialize();



const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const fs = require('fs');

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// QR code
client.on('qr', qr => {
    console.log('Scan this QR code:');
    qrcode.generate(qr, { small: true });
});

// Bot ready
client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready!');
    scheduleMessages();
});

// Function to send message
async function sendMessage(numberOrGroupId, message) {
    try {
        await client.sendMessage(numberOrGroupId, message);
        console.log(`✅ Message sent to ${numberOrGroupId}`);
    } catch (err) {
        console.log('❌ Error sending message:', err);
    }
}

// Schedule messages based on messages.json
function scheduleMessages() {
    const messages = JSON.parse(fs.readFileSync('messages.json', 'utf-8'));

    messages.forEach(item => {
        const [hour, minute] = item.time.split(':');

        // cron format: 'm h * * *'
        const cronTime = `${minute} ${hour} * * *`;

        cron.schedule(cronTime, () => {
            sendMessage(item.number, item.message);
        });

        console.log(`Scheduled message to ${item.number} at ${item.time}`);
    });
}

// Initialize client
client.initialize();
