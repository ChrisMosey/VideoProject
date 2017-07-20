let express = require("express");
let app = express();
let http = require("http").createServer(app);
let fs = require("fs");
let bodyParser = require("body-parser");
let request = require("request");
const { execSync } = require("child_process");

const videoFile = "vidfile.mp4";
const thumbnail = "thumbnail.jpg";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    let video = req.body.video;

    //if video does not end with .mp4
    if (video == "" || video == null) {
        res.sendFile(__dirname + "/index.html");
        return;
    }

    let file = fs.createWriteStream(videoFile);
    let stream = request(video).pipe(file);
    stream.on('finish', () => {
        getThumbnail();
        res.sendFile(__dirname + "/return.html");
    });
});

app.get('/thumbnail', (req, res) => {
    res.sendFile(__dirname + '/' + thumbnail);
});

app.get('/vid', (req, res) => {
    res.sendFile(__dirname + '/' + videoFile)
});

http.listen(3000, () => {
    console.log("Listening on port 3000");
});

function getThumbnail() {
	let cmd = 'ffmpeg ' 
	+ '-i ' 
	+ videoFile + ' '
	+ '-vframes 1 ' //this gets the first frame of the video
    + '-q:v 3 ' //this is the image quality
    + thumbnail + ' ' //output image file
    + '-y'; //overwrite file if exists

    execSync(cmd, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
        }
    });
}