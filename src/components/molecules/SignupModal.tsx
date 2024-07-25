import React, { useState } from 'react';
import { supabase } from '../../supabase/client'; // supabase 클라이언트 임포트

interface SignupModalProps {
  onClose: () => void;
  onSignupSuccess: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const signUp = async () => {
    try {
      // 1. 사용자 인증 정보로 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname
          }
        }
      });
      if (authError) throw authError;

      // 2. 회원가입 성공 시, 사용자 프로필 정보 추가
      if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            nickname: nickname,
            email: email
          })
          .select();
        if (profileError) throw profileError;

        // 회원가입과 프로필 정보 추가가 모두 성공하면 모달 닫기 및 성공 콜백 호출
        onClose();
        onSignupSuccess();
        return { authData, profileData };
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'An error occurred.');
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-4 rounded w-96">
        <h1 className="text-xl font-bold mb-4 text-center text-emerald-400">Welcome to PlanTree! </h1>
        <h2 className="text-xl font-bold mb-4 text-center text-black">회원가입</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          type="text"
          placeholder="닉네임"
          className="mb-4 p-2 border rounded w-full text-black"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="email"
          placeholder="이메일"
          className="mb-4 p-2 border rounded w-full text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="mb-4 p-2 border rounded w-full text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex flex-col gap-2 mt-4">
          <button className="w-full px-4 py-3 font-bold bg-blue-500 text-black rounded" onClick={signUp}>
            회원가입
          </button>
          <button className="w-full px-4 py-3 bg-gray-500 text-black rounded" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
