# image-getter-chrome-extension

## 概要

複数画像の選択ダウンロードの Chrome extension です。  
他の画像一括ダウンローダとの違いは、ユーザが自分で選択した範囲のみをダウンロードする点です。

## インストール方法：

右上の『Code』ボタンから Download Zip でダウンロードして、適当なところで解凍します。  
Chrome の拡張機能ページで、『パッケージ化されていない拡張機能を読み込む』ボタンを押して、解凍した『image-getter-chrome-extension-main』フォルダを選択

## 使い方：

1. ダウンロードしたい画像や画像のリンクがあるページで、ダウンロードファイル名となる文字列があれば、選択してコピーしてください。
   ※ページ内でコピーした文字列が、ダウンロードファイルの名前になります。
   ※コピーしないと、HTML のタイトルがファイル名となります。

1. ダウンロードしたい画像をテキスト選択（ドラッグ）で選択し、右クリックメニュ『画像選択範囲ダウンローダ』の 3 つのサブメニューのどれかを選ぶとダウンロードが開始します。

   - 選択画像をダウンロード：ページに表示されている画像がダウンロードされます。（img タグの src 先がダウンロードされます）
   - 選択リンク先の画像をダウンロード：選択範囲のリンクの先の画像をダウンロードします（a タグの href 先がダウンロードされます）
   - 選択リンク先の HTML の最大画像をダウンロード：選択範囲のリンク先の HTML に含まれる画像のうち、最もサイズ（面積）の大きな画像をダウンロードします（a タグの href 先に含まれる img タグを全部調べて、サイズの最大のものをダウンロードします）

1. ダウンロードの進捗状況は右上のアイコンをクリックするとポップアップで表示されます。
   レジューム機能は現時点でないので、ダウンロード中にブラウザを終了させると、そのままリセットされてなくなります。
