export interface PublishValidationItem {
  id: string;
  label: string;
  status: 'valid' | 'warning' | 'error';
  message: string;
  required: boolean;
}

export interface SkillTreeValidationData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  difficulty: string;
  courses: CourseValidationData[];
}

export interface CourseValidationData {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  estimatedTime: number;
  chapters?: ChapterValidationData[];
}

export interface ChapterValidationData {
  id: string;
  title: string;
  content: object;
  status: 'draft' | 'published' | 'archived';
  chapterType: string;
}

export function validateSkillTreeForPublishing(
  data: SkillTreeValidationData
): PublishValidationItem[] {
  const items: PublishValidationItem[] = [];

  // Basic information validation
  items.push({
    id: 'title',
    label: 'Title',
    status: data.title.trim().length >= 3 ? 'valid' : 'error',
    message:
      data.title.trim().length >= 3
        ? 'Title is provided'
        : 'Title must be at least 3 characters long',
    required: true,
  });

  items.push({
    id: 'description',
    label: 'Description',
    status: data.description.trim().length >= 50 ? 'valid' : 'error',
    message:
      data.description.trim().length >= 50
        ? 'Description is comprehensive'
        : 'Description should be at least 50 characters for better discovery',
    required: true,
  });

  items.push({
    id: 'short-description',
    label: 'Short Description',
    status: data.shortDescription.trim().length >= 20 ? 'valid' : 'warning',
    message:
      data.shortDescription.trim().length >= 20
        ? 'Short description is provided'
        : 'Short description helps with previews and search results',
    required: false,
  });

  items.push({
    id: 'category',
    label: 'Category',
    status: data.category.trim().length > 0 ? 'valid' : 'error',
    message:
      data.category.trim().length > 0
        ? 'Category is selected'
        : 'Category is required for learner discovery',
    required: true,
  });

  // Course slugs uniqueness validation
  const courseSlugValidation = validateCourseSlugUniqueness(data.courses);
  items.push(courseSlugValidation);

  // Courses validation
  const publishedCourses = data.courses.filter(
    course => course.status === 'published'
  );
  const totalCourses = data.courses.length;

  items.push({
    id: 'courses-exist',
    label: 'Courses Available',
    status: totalCourses > 0 ? 'valid' : 'error',
    message:
      totalCourses > 0
        ? `${totalCourses} course${totalCourses > 1 ? 's' : ''} created`
        : 'At least one course is required',
    required: true,
  });

  if (totalCourses > 0) {
    items.push({
      id: 'published-courses',
      label: 'Published Courses',
      status: publishedCourses.length > 0 ? 'valid' : 'warning',
      message:
        publishedCourses.length > 0
          ? `${publishedCourses.length} of ${totalCourses} courses are published`
          : "No courses are published yet. Learners won't see any content.",
      required: false,
    });

    // Check if we have at least one course with reasonable content
    const coursesWithContent = data.courses.filter(
      course => course.estimatedTime > 0
    );

    items.push({
      id: 'course-content',
      label: 'Course Content Quality',
      status:
        coursesWithContent.length === totalCourses
          ? 'valid'
          : coursesWithContent.length > 0
            ? 'warning'
            : 'error',
      message:
        coursesWithContent.length === totalCourses
          ? 'All courses have proper descriptions and timing'
          : coursesWithContent.length > 0
            ? `${coursesWithContent.length} of ${totalCourses} courses have complete information`
            : 'Courses need descriptions and estimated timing',
      required: coursesWithContent.length > 0,
    });
  }

  // Skill tree structure validation
  if (totalCourses >= 2) {
    items.push({
      id: 'learning-path',
      label: 'Learning Path Structure',
      status: 'warning',
      message: 'Consider adding prerequisites to create a guided learning path',
      required: false,
    });
  }

  return items;
}

export function validateCourseForPublishing(
  data: CourseValidationData
): PublishValidationItem[] {
  const items: PublishValidationItem[] = [];

  // Basic information validation
  items.push({
    id: 'title',
    label: 'Course Title',
    status: data.title.trim().length >= 3 ? 'valid' : 'error',
    message:
      data.title.trim().length >= 3
        ? 'Title is provided'
        : 'Title must be at least 3 characters long',
    required: true,
  });

  // Slug validation
  const slugValidation = validateCourseSlug(data.slug);
  items.push({
    id: 'slug',
    label: 'Course Slug',
    status: slugValidation.isValid ? 'valid' : 'error',
    message: slugValidation.message,
    required: true,
  });

  items.push({
    id: 'description',
    label: 'Course Description',
    status: data.description.trim().length >= 20 ? 'valid' : 'error',
    message:
      data.description.trim().length >= 20
        ? 'Description is comprehensive'
        : 'Description should be at least 20 characters',
    required: true,
  });

  items.push({
    id: 'estimated-time',
    label: 'Estimated Duration',
    status: data.estimatedTime > 0 ? 'valid' : 'warning',
    message:
      data.estimatedTime > 0
        ? `Duration: ${data.estimatedTime} minutes`
        : 'Setting estimated duration helps learners plan their time',
    required: false,
  });

  // Chapters validation (if applicable)
  if (data.chapters && data.chapters.length > 0) {
    const publishedChapters = data.chapters.filter(
      chapter => chapter.status === 'published'
    );
    const totalChapters = data.chapters.length;

    items.push({
      id: 'chapters-exist',
      label: 'Course Content',
      status: totalChapters > 0 ? 'valid' : 'error',
      message:
        totalChapters > 0
          ? `${totalChapters} chapter${totalChapters > 1 ? 's' : ''} created`
          : 'At least one chapter is required',
      required: true,
    });

    items.push({
      id: 'published-chapters',
      label: 'Published Chapters',
      status: publishedChapters.length > 0 ? 'valid' : 'warning',
      message:
        publishedChapters.length > 0
          ? `${publishedChapters.length} of ${totalChapters} chapters are published`
          : "No chapters are published. Learners won't see any content.",
      required: false,
    });

    // Check chapter content quality
    const chaptersWithContent = data.chapters.filter(
      chapter =>
        chapter.title.trim().length >= 3 &&
        chapter.content &&
        Object.keys(chapter.content).length > 0
    );

    items.push({
      id: 'chapter-content',
      label: 'Chapter Content Quality',
      status:
        chaptersWithContent.length === totalChapters
          ? 'valid'
          : chaptersWithContent.length > 0
            ? 'warning'
            : 'error',
      message:
        chaptersWithContent.length === totalChapters
          ? 'All chapters have content'
          : chaptersWithContent.length > 0
            ? `${chaptersWithContent.length} of ${totalChapters} chapters have content`
            : 'Chapters need titles and content',
      required: chaptersWithContent.length > 0,
    });
  } else {
    items.push({
      id: 'no-chapters',
      label: 'Course Content',
      status: 'warning',
      message:
        'No chapters found. Consider adding chapters to structure the learning content.',
      required: false,
    });
  }

  return items;
}

export function getPublishingStats(courses: CourseValidationData[]) {
  return {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.status === 'published').length,
    draftCourses: courses.filter(c => c.status === 'draft').length,
  };
}

export function validateCourseSlugUniqueness(
  courses: CourseValidationData[]
): PublishValidationItem {
  const slugCounts = new Map<string, CourseValidationData[]>();

  // Group courses by slug
  courses.forEach(course => {
    if (course.slug && course.slug.trim()) {
      const slug = course.slug.trim().toLowerCase();
      if (!slugCounts.has(slug)) {
        slugCounts.set(slug, []);
      }
      slugCounts.get(slug)!.push(course);
    }
  });

  // Find duplicate slugs
  const duplicateSlugs = Array.from(slugCounts.entries()).filter(
    ([_, coursesWithSlug]) => coursesWithSlug.length > 1
  );

  // Check for missing slugs
  const coursesWithoutSlugs = courses.filter(
    course => !course.slug || !course.slug.trim()
  );

  let status: 'valid' | 'warning' | 'error' = 'valid';
  let message = 'All course slugs are unique';

  if (duplicateSlugs.length > 0) {
    status = 'error';
    const duplicateNames = duplicateSlugs
      .map(
        ([slug, coursesWithSlug]) =>
          `"${slug}" (${coursesWithSlug.map(c => c.title).join(', ')})`
      )
      .join(', ');
    message = `Duplicate slugs found: ${duplicateNames}`;
  } else if (coursesWithoutSlugs.length > 0) {
    status = 'warning';
    message = `${coursesWithoutSlugs.length} course${coursesWithoutSlugs.length > 1 ? 's' : ''} missing slug${coursesWithoutSlugs.length > 1 ? 's' : ''}`;
  }

  return {
    id: 'course-slugs',
    label: 'Course Slugs',
    status,
    message,
    required: duplicateSlugs.length === 0,
  };
}

export function validateCourseSlug(slug: string): {
  isValid: boolean;
  message: string;
} {
  if (!slug || !slug.trim()) {
    return { isValid: false, message: 'Slug is required' };
  }

  const trimmedSlug = slug.trim();

  // Check length
  if (trimmedSlug.length < 3) {
    return {
      isValid: false,
      message: 'Slug must be at least 3 characters long',
    };
  }

  if (trimmedSlug.length > 50) {
    return { isValid: false, message: 'Slug must be less than 50 characters' };
  }

  // Check format (alphanumeric, hyphens, underscores only)
  const slugRegex = /^[a-z0-9-_]+$/;
  if (!slugRegex.test(trimmedSlug)) {
    return {
      isValid: false,
      message:
        'Slug can only contain lowercase letters, numbers, hyphens, and underscores',
    };
  }

  // Check that it doesn't start or end with hyphen/underscore
  if (
    trimmedSlug.startsWith('-') ||
    trimmedSlug.startsWith('_') ||
    trimmedSlug.endsWith('-') ||
    trimmedSlug.endsWith('_')
  ) {
    return {
      isValid: false,
      message: 'Slug cannot start or end with hyphen or underscore',
    };
  }

  // Check for consecutive hyphens/underscores
  if (
    trimmedSlug.includes('--') ||
    trimmedSlug.includes('__') ||
    trimmedSlug.includes('-_') ||
    trimmedSlug.includes('_-')
  ) {
    return {
      isValid: false,
      message: 'Slug cannot contain consecutive hyphens or underscores',
    };
  }

  return { isValid: true, message: 'Valid slug format' };
}
