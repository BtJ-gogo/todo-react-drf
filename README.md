# Django EC Project

React、Django REST Frameworkで作成したTodoアプリです。
コアとなるCRUD機能を優先するため、認証は省略しています。

## 主な機能

- タスクのCRUD機能

## 使用技術

- フロントエンド
  - React
- バックエンド
  - Django 5.2.10
  - Django Rest Framework 3.16.1
  - django-Cors-headers 4.9.0
- データベース
  - SQLite(開発用)
- プログラミング言語
  - Python 3.12


## セットアップ方法
```bash

# 開発サーバー起動
cd frontend
npm run dev
```

```bash

# 仮想環境作成 & 有効化
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 依存関係インストール
pip install -r requirements.txt

# マイグレーション実行
python manage.py migrate

# 管理ユーザー作成
python manage.py createsuperuser

# 開発サーバー起動
python manage.py runserver
```
