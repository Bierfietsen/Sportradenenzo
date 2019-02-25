module.exports = function (app) {
    const async = require('async')
    const SQLread = require('../db/SQLread')
    const SQLwrite = require('../db/SQLwrite')
    const SQLscrape = require('../SQLscrape')


    app.post('/api/teamselectionadd', function (req, res, next) {
        if(!req.user){
            res.redirect('/')
        }else{
            async.auto({
                rider: function(callback){
                    SQLread.getRider(req.body.rider_participation_id,callback)
                },
                userSelection: function(callback){
                    SQLread.getTeamSelection(req.user.account_id,req.body.race,req.body.year,callback)
                },
                race: function(callback){
                    SQLread.getRace(req.body.race,req.body.year,callback)
                }
            }),function(err,results){
                if(err) throw err;

                var budget = results.race.budget;   
                for(var i=0;i<results.userSelection.length;i++){
                    budget = budget - results.userSelection.price
                }
                if(results.userSelection.length>=20||budget<results.rider.price){
                    res.send(false)
                }else{
                    async.auto({
                        rider: function(callback){
                            SQLwrite.addRiderToSelection(req.body.rider_participation_id,req.user.account_id,results.race.race_id,callback)
                        }
                    }),function(err){
                        if(err) throw err;
                        res.send(true)
                    }
                }
            }
        }

    });
    app.post('/api/teamselectionremove', function (req, res) {
        if(!req.user){
            res.send(false)
            res.redirect('/')
        }else{
            SQLread.getRace(req.body.race,req.body.year,function(err,race){
                if(err) throw err
                SQLwrite.removeRiderFromSelection(req.user.account_id, req.body.rider_participation_id, race.race_id,function(err,results){
                    if(err) throw err
                    console.log(results)
                    res.send(true)
                })
            })
                
        }
    });
}