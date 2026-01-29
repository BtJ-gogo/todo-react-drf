const fetchTasks = async (url, options={}, nav, authHeaders) => {
    const response = await fetch(url, {
        ...options,
        headers: authHeaders(),
    });

    if (response.status === 401) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        nav("/login");
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response;
}

export default fetchTasks;