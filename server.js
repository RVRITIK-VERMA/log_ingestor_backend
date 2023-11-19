const express = require('express');
const app = express()
const port = 3000
const cors = require('cors');

app.use(express.json());
var corsOption = {
    origin : '*'
}
app.use(cors(corsOption));
require('./src/routes')(app);

app.get('/', (req,res)=>{
    return res.status(200).send({ status: true, data: 'Api Hit' })
});

app.listen(port,()=>{
    console.log(`server is listening to port ${port}`);
});
