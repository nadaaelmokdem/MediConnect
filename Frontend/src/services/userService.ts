import { isAxiosError } from "axios";
import api from "./api";

export async function addToRole(email: string, role: string) {
  try {
    await api.post("auth/add-to-role", { email: email, role: role });
    console.log("done");
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.log(error.message);
      if (error.response && error.response.status === 400) {
        throw new Error("Invalid data provided!");
      }
    } else if (error instanceof Error) {
      console.log("Error: " + error.message);
    }
  }
}
