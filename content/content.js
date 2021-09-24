// コピーした文字列を隠しtextareaに入れておく（Zipファイル名に利用するため）
let zipTitle = document.createElement("textarea");
document.addEventListener("copy", function (e) {
  zipTitle.innerText = window.getSelection().toString();
});

// ダウンロードするZipファイル名を取得
// 隠しtextareaか、なければHTMLのタイトルを取得し
function getZipTitle() {
  let title = zipTitle.innerText.length ? zipTitle.innerText : document.title;
  // 禁止文字があれば全角に置き換える
  title = title.replaceAll("/", "／");
  title = title.replaceAll(":", "：");
  title = title.replaceAll("*", "＊");
  title = title.replaceAll("?", "？");
  title = title.replaceAll('"', "”");
  title = title.replaceAll(">", "＞");
  title = title.replaceAll("<", "＜");
  title = title.replaceAll("»", "＞＞");
  title = title.replaceAll("«", "＜＜");
  title = title.replaceAll("|", "｜");
  title = title.replaceAll("~", "～");
  title = title.replaceAll(/\r?\n/g, "");
  title = title.replaceAll(/\t/g, " ");
  title = title.trim();
  // console.log(title);
  return title;
}

// 右クリックメニューイベントの受信
chrome.extension.onMessage.addListener(function (
  message,
  sender,
  sendResponse
) {
  if (message == "img") {
    imgGetter();
  } else if (message == "linkImg") {
    linkImgGetter();
  } else if (message == "linkHtmlImg") {
    linkHtmlimgGetter();
  }
});

// 選択範囲のimgタグ画像をダウンロード
function imgGetter() {
  // console.log("img mode.");

  // 選択範囲のDocumentFragmentをコピー
  let selectionDOM = window.getSelection().getRangeAt(0).cloneContents();

  // imgタグを取得して、URLを配列に詰める
  let imgTags = selectionDOM.querySelectorAll("img");
  let urls = [];
  for (let i = 0; i < imgTags.length; i++) {
    urls.push(imgTags[i].src);
  }

  // ダウンロードするZipファイル名を取得
  let title = getZipTitle();

  // event.jsにダウンロードさせる
  chrome.runtime.sendMessage({ type: "imgUrls", title: title, urls: urls });
}

// 選択範囲のAタグ先の画像をダウンロード
function linkImgGetter() {
  // console.log("link img mode.");

  // 選択範囲のDocumentFragmentをコピー
  let selectionDOM = window.getSelection().getRangeAt(0).cloneContents();

  // aタグを取得
  let Atags = selectionDOM.querySelectorAll("a");
  let urls = [];
  for (let i = 0; i < Atags.length; i++) {
    urls.push(Atags[i].href);
  }

  // ダウンロードするZipファイル名を取得
  let title = getZipTitle();

  // event.jsにダウンロードさせる
  chrome.runtime.sendMessage({ type: "imgUrls", title: title, urls: urls });
}

// 選択範囲のAタグ先のHTMLの最大サイズ画像をダウンロード
function linkHtmlimgGetter() {
  // console.log("link html mode.");

  // 選択範囲のDocumentFragmentをコピー
  let selectionDOM = window.getSelection().getRangeAt(0).cloneContents();

  // aタグを取得
  let Atags = selectionDOM.querySelectorAll("a");

  let urls = [];
  for (let i = 0; i < Atags.length; i++) {
    urls.push(Atags[i].href);
  }

  // ダウンロードするZipファイル名を取得
  let title = getZipTitle();

  // event.jsにダウンロードさせる
  chrome.runtime.sendMessage({ type: "htmlUrls", title: title, urls: urls });
}
