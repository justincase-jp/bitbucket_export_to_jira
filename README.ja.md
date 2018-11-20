# BitBucket issue exporter

Jira に移行するために BitBucket issue を json 形式で書き出すためのツールです。

## セットアップ

- `.nvmrc` に必要な node バージョンをしています。
- `nvm use; npm install` を実行して、必要な node モジュールをインストールします。

## 設定

- `config/api_credential-default.js` を `config/api_credential.js` としてコピーします。
    - bitbucket api にアクセスするために `username` と `password` を編集します
- `config/app_config.js` を編集して、対象となる BitBucket リポジトリを設定します。
- `config/state_mapper.js` を編集して、BitBucket issue のステータスマッピングを定義します。
- `config/user_mapping-sample.json` を `config/user_mapping.json` としてコピーします。
    - `config/user_mapping.json` では BitBucket ユーザーと Jira ユーザーのマッピングを定義します。

## 実行

- `node export_issues.js` を実行すると、 `results` ディレクトリに BitBucket issue が書き出されます

## コピーライト

[bitbucket_export_to_jira](https://github.com/justincase-jp/bitbucket_export_to_jira) は justInCase, Inc によって開発されました。

Copyright (c) 2018 [justInCase, Inc](https://justincase.jp/)

## ライセンス

bitbucket_export_to_jira is released under the MIT-license.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
