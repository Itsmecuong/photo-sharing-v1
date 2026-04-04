/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
function fetchModel(url) {
  const API_BASE_URL = "https://ff8wmt-8080.csb.app";
  return fetch(API_BASE_URL + url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("fetchModel failed for URL:", url, error);
      throw error;
    });
}

export default fetchModel;
