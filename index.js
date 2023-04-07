const line = require('@line/bot-sdk');
const https = require("https")

const Router = require('koa-router');

const Koa = require('koa');
const app = new Koa();

const router = new Router();


const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);


const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



const handleEvent = async (event) => {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: event.message.text}], //event.message.text 人類的問題
    });
    console.log(completion.data.choices[0].message.content);

    msg = {
      type: 'text', text: completion.data.choices[0].message.content // 回傳的AI回答
      }

    
    return client.replyMessage(event.replyToken, msg).catch((err) => {
        if (err) {
            console.error(err);
        }
    });
};
/*
router.post('/callback', function *(ctx, next) {
  // 取 User 傳送得資料
      Promise
      .all(ctx.req.body.events.map(handleEvent))  //handleEvent處理傳過來的訊息再回傳
      .then((result) => res.json(result))
      .catch((err) => {
          res.status(500).end();   
        });
        
  
})

app.use(function *(ctx, next){
    this.status = 200;
  });
 */



/*
router
    .get('/', ctx => {
        ctx.body = '首頁';
    })

    .post('/callback', function(ctx) {
     
      Promise
      .all(ctx.request.body.events.map(handleEvent))  //handleEvent處理傳過來的訊息再回傳
      .then((result) => res.json(result))
      //.catch((err) => {
          //res.status(500).end();
      //});
    });


app.use(router.routes());



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
*/

const router = Router();  
// Router -> / 
router.get('/', async(ctx) => {     
    ctx.body = 'Hello Koa2 body'; 
});  
// Router -> /ready
router.get('/ready', async(ctx) => {     
    ctx.body = 'Ready Content'; 
});  app.use(router.routes());  
app.listen(3001);
