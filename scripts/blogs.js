const latest_blog = document.getElementById("latest_blog");
const blogs = document.getElementById("blogs");
const blogPath = "../pages/blogs/";
const url = "http://localhost:3000";

// Format: ../blogs/YYYY_MM/DDMonth
const currentYear = new Date().getFullYear(); // Output: YYYY
let year = 2026;
let monthShort = 1;
let day = 1;

const monthsAbbr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

while (year <= currentYear) {
  while (monthShort <= 12) {
    const yearMonth = year + "_" + monthShort + "/"; // ../YYYY_MM
    // console.log("Year and Month : " + yearMonth);

    for (const month of monthsAbbr) {
      while (day <= 31) {
        const dayMonth = day + month; // ../DDMonth{.txt}
        const blogFilePath = blogPath + yearMonth + dayMonth;

        // Check if file (blog) exists. If so, insert into blog.html
        const fileData = fetchFile(blogFilePath);
        day++;
      }
      day = 1;
    }
    monthShort++;
  }
  year++;
}

async function checkFileExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    // Status 200-299 means the file exists
    return response.ok;
  } catch (error) {
    console.error("Error checking file:", error);
    return false;
  }
}

async function fetchFile(blogFilePath) {
  try {
    // Fetch the text file from the server
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: blogFilePath }),
    });

    const data = await response.json();
    return data;

    // return data back
  } catch (err) {
    console.error("Error communicating with server: ", err);
  }
}
