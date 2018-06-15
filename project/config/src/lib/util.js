const util = {};
util.echartsFormat = (columnMap, dataResult) => {
  const object = {
    tCloumns: [],
    datas: {
      xData: [],
      yData: [],
      legend: [],
      min: '',
      max: '',
    },
  };
  const series = {};
  const keys = [];
  let valueKey;
  const reg = new RegExp(columnMap.regExp);
  Object.keys(columnMap).forEach((key) => {
    if (key !== 'x' && key !== columnMap.x && !reg.test(key) && key !== 'regExp') {
      object.tCloumns.push({
        prop: key,
        label: key === 'dt' ? '时间' : columnMap[key],
      });
      keys.push(key);
    }
    if (reg.test(key)) {
      valueKey = key;
    }
  });
  if (keys.length > 0) {
    dataResult.forEach((o, i) => {
      if (i === 0) {
        object.datas.min = o[valueKey];
        object.datas.max = o[valueKey];
      } else {
        if (o[valueKey] < object.datas.min) object.datas.min = o[valueKey];
        if (o[valueKey] > object.datas.max) object.datas.max = o[valueKey];
      }
      if (object.datas.xData.indexOf(o.dt) === -1) {
        object.datas.xData.push(o.dt);
      }
      let str = '';
      keys.forEach((v) => {
        str += o[v];
      });
      if (!series[str]) {
        object.datas.legend.push(str);
        series[str] = {};
        series[str].arr = [];
      }
      if (series[str]) {
        series[str][o.dt] = o[valueKey];
      }
    });
    object.datas.xData.forEach((v) => {
      Object.keys(series).forEach((key) => {
        const data = series[key][v] ? series[key][v] : 0;
        series[key].arr.push(data);
      });
    });
    Object.keys(series).forEach((key) => {
      object.datas.yData.push(series[key].arr);
    });
  } else {
    series.arr = [];
    dataResult.forEach((data, i) => {
      if (i === 0) {
        object.datas.min = data[valueKey];
        object.datas.max = data[valueKey];
      } else {
        if (data[valueKey] < object.datas.min) object.datas.min = data[valueKey];
        if (data[valueKey] > object.datas.max) object.datas.max = data[valueKey];
      }
      if (object.datas.xData.indexOf(data.dt) === -1) {
        object.datas.xData.push(data.dt);
      }
      series.arr.push(data[valueKey]);
    });
    object.datas.legend.push(columnMap[valueKey]);
    object.datas.yData.push(series.arr);
  }
  return object;
};
util.deleCookies = () => {
  const myDate = new Date();
  myDate.setTime(-1000); // 设置时间
  const data = document.cookie;
  const dataArray = data.split('; ');
  for (let i = 0; i < dataArray.length; i += 1) {
    const varName = dataArray[i].split('=');
    document.cookie = `${varName[0]}=''; expires=${myDate.toGMTString()}`;
    console.log(dataArray[i]);
  }
  const domain = document.domain.replace(/^\w*\./, '');
  document.cookie = `_TOKEN_KEY_='';domain=${domain}`;
};

util.tableSearch = ({ selection = false, pageSize = 10, currentPage = 1, total = 0, order = '', prop = '' } = {}) => ({
  pageSize,
  currentPage,
  total,
  order,
  prop,
  selection,
});
// util.selection = ({ selection = [] } = {}) => ({
//   selection,
// });
export default util;
