import { ComponentProps, useId } from 'react';

// InputProps 타입을 정의
type InputProps = {
  label?: string; // 입력 필드 위에 표시될 라벨의 텍스트
  required?: boolean; //  입력 필드가 필수 요소인지 여부 (*)
  identity?: string; // 입력 필드의 스타일을 결정하기 위한 식별자
  warnning?: string; // 입력 필드 아래에 표시될 경고 메시지
  innerClassName?: string; // 입력 필드에 추가적으로 적용할 CSS 클래스 이름
} & ComponentProps<'input'>; // HTML input 요소의 모든 속성을 포함

// 컴포넌트에 사용될 스타일을 변수로 정의
const tenMinPlannerRegularStyle = 'bg-transparent';
const tenMinPlannerTodoStyle = '';
const blankNoteStyle = 'border w-[8rem] text-[0.8rem]';

// ParchmentInput 함수형 컴포넌트를 정의합니다. 이 컴포넌트는 입력 필드를 생성합니다.
function ParchmentInput({ label, required, id, identity, warnning, innerClassName, ...props }: InputProps) {
  const inputUid = useId(); // 고유한 ID를 생성
  const inputId = id || inputUid; // // 제공된 id 또는 생성된 고유 id를 사용

  let inputStyle = ''; // 입력 필드에 적용할 스타일을 초기화
  if (identity === 'tenMinPlannerRegular') {
    inputStyle = tenMinPlannerRegularStyle;
  } else if (identity === 'tenMinplannerTodo') {
    inputStyle = tenMinPlannerTodoStyle;
  } else if (identity === 'blank') {
    inputStyle = blankNoteStyle;
  }
  return (
    <div className="flex flex-row border-b-[0.3rem] w-[14.5rem]">
      {/* 라벨이 있는 경우 : 라벨 요소 렌더링 */}
      {label && (
        <label htmlFor={inputId} className={`text-[1.5rem] font-[600] text-[#727272] w-[10rem] bg-red-200`}>
          {label}
        </label>
      )}

      {/* 기본 : 입력 필드 렌더링(기존 설정 스타일+추가 스타일)*/}
      <input id={inputId} {...props} className={`${inputStyle} ${innerClassName}`} />

      {/* 경고 메시지가 필요한 경우 : 경고 메시지를 렌더링합니다. 필수 요소일 경우 경고 메시지 옆에 별표(*)를 추가합니다. */}
      {warnning && required && (
        <label htmlFor={inputId} className="text-sm font-semibold h-4">
          <span className="text-xs font-semibold text-gray-400 p-1">
            {warnning}
            <span className="text-red-500">*</span>
          </span>
        </label>
      )}
    </div>
  );
}

export default ParchmentInput;
