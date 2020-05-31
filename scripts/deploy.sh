#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git remote add origin https://github.com/hitao123/hitao123.github.io.git

git config user.email hitao1234@gmail.com
git config user.name hitao123
git commit -m 'deploy'

git push -u -f origin master