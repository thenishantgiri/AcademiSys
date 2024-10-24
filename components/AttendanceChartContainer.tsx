import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Calculate the start of the current week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  // Calculate the end of the week (Friday, as Saturday is not a working day)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 5); // +5 days gets us to Friday
  endOfWeek.setHours(23, 59, 59, 999);

  // Query attendance data for the current week
  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  // Days of the week (Nepal working days: Sun to Fri)
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  // Initialize the attendance map for each working day
  const attendanceMap = daysOfWeek.reduce(
    (acc, day) => ({
      ...acc,
      [day]: { present: 0, absent: 0 },
    }),
    {} as Record<string, { present: number; absent: number }>
  );

  // Process attendance data
  resData.forEach((item) => {
    const dayName = daysOfWeek[new Date(item.date).getDay()];
    if (item.present) {
      attendanceMap[dayName].present += 1;
    } else {
      attendanceMap[dayName].absent += 1;
    }
  });

  // Map attendance data into a structured format
  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>
      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
