/**
 * ダウンロード処理
 */

// ダウンロードジョブリスト
let jobs = [];
// ダウンロードスレッド実行フラグ
let isDownloading = 0;
// ダウンロード中のジョブタイトル
let jobTitle = "";
// ダウンロード中ジョブの状況
let jobStatus = "";

// content.jsからのイベントの受信し、ジョブリストに入れる
chrome.extension.onMessage.addListener(async function (
  message,
  sender,
  sendResponse
) {
  // ローカルストレージのジョブリストを取得
  // jobs = await getLocalStorage("jobs");
  // if (typeof jobs === "undefined") {
  //   jobs = [];
  // }
  if (message["type"] === "imgUrls") {
    // 画像ダウンロード
    jobs.push({
      type: "imgUrls",
      title: message["title"],
      urls: message["urls"],
    });
  } else if (message["type"] === "htmlUrls") {
    // HTML解析ダウンロード
    jobs.push({
      type: "htmlUrls",
      title: message["title"],
      urls: message["urls"],
    });
    // await setLocalStorage({ jobs: jobs });
  }

  // スレッドコントローラにダウンロード処理を任せる
  threadController();
});

// スレッド上限値までダウンロード処理を実行し管理
function threadController() {
  // 他のダウンロードスレッドが実行されていなく、残りジョブリストが残っているか
  if (!isDownloading && jobs.length > 0) {
    // 新規スレッド実行する
    downloadThread();
  }
}

// ダウンロードスレッド
async function downloadThread() {
  // 他のダウンロードスレッドが実行されないようにフラグ立て
  isDownloading = true;

  // ダウンロードした画像ファイルを詰めるコンテナ
  let images = [];

  // 先頭のジョブを取得
  let job = jobs[0];
  jobs.shift();
  // await setLocalStorage({ jobs: jobs });

  jobTitle = job["title"];

  // ジョブの種類の確認
  if (job["type"] === "imgUrls") {
    // 画像ダウンロード
    images = await imgGetter(job["urls"]);
  } else if (job["type"] === "htmlUrls") {
    // HTML解析+最大画像ダウンロード
    images = await htmlAnalyse(job["urls"]);
  }

  // ダウンロード処理へ
  downloadFile(jobTitle, images);

  // フラグを戻してスレッドコントローラに返す
  isDownloading = false;
  threadController();
}

// HTML解析処理開始
async function htmlAnalyse(htmlUrls) {
  // ダウンロードした画像ファイルを詰めるコンテナ
  let images = [];

  // 全件数
  let max = htmlUrls.length;

  // htmlUrlsのHTMLをすべて取得
  for (let i = 0; i < max; i++) {
    // console.log("loadingHTML:" + (i + 1) + "/" + max);
    jobStatus = "HTML解析中:" + (i + 1) + "/" + max;
    try {
      let html = await getHtml(htmlUrls[i], 3);

      // HTMLの全imgタグの中で最大面積のものを取得
      let imgTags = html.querySelectorAll("img");
      let maxId = 0;
      let maxArea = 0;
      for (let j = 0; j < imgTags.length; j++) {
        if (imgTags[j].width * imgTags[j].height > maxArea) {
          maxArea = imgTags[j].width * imgTags[j].height;
          maxId = j;
        }
      }

      let url = imgTags[maxId].src;
      // console.log("download:" + (i + 1) + "/" + max);
      jobStatus = "画像ダウンロード中:" + (i + 1) + "/" + max;
      images.push({ fileName: i + getExt(url), image: await getImg(url, 3) });
    } catch (err) {
      // TODO:未実装
      // ダウンロードが3回失敗したらどうするか？
    }
  }

  return images;
}

// 画像ダウンロード
async function imgGetter(urls) {
  // ダウンロードした画像ファイルを詰めるコンテナ
  let images = [];

  // 全件数
  let max = urls.length;

  for (let i = 0; i < max; i++) {
    // console.log("download:" + (i + 1) + "/" + max);
    jobStatus = "画像ダウンロード中:" + (i + 1) + "/" + max;
    try {
      images.push({
        fileName: i + getExt(urls[i]),
        image: await getImg(urls[i], 3),
      });
    } catch (err) {
      // TODO:未実装
      // ダウンロードが3回失敗したらどうするか？
    }
  }
  return images;
}

// ZIPファイルのダウンロード
function downloadFile(title, images) {
  // console.log(title + ":Zipping.");
  jobStatus = title + "Zip化中";

  // ダウンロード用ZIPファイルを作成
  let zipData = new JSZip();

  // ファイル名は0から連番を付ける
  for (let i = 0; i < images.length; i++) {
    zipData.file(images[i]["fileName"], images[i]["image"], { binary: true });
  }

  zipData.generateAsync({ type: "blob" }).then(function (blob) {
    // blobからダウンロードURLを生成し、そのURLでブラウザのダウンロード機能を走らせる
    let url = window.URL.createObjectURL(blob);
    // downloadAPIでダウンロード実行
    chrome.downloads.download(
      { url: url, filename: title + ".zip" },
      function () {
        window.URL.revokeObjectURL(url);
      }
    );
  });
}

// 拡張子を取得
function getExt(filename) {
  var pos = filename.lastIndexOf(".");
  if (pos === -1) return "";
  return filename.slice(pos);
}

// ポップアップ表示用に現状のジョブリストとステータスを返す
function getStatus() {
  let statusList = jobs.map(function (job) {
    return {
      title: job["title"],
      status: "ダウンロード待機中:" + "0/" + job["urls"].length,
    };
  });
  if (isDownloading) {
    statusList.unshift({ title: jobTitle, status: jobStatus });
  }
  return statusList;
}
