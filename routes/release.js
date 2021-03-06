var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
//upload
var formidable = require("formidable");
//shell
var spawn = require('child_process').spawn;

var STATUS_NO_THROUGH = false;
var STATUS_THROUGH = true;
var config = {
  user:'',
  password:'',
  host:'',
  database:''
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
    update:function(client,sql,value,res){
        client.query(sql,value,function(err,result){
            if(err){
              console.log("error -> "+err.message);
              client.end();
            }else{
              console.log("update success");
              res.send(STATUS_THROUGH);
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
var addReleaseSql="insert into releases set projectType=?,projectHost=?,projectContent=?,position=?,isCreateReleaseFile=?,isCopyOriginalFile=?,isResetTomcat=?,status=?,fileHosts=?,ipHost=?";
var findReleaseSql="select * from releases";
var updateStatusByIdSql = "update releases set status='1' where id=?";
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
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var protos = [];
      for(var key in fields){
          if(fields.hasOwnProperty(key)&&key!='upfile'){
              protos.push(fields[key]);
              console.log('key -> ' + key + ' fields[key] -> ' + fields[key]);
          };
      }
      var tmp_path = files.file1.path;
      var target_path = './public/images/' + files.file1.name;
      fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
      // 删除临时文件夹文件,
         fs.unlink(tmp_path, function() {
           if (err) throw err;
           console.log('File uploaded to: ' + target_path + ' - ' + files.file1.size + ' bytes');
         });
      });
      protos.push(STATUS_NO_THROUGH);
      protos.push(target_path);
      protos.push(req.connection.remoteAddress);
      mysqlCrud.insert(client,addReleaseSql,protos);
    });


    // var free  = spawn('ps', ['-ef']);//执行shell
    // free.stdout.on('data', function (data) {
    //     console.log('脚本显示结果：\n' + data);
    // });
    // res.send('发布成功 等待测试通过');
    release={
        title: 'Release for NodeJs',
        listName:'发布流程',
        uploadFile:'上传文件',
        technologicalProcess:['上传文件-upload','测试验证-veriFication','手动发布-autoRelease'],
        submitName:'上传'
    }
    res.render('index',release);
});

router.post('/updateStatus',function(req,res){
    var releaseId = req.body.releaseId;

    mysqlCrud.update(client,updateStatusByIdSql,releaseId,res);

});

module.exports = router;
