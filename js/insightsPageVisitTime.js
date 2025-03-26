const spendTimeFn = () => {
  let end = new Date().getTime();
  let timeSpent = end - start;
  timeSpent = timeSpent / 1000;
  totalSeconds += timeSpent;
  start = null;
}
let totalSeconds = 0;
let start;
document.addEventListener("DOMContentLoaded", () => {
  start = new Date().getTime()
});
window.addEventListener("blur", function () {
  spendTimeFn();
});
window.addEventListener("focus", function () {
  start = new Date().getTime();
});
window.addEventListener("beforeunload", function () {
  let end = new Date().getTime();
  let timeSpent = end - start;
  timeSpent = timeSpent / 1000;
  totalSeconds += timeSpent;
  if (totalSeconds > 100000) return
  appInsights.trackMetric({
    name: 'timeSpentInPage',
    average: totalSeconds,
    properties: {
      sitepath: 'inversores',
      webapp: 'ypfzpapsinv001'
    }
  })
});