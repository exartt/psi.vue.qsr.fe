// import jwtDecode from "jwt-decode";
// import { Cookies } from "quasar";

// export function isCookieValid(): boolean {
//   const cookieValue = Cookies.get("Authorization");
//   if (!cookieValue) return false;

//   try {
//     const decodedToken: any = jwtDecode(cookieValue);

//     const currentTime = Math.floor(Date.now() / 1000);

//     if (decodedToken.exp < currentTime) {
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error("Erro ao decodificar o token:", error);
//     return false;
//   }
// }
