const axios = require('axios');
const qs = require('qs');
const sign = require('./sign');
const headers = {
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'zh-CN,zh;q=0.9,ru;q=0.8',
  'cookie': 'FANYI_WORD_SWITCH=1; REALTIME_TRANS_SWITCH=1; HISTORY_SWITCH=1; SOUND_SPD_SWITCH=1; SOUND_PREFER_SWITCH=1; BAIDUID=57DF142C7E85D4EA8A27447286991A12:FG=1; PSTM=1594958134; BIDUPSID=FBF8849B3FD0D6EF12FC5C045C5A92FF; BDUSS=hXdFh2MWp0MnJhTnR1OU1yTXBlNnVybUFRZ2UxTkl3TTBNa0xpMmxyekEzanRmSVFBQUFBJCQAAAAAAAAAAAEAAAB7wPO2eXNmMjAwNTEyMjMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMBRFF~AURRfQk; BDUSS_BFESS=hXdFh2MWp0MnJhTnR1OU1yTXBlNnVybUFRZ2UxTkl3TTBNa0xpMmxyekEzanRmSVFBQUFBJCQAAAAAAAAAAAEAAAB7wPO2eXNmMjAwNTEyMjMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMBRFF~AURRfQk; Hm_lvt_64ecd82404c51e03dc91cb9e8c025574=1595436609,1595470204,1595771964,1595928585; Hm_lpvt_64ecd82404c51e03dc91cb9e8c025574=1595928585; __yjsv5_shitong=1.0_7_52f5436d205ef98ae5c2248990893b7a5a87_300_1595928585062_183.132.73.68_1f7bcc55',
  'cache-control': 'max-age=0',
  'referer': 'https://fanyi.baidu.com/',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
  'x-requested-with': 'XMLHttpRequest'
};
const url = {
  page: 'https://fanyi.baidu.com',
  trans: 'https://fanyi.baidu.com/v2transapi',
  detect: 'https://fanyi.baidu.com/langdetect'
}

function token(page) {
  return page.match(/token: '(.*?)'/)[1];
}
function gtk(page) {
  return page.match(/window.gtk = '(.*?)';/)[1];
}

async function create() {
  const data = await axios.get(url.page, { headers }).then(
    res => {
      return { error: false, token: token(res.data), gtk: gtk(res.data) };
    },
    () => {
      return { error: true };
    }
  );
  if (data.error) {
    throw new Error('network error');
  }
  return (query, to) => {
    return axios.post(url.detect, qs.stringify({ query: query })).then(
      res => {
        return res.data.lan
      }
    ).then(
      (lan) => {
        return axios.post(url.trans + '?from=' + lan + '&to=' + to, qs.stringify({ from: lan, to, query, transtype: 'realtime', 'simple_means_flag': 3, sign: sign(query, data.gtk), token: data.token, domain: 'common' }), { headers }).then((res) => {
          return res.data
        })
      }, () => {
        throw new Error('network error');
      }
    )
  }
};

module.exports = create;
