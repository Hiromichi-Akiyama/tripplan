import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Package, Share2, Plus, Clock, DollarSign, ExternalLink, ChevronRight, Menu, X, Edit2, Trash2, User, Settings, Archive, HelpCircle, LogOut, ArrowLeft, ClipboardList, Plane, Check, AlertCircle, Info } from 'lucide-react';

// --- ヘルパー関数 ---
const getDaysArray = (start, end) => {
  const arr = [];
  const dt = new Date(start);
  const endDt = new Date(end);
  while (dt <= endDt) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

const formatDateISO = (date) => date.toISOString().split('T')[0];

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const formatDateRange = (startStr, endStr) => {
  if (!startStr) return '';
  const start = new Date(startStr);
  const sYear = start.getFullYear();
  const sMonth = start.getMonth() + 1;
  const sDay = start.getDate();

  if (!endStr) return `${sYear}年${sMonth}月${sDay}日`;

  const end = new Date(endStr);
  const eYear = end.getFullYear();
  const eMonth = end.getMonth() + 1;
  const eDay = end.getDate();

  if (sYear === eYear) {
    if (sMonth === eMonth) {
      return `${sYear}年${sMonth}月${sDay}日〜${eDay}日`;
    }
    return `${sYear}年${sMonth}月${sDay}日〜${eMonth}月${eDay}日`;
  }
  return `${sYear}年${sMonth}月${sDay}日〜${eYear}年${eMonth}月${eDay}日`;
};

// 色から美しいグラデーションを生成する関数
const generateGradient = (hexColor) => {
  let c = hexColor.substring(1);
  if (c.length === 3) c = c.split('').map(v => v + v).join('');
  const num = parseInt(c, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  const r2 = Math.min(255, r + 60);
  const g2 = Math.min(255, g + 60);
  const b2 = Math.min(255, b + 60);

  const color1 = `rgb(${r}, ${g}, ${b})`;
  const color2 = `rgb(${r2}, ${g2}, ${b2})`;
  
  return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
};

// --- 共通コンポーネント ---
const CategoryIcon = ({ category }) => {
  switch(category) {
    case 'transport': return <span className="text-blue-600">✈️</span>;
    case 'sightseeing': return <span className="text-green-600">🏛️</span>;
    case 'meal': return <span className="text-orange-600">🍴</span>;
    case 'lodging': return <span className="text-purple-600">🏨</span>;
    default: return <span className="text-gray-600">📝</span>;
  }
};

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
      <Icon size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6 max-w-sm text-sm leading-relaxed">{description}</p>
    {action && <div className="mt-2">{action}</div>}
  </div>
);

// フラッシュメッセージコンポーネント
const FlashMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300 w-11/12 max-w-md ${
      type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`}>
      {type === 'error' ? <AlertCircle size={20} className="flex-shrink-0" /> : <Check size={20} className="flex-shrink-0" />}
      <span className="font-medium text-sm md:text-base">{message}</span>
    </div>
  );
};

// --- サイドメニューコンポーネント ---
const SideMenu = ({ isOpen, onClose, currentUser, onNavigate, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <span className="text-lg font-bold text-gray-900">メニュー</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
              {currentUser?.name?.[0] || 'G'}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 truncate">{currentUser?.name || 'ゲストユーザー'}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser?.email || ''}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('profile')} 
            className="w-full mt-2 text-sm text-blue-600 font-medium text-left hover:underline"
          >
            プロフィールを編集
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {[
              { id: 'trips', label: 'マイ旅一覧', icon: MapPin },
            ].map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => onNavigate(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  <item.icon size={20} className="text-gray-400" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors"
          >
            <LogOut size={20} />
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ページコンポーネント ---

const LandingPage = ({ onLogin, onSignup, onDemo }) => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <MapPin className="text-white" size={20} />
          </div>
          <span className="text-2xl font-bold text-gray-900">TripPlan</span>
        </div>
        <div className="flex gap-2 md:gap-4">
          <button onClick={onLogin} className="px-3 md:px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors text-sm md:text-base">ログイン</button>
          <button onClick={onSignup} className="px-4 md:px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium transition-all text-sm md:text-base">新規登録</button>
        </div>
      </div>
    </header>
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">計画。準備。出発。</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">旅程管理・宿泊・スポット・持ち物リストを1つのアプリで。</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onLogin} className="px-8 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 font-semibold text-lg transition-all shadow-lg hover:shadow-xl">プランを始める</button>
          <button onClick={onDemo} className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 font-semibold text-lg transition-all">デモを見る</button>
        </div>
      </div>

      {/* 機能カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-20">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">旅程管理</h3>
          <p className="text-gray-600">
            日ごとに活動・時間・場所を整理して、旅程を一箇所で管理できます。
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
            <Package className="text-green-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">持ち物リスト</h3>
          <p className="text-gray-600">
            必需品を忘れません。荷造りしながらチェックリストで確認できます。
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">メモ機能</h3>
          <p className="text-gray-600">
            旅の計画、アイデア、注意事項を自由に書き留めて管理できます。
          </p>
        </div>
      </div>
    </div>
  </div>
);

const LoginPage = ({ onLoginSuccess, onNavigateToSignup, onNavigateToReset, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'メールアドレスを入力してください';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = '有効なメールアドレスを入力してください';
    if (!password) newErrors.password = 'パスワードを入力してください';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onLoginSuccess({ email, name: 'ユーザー' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div onClick={onBack} className="flex items-center justify-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <MapPin className="text-white" size={24} />
          </div>
          <span className="text-3xl font-bold text-gray-900">TripPlan</span>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ログイン</h1>
          <p className="text-gray-600 mb-6">アカウントにログインして旅行を管理しましょう</p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">メールアドレス</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">パスワード</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">ログイン状態を保持</span>
                </label>
                <button type="button" onClick={onNavigateToReset} className="text-sm text-blue-600 hover:text-blue-700 font-medium">パスワードを忘れた場合</button>
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold transition-all shadow-sm hover:shadow-md">ログイン</button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">アカウントをお持ちでない方は<button onClick={onNavigateToSignup} className="text-blue-600 hover:text-blue-700 font-semibold ml-1">新規登録</button></p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900">← トップページに戻る</button>
        </div>
      </div>
    </div>
  );
};

const SignupPage = ({ onSignupSuccess, onNavigateToLogin, onBack }) => {
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', name: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email) newErrors.email = 'メールアドレスを入力してください';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = '有効なメールアドレスを入力してください';
    
    if (!form.password) newErrors.password = 'パスワードを入力してください';
    else if (form.password.length < 8) newErrors.password = '8文字以上で入力してください';
    
    if (form.password !== form.passwordConfirm) newErrors.passwordConfirm = 'パスワードが一致しません';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSignupSuccess({ email: form.email, name: form.name || 'ユーザー' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div onClick={onBack} className="flex items-center justify-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <MapPin className="text-white" size={24} />
          </div>
          <span className="text-3xl font-bold text-gray-900">TripPlan</span>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">新規登録</h1>
          <p className="text-gray-600 mb-6">アカウントを作成して旅行の計画を始めましょう</p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="example@email.com"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* パスワード */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  パスワード <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  placeholder="8文字以上、英数字を含む"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">8文字以上、英字と数字を含めてください</p>
              </div>

              {/* パスワード（確認） */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  パスワード（確認） <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.passwordConfirm}
                  onChange={(e) => setForm({...form, passwordConfirm: e.target.value})}
                  placeholder="もう一度入力してください"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.passwordConfirm && (
                  <p className="text-sm text-red-500 mt-1">{errors.passwordConfirm}</p>
                )}
              </div>

              {/* 名前（任意） */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  名前 <span className="text-gray-500 text-xs">（任意）</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="山田太郎"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">後から設定することもできます</p>
              </div>

              {/* 新規登録ボタン */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold transition-all shadow-sm hover:shadow-md"
              >
                新規登録
              </button>
            </div>
          </form>

          {/* 利用規約 */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            登録することで、<a href="#" className="text-blue-600 hover:underline">利用規約</a>と
            <a href="#" className="text-blue-600 hover:underline">プライバシーポリシー</a>に同意したものとみなされます
          </p>

          {/* ログインリンク */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              すでにアカウントをお持ちの方は
              <button
                onClick={onNavigateToLogin}
                className="text-blue-600 hover:text-blue-700 font-semibold ml-1"
              >
                ログイン
              </button>
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900">← トップページに戻る</button>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage = ({ onNavigateToLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: '有効なメールアドレスを入力してください' });
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div onClick={onBack} className="flex items-center justify-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"><MapPin className="text-white" size={24} /></div>
            <span className="text-3xl font-bold text-gray-900">TripPlan</span>
          </div>
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-4xl">✉️</span></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">メールを送信しました</h1>
            <p className="text-gray-600 mb-6"><span className="font-semibold">{email}</span> 宛に<br/>パスワードリセット用のリンクを送信しました。</p>
            <button onClick={onNavigateToLogin} className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold transition-all">ログイン画面に戻る</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div onClick={onBack} className="flex items-center justify-center gap-2 mb-8 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"><MapPin className="text-white" size={24} /></div>
          <span className="text-3xl font-bold text-gray-900">TripPlan</span>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">パスワードリセット</h1>
          <p className="text-gray-600 mb-6">登録したメールアドレスを入力してください。<br/>パスワードリセット用のリンクをお送りします。</p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">メールアドレス</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              <button type="submit" className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold transition-all shadow-sm hover:shadow-md">リセットリンクを送信</button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button onClick={onNavigateToLogin} className="text-sm text-blue-600 hover:text-blue-700 font-semibold">← ログイン画面に戻る</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TripsIndexPage = ({ trips, onSelectTrip, onNewTrip, onMenuOpen, onBackToLanding }) => {
  const [filter, setFilter] = useState('all');

  const filteredTrips = trips
    .filter(trip => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(trip.endDate);
      
      if (filter === 'upcoming') {
        return endDate >= today;
      } else if (filter === 'past') {
        return endDate < today;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      
      if (filter === 'upcoming') {
        return dateA - dateB;
      }
      return dateB - dateA;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div onClick={onBackToLanding} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900">TripPlan</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onMenuOpen} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">マイ旅一覧</h1>
          <button onClick={onNewTrip} className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2 w-full sm:w-auto justify-center">
            <Plus size={20} />
            新しい旅
          </button>
        </div>
        {trips.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              すべて
            </button>
            <button 
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              今後の旅
            </button>
            <button 
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${filter === 'past' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              過去の旅
            </button>
          </div>
        )}
        
        {trips.length === 0 ? (
          <div className="mt-20">
            <EmptyState 
              icon={Plane}
              title="さあ、次の旅を計画しましょう！"
              description="まだ旅の計画がありません。新しい旅を作成して、素晴らしい思い出を作りましょう。"
              action={
                <button onClick={onNewTrip} className="mt-4 px-8 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto">
                  <Plus size={20} />
                  最初の旅を作成する
                </button>
              }
            />
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="mt-12 text-center text-gray-500">
            <p>該当する旅はありません</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTrips.map(trip => (
              <div 
                key={trip.id}
                onClick={() => onSelectTrip(trip)}
                className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col md:flex-row group"
              >
                <div 
                  className="h-40 md:h-auto md:w-64 relative flex-shrink-0"
                  style={{ background: generateGradient(trip.color) }}
                >
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: trip.color }} />
                    <span className="text-sm font-medium text-gray-500">{trip.destination}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{trip.title}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    {trip.dateRange}
                  </p>
                </div>
                <div className="hidden md:flex items-center px-6 text-gray-300">
                  <ChevronRight size={24} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NewTripPage = ({ initialData, onSave, onCancel, onNavigateToTrips }) => {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    color: '#4c6ef5',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [tempColor, setTempColor] = useState(formData.color);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setTempColor(initialData.color);
    } else {
      setFormData({
        title: '',
        destination: '',
        startDate: '',
        endDate: '',
        color: '#4c6ef5'
      });
      setTempColor('#4c6ef5');
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'タイトルは必須です';
    if (!formData.destination) newErrors.destination = '目的地は必須です';
    if (!formData.startDate) newErrors.startDate = '開始日は必須です';
    if (!formData.endDate) newErrors.endDate = '終了日は必須です';
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = '終了日は開始日以降の日付を選択してください';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleColorSelect = (color) => {
    setTempColor(color);
  };

  const applyColor = () => {
    setFormData(prev => ({ ...prev, color: tempColor }));
  };

  // プリセット色
  const presetColors = [
    '#4c6ef5', '#f06595', '#cc5de8', '#ff922b', '#20c997', '#10b981', '#6366f1'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div onClick={onCancel} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900">TripPlan</span>
          </div>
          <button onClick={onCancel} className="text-gray-600 hover:text-gray-900 font-medium">
            {initialData ? '← 旅の詳細に戻る' : '← マイ旅一覧に戻る'}
          </button>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <nav className="text-sm text-gray-500 mb-6 flex items-center flex-wrap gap-1">
          {initialData ? (
             <>
               <span onClick={onNavigateToTrips} className="hover:text-gray-700 cursor-pointer hover:underline">マイ旅一覧</span>
               {' > '}
               <span onClick={onCancel} className="hover:text-gray-700 cursor-pointer hover:underline">{initialData.title}</span>
               {' > '}
               <span className="text-gray-900 font-medium">編集</span>
             </>
          ) : (
             <>
               <span onClick={onNavigateToTrips} className="hover:text-gray-700 cursor-pointer hover:underline">マイ旅一覧</span>
               {' > '}
               <span className="text-gray-900 font-medium">新しい旅を作成</span>
             </>
          )}
        </nav>
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{initialData ? '旅を編集' : '新しい旅を作成'}</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">旅のタイトル <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="例：北海道 冬の旅"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">目的地 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                  placeholder="例：札幌・小樽"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.destination ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.destination && <p className="text-sm text-red-500 mt-1">{errors.destination}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">開始日 <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">終了日 <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                   {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">テーマカラー</label>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    {presetColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={`w-12 h-12 rounded-xl transition-all ${
                          tempColor === color 
                            ? 'ring-4 ring-offset-2 ring-gray-400 scale-105' 
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex flex-col items-center">
                      <input
                        type="color"
                        value={tempColor}
                        onChange={(e) => handleColorSelect(e.target.value)}
                        className="w-14 h-14 p-1 rounded-xl cursor-pointer bg-white border border-gray-200"
                      />
                      <span className="text-xs text-gray-500 mt-1">選択中</span>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">プレビュー</p>
                      <div className="h-2 rounded-full w-full mb-3" style={{ background: generateGradient(tempColor) }}></div>
                      <button
                        type="button"
                        onClick={applyColor}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                          tempColor === formData.color
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-gray-900 text-white hover:bg-gray-700 shadow-sm'
                        }`}
                        disabled={tempColor === formData.color}
                      >
                        {tempColor === formData.color ? '適用済み' : 'この色を適用'}
                        {tempColor === formData.color && <Check size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button type="submit" className="w-full sm:flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold transition-all shadow-sm hover:shadow-md">
                  {initialData ? '変更を保存' : '作成する'}
                </button>
                <button type="button" onClick={onCancel} className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 font-semibold transition-all">キャンセル</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const NewActivityPage = ({ initialData, selectedTrip, onSave, onCancel, onNavigateToTrips, onNavigateToTripDetail }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    cost: '',
    address: '',
    url: '',
    bookingCode: '',
    memo: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  // 時刻選択用のオプション生成 (00-23時, 00-55分(5分刻み))
  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minuteOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'タイトルは必須です';
    if (!formData.date) newErrors.date = '日付は必須です';
    if (formData.cost && parseInt(formData.cost) < 0) newErrors.cost = '費用には0以上の整数を入力してください';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleTimeChange = (field, type, val) => {
    const current = formData[field] || '';
    let [h, m] = current.split(':');
    
    if (type === 'hour') {
      if (val === '') {
        // 時をクリアしたら全体をクリア（未設定）
        handleChange(field, '');
      } else {
        h = val;
        // 分が未設定なら00にする
        if (!m) m = '00';
        handleChange(field, `${h}:${m}`);
      }
    } else if (type === 'minute') {
      m = val;
      // 時が未設定なら00にする
      if (!h) h = '00';
      handleChange(field, `${h}:${m}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div onClick={onCancel} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900">TripPlan</span>
          </div>
          <button onClick={onCancel} className="text-gray-600 hover:text-gray-900 font-medium">← 詳細に戻る</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="mb-6">
          <nav className="text-sm text-gray-500 mb-6 flex items-center flex-wrap gap-1">
            <span onClick={onNavigateToTrips} className="hover:text-gray-700 cursor-pointer hover:underline">マイ旅一覧</span>
            {' > '}
            <span onClick={onNavigateToTripDetail} className="hover:text-gray-700 cursor-pointer hover:underline">{selectedTrip?.title}</span>
            {' > '}
            <span onClick={onCancel} className="hover:text-gray-700 cursor-pointer hover:underline">旅程</span>
            {' > '}
            <span className="text-gray-900 font-medium">{initialData.id ? '活動を編集' : '活動を追加'}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{initialData.id ? '活動を編集' : '活動を追加'}</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            {/* 基本情報セクション */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-bold text-gray-900">基本情報</h2>
                <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">旅程に表示されます</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">タイトル <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="例：札幌時計台" className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">日付 <span className="text-red-500">*</span></label>
                  <input type="date" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">開始時刻</label>
                    <div className="flex gap-2 items-center">
                        <select 
                          value={formData.startTime ? formData.startTime.split(':')[0] : ''} 
                          onChange={(e) => handleTimeChange('startTime', 'hour', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">--</option>
                          {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <span>:</span>
                        <select 
                          value={formData.startTime ? formData.startTime.split(':')[1] : ''} 
                          onChange={(e) => handleTimeChange('startTime', 'minute', e.target.value)}
                          disabled={!formData.startTime}
                          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          {minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">終了時刻</label>
                    <div className="flex gap-2 items-center">
                        <select 
                          value={formData.endTime ? formData.endTime.split(':')[0] : ''} 
                          onChange={(e) => handleTimeChange('endTime', 'hour', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">--</option>
                          {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <span>:</span>
                        <select 
                          value={formData.endTime ? formData.endTime.split(':')[1] : ''} 
                          onChange={(e) => handleTimeChange('endTime', 'minute', e.target.value)}
                          disabled={!formData.endTime}
                          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          {minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">場所</label>
                  <input type="text" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="例：札幌市中央区" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">費用</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">¥</span>
                    <input type="number" value={formData.cost} onChange={(e) => handleChange('cost', e.target.value)} placeholder="0" className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cost ? 'border-red-500' : 'border-gray-300'}`} />
                  </div>
                   {errors.cost && <p className="text-sm text-red-500 mt-1">{errors.cost}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">メモ</label>
                  <textarea value={formData.memo} onChange={(e) => handleChange('memo', e.target.value)} placeholder="活動についてのメモや注意事項" rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </div>
            </div>

            {/* 詳細情報セクション */}
            <div className="mb-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-bold text-gray-900">詳細情報</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">任意・詳細ページのみ表示</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-2">住所</label>
                  <input type="text" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="例：北海道札幌市中央区北1条西2丁目" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-2">URL</label>
                  <input type="url" value={formData.url} onChange={(e) => handleChange('url', e.target.value)} placeholder="https://example.com" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-2">予約番号</label>
                  <input type="text" value={formData.bookingCode} onChange={(e) => handleChange('bookingCode', e.target.value)} placeholder="例：CH-2026021001" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold transition-all shadow-sm hover:shadow-md">
                {initialData.id ? '変更を保存' : '保存する'}
              </button>
              <button type="button" onClick={onCancel} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 font-semibold transition-all">キャンセル</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const TripDetailPageContent = ({ selectedTrip, sampleActivities, onBack, onEdit, onDelete, activeTab, setActiveTab, onAddActivity, onEditActivity, onDeleteActivity, onUpdatePackingList }) => {
  // 追加: マウント時にトップへスクロール
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!selectedTrip) return null;
  const currentPackingList = selectedTrip.packingList || [];
  const tripDays = getDaysArray(selectedTrip.startDate, selectedTrip.endDate);
  
  // Trip IDで活動をフィルタリング
  const tripActivities = sampleActivities.filter(a => a.tripId === selectedTrip.id);
  const getActivitiesForDate = (dateStr) => {
    const acts = tripActivities.filter(a => a.date === dateStr);
    // 企画書のソート順:
    // 1. start_timeがあるもの -> 未設定
    // 2. start_time昇順
    return acts.sort((a, b) => {
      const timeA = a.startTime || '';
      const timeB = b.startTime || '';
      if (timeA && !timeB) return -1;
      if (!timeA && timeB) return 1;
      if (!timeA && !timeB) return 0;
      return timeA.localeCompare(timeB);
    });
  };

  const [newPackingItem, setNewPackingItem] = useState({ name: '', category: '衣類' });
  const [draggedItem, setDraggedItem] = useState(null);

  // 合計費用の自動計算ロジック
  const totalCost = tripActivities.reduce((sum, activity) => {
    if (!activity.cost) return sum;
    // 数値以外の文字を除去し、数値に変換。空や不正な値は0とする
    const costValue = parseInt(activity.cost.toString().replace(/[^0-9]/g, ''), 10);
    return sum + (isNaN(costValue) ? 0 : costValue);
  }, 0);

  // 持ち物をカテゴリごとにグループ化
  const groupedPackingList = currentPackingList.reduce((acc, item) => {
    const category = item.category || 'その他';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
  
  // カテゴリ表示順（固定）
  const categoryOrder = ['衣類', '洗面用具', '電子機器', '書類', '医薬品', 'その他'];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div onClick={onBack} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><MapPin className="text-white" size={20} /></div>
            <span className="text-2xl font-bold text-gray-900">TripPlan</span>
          </div>
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900 font-medium">← マイ旅一覧に戻る</button>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <span onClick={onBack} className="hover:text-gray-700 cursor-pointer hover:underline">マイ旅一覧</span>
          {' > '}
          <span className="text-gray-900 font-medium">{selectedTrip.title}</span>
        </nav>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-6">
          {/* グラデーションを適用 */}
          <div className="h-2 rounded-full mb-6" style={{ background: generateGradient(selectedTrip.color) }} />
          <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{selectedTrip.title}</h1>
              <p className="text-xl text-gray-600 flex items-center gap-2"><MapPin size={20} />{selectedTrip.destination}</p>
              <p className="text-gray-500 flex items-center gap-2 mt-2"><Calendar size={18} />{selectedTrip.dateRange}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit(selectedTrip)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium flex items-center gap-2"><Edit2 size={16} />編集</button>
              <button onClick={() => onDelete(selectedTrip.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-medium flex items-center gap-2"><Trash2 size={16} />削除</button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('itinerary')} className={`px-6 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap ${activeTab === 'itinerary' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>旅程</button>
          <button onClick={() => setActiveTab('packing')} className={`px-6 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap ${activeTab === 'packing' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>持ち物</button>
          <button onClick={() => setActiveTab('notes')} className={`px-6 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap ${activeTab === 'notes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>メモ</button>
          <div className="flex-1" />
        </div>
        
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {tripDays.map((day, index) => {
              const dateStr = formatDateISO(day);
              const dayActivities = getActivitiesForDate(dateStr);
              return (
                <div key={dateStr} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-baseline gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{index + 1}日目</h2>
                    <span className="text-sm text-gray-500">({formatDateDisplay(dateStr)})</span>
                  </div>
                  <div className="space-y-4">
                    {dayActivities.length > 0 ? dayActivities.map((activity, idx) => (
                      <div key={idx} onClick={() => onEditActivity(activity)} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 border border-gray-200 rounded-2xl hover:shadow-md cursor-pointer transition-all">
                        <div className="flex items-center gap-2 sm:w-32 sm:block sm:flex-shrink-0 text-gray-700 font-medium">
                          <Clock size={16} className="inline sm:mr-2" />{activity.time}
                        </div>
                        <div className="hidden sm:block flex-shrink-0"><CategoryIcon category={activity.category} /></div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2 sm:hidden mb-1"><CategoryIcon category={activity.category} /><span className="font-semibold">{activity.title}</span></div>
                           <h3 className="hidden sm:block font-semibold text-gray-900 mb-1">{activity.title}</h3>
                           <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin size={14} />{activity.location}</p>
                        </div>
                        <div className="flex-shrink-0 text-left sm:text-right mt-2 sm:mt-0">
                          <p className="font-semibold text-gray-900 flex items-center gap-1"><DollarSign size={16} className="hidden" />{activity.cost ? `¥${Number(activity.cost).toLocaleString()}` : '¥0'}</p>
                        </div>
                        <ChevronRight size={20} className="text-gray-400 self-center hidden sm:block" />
                      </div>
                    )) : <div className="py-6 flex flex-col items-center justify-center text-gray-400"><p className="text-sm">予定はまだありません。『+この日の活動を追加』から登録しましょう。</p></div>}
                  </div>
                  <button onClick={() => onAddActivity(dateStr)} className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2"><Plus size={18} />この日の活動を追加</button>
                </div>
              );
            })}
            
            {/* 合計費用の表示（常時表示） */}
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">合計活動数</p>
                <p className="text-2xl font-bold text-gray-900">{tripActivities.length}件</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">合計費用</p>
                <p className="text-2xl font-bold text-gray-900">¥{totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Packing and Notes Tabs code remains the same... */}
        {activeTab === 'packing' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">持ち物リスト</h2>
            
            {/* アイテム追加フォーム */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-gray-50 rounded-2xl">
              <input 
                type="text" 
                placeholder="アイテム名"
                value={newPackingItem.name}
                onChange={(e) => setNewPackingItem({...newPackingItem, name: e.target.value})}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newPackingItem.name.trim()) {
                    const newItem = {
                      id: Date.now(),
                      name: newPackingItem.name.trim(),
                      category: newPackingItem.category,
                      checked: false
                    };
                    onUpdatePackingList([...currentPackingList, newItem]);
                    setNewPackingItem({ name: '', category: '衣類' });
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select 
                value={newPackingItem.category}
                onChange={(e) => setNewPackingItem({...newPackingItem, category: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>衣類</option>
                <option>電子機器</option>
                <option>書類</option>
                <option>洗面用具</option>
                <option>医薬品</option>
                <option>その他</option>
              </select>
              <button 
                onClick={() => {
                  if (newPackingItem.name.trim()) {
                    const newItem = {
                      id: Date.now(),
                      name: newPackingItem.name.trim(),
                      category: newPackingItem.category,
                      checked: false
                    };
                    onUpdatePackingList([...currentPackingList, newItem]);
                    setNewPackingItem({ name: '', category: '衣類' });
                  }
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-medium transition-all"
              >
                追加
              </button>
            </div>

            {currentPackingList.length === 0 ? (
              <EmptyState icon={ClipboardList} title="リストが空です" description="リストが空です。忘れ物を防ぐために、まずは必需品から追加してみましょう。" />
            ) : (
              <div className="space-y-6">
                {categoryOrder.map(cat => {
                   const items = groupedPackingList[cat];
                   if (!items || items.length === 0) return null;
                   
                   // 未チェックを上に、チェック済みを下にソート
                   const sortedItems = [...items].sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1));

                   return (
                     <div key={cat} className="mb-4">
                       <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">{cat}</h3>
                       <div className="space-y-2">
                          {sortedItems.map((item) => (
                            <div 
                              key={item.id}
                              className={`flex items-center gap-4 p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all ${
                                item.checked ? 'bg-gray-50 opacity-75' : ''
                              }`}
                            >
                              <input type="checkbox" checked={item.checked} onChange={() => {
                                const newItems = currentPackingList.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i);
                                onUpdatePackingList(newItems);
                              }} className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-2 cursor-pointer" />
                              <span className={`flex-1 ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'}`}>{item.name}</span>
                              <button onClick={() => {
                                if (window.confirm('削除しますか？')) {
                                  onUpdatePackingList(currentPackingList.filter(i => i.id !== item.id));
                                }
                              }} className="text-red-500 p-2"><X size={18} /></button>
                            </div>
                          ))}
                       </div>
                     </div>
                   );
                })}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">旅のメモ</h2>
            <textarea 
              className="w-full h-64 p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="フライト番号、予約メモ、現地でやりたいことなどを自由に書き留めましょう。" 
            />
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl font-medium">保存</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityDetailPage = ({ selectedActivity, selectedTrip, onBack, onEdit, onDelete, onNavigateToTrips }) => {
  if (!selectedActivity) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div onClick={onBack} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><MapPin className="text-white" size={20} /></div>
            <span className="text-2xl font-bold text-gray-900">TripPlan</span>
          </div>
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900 font-medium">← 旅の詳細に戻る</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <nav className="text-sm text-gray-500 mb-6 flex items-center flex-wrap gap-1">
          <span onClick={onNavigateToTrips} className="hover:text-gray-700 cursor-pointer hover:underline">マイ旅一覧</span>
          {' > '}
          <span onClick={onBack} className="hover:text-gray-700 cursor-pointer hover:underline">{selectedTrip?.title}</span>
          {' > '}
          <span onClick={onBack} className="hover:text-gray-700 cursor-pointer hover:underline">旅程</span>
          {' > '}
          <span className="text-gray-900 font-medium">活動詳細</span>
        </nav>

        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">活動詳細</h1>
          <div className="flex gap-3">
            <button onClick={onEdit} className="px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors flex items-center gap-2 text-sm md:text-base"><Edit2 size={16} />編集</button>
            <button onClick={onDelete} className="px-3 md:px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-medium transition-colors flex items-center gap-2 text-sm md:text-base"><Trash2 size={16} />削除</button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 md:p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-bold text-gray-900">基本情報</h2>
              <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">旅程に表示されます</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">タイトル</label>
                <div className="px-3 md:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"><p className="text-gray-900">{selectedActivity.title}</p></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">日付</label>
                <div className="px-3 md:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"><p className="text-gray-900">{selectedActivity.date || '未設定'}</p></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-2">開始時刻</label>
                  <div className="px-3 md:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"><p className="text-gray-900">{selectedActivity.time?.split('–')[0]?.trim() || '未設定'}</p></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-2">終了時刻</label>
                  <div className="px-3 md:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"><p className="text-gray-900">{selectedActivity.time?.split('–')[1]?.trim() || '未設定'}</p></div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">場所</label>
                <div className="px-3 md:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"><p className="text-gray-900">{selectedActivity.location || '未設定'}</p></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">費用</label>
                <div className="px-3 md:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"><p className="text-gray-900">{selectedActivity.cost || '¥0'}</p></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">メモ</label>
                <div className="px-3 md:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[100px]"><p className="text-gray-900 whitespace-pre-wrap">{selectedActivity.memo || '未設定'}</p></div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-bold text-gray-900">詳細情報</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">任意・詳細ページのみ表示</span>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">住所</label>
                <div className="px-3 md:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"><p className="text-gray-900">{selectedActivity.address || '未設定'}</p></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">URL</label>
                <div className="px-3 md:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                  {selectedActivity.url ? (
                    <a href={selectedActivity.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-2 break-all">{selectedActivity.url}<ExternalLink size={16} className="flex-shrink-0" /></a>
                  ) : <p className="text-gray-900">未設定</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-2">予約番号</label>
                <div className="px-3 md:px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"><p className="text-gray-900 font-mono">{selectedActivity.bookingCode || '未設定'}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ currentUser, onUpdateProfile, onBack, onNavigateToTrips }) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <span className="text-xl font-bold text-gray-900">プロフィール編集</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <nav className="text-sm text-gray-500 mb-6 flex items-center flex-wrap gap-1">
          <span onClick={onNavigateToTrips} className="hover:text-gray-700 cursor-pointer hover:underline">マイ旅一覧</span>
          {' > '}
          <span className="text-gray-900 font-medium">プロフィール編集</span>
        </nav>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">名前</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">メールアドレス</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold transition-all shadow-sm hover:shadow-md"
              >
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- メインコンポーネント ---

const TripPlanApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [flash, setFlash] = useState(null); // { message: string, type: 'success' | 'error' }

  const showFlash = (message, type = 'success') => {
    setFlash({ message, type });
  };

  const [trips, setTrips] = useState([
    {
      id: 1,
      title: '北海道 冬の旅',
      destination: '札幌・小樽',
      dateRange: '2026年2月10日〜14日',
      startDate: '2026-02-10',
      endDate: '2026-02-14',
      color: '#4c6ef5', // Indigo
      packingList: [
        { id: 1, name: 'ダウンジャケット', category: '衣類', checked: true },
        { id: 2, name: '手袋', category: '衣類', checked: true },
        { id: 3, name: 'カイロ', category: 'その他', checked: true },
        { id: 4, name: 'スノーブーツ', category: '衣類', checked: false },
        { id: 5, name: 'カメラ', category: '電子機器', checked: false },
        { id: 6, name: 'モバイルバッテリー', category: '電子機器', checked: false }
      ]
    },
    // ... 他の旅データは省略せずに記述する必要がありますが、ここでは簡略化のため維持
      {
      id: 2,
      title: '沖縄 ビーチリゾート',
      destination: '那覇・石垣島',
      dateRange: '2026年5月20日〜25日',
      startDate: '2026-05-20',
      endDate: '2026-05-25',
      color: '#f06595', // Pink
      packingList: [
        { id: 1, name: '水着', category: '衣類', checked: true },
        { id: 2, name: 'サングラス', category: '衣類', checked: true },
        { id: 3, name: '日焼け止め', category: '洗面用具', checked: true },
        { id: 4, name: 'ビーチサンダル', category: '衣類', checked: false },
        { id: 5, name: '防水スマホケース', category: '電子機器', checked: false },
        { id: 6, name: 'タオル', category: '洗面用具', checked: false }
      ]
    },
    {
      id: 3,
      title: '京都 紅葉巡り',
      destination: '京都・奈良',
      dateRange: '2026年11月10日〜15日',
      startDate: '2026-11-10',
      endDate: '2026-11-15',
      color: '#cc5de8', // Grape
      packingList: [
        { id: 1, name: '御朱印帳', category: 'その他', checked: true },
        { id: 2, name: '歩きやすい靴', category: '衣類', checked: true },
        { id: 3, name: 'ハンカチ', category: '衣類', checked: true },
        { id: 4, name: 'ガイドブック', category: '書類', checked: false },
        { id: 5, name: '折り畳み傘', category: 'その他', checked: false },
        { id: 6, name: '自撮り棒', category: '電子機器', checked: false }
      ]
    },
    {
      id: 4,
      title: '東京 週末旅行',
      destination: '東京',
      dateRange: '2024年12月10日〜12日',
      startDate: '2024-12-10',
      endDate: '2024-12-12',
      color: '#ff922b', // Orange
      packingList: [
        { id: 1, name: 'Suica/ICカード', category: '書類', checked: true },
        { id: 2, name: '常備薬', category: '医薬品', checked: true },
        { id: 3, name: '化粧ポーチ', category: '洗面用具', checked: true },
        { id: 4, name: 'モバイルバッテリー', category: '電子機器', checked: false },
        { id: 5, name: 'エコバッグ', category: 'その他', checked: false },
        { id: 6, name: '着替え', category: '衣類', checked: false }
      ]
    },
    {
      id: 5,
      title: 'ソウル グルメツアー',
      destination: 'ソウル',
      dateRange: '2023年9月15日〜18日',
      startDate: '2023-09-15',
      endDate: '2023-09-18',
      color: '#20c997', // Teal
      packingList: [
        { id: 1, name: 'パスポート', category: '書類', checked: true },
        { id: 2, name: '変換プラグ', category: '電子機器', checked: true },
        { id: 3, name: 'クレジットカード', category: '書類', checked: true },
        { id: 4, name: '胃腸薬', category: '医薬品', checked: false },
        { id: 5, name: '翻訳アプリ', category: '電子機器', checked: false },
        { id: 6, name: 'ウェットティッシュ', category: '洗面用具', checked: false }
      ]
    }
  ]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [initialActivityData, setInitialActivityData] = useState(null);
  
  // Sample activities
  const [sampleActivities, setSampleActivities] = useState([
    // ... (activity data same as provided in previous code)
    { id: 101, tripId: 1, date: '2026-02-10', time: '09:00–11:00', category: 'transport', title: 'フライト 羽田→新千歳', location: '羽田空港', cost: '15000', memo: 'ANA 55便' },
    { id: 102, tripId: 1, date: '2026-02-10', time: '12:00–13:00', category: 'meal', title: '海鮮丼ランチ', location: '新千歳空港', cost: '2500', memo: '空港内の有名店で' },
    { id: 103, tripId: 1, date: '2026-02-10', time: '15:00–17:00', category: 'sightseeing', title: '札幌時計台・大通公園', location: '札幌市中央区', cost: '200', memo: '雪まつり見学' },
    { id: 104, tripId: 1, date: '2026-02-11', time: '10:00–12:00', category: 'sightseeing', title: '小樽運河クルーズ', location: '小樽市', cost: '1800', memo: '冬の景色を楽しむ' },
    { id: 105, tripId: 1, date: '2026-02-11', time: '13:00–14:30', category: 'meal', title: '小樽寿司ランチ', location: '寿司屋通り', cost: '3500', memo: '予約済み' },
    { id: 106, tripId: 1, date: '2026-02-11', time: '15:30–17:00', category: 'sightseeing', title: 'オルゴール堂', location: '小樽市', cost: '0', memo: 'お土産購入' },
    { id: 201, tripId: 2, date: '2026-05-20', time: '11:00–14:00', category: 'transport', title: 'フライト 成田→那覇', location: '成田空港', cost: '12000', memo: 'LCC利用' },
    { id: 202, tripId: 2, date: '2026-05-20', time: '15:00–16:00', category: 'meal', title: 'ソーキそば', location: '那覇市内', cost: '800', memo: '到着後の軽食' },
    { id: 203, tripId: 2, date: '2026-05-20', time: '17:00–18:00', category: 'sightseeing', title: '国際通り散策', location: '那覇市', cost: '0', memo: 'お土産の下見' },
    { id: 204, tripId: 2, date: '2026-05-21', time: '09:00–12:00', category: 'sightseeing', title: '美ら海水族館', location: '本部町', cost: '2180', memo: '朝一で行く' },
    { id: 205, tripId: 2, date: '2026-05-21', time: '13:00–14:00', category: 'meal', title: 'カフェランチ', location: '本部町', cost: '1500', memo: '海の見えるカフェ' },
    { id: 206, tripId: 2, date: '2026-05-21', time: '15:00–17:00', category: 'sightseeing', title: 'エメラルドビーチ', location: '本部町', cost: '0', memo: '海水浴' },
    { id: 301, tripId: 3, date: '2026-11-10', time: '10:00–12:00', category: 'sightseeing', title: '清水寺', location: '京都市東山区', cost: '400', memo: '紅葉ライトアップ前' },
    { id: 302, tripId: 3, date: '2026-11-10', time: '12:30–13:30', category: 'meal', title: '湯豆腐ランチ', location: '清水周辺', cost: '3000', memo: '混雑予想' },
    { id: 303, tripId: 3, date: '2026-11-10', time: '14:00–16:00', category: 'sightseeing', title: '高台寺', location: '京都市東山区', cost: '600', memo: '庭園散策' },
    { id: 304, tripId: 3, date: '2026-11-11', time: '09:00–11:00', category: 'sightseeing', title: '嵐山・渡月橋', location: '京都市右京区', cost: '0', memo: '早朝散歩' },
    { id: 305, tripId: 3, date: '2026-11-11', time: '11:30–12:30', category: 'meal', title: '京料理ランチ', location: '嵐山', cost: '4000', memo: '予約必須' },
    { id: 306, tripId: 3, date: '2026-11-11', time: '13:00–15:00', category: 'sightseeing', title: '天龍寺', location: '京都市右京区', cost: '500', memo: '世界遺産' },
    { id: 401, tripId: 4, date: '2024-12-10', time: '10:00–12:00', category: 'sightseeing', title: '浅草寺', location: '台東区浅草', cost: '0', memo: '雷門で写真撮影' },
    { id: 402, tripId: 4, date: '2024-12-10', time: '12:30–13:30', category: 'meal', title: 'もんじゃ焼き', location: '月島', cost: '2000', memo: '人気店へ' },
    { id: 403, tripId: 4, date: '2024-12-10', time: '15:00–18:00', category: 'sightseeing', title: 'スカイツリー', location: '墨田区', cost: '3000', memo: '展望台予約済み' },
    { id: 404, tripId: 4, date: '2024-12-11', time: '09:00–18:00', category: 'sightseeing', title: 'ディズニーランド', location: '千葉県浦安市', cost: '8400', memo: '一日中遊ぶ' },
    { id: 405, tripId: 4, date: '2024-12-11', time: '19:00–20:30', category: 'meal', title: 'パーク内ディナー', location: 'TDL', cost: '4000', memo: 'ショーを見ながら' },
    { id: 406, tripId: 4, date: '2024-12-11', time: '21:00–22:00', category: 'transport', title: 'ホテルへ移動', location: '舞浜', cost: '0', memo: 'シャトルバス' },
    { id: 501, tripId: 5, date: '2023-09-15', time: '12:00–15:00', category: 'transport', title: 'フライト 関空→仁川', location: '関西国際空港', cost: '20000', memo: 'ピーチ航空' },
    { id: 502, tripId: 5, date: '2023-09-15', time: '17:00–18:30', category: 'meal', title: 'サムギョプサル', location: '明洞', cost: '2500', memo: '有名店' },
    { id: 503, tripId: 5, date: '2023-09-15', time: '19:00–21:00', category: 'sightseeing', title: '明洞ショッピング', location: '明洞', cost: '10000', memo: 'コスメ購入' },
    { id: 504, tripId: 5, date: '2023-09-16', time: '10:00–13:00', category: 'sightseeing', title: '景福宮', location: 'ソウル', cost: '300', memo: 'チマチョゴリ体験' },
    { id: 505, tripId: 5, date: '2023-09-16', time: '13:30–14:30', category: 'meal', title: '参鶏湯', location: '土俗村', cost: '1800', memo: '並ぶ可能性あり' },
    { id: 506, tripId: 5, date: '2023-09-16', time: '15:30–17:30', category: 'sightseeing', title: '北村韓屋村', location: '北村', cost: '0', memo: '写真スポット' }
  ]);

  // --- ハンドラー ---

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('trips');
    showFlash('ログインしました');
  };

  const handleSignupSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage('trips');
    showFlash('アカウントを作成しました');
  };

  const handleUpdateProfile = (newUserData) => {
    setCurrentUser(prev => ({ ...prev, ...newUserData }));
    setCurrentPage('trips');
    showFlash('プロフィールを更新しました');
  };

  const handleSaveTrip = (formData) => {
    if (editingTrip) {
      const updatedTrip = { 
        ...editingTrip, 
        ...formData, 
        dateRange: formatDateRange(formData.startDate, formData.endDate),
      };
      const updatedTrips = trips.map(t => t.id === editingTrip.id ? updatedTrip : t);
      setTrips(updatedTrips);
      setSelectedTrip(updatedTrip);
      setEditingTrip(null);
      setCurrentPage('trip-detail');
      showFlash('旅の情報を更新しました');
    } else {
      const newId = trips.length > 0 ? Math.max(...trips.map(t => t.id)) + 1 : 1;
      const newTripData = {
        id: newId,
        ...formData,
        dateRange: formatDateRange(formData.startDate, formData.endDate),
        packingList: []
      };
      setTrips([...trips, newTripData]);
      setCurrentPage('trips');
      showFlash('新しい旅を作成しました');
    }
  };

  const handleDeleteTrip = (tripId) => {
    if (window.confirm('この旅を削除しますか？取り消すことはできません。')) {
      setTrips(trips.filter(t => t.id !== tripId));
      setCurrentPage('trips');
      showFlash('旅を削除しました', 'error');
    }
  };

  const handleUpdatePackingList = (newPackingList) => {
    if (!selectedTrip) return;
    const updatedTrip = { ...selectedTrip, packingList: newPackingList };
    setSelectedTrip(updatedTrip);
    setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  const handleAddActivityStart = (dateStr) => {
    setEditingActivity(null);
    setInitialActivityData({
      title: '',
      date: dateStr,
      startTime: '',
      endTime: '',
      location: '',
      cost: '',
      address: '',
      url: '',
      bookingCode: '',
      memo: ''
    });
    setCurrentPage('new-activity');
  };

  const handleEditActivityStart = (activity) => {
    setEditingActivity(activity);
    const [start, end] = activity.time ? activity.time.split('–') : ['', ''];
    setInitialActivityData({
      ...activity,
      startTime: start || '',
      endTime: end || ''
    });
    setCurrentPage('new-activity');
  };

  const handleSaveActivity = (formData) => {
    if (editingActivity) {
      const updatedActivity = {
        ...editingActivity,
        ...formData,
        time: `${formData.startTime}–${formData.endTime}`
      };
      const updatedActivities = sampleActivities.map(a => a.id === editingActivity.id ? updatedActivity : a);
      setSampleActivities(updatedActivities);
      setSelectedActivity(updatedActivity);
      setCurrentPage('activity-detail');
      showFlash('活動を更新しました');
    } else {
      const newId = sampleActivities.length > 0 ? Math.max(...sampleActivities.map(a => a.id)) + 1 : 1;
      const newActivity = {
        id: newId,
        tripId: selectedTrip.id,
        ...formData,
        time: `${formData.startTime}–${formData.endTime}`,
        category: 'sightseeing'
      };
      setSampleActivities([...sampleActivities, newActivity]);
      setCurrentPage('trip-detail');
      setActiveTab('itinerary');
      showFlash('新しい活動を追加しました');
    }
  };

  // --- Render ---

  return (
    <div>
      {flash && <FlashMessage message={flash.message} type={flash.type} onClose={() => setFlash(null)} />}
      {currentPage === 'landing' && (
        <LandingPage 
          onLogin={() => setCurrentPage('login')} 
          onSignup={() => setCurrentPage('signup')} 
          onDemo={() => setCurrentPage('trips')} 
        />
      )}
      {currentPage === 'login' && (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          onNavigateToSignup={() => setCurrentPage('signup')}
          onNavigateToReset={() => setCurrentPage('reset-password')}
          onBack={() => setCurrentPage('landing')}
        />
      )}
      {currentPage === 'signup' && (
        <SignupPage 
          onSignupSuccess={handleSignupSuccess}
          onNavigateToLogin={() => setCurrentPage('login')}
          onBack={() => setCurrentPage('landing')}
        />
      )}
      {currentPage === 'reset-password' && (
        <ResetPasswordPage 
          onNavigateToLogin={() => setCurrentPage('login')}
          onBack={() => setCurrentPage('landing')}
        />
      )}
      {currentPage === 'trips' && (
        <TripsIndexPage 
          trips={trips} 
          onSelectTrip={(trip) => { 
            setSelectedTrip(trip); 
            setCurrentPage('trip-detail'); 
            setActiveTab('itinerary'); 
          }} 
          onNewTrip={() => { setEditingTrip(null); setCurrentPage('new-trip'); }} 
          onMenuOpen={() => setIsMenuOpen(true)} 
          onBackToLanding={() => setCurrentPage('landing')} 
        />
      )}
      {(currentPage === 'new-trip' || currentPage === 'edit-trip') && (
        <NewTripPage 
          initialData={editingTrip} 
          onSave={handleSaveTrip} 
          onCancel={() => { 
            if (editingTrip) {
              setCurrentPage('trip-detail');
            } else {
              setEditingTrip(null); 
              setCurrentPage('trips'); 
            }
          }} 
          onNavigateToTrips={() => setCurrentPage('trips')}
        />
      )}
      {currentPage === 'trip-detail' && (
        <TripDetailPageContent 
          selectedTrip={selectedTrip}
          sampleActivities={sampleActivities}
          onBack={() => setCurrentPage('trips')}
          onEdit={(trip) => { setEditingTrip(trip); setCurrentPage('edit-trip'); }}
          onDelete={handleDeleteTrip}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onAddActivity={handleAddActivityStart}
          onEditActivity={(activity) => { 
            setSelectedActivity(activity); 
            setCurrentPage('activity-detail'); 
          }}
          onUpdatePackingList={handleUpdatePackingList}
        />
      )}
      {(currentPage === 'new-activity' || currentPage === 'edit-activity') && (
        <NewActivityPage
          initialData={initialActivityData}
          selectedTrip={selectedTrip}
          onSave={handleSaveActivity}
          onCancel={() => setCurrentPage(editingActivity ? 'activity-detail' : 'trip-detail')}
          onNavigateToTrips={() => setCurrentPage('trips')}
          onNavigateToTripDetail={() => setCurrentPage('trip-detail')}
        />
      )}
      {currentPage === 'activity-detail' && (
        <ActivityDetailPage
          selectedActivity={selectedActivity}
          selectedTrip={selectedTrip}
          onBack={() => setCurrentPage('trip-detail')}
          onEdit={() => handleEditActivityStart(selectedActivity)}
          onNavigateToTrips={() => setCurrentPage('trips')}
          onDelete={() => {
             if (window.confirm('この活動を削除しますか？')) {
                const newActivities = sampleActivities.filter(a => a.id !== selectedActivity.id);
                setSampleActivities(newActivities);
                setCurrentPage('trip-detail');
                setActiveTab('itinerary');
                showFlash('活動を削除しました', 'error');
             }
          }}
        />
      )}
      <SideMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentUser={currentUser}
        onNavigate={(page) => {
          setCurrentPage(page);
          setIsMenuOpen(false);
        }}
        onLogout={() => {
           if(window.confirm('ログアウトしますか？')) { 
             setCurrentUser(null);
             setCurrentPage('landing'); 
             setIsMenuOpen(false); 
             showFlash('ログアウトしました');
           } 
        }}
      />
      {currentPage === 'profile' && (
        <ProfilePage 
          currentUser={currentUser} 
          onUpdateProfile={handleUpdateProfile}
          onBack={() => setCurrentPage('trips')}
          onNavigateToTrips={() => setCurrentPage('trips')}
        />
      )}
    </div>
  );
};

export default function App() {
  return <TripPlanApp />;
}