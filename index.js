const exprss = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./db");


require('dotenv').config();
const app = exprss();

app.use(cors({
    credentials: true
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Wellcom to IOT API .... ');
});
app.get('/writeInternal',async (req, res) => {
    try{
        let { proximity , noise , lighting   } = req.query;
        console.log(proximity , noise , lighting  );
        const date = new Date();
        const {rows} = await db.query(`INSERT INTO WESAM_DATA( proximity , noise , lighting, date)
        VALUES ($1, $2, $3,$4) RETURNING id`,[proximity , noise , lighting , date]);
        res.status(200).send({message:"success",id:rows[0].id});
    }catch(err){
        console.log(err)
    }
   
});
app.get('/writeExternal/:id',async (req, res) => {
    try{
        let { heart_beats , pollution  } = req.query;
        let { id  } = req.params;
        await db.query(`UPDATE WESAM_DATA SET heart_beats=${heart_beats}, pollution=${pollution} Where id=${id}`)
        res.status(200).send({message:"success"});
    }catch(err){
        console.log(err)
    }
   
});
app.get('/read', async(req, res) => {
    const data =await db.query(`Select * from WESAM_DATA ORDER BY date ASC`);
    console.log(data);
    res.send(data.rows);
});
app.get('/readLast', async(req, res) => {
    const data =await db.query(`Select * from WESAM_DATA ORDER BY date DESC LIMIT 1`);
    console.log(data);
    res.send(data.rows[0]);
});
const port = process.env.PORT || 3000;
app.listen(port, () => {

    console.log("your server is running on port " + port);
})