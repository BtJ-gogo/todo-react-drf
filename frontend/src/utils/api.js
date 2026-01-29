const fetchTasks = async (url, options={}, navigate, authHeaders) => {
    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
    }
    const response = await fetch(url, {
        ...options,
        headers: authHeaders(),
    });

    if (response.status === 401) {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
            logout();
            throw new Error("Unauthorized");
        }
        
        try {
            const refreshResponse = await fetch("http://localhost:8000/api/token/refresh/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!refreshResponse.ok) {
                logout();
                throw new Error("Unauthorized");
            }

            const refreshData = await refreshResponse.json();
            localStorage.setItem("access", refreshData.access);
            const newAuthHeaders = {
                ...authHeaders(),
                Authorization: `Bearer ${refreshData.access}`,
            };

            const retryResponse = await fetch(url, {
                ...options,
                headers: newAuthHeaders,
            });
            return retryResponse;

        } catch (error) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            navigate("/login");
            throw new Error(error.message);
        }
               
    }

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response;
}

export default fetchTasks;