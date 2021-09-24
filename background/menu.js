/**
 * contextMenu（右クリックメニュー）の作成
 * contentページに"img","linkImg","linkHtmlImg"の3つのメッセージを送信する
 */
// 親階層のメニューを生成
chrome.contextMenus.create({
  type: "normal",
  id: "parent_menu",
  contexts: ["all"],
  title: "画像選択範囲ダウンローダ",
});

// 選択範囲のimgタグ画像をダウンロード
chrome.contextMenus.create({
  parentId: "parent_menu",
  title: "選択画像をダウンロード",
  contexts: ["all"],
  type: "normal",
  onclick: function (info, tab) {
    chrome.tabs.sendMessage(tab.id, "img");
  },
});

// 選択範囲のAタグ先の画像をダウンロード
chrome.contextMenus.create({
  parentId: "parent_menu",
  title: "選択リンク先の画像をダウンロード",
  contexts: ["all"],
  type: "normal",
  onclick: function (info, tab) {
    chrome.tabs.sendMessage(tab.id, "linkImg");
  },
});

// 選択範囲のAタグ先のHTMLの最大サイズ画像をダウンロード
chrome.contextMenus.create({
  parentId: "parent_menu",
  title: "選択リンク先のHTMLの最大画像をダウンロード",
  contexts: ["all"],
  type: "normal",
  onclick: function (info, tab) {
    chrome.tabs.sendMessage(tab.id, "linkHtmlImg");
  },
});
