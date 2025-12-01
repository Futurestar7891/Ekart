const API = import.meta.env.VITE_API;
 export const checkAuth = async (setLoading,setError,setIsLoggedIn,setUser) => {
    setLoading(true);
    setError("");

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000); // abort after 4 sec

    try {
      const res = await fetch(`${API}/auth/check`, {
        method: "GET",
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();

      if (data.loggedIn) {
        setIsLoggedIn(true);
        setUser(data.user);
        setError("");
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.log("Auth check aborted or failed:", error);
      setError("Something went Wrong with server");
      setIsLoggedIn(false);
      setUser(null);
    }

    setLoading(false);
  };