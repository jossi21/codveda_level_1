// Here is Api configuration
let API_BASE_URL = "http://localhost:1616";

// console.log(API_BASE_URL);

// dom Elements
const baseUrlElement = document.getElementById("baseUrl");

// console.log(baseUrlElement.outerHTML);
// console.log(baseUrlElement.textContent);

const currentApiUrlElement = document.getElementById("currentApiUrl");
// console.log(currentApiUrlElement.outerHTML);

// api status checking
const apiStatusElement = document.getElementById("apiStatus");
// console.log(apiStatusElement.innerHTML);

// status message
const statusMessage = document.getElementById("statusMessage");
// console.log(statusMessage);

// response dom
const apiFetchDataContainer = document.getElementById("apiFetchDataContainer");
const apiResponse = document.getElementById("apiResponse");
// console.log(homeApiResponse);

// update API base URL
function updateBaseUrl(event) {
  // prevent default
  event.preventDefault();
  const newUrl = document.getElementById("apiBaseUrl").value.trim();

  //   //   test it
  //   console.log(newUrl);

  //   set conditions
  if (newUrl) {
    API_BASE_URL = newUrl;
    baseUrlElement.textContent = newUrl;
    currentApiUrlElement.textContent = newUrl;

    // console.log(API_BASE_URL);
    // console.log(baseUrlElement);
    // console.log(currentApiUrlElement);

    // call showStatus function
    showStatus("API URL updated successfully!", "success");
    // test the connection
    checkApiConnection();
  }
}

// check API connection
async function checkApiConnection() {
  try {
    apiStatusElement.textContent = "Checking...";
    apiStatusElement.style.color = "#ed8936";
    // console.log(apiStatusElement);

    //fetch the data
    const response = await fetch(`${API_BASE_URL}/`);
    // console.log(response);

    if (response.ok) {
      apiFetchDataContainer.style.display = "block";
      apiStatusElement.textContent = "Connected ✓";
      apiStatusElement.style.color = "#48bb78";

      const data = await response.json();
      // console.log(data);
      apiResponse.textContent = JSON.stringify(data, null, 2);
      apiResponse.style.color = "#48bb78";
    } else {
      apiFetchDataContainer.style.display = "none";
      apiStatusElement.textContent = "Connecting Error";
      apiStatusElement.style.color = "#f56565";
    }
  } catch (error) {
    apiStatusElement.textContent = "Not connected";
    apiStatusElement.style.color = "#f56565";
  }
}

// show status message
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status status-${type}`;
  statusMessage.style.display = "block";

  //   hide it after 5second
  setTimeout(() => {
    statusMessage.style.display = "none";
  }, 5000);
}

// now get all courses
async function getAllCourses() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses`);
    // console.log(response);
    const data = await response.json();
    if (response.ok) {
      displayCourse(data.data);
      showStatus(`Loaded ${data.data.length} courses`, `success`);
      apiFetchDataContainer.style.display = "block";
    } else {
      showStatus(data.error || "Failed to load courses", "error");
    }
  } catch (error) {
    showStatus("Error Connecting to API: " + error.message, "error");
  }
}

// get Single Course
async function getOneCourse() {
  const courseCode = document.getElementById("courseCode").value.trim();

  if (!courseCode) {
    showStatus("Please enter a course code", "error");
    return;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseCode}`);
    // console.log(response);
    const data = await response.json();

    if (data.success) {
      displayCourse([data.data]);
      apiFetchDataContainer.style.display = "block";
      showStatus(`Found course: ${data.course_name}`, "success");
    } else {
      apiFetchDataContainer.style.display = "none";
      showStatus(
        `Corse Code ${courseCode} not found: please enter the correct one`,
        "error",
      );
    }
  } catch (error) {
    showStatus(`Error fetching course:` + error.message, `error`);
  }
}

// add course
async function addCourse() {
  const courseName = document.getElementById("courseName").value.trim();
  const courseCode = document.getElementById("courseCode").value.trim();

  if (!courseCode || !courseName) {
    showStatus(`Please enter Course code and name`, "error");
    return;
  }
  const courseData = {
    course_code: courseCode,
    course_name: courseName,
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });
    // console.log(response);

    const data = await response.json();
    if (response.ok) {
      showStatus("Course created successfully", "success");

      //   clear the form
      document.getElementById("courseCode").value = "";
      document.getElementById("courseName").value = "";
      // refresh the list
      getAllCourses();
    } else {
      showStatus(data.error || "Failed to create course", "error");
    }
  } catch (error) {
    showStatus("Error creating course: " + error.message, "error");
  }
}

// edit course
function editCourse(courseCode, courseName) {
  document.getElementById("courseCode").value = courseCode;
  document.getElementById("courseName").value = courseName;

  showStatus(`Editing course ${courseCode}`, "success");
}
// Update courses
async function updateCourse() {
  const courseCode = document.getElementById("courseCode").value.trim();
  const courseName = document.getElementById("courseName").value.trim();

  // check if course Code exist
  if (!courseCode) {
    showStatus("Please enter course code to update", "error");
    return;
  }

  // check if course name
  if (!courseName) {
    showStatus("Please enter course name to update", "error");
    return;
  }

  const courseData = {
    course_name: courseName,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });

    const data = await response.json();

    if (data.success) {
      showStatus(
        `Course update: ${data.data.course_code} - ${data.data.course_name}`,
        "success",
      );

      // Refresh course list
      getAllCourses();
      document.getElementById("courseCode").value = "";
      document.getElementById("courseName").value = "";
    } else {
      showStatus(data.error || "Failed to update course", "error");
    }
  } catch (error) {
    showStatus("Error updating course: " + error.message, "error");
  }
}

// Delete Course
async function deleteCourse(courseCode) {
  if (!confirm(`Delete course ${courseCode}?`)) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/courses/${courseCode}`, {
      method: "DELETE",
    });

    const data = await response.json();
    if (response.ok) {
      showStatus("Course deleted successfully", "success");
      getAllCourses();
    } else {
      showStatus(data.error || "Delete failed", "error");
    }
  } catch (error) {
    showStatus("Error deleting course: " + error.message, "error");
  }
}
// Display courses in the UI
function displayCourse(courses) {
  if (!courses || courses.length === 0) {
    apiFetchDataContainer.style.display = "block";
    apiFetchDataContainer.innerHTML = "<div> <div></div>No Courses Found</div>";
    return;
  }
  // console.log(courses);

  // map fetch data
  apiFetchDataContainer.style.display = "block";

  apiFetchDataContainer.innerHTML = courses
    .map(
      (course) => `
    <div class="fetched__data__container">
    <div>${course.course_id}</div>
    <div>${course.course_code}</div>
    <div>${course.course_name}</div>
    <div class="edit__delete__btn">
    <div>
    <i class ="fa-solid fa-pen edit-icon"
    title = "Edit"
onclick="editCourse('${course.course_code}', '${course.course_name}')"
    ></i>
    </div>
    <div>
    <i class ="fa-solid fa-trash delete-icon" 
    title= "Delete"
    onclick = "deleteCourse('${course.course_code}')"
    ></i>
    </div></div>
    
    </div>`,
    )
    .join("");
}
