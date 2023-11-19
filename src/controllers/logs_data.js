const db = require('../models/db_connection')


function validateTimeStamp(timestamp) {
    // regular expression for a specific timestamp format
    const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/;
    try {
        if (timestampRegex.test(timestamp)) {
            let date = new Date(timestamp);
            console.log("Correct date", date);
            return true;
        } else {
            console.log("Invalid timestamp format");
            return false;
        }
    } catch (error) {
        console.log("Error parsing timestamp", error);
        return false;
    }
}

function TrimInput(str) {
    if (str.length > 0) {
        return str.trim();
    }
    else {
        return "";
    }
}

exports.get_Logs_data = async (req, res) => {
    try {
        const body = req.body;
        let levelFilter = ""
        let messageFilter = ""
        let resourceIdFilter = ""
        let timestampFilter = ""
        let traceIdFilter = ""
        let spanIdFilter = ""
        let commitFilter = ""
        let parentResourceIdFilter = ""
        let searchKeywordFilter = ""
        let dateFromFilter = ""
        let dateToFilter = ""
        let applyFilter = false

        if (body.level && body.level.trim().length > 0) {
            levelFilter = TrimInput(body.level);
            applyFilter = true
        }
        if (body.message && body.message.trim().length > 0) {
            messageFilter = TrimInput(body.message)
            applyFilter = true
        }
        if (body.resourceId && body.resourceId.trim().length > 0) {
            resourceIdFilter = TrimInput(body.resourceId)
            applyFilter = true
        }
        if (body.timestamp && body.timestamp.trim().length > 0) {
            if (validateTimeStamp(TrimInput(body.timestamp))) {
                timestampFilter = TrimInput(body.timestamp)
                applyFilter = true
            }
            else {
                return res.status(200).send({ status: false, error: 'Invalid TimeStamp' });
            }
        }

        if (body.DateFrom && body.DateFrom.trim().length > 0) {
            if (validateTimeStamp(TrimInput(body.DateFrom))) {
                dateFromFilter = TrimInput(body.DateFrom)
                applyFilter = true
            }
            else {
                return res.status(200).send({ status: false, error: 'Invalid TimeStamp for DateFrom filter' });
            }
        }


        if (body.DateTo && body.DateTo.trim().length > 0) {
            if (validateTimeStamp(TrimInput(body.DateTo))) {
                dateToFilter = TrimInput(body.DateTo)
                applyFilter = true
            }
            else {
                return res.status(200).send({ status: false, error: 'Invalid TimeStamp for DateTo filter' });
            }
        }

        if (body.traceId && body.traceId.trim().length > 0) {
            traceIdFilter = TrimInput(body.traceId)
            applyFilter = true
        }
        if (body.spanId && body.spanId.trim().length > 0) {
            spanIdFilter = TrimInput(body.spanId)
            applyFilter = true
        }
        if (body.commit && body.commit.trim().length > 0) {
            commitFilter = TrimInput(body.commit)
            applyFilter = true
        }
        if (body.metadata && body.metadata.parentResourceId.trim().length > 0) {
            parentResourceIdFilter = TrimInput(body.metadata.parentResourceId)
            applyFilter = true
        }
        if (body.searchKeyword && body.searchKeyword.trim().length > 0) {
            searchKeywordFilter = TrimInput(body.searchKeyword)
            applyFilter = true
        }



        await db.sequelize.query('select * from get_log_data(?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
            {
                replacements: ['get_logs_data', levelFilter, messageFilter, resourceIdFilter, timestampFilter, dateFromFilter, dateToFilter, traceIdFilter, spanIdFilter, commitFilter, parentResourceIdFilter, searchKeywordFilter, applyFilter ? "true" : "false", null]
            }).then(data => {
                const result = data[0];
                let length = data[0].length;
                console.log(result);
                return res.status(200).send({ 'status': true,'Total_Items':length, 'data': result });
            })
    }
    catch (error) {
        console.error('Error in get_Logs_data:', error);

        // Handle the error and send an appropriate response
        return res.status(500).send({ status: false, error: 'Internal Server Error' });

    }
}

exports.insert_logs_data = async (req, res) => {
    try {
        const body = req.body
        console.log(body);
        if (body.level && body.message && body.resourceId && body.timestamp && body.traceId && body.spanId && body.commit && body.metadata) {

            if (body.timestamp && (validateTimeStamp(body.timestamp.trim()) == false)) {
                return res.status(200).send({ status: false, error: 'Invalid TimeStamp' });
            }

            else {
                let level = ""
                let message = ""
                let resourceId = ""
                let timestamp = ""
                let traceId = ""
                let spanId = ""
                let commit = ""
                let metadata = ""
                let parentResourceId = ""
                level = TrimInput(body.level);
                message = TrimInput(body.message);
                resourceId = TrimInput(body.resourceId);
                timestamp = TrimInput(body.timestamp);
                traceId = TrimInput(body.traceId);
                spanId = TrimInput(body.spanId);
                commit = TrimInput(body.commit);
                parentResourceId = TrimInput(body.metadata.parentResourceId);


                await db.sequelize.query('CALL insert_logs_data(?,?,?,?,?,?,?,?,?,?);', {
                    replacements: ['insert_new_log', level, message, resourceId, timestamp, traceId, spanId, commit, parentResourceId, null]
                })
                    .then(data => {
                        console.log(data);
                        return res.status(200).send({ status: true, "msg": "Inserted log successfully", "IdOfLog:": data });
                    })
            }
        }

        else {
            return res.status(200).send({ status: false, error: 'Paramters missing' });
        }

    }
    catch (error) {
        console.error('Error in get_Logs_data:', error);

        // Handle the error and send an appropriate response
        return res.status(500).send({ status: false, error: 'Internal Server Error' });

    }
}