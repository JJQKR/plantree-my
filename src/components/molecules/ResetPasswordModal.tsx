import React, { useState } from 'react';
import { supabase } from '@/supabase/client';

interface ResetPasswordModalProps {
  token: string | null;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ token, onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setError(null);
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      setMessage(null);
      setError(error instanceof Error ? error.message : 'An error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
      <div className="bg-white p-4 rounded w-96">
        <h1 className="text-xl font-bold mb-4 text-center text-emerald-400">Welcome to PlanTree! </h1>
        <h2 className="text-xl font-bold mb-4 text-center text-black">비밀번호 재설정</h2>
        <input
          type="password"
          placeholder="새 비밀번호를 입력하세요."
          className="mb-4 p-2 border rounded w-full text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호를 다시 입력하세요."
          className="mb-4 p-2 border rounded w-full text-black"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col gap-2 mt-4">
          <button className="w-full px-4 py-3 bg-gray-500 text-white rounded" onClick={onClose}>
            취소
          </button>
          <button className="w-full px-4 py-3 bg-blue-500 text-white rounded" onClick={handleResetPassword}>
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
