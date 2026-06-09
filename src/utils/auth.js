export const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload; // { userId, role }
  } catch (err) {
    return null;
  }
};
export const getRole = () => {
  const user = getUser();
  return user?.role;
};
