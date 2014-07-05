var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var spawn = require('child_process').spawn;

var config = {
  user:'root',
  password:'123456',
  host:'42.96.168.163',
  database:'releaseAuto_for_NodeJs'
};

var client = mysql.createConnection(config);
client.connect(function(error,results){
    if(error){
      console.log("Error connect mysql"+error.message);
    }
    console.log("Connect mysql success");
});

var mysqlCrud = {
    insert:function(client,sql,value){
        client.query(sql,value,function(err,result){
            if(err){
              console.log("Error -> "+err.message);
              client.end();
              return;
            }else{
              console.log("Inserted ->"+ result.affectedRows + "row.");
              console.log("Insert sueccss");
              // res.send('Inserted ->'+ result.affectedRows + 'row.');
            }
        });
    },
    update:function(client,sql){
        client.query(sql,function(err,result){
            if(err){
              console.log("error -> "+err.message);
              client.end();
            }else{
              console.log("update success");
              // res.send('update success sql -> '+sql);
            }
        });
    },
    delete:function(client,sql){
        client.query(sql,function(err,result){
            if(err){
              console.log("error -> "+err.message);
              client.end();
            }
            console.log("delete success");
            // res.send('delete success sql -> '+sql);
        });
    },
    select:function(client,sql,res){
        client.query(sql,function(err,rows,fields){
            if(err){
                console.log('error -> '+ err.message);
            }else{
               var data = {
                   title:'测试验证-veriFication',
                   result:(rows)
               }
               res.render('veriFication',{'data':data});
            }
        });
    }
};

//crud sql...
var addReleaseSql="insert into releases set projectType=?,projectHost=?,projectContent=?,isCreateReleaseFile=?,isCopyOriginalFile=?,isResetTomcat=?";
var findReleaseSql="select * from releases";
/* GET users listing. */
router.get('/', function(req, res) {
  res.send('release with a resource');
});

router.get('/add',function(req,res){
    var title ='上传文件-upload';
    res.render('createRelease',{'title':title});
});

router.get('/select',function(req,res){
    mysqlCrud.select(client,findReleaseSql,res);
});

router.post('/add',function(req,res){
    var protos = [];
    for(var key in req.body){
        if(req.body.hasOwnProperty(key)){
            protos.push(req.body[key]);
        };
    }
    console.log(protos);
    mysqlCrud.insert(client,addReleaseSql,protos);
    var free  = spawn('ps', ['-ef']);//执行shell

    // 捕获标准输出并将其打印到控制台
    free.stdout.on('data', function (data) {
        console.log('脚本显示结果：\n' + data);
    });
    // res.send('发布成功 等待测试通过');
});

module.exports = router;
