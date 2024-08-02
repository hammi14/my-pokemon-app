import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import os from 'os';
import { router } from './routes';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', router);

// Get the local IP address
const networkInterfaces = os.networkInterfaces();
let localIp = '127.0.0.1'; // Default to localhost

for (const key in networkInterfaces) {
    const networkInterface = networkInterfaces[key];
    if (networkInterface) { // Check if networkInterface is defined
        for (const iface of networkInterface) {
            if (iface.family === 'IPv4' && !iface.internal) {
                localIp = iface.address;
                break;
            }
        }
    }
}

app.listen(3000, '0.0.0.0', () => {
    console.log(`Server running on http://${localIp}:3000`);
});


// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import { router } from './routes';

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// app.use('/api', router);

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });
