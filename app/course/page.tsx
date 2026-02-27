import { getAllLessons } from "@/lib/mdx";
import CourseList from "./CourseList";

export default async function CoursePage() {
  const lessons = await getAllLessons();
  return (
    <div className="course-page">
      <div className="page-header">
        <h1 className="page-title">คอร์สเรียน Python</h1>
        <p className="page-desc">เลือกบทเรียนที่ต้องการ และเริ่มเรียนได้ทันที</p>
      </div>
      <CourseList lessons={lessons} />
    </div>
  );
}
