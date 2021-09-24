// 画像読み込み(リトライ3回まで)
async function getImg(url, n = 3) {
  try {
    let res = await fetch(url);
    let blob = await res.blob();
    return blob;
  } catch (err) {
    console.log("1秒後リトライ");
    await new Promise((r) => setTimeout(r, 1000));
    if (n === 1) {
      throw err;
    }
    return await getImg(url, n - 1);
  }
}

// HTMLをダウンロード(リトライ3回まで)
async function getHtml(url, n = 3) {
  try {
    let res = await fetch(url);
    let text = await res.text();
    let html = new DOMParser().parseFromString(text, "text/html");
    return html;
  } catch (err) {
    console.log("1秒後リトライ");
    await new Promise((r) => setTimeout(r, 1000));
    if (n === 1) {
      throw err;
    }
    return await getHtml(url, n - 1);
  }
}
