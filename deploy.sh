# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd public

# 如果是发布到自定义域名
# echo 'www.yourwebsite.com' > CNAME

git init
git checkout -b gh-page
git add -A
git commit -m 'deploy'
git config --global user.email "2713554182@qq.com"
git config --global user.name "李佳成"
# 如果你想要部署到 https://USERNAME.github.io
git push -f https://option-star:${GITHUB_TOKEN}@github.com/option-star/Ljc.github.io.git master:gh-page

# 如果发布到 https://USERNAME.github.io/<REPO>  REPO=github上的项目
# git push -f git@github.com:USERNAME/<REPO>.git master:gh-pages

cd -

rm -rf public