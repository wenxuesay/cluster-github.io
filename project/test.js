// for (var i = 0; i < 5; i++) {
//   setTimeout(() => {
//     console.log(new Date(), i);
//   }, 1000);
// }

// console.log(new Date(), i);

// for (var i = 0; i < 5; i++) {
//   (function (j) {
//     setTimeout(function() {
//       console.log(new Date(), j);
//     }, 1000);
//   })(i);
// }
// console.log(new Date(), i);

// for (let i = 0; i < 5; i++) {
//   setTimeout(function () {
//     console.log(new Date, i);
//   }, 1000);
// }

// for (var i = 0; i < 5; i++) {
//   (function (j) {
//     setTimeout(function () {
//       console.log(new Date, j);
//     }, 1000 * j)
//   })(i);
// }
// const tasks = []; // 这里存放异步操作的 Promise
// const output = (i) => new Promise((resolve) => {
//   setTimeout(() => {
//     console.log(new Date, i);
//     resolve();
//   }, 1000 * i);
// });

// // 生成全部的异步操作
// for (var i = 0; i < 5; i++) {
//   tasks.push(output(i));
// }

// // 异步操作完成之后，输出最后的 i
// Promise.all(tasks).then(() => {
//   setTimeout(() => {
//     console.log(new Date, i);
//   }, 1000);
// });
// const sleep = (timeountMS) => new Promise((resolve) => {
//   setTimeout(resolve, timeountMS);
// });


console.log('test');
