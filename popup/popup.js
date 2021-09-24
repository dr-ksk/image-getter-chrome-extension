// バックグランドページから
let status = chrome.extension.getBackgroundPage().getStatus();
let table = document.getElementById("statusTable");

// jobsをHTMLフォーマットに落とし込む
for (let row of status) {
  let titleElement = document.createElement("td");
  titleElement.innerText = row.title;
  let statusElement = document.createElement("td");
  statusElement.innerText = row.status;
  let trElement = document.createElement("tr");
  trElement.appendChild(titleElement);
  trElement.appendChild(statusElement);
  table.appendChild(trElement);
}

// ローカルストレージのjobsを取り込むように指示する（ダウンロード再開機能）
chrome.runtime.sendMessage({ type: "sync" });
