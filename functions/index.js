const functions = require('firebase-functions');

// basic認証ロジック+vueレンダリング----------------------------
const express = require('express')
const basicAuth = require('basic-auth-connect')
const app = express()
const path = require('path');

//basic認証
app.use(basicAuth('test', '9iagK2Mg'));

// basic認証後に　ビルドしたvue一式をレンダリング
app.use(express.static(__dirname + '/dist/'));
// historyモードで/〇〇/となってもレンダリングできるように
app.all('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname + '/dist/index.html'));
});
exports.basic = functions.https.onRequest(app)
// basic認証ロジック+vueレンダリングここまで---------------------


// OGP用 shareロジック
const admin = require('firebase-admin');
const keyFilename = __dirname + '/service-account-credentials.json';
admin.initializeApp({
  credential: admin.credential.cert(keyFilename),
  databaseURL: "https://tsumiageday.firebaseio.com"
});
const db = admin.firestore();
const { Storage } = require('@google-cloud/storage');


const siteName = '今日の積み上げメーカー';
const siteTitle = '今日の積み上げメーカー';
const metaDescription = '今日の積み上げメーカーのシェアページです。';
const ogDescription = '今日の積み上げメーカーのシェアページです。';
const ogImageWidth = 1200;
const ogImageHeight = 630;
const twDescription = '今日の積み上げメーカーのシェアページです。';

// OGP読み込ませる用の出力html
const genHtml = (pageId, imgSrc) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <title>${siteTitle}</title>
    <meta name="description" content=${metaDescription}>
    <meta property="og:locale" content="ja_JP">
    <meta property="og:type" content="website">
    <meta property="og:url" content=https://tsumiage.com/share/${pageId}>
    <meta property="og:title" content=${siteTitle}>
    <meta property="og:siteName" content=${siteName}>
    <meta property="og:description" content=${ogDescription}>
    <meta property="og:image" content=${imgSrc}>
    <meta property="og:image:width" content=${ogImageWidth}>
    <meta property="og:image:height" content=${ogImageHeight}>
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content=${siteTitle}>
    <meta name="twitter:description" content=${twDescription}>
    <meta name="twitter:image" content=${imgSrc}>
  </head>
  <body>
    <script>
      // クローラーにはメタタグを解釈させて、人間はコンテンツ生成ページへ飛ばす
      location.href = '/content/${pageId}';
    </script>
  </body>
</html>
`;
exports.share = functions.https.onRequest(async (request, response) => {

  // アクセスURL「ドメイン/share/〇〇」の時の〇〇を取得
  const contentId = request.path.split("/")[2];
  const dbSnapshot = await db.collection("contents").where("contentId", "==", contentId)
    .get();


  // _sizeでSnapshotの要素数。 要素数が1のとき、OGP画像が存在するため動作モジュールへ
  if (dbSnapshot._size === 1) {

    const fileName = 'contents/' + contentId + '.png';

    // Firebaseのproject ID
    const projectId = 'tsumiageday';

    // OGPが保存されてるCloudStorageのバケット
    const bucketName = 'tsumiageday.appspot.com';
    const options = {
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24 * 30 // 生成URLの有効期限
    };

    const storage = new Storage({
      projectId,
      keyFilename
    });

    // アクセス可能な画像URLを生成
    const imgSrc = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    // cloudfunctionのキャシュ設定
    response.set('cache-control', 'public, max-age=3600');
    // OGP用のhtml表示
    response.send(genHtml(contentId, imgSrc));

  } else {
    // URLに対応するOGP画像が存在しなかった場合

    // cloudfunctionのキャシュ設定
    response.set('cache-control', 'public, max-age=3600');
    // TOPページへリダイレクト
    response.writeHead(302, {
      'Location': '/'
    });
    response.end();
  }
});