// It was a try to use axios interceptor but it didn't work for me
export async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem("token");

  // Set the Authorization header if the accessToken is available
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, options);

  // If the token is expired (assuming 401 or 403 status)
  if (response.statusCode === 401 || response.statusCode === 403) {
    console.log("Access token expired, attempting to refresh...");

    const refreshResponse = await fetch(
      "http://localhost:5000/api/v1/auth/refresh",
      {
        method: "GET",
      }
    );

    const refreshData = await refreshResponse.json();

    if (refreshResponse.ok) {
      // Store the new access token and retry the original request
      localStorage.setItem("token", refreshData["New Access Token"]);

      // Retry the original request with the new access token
      options.headers[
        "Authorization"
      ] = `Bearer ${refreshData["New Access Token"]}`;
      response = await fetch(url, options);
    } else {
      console.error("Failed to refresh token", refreshData);
      // Handle logout or redirect to login
      return refreshData;
    }
  }

  return response;
}
