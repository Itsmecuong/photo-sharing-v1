/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 * Gọi API tới Backend chạy tại localhost:8081
 */
function fetchModel(url, options = {}) {
  const API_BASE_URL = "http://localhost:8081";
  
  // Lấy token từ localStorage
  const token = localStorage.getItem("token");
  
  const fetchOptions = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
  };

  if (options.body) {
    fetchOptions.body = options.body;
  }
  
  return fetch(API_BASE_URL + url, fetchOptions)
    .then(async (response) => {
      if (!response.ok) {
        // Có thể emit event hoặc xử lý nếu trả về 401/403 để redirect về login
        if (response.status === 401 || response.status === 403) {
          console.error("Unauthorized or Token expired");
          localStorage.removeItem("token");
          // Xoá token nếu không hợp lệ
        }
        
        // Cố gắng parse error message từ backend nếu có
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errData = await response.text();
          if (errData) errorMessage = errData;
        } catch (e) {
          // ignore parsing error
        }
        throw new Error(errorMessage);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("fetchModel failed for URL:", url, error);
      throw error;
    });
}

export default fetchModel;
