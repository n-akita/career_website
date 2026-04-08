@AGENTS.md

## デプロイ手順

このサイトは Vercel に接続されており、`main` ブランチへの push で自動デプロイされる。

```
# 1. ビルド確認（デプロイ前に必ず実行）
cd site
npx next build

# 2. 変更をコミット
git add <変更ファイル>
git commit -m "コミットメッセージ"

# 3. push → 自動デプロイ
git push origin main
```

- リポジトリ: https://github.com/n-akita/career_website.git
- 本番URL: https://nara-career.com
- ホスティング: Vercel（GitHub連携による自動デプロイ）
- push後、数分でデプロイ完了
