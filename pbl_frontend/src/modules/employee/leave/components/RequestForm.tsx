import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import React from "react";

export const RequestForm: React.FunctionComponent = () => {
  const [leaveType, setLeaveType] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [leaveDays, setLeaveDays] = React.useState("");
  const [session, setSession] = React.useState("");
  const [reason, setReason] = React.useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form submitted:", {
      leaveType,
      startDate,
      endDate,
      leaveDays,
      session,
      reason,
    });
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setLeaveDays("");
    setSession("");
    setReason("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Leave Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="leaveType"
          >
            Leave Type
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            id="leaveType"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="startDate"
            >
              Start Date
            </label>
            <DatePicker className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="endDate"
            >
              End Date
            </label>
            <DatePicker className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="leaveDays"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Leave Days
            </label>
            <input
              type="number"
              id="leaveDays"
              value={leaveDays}
              onChange={(e) => setLeaveDays(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="session"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Session
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              id="session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              required
            >
              <option value="FullDay">Full Day</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="reason"
          >
            Reason
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
