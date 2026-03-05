1. Rules を確認してください

2. **gh コマンドで issue を確認してください**
```
gh issue list --json number,title,labels,state
```

3. **main ブランチに移動してください**
```
git checkout main
git pull origin main
```

4. **このissue用のブランチを作成してください**
```
git checkout -b feature/[ISSUE_NUMBER]-[機能名]
```

5. **コミットは以下の点に注意してください**
- コミットメッセージは、英語でお願いします
- こまめに分割してコミットしてください
```
git add [ファイル]
git commit -m "#[ISSUE_NUMBER] [変更内容を英語で]"
```

6. **変更をプッシュしてください**
```
git push origin feature/[ISSUE_NUMBER]-[機能名]
```

7. PR 作成してください