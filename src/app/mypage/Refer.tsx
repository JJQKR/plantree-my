return (
  <div className="flex flex-col justify-center w-full h-[20rem]">
    <div className="flex flex-col">
      <Input
        identity="meeting"
        label="모임 이름"
        type="text"
        id="meetingName"
        required
        onChange={handleMeetingName}
        value={meetingName}
        // className="border-2 rounded-md h-12 text-xl px-4"
      />
    </div>
    <div className="flex flex-row items-center justify-center mb-4">
      <div className="flex flex-col w-full">
        <label htmlFor="meetingStartDate" className="text-sm flex flex-col text-gray-500">
          시작 날짜
        </label>
        <input
          type="date"
          id="meetingStartDate"
          onChange={handleMeetingStartDate}
          value={meetingStartDate}
          className=" border-2 rounded-md h-8 text-xs px-2 "
        />
      </div>
      <div className="text-center m-3"> ~ </div>
      <div className="flex flex-col w-full">
        <label htmlFor="meetingEndDate" className="text-sm flex flex-col text-gray-500">
          종료 날짜
        </label>
        <input
          type="date"
          id="meetingEndDate"
          onChange={handleMeetingEndDate}
          value={meetingEndDate}
          className="border-2 rounded-md h-8 text-xs px-2"
        />
      </div>
    </div>
    <div className="flex flex-col">
      <Input
        identity="meeting"
        label="비밀번호"
        type="password"
        placeholder="****"
        onChange={handleMeetingPassword}
        value={meetingPassword}
      />
    </div>

    <button onClick={onCreateMeeting} className="bg-button-color text-loginpage-color p-3 mt-3 rounded-xl">
      {meetingId ? '수정하기' : '생성하기'}
    </button>
  </div>
);
