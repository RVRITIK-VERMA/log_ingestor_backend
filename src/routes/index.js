const log_data_obj = require('../controllers/logs_data')


module.exports = function(app){
    app.use(function (req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept",
        );
        next();
    });

    app.post('/api/getLogsData',log_data_obj.get_Logs_data);
    app.post('/api/insertLogsData',log_data_obj.insert_logs_data);
    app.get('/', (req,res)=>{
        return res.status(200).send({ status: true, data: 'Api Hit' });
    });
}