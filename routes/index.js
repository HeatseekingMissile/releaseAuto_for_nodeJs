var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  keyControl={
      title:'Release for NodeJs',
      listName:'爬虫操作',
      crud:['insert','update','select','delete'],
      selectName:'搜索爬虫',
      submitName:'查找'
  },
  release={
      title: 'Release for NodeJs',
      listName:'发布流程',
      uploadFile:'上传文件',
      technologicalProcess:['上传文件-upload','测试验证-veriFication','自动发布-autoRelease'],
      submitName:'上传'
  }
  res.render('index',release);
});

module.exports = router;
