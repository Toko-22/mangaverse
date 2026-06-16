# MangaVerse 🎌

منصة عربية لمتابعة المانجا والمانهوا مع مجتمع تفاعلي.

## 🏗️ هيكل المشروع

```
├── backend/          # FastAPI + Python
│   ├── server.py     # الخادم الرئيسي
│   ├── requirements.txt
│   └── ...
├── frontend/         # React + Tailwind
│   ├── src/
│   ├── package.json
│   └── ...
├── Procfile          # Railway deployment
├── railway.json      # Railway config
├── netlify.toml      # Netlify config
└── .env.example      # متغيرات البيئة
```

---

## 🚀 خطوات الـ Deploy

### الخطوة 1: رفع الكود على GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mangaverse.git
git push -u origin main
```

---

### الخطوة 2: قاعدة البيانات — MongoDB Atlas (مجاني)

1. اذهب إلى [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ حساب مجاني → **Create a Free Cluster** (M0 Free Tier)
3. اختر أي Region
4. اضغط **Connect** → **Connect your application**
5. انسخ الـ Connection String مثل:
   ```
   mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/
   ```
6. استبدل `<password>` بكلمة المرور الخاصة بك
7. في **Network Access**: اضغط **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0)

---

### الخطوة 3: Backend — Railway

1. اذهب إلى [railway.app](https://railway.app) وسجل دخول بـ GitHub
2. اضغط **New Project** → **Deploy from GitHub repo**
3. اختر `mangaverse`
4. بعد الربط، اذهب إلى **Variables** وأضف:

| Variable | Value |
|----------|-------|
| `MONGO_URL` | `mongodb+srv://...` (من Atlas) |
| `DB_NAME` | `otaku_hub` |
| `JWT_SECRET` | أي string عشوائي طويل |
| `ADMIN_EMAIL` | `admin@otaku.com` |
| `ADMIN_PASSWORD` | كلمة مرور قوية |
| `PORT` | `8000` |

5. اضغط **Deploy** — Railway سيشغّل الـ backend تلقائياً
6. انسخ الـ URL مثل: `https://mangaverse-backend.up.railway.app`

---

### الخطوة 4: Frontend — Netlify

1. اذهب إلى [netlify.com](https://netlify.com) وسجل دخول بـ GitHub
2. اضغط **Add new site** → **Import an existing project**
3. اختر GitHub → `mangaverse`
4. إعدادات البناء:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
5. اضغط **Show advanced** → **New variable** وأضف:

| Variable | Value |
|----------|-------|
| `REACT_APP_BACKEND_URL` | `https://mangaverse-backend.up.railway.app` |

6. اضغط **Deploy site**
7. بعد الانتهاء ستحصل على URL مثل: `https://mangaverse.netlify.app`

---

## ✅ التحقق من نجاح الـ Deploy

```bash
# تحقق من الـ Backend
curl https://YOUR-RAILWAY-URL.up.railway.app/api/

# يجب أن يرجع:
# {"ok": true, "name": "Otaku Hub"}
```

---

## 🔑 دخول لوحة الإدارة

- URL: `https://YOUR-NETLIFY-URL.netlify.app/admin`
- Email: القيمة اللي حطيتها في `ADMIN_EMAIL`
- Password: القيمة اللي حطيتها في `ADMIN_PASSWORD`

---

## 📦 المتطلبات التقنية

- Python 3.11+
- Node.js 18+
- MongoDB Atlas (مجاني)

---

## 🛠️ تشغيل محلي

### Backend
```bash
cd backend
pip install -r requirements.txt
# أنشئ ملف .env (انسخ من .env.example)
cp ../.env.example .env
# عدّل القيم في .env
uvicorn server:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
# أنشئ .env.local
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env.local
npm start
```
