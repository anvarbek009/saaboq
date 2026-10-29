'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataStore } from '@/lib/store';
import { Course, Video } from '@/types';
import { BookOpen, Play, CheckCircle2, ArrowRight } from 'lucide-react';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseLessonsMap, setCourseLessonsMap] = useState<Record<string, Video[]>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    DataStore.init();
    const loadedCourses = DataStore.getCourses();
    setCourses(loadedCourses);

    const map: Record<string, Video[]> = {};
    loadedCourses.forEach(c => {
      map[c.id] = DataStore.getCourseLessons(c.id);
    });
    setCourseLessonsMap(map);
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-[var(--text-low)] font-mono">Loading course tracks...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-[var(--text-high)] font-mono uppercase tracking-wider">
          Structured Learning Tracks
        </h1>
        <p className="text-xs text-[var(--text-mid)] mt-1">
          Cohesive, multi-lesson course syllabi designed for systematic mastery without tangential distractions.
        </p>
      </div>

      <div className="space-y-8">
        {courses.map((course) => {
          const lessons = courseLessonsMap[course.id] || [];
          return (
            <div
              key={course.id}
              id={course.id}
              className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-[8px] p-5 space-y-5"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row gap-5">
                <div className="relative aspect-video md:w-72 rounded-[6px] overflow-hidden bg-black shrink-0 border border-[var(--border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 video-duration-badge">
                    {lessons.length} Lessons
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-[var(--accent)]">
                        {course.difficulty}
                      </span>
                      <span className="text-xs text-[var(--text-low)] font-mono">
                        {course.category}
                      </span>
                    </div>

                    <h2 className="text-lg font-semibold text-[var(--text-high)]">
                      {course.title}
                    </h2>
                    <p className="text-xs text-[var(--text-mid)] mt-1.5 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {course.creator && (
                    <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                      <Link
                        href={`/channel/${course.creator.username}`}
                        className="flex items-center gap-2.5 group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={course.creator.avatar_url}
                          alt={course.creator.display_name}
                          className="w-7 h-7 rounded-full object-cover border border-[var(--border)]"
                        />
                        <div>
                          <div className="text-xs font-medium text-[var(--text-high)] group-hover:text-[var(--accent)] transition-colors">
                            {course.creator.display_name}
                          </div>
                          <div className="text-[11px] text-[var(--text-low)]">
                            @{course.creator.username}
                          </div>
                        </div>
                      </Link>

                      {lessons.length > 0 && (
                        <Link
                          href={`/watch/${lessons[0].id}`}
                          className="btn-primary text-xs h-8 px-3"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Start Course</span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Course Lessons List / Syllabus */}
              <div className="pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-high)]">
                    Curriculum Syllabus ({lessons.length} Modules)
                  </h3>
                </div>

                <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-[6px] overflow-hidden bg-[var(--bg-main)]">
                  {lessons.map((lesson, idx) => (
                    <Link
                      key={lesson.id}
                      href={`/watch/${lesson.id}`}
                      className="flex items-center justify-between p-3 hover:bg-[var(--bg-elevated)] transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs text-[var(--text-low)] w-6 text-center">
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-[var(--text-high)] group-hover:text-[var(--accent)] truncate">
                            {lesson.title}
                          </div>
                          <div className="text-[11px] text-[var(--text-low)] font-mono mt-0.5">
                            Duration: {formatDuration(lesson.duration_seconds)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[var(--text-low)] group-hover:text-[var(--accent)] shrink-0 ml-3 font-mono">
                        <span>Watch</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
