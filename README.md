# Todoアプリ

React、Django REST Frameworkで作成したTodoアプリです。
認証(JSON Web Token)、タスクのCRUD機能を実装しています。

## 主な機能

- タスクのCRUD機能
- 認証機能

## 使用技術

- フロントエンド
  - React  
  - React Hook Form  
  - Zod
  - React Router DOM  
- バックエンド
  - Django 5.2.10
  - Django Rest Framework 3.16.1
  - django-cors-headers 4.9.0
  - djangorestframework-simplejwt
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

## 今後の課題
- XSSに対する対応