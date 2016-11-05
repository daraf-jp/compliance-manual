# README

1. git clone <template repo>
2. git remote rename origin template
3. git remote add origin <new repo>
4. npm install
5. bower install
6. npm run gulp-sketch
7. npm run gulp
8. git add, commit, push

## 雛形

* codebot-new-markup を cloneして、remote の rename する。  
* <new repo> は、GitHubで自分で作ったリポジトリのアドレス `git@github.com:<user>/<repo>`  

## sketchtool

このプロジェクトのrootにsketchファイルを置く。  
artboard の名前でslimファイルが生成されます。

6.の `npm run gulp-sketch` は sketchtool が必要。  
Sketch.app が入っている場合は以下でインストールできる。

`[~]% /Applications/Sketch.app/Contents/Resources/sketchtool/install.sh`

## node

v4.4.7
