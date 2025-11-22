"use client";
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types/session';
import { useSessionStore } from '@/lib/stores/sessionStore';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user: currentUser } = useSessionStore();
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [stageInput, setStageInput] = useState<string>('');
  const [deletingAll, setDeletingAll] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateEmail = async (sessionId: string) => {
    try {
      await fetch(`/api/admin/users/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: editEmail }),
      });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update email:', error);
    }
  };

  const handleTogglePass = async (sessionId: string, field: 'has1DayPass' | 'hasStandard', value: boolean) => {
    try {
      await fetch(`/api/admin/users/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !value }),
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle pass:', error);
    }
  };

  const handleDelete = async (sessionId: string) => {
    try {
      await fetch(`/api/admin/users/${sessionId}`, { method: 'DELETE' });
      setDeletingId(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleStageSave = async (sessionId: string) => {
    const value = stageInput.trim();
    if (!value) {
      setEditingStageId(null);
      return;
    }
    const numeric = Number(value);
    if (isNaN(numeric)) {
      alert('数値を入力してください');
      return;
    }
    try {
      await fetch(`/api/admin/users/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: numeric }),
      });
      setEditingStageId(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update stage:', error);
    }
  };

  const handleDeleteAllOthers = async () => {
    if (!currentUser) {
      alert('ログインユーザーが見つかりません');
      return;
    }

    const otherUsers = users.filter(u => u.sessionId !== currentUser.sessionId);
    if (otherUsers.length === 0) {
      alert('削除対象のユーザーがいません');
      setDeletingAll(false);
      return;
    }

    try {
      await Promise.all(
        otherUsers.map(u => fetch(`/api/admin/users/${u.sessionId}`, { method: 'DELETE' }))
      );
      setDeletingAll(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete users:', error);
      alert('削除に失敗しました');
      setDeletingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100svh] bg-white flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ユーザー管理(Admin)</h1>
          <div className="flex gap-3">
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              再読み込み
            </button>
            {deletingAll ? (
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAllOthers}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  確認：他ユーザー削除
                </button>
                <button
                  onClick={() => setDeletingAll(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeletingAll(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                他ユーザー全削除
              </button>
            )}
          </div>
        </div>

        {users.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">ユーザーが見つかりません</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">セッションID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">メール</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stage</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ステージ更新日時</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">1日パス</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Standard</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">作成日時</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr 
                    key={user.sessionId} 
                    className={`hover:bg-gray-50 ${
                      currentUser?.sessionId === user.sessionId 
                        ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                        : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-xs sm:text-sm font-mono text-gray-900 break-all">
                      {user.sessionId}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {editingId === user.sessionId ? (
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="px-2 py-1 border rounded text-sm flex-1"
                            placeholder="user@example.com"
                          />
                          <button
                            onClick={() => handleUpdateEmail(user.sessionId)}
                            className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          >
                            保存
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                          >
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <span className="text-gray-900">{user.email || '未設定'}</span>
                          <button
                            onClick={() => {
                              setEditingId(user.sessionId);
                              setEditEmail(user.email || '');
                            }}
                            className="text-blue-500 hover:text-blue-700 text-xs"
                          >
                            編集
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {editingStageId === user.sessionId ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={stageInput}
                            onChange={(e) => setStageInput(e.target.value)}
                            className="px-2 py-1 border rounded text-xs w-20"
                            placeholder={String(user.stage ?? 0)}
                          />
                          <button
                            onClick={() => handleStageSave(user.sessionId)}
                            className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          >保存</button>
                          <button
                            onClick={() => setEditingStageId(null)}
                            className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                          >取消</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-800 text-xs sm:text-sm">{user.stage?.toFixed(1) ?? '0.0'}</span>
                          <button
                            onClick={() => { setEditingStageId(user.sessionId); setStageInput(String(user.stage)); }}
                            className="text-blue-500 hover:text-blue-700 text-xs"
                          >編集</button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.stageupDate ? new Date(user.stageupDate).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }) : '未設定'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleTogglePass(user.sessionId, 'has1DayPass', user.has1DayPass)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.has1DayPass
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {user.has1DayPass ? '有効' : '無効'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => handleTogglePass(user.sessionId, 'hasStandard', user.hasStandard)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.hasStandard
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {user.hasStandard ? '有効' : '無効'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(user.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {deletingId === user.sessionId ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(user.sessionId)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            確認
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                          >
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingId(user.sessionId)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          削除
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p>全 {users.length} ユーザー</p>
        </div>
      </div>
    </div>
  );
}
