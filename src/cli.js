const prompts = require('prompts');
const create = require('./lib/core');
const chalk = require('chalk');
const langList = {
  'zh': '中文',
  'jp': '日语',
  'jpka': '日语假名',
  'th': '泰语',
  'fra': '法语',
  'en': '英语',
  'spa': '西班牙语',
  'kor': '韩语',
  'tr': '土耳其语',
  'vie': '越南语',
  'ms': '马来语',
  'de': '德语',
  'ru': '俄语',
  'ir': '伊朗语',
  'ara': '阿拉伯语',
  'est': '爱沙尼亚语',
  'be': '白俄罗斯语',
  'bul': '保加利亚语',
  'hi': '印地语',
  'is': '冰岛语',
  'pl': '波兰语',
  'fa': '波斯语',
  'dan': '丹麦语',
  'tl': '菲律宾语',
  'fin': '芬兰语',
  'nl': '荷兰语',
  'ca': '加泰罗尼亚语',
  'cs': '捷克语',
  'hr': '克罗地亚语',
  'lv': '拉脱维亚语',
  'lt': '立陶宛语',
  'rom': '罗马尼亚语',
  'af': '南非语',
  'no': '挪威语',
  'pt_BR': '巴西语',
  'pt': '葡萄牙语',
  'swe': '瑞典语',
  'sr': '塞尔维亚语',
  'eo': '世界语',
  'sk': '斯洛伐克语',
  'slo': '斯洛文尼亚语',
  'sw': '斯瓦希里语',
  'uk': '乌克兰语',
  'iw': '希伯来语',
  'el': '希腊语',
  'hu': '匈牙利语',
  'hy': '亚美尼亚语',
  'it': '意大利语',
  'id': '印尼语',
  'sq': '阿尔巴尼亚语',
  'am': '阿姆哈拉语',
  'as': '阿萨姆语',
  'az': '阿塞拜疆语',
  'eu': '巴斯克语',
  'bn': '孟加拉语',
  'bs': '波斯尼亚语',
  'gl': '加利西亚语',
  'ka': '格鲁吉亚语',
  'gu': '古吉拉特语',
  'ha': '豪萨语',
  'ig': '伊博语',
  'iu': '因纽特语',
  'ga': '爱尔兰语',
  'zu': '祖鲁语',
  'kn': '卡纳达语',
  'kk': '哈萨克语',
  'ky': '吉尔吉斯语',
  'lb': '卢森堡语',
  'mk': '马其顿语',
  'mt': '马耳他语',
  'mi': '毛利语',
  'mr': '马拉提语',
  'ne': '尼泊尔语',
  'or': '奥利亚语',
  'pa': '旁遮普语',
  'qu': '凯楚亚语',
  'tn': '塞茨瓦纳语',
  'si': '僧加罗语',
  'ta': '泰米尔语',
  'tt': '塔塔尔语',
  'te': '泰卢固语',
  'ur': '乌尔都语',
  'uz': '乌兹别克语',
  'cy': '威尔士语',
  'yo': '约鲁巴语',
  'yue': '粤语',
  'wyw': '文言文',
  'cht': '中文繁体'
};

let lanChoices = [];

Object.keys(langList).forEach((name) => {
  lanChoices.push({ title: langList[name], value: name });
});

function handle(main) {
  (async () => {
    const qs = [
      {
        type: 'autocomplete',
        name: 'lan',
        message: '选择要翻译成的语言',
        choices: lanChoices
      },
      {
        type: 'text',
        name: 'query',
        message: '输入翻译内容'
      }
    ]
    const res = await prompts(qs);
    main(res.query, res.lan).then(res => {
      if (!res.error) {
        console.log(chalk.green('翻译结果: ' + res['trans_result'].data[0].dst + '\n------------------------------------------------------\n'));
        (async () => {
          const r = await prompts({
            type: 'confirm',
            name: 'isContinue',
            message: '是否继续'
          });
          if (r.isContinue === true) {
            handle(main);
          } else {
            process.exit(0);
          }
        })()
      } else if (res.error === 1000) {
        console.log(chalk.yellow('输入了非法字符' + '\n------------------------------------------------------\n'));
        (async () => {
          const r = await prompts({
            type: 'confirm',
            name: 'isContinue',
            message: '是否继续'
          });
          if (r.isContinue === true) {
            handle(main);
          } else {
            process.exit(0);
          }
        })()
      } else {
        console.log(chalk.yellow('发生了一个未知来源的错误' + '\n------------------------------------------------------\n'));
        (async () => {
          const r = await prompts({
            type: 'confirm',
            name: 'isContinue',
            message: '是否继续'
          });
          if (r.isContinue === true) {
            handle(main);
          } else {
            process.exit(0);
          }
        })()
      }
    }, (error) => {
      console.log(chalk.red('发生了一个错误，来自网络，或来自百度服务器问题' + '\n------------------------------------------------------\n'));
      (async () => {
        const r = await prompts({
          type: 'confirm',
          name: 'isContinue',
          message: '是否继续'
        });
        if (r.isContinue === true) {
          handle(main);
        } else {
          process.exit(0);
        }
      })()
    })
  })();
}

(async () => {
  console.log(chalk.yellow('正在准备中...'));
  try {
    let main = await create();
    console.log(chalk.green('就绪!'));
    handle(main);
  } catch (e) {
    console.log(chalk.red('网络错误,请检查网络'));
  }
})()
