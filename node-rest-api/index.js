// let the app to config .env file
require("dotenv").config();

// importing express module
const express = require("express");

// initialize our app
const app = express();

// Declaring our PORT
const PORT = process.env.PORT;

// middleware
app.use(express.json());

// In-memory database
let courses = [
  { course_id: 1, course_code: "CS101", course_name: " Cybersecurity" },
  { course_id: 2, course_code: "NET102", course_name: " Networking" },
  { course_id: 3, course_code: "DS103", course_name: " Data Science" },
];

// GET all courses
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Course API",
    instruction:
      "Use this Example for course_code sample: let the course is'Cybersecurity' course_code can be 'CS104, CS205' or 'CS211'etc....",
    endpoints: {
      get_all: "GET /api/courses",
      get_one: "GET /api/courses/:course_code",
      create: "POST /api/courses",
      update: "PUT /api/courses/:course_code",
      delete: "DELETE /api/courses/:course_code",
    },
  });
});

// -------------------------
// CRUD ROUTES
// -------------------------

// GET all courses
app.get("/api/courses", (req, res) => {
  try {
    if (courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No courses found",
      });
    }
    // if it is success return this
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// GET single course
app.get("/api/courses/:course_code", (req, res) => {
  try {
    // get a single course
    const course = courses.find(
      (c) => c.course_code === req.params.course_code,
    );
    console.log(course);

    // if it is invalid course_code
    if (!course) {
      return res.status(404).json({
        success: false,
        error: `Course with course code ${req.params.course_code} not found`,
      });
    } else {
      res.status(200).json({
        success: true,
        data: course,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// POST create product
app.post("/api/courses", (req, res) => {
  try {
    const { course_id, course_code, course_name } = req.body;

    // make some validation
    if (!course_id || !course_code || !course_name) {
      return res.status(400).json({
        success: false,
        error: "Please provide course_id, course_code and course_name",
      });
    }

    // Generate a new course_id
    const newCourse = {
      course_id:
        courses.length > 0
          ? Math.max(...courses.map((c) => c.course_id)) + 1
          : 1,
      course_code,
      course_name,
    };

    // Add the new course to the array
    courses.push(newCourse);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// PUT update course
app.put("/api/courses/:course_code", (req, res) => {
  try {
    // find the index of the course to update
    const courseIndex = courses.findIndex(
      (c) => c.course_code === req.params.course_code,
    );

    // if enter an existed course_code
    if (courseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Course with code ${req.params.course_code} not found`,
      });
    }

    // get data from the user
    const { course_code: new_course_code, course_name } = req.body;

    // Update only the provide fields
    if (new_course_code) courses[courseIndex].course_code = new_course_code;
    if (course_name) courses[courseIndex].course_name = course_name;

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: courses[courseIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
});

// DELETE products
app.delete("/api/courses/:course_code", (req, res) => {
  try {
    // get course codeindex of will be delete course
    const courseCodeIndex = courses.findIndex(
      (c) => c.course_code === req.params.course_code,
    );

    // if the course codeindex is invalid
    if (courseCodeIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Course with code ${req.params.course_code} not found`,
      });
    }

    // get deleted course data before delete
    const deletedCourse = courses[courseCodeIndex];

    // DELETE happens here
    courses.splice(courseCodeIndex, 1);

    // success response
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: deletedCourse,
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
});
// initialize port
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
