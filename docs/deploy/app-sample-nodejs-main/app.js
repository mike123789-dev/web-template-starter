const express = require('express');
const process = require('process');
const logger = require('morgan');
const fs = require('fs');
const ms = require('ms');
const prometheus = require('prom-client');
const path = require('path');

const config = {
    port: process.env.PORT || 80,
    managerPort: process.env.MANAGE_PORT || 16122,
    accessLogWriteStream: getWriteStream(process.env.ACCESS_LOG_PATH),
    appLogWriteStream: getWriteStream(process.env.APP_LOG_PATH),
    appName: process.env.N3R_APP_NAME || "unknown",
    revision: process.env.N3R_APP_POD_REVISION || "unknown",
    podName: process.env.N3R_POD_NAME || "nobody",
    ready: false,
    alive: false,
}

const register = new prometheus.Registry();
register.setDefaultLabels({
    app: 'sample'
});
prometheus.collectDefaultMetrics({ register });

const app = express();

function getWriteStream(filePath) {
    if (filePath === undefined){
        return process.stdout
    }

    const logStream = fs.createWriteStream(filePath, { flags: 'a' });
    fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
        if (err) {
            console.error('Failed to create directory:', err);
            process.exit(1);
        }});
    return logStream
}
function createLogger() {

    const accessLogger = logger('combined', { stream: config.accessLogWriteStream });
    const appLogger = logger((tokens, req, res) => {
        const { body } = req;
        if (body && body.input) {
            return body.input;
        }
        return null;
    }, { stream: config.appLogWriteStream });

    return { accessLogger, appLogger };
}

const { accessLogger, appLogger } = createLogger();

app.use(accessLogger);
app.use(appLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
            <p>값을 입력하시면 화면에 출력되고 logs에서 확인하실 수 있습니다.</p>
            <form id="input-form">
                <label for="input">Enter text:</label>
                <input type="text" id="input" name="input">
                <br><br>
                <button type="submit">Submit</button>
            </form>
            <div id="result"></div>
            <script>
                // Handle form submission with JavaScript
                document.getElementById("input-form").addEventListener("submit", function(e) {
                    e.preventDefault(); // prevent default form submission
                    let input = document.getElementById("input").value;
                    let resultDiv = document.getElementById("result");
                    resultDiv.appendChild(document.createTextNode("You entered: " + input));
                    resultDiv.appendChild(document.createElement("br")); // create a line break
                    document.getElementById("input").value = ""; // clear the input box
                    fetch('/submit', { // send the user input to the server
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'input=' + input,
                    });
                });
            </script>
        `);
});

app.post('/submit', (req, res) => {
    res.send();
});

app.get('/identity', (req, res) => {
    res.send(`${config.appName}:${config.revision}:${config.podName}`);
});

app.get('/dump', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${req.method} ${req.url} ${JSON.stringify(req.headers)}\n\n${JSON.stringify(req.body)}`);
});

const playground = "/playground";

app.get(playground + '/sleep', async (req, res) => {
    const duration = req.query.duration || "1s";
    const d = parseDuration(duration);
  
    await sleep(d);
    res.send(`${config.podName} woke up after sleeping ${duration}`);
});

app.get(playground + '/cpu', async (req, res) => {
    const length = req.query.length || "1";
    const l = parseInt(length);
  
    const s = Date.now();
    for (let k = 0; k < l; k++) {
      for (let i = 0; i < 2147483647; i++) {
      }
    }
    const d = Date.now() - s;
    res.send(`${config.pod} burned cpu for ${d}ms`);
});


const manager = express();

manager.use(logger('dev'));

manager.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    let metrics = await register.metrics();
    res.send(metrics);
});

manager.get('/ready', (req, res) => {
    if(config.ready) {
        res.send('i\'m ready');
    } else {
        res.status(503).send('i\'m not ready');
    }
});

manager.get('/ready/on', (req, res) => {
    config.ready = true
    res.send('i\'m ready');
});

manager.get('/ready/off', (req, res) => {
    config.ready = false
    res.send('i\'m not ready');
});

manager.get('/alive', (req, res) => {
    if(config.alive) {
        res.send('i\'m alive');
    } else {
        res.status(503).send('i\'m not alive');
    }
});

manager.get('/alive/on', (req, res) => {
    config.alive = true
    res.send('i\'m alive');
});

manager.get('/alive/off', (req, res) => {
    config.alive = false
    res.send('i\'m not alive');
});

app.listen(config.port, () => {
    console.log(`Service listening on port ${config.port}`);
});

manager.listen(config.managerPort, () => {
    console.log(`Manager listening on port ${config.managerPort}`);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

function parseDuration(duration) {
    try {
      return ms(duration);
    } catch {
      throw new Error(`invalid duration: ${duration}`);
    }
}
  
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
