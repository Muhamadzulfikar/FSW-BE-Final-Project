const { getAllCourseCategories } = require('../courseCategoryRepository');

describe('getAllCourseCategories', () => {
  test('should return all course categories', async () => {
    const result = await getAllCourseCategories();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
});
