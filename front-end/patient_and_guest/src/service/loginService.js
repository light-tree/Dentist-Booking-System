import axios from "axios";
const LOGIN_API = "http://localhost:8080/rade/auth/login";
const BRANCH_API = "http://localhost:8080/admin/branch/list";
// const accessToken =
//   "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwOTg3NjU0MzIxLCQyeSQxMCQuMkJUWDNZVDFGcE9uZTYydkRTVkp1V2tCaDRETlhLZWdhazJYNS5ieVNvNUVBZC42Y2N2VyIsInJvbGUiOiJST0xFX0FETUlOIiwiaXNzIjoiQ29kZUphdmEiLCJpYXQiOjE2NTM5NzU3ODksImV4cCI6MTY1Mzk3Njk4OX0.bS8dtiaeJfPgAz0IojH14fGzV1XeuvAvi5ubBQTdyUH1jJRNsOWd9HgjKEhj6WFjSWW5f2PgO4VMW4xxfFGXBg";
// const config = {
//   headers: { Authorization: `Bearer ${accessToken}` },
// };
class AccountService {
  login(phone, password) {
    return axios.post(
      LOGIN_API,
      JSON.stringify({
        phone: phone,
        password: password,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  getBranch() {
    // console.log(config);
    axios
      .get(BRANCH_API, { headers: { "Content-Type": "application/json" } })
      .then((response) => console.log(response))
      .catch((error) => console.log("Error: " + error));
  }

  getCurrentUser() {}
}

export default new AccountService();
