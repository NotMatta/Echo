"use server"

export const getServerUrl = async () => {
  return process.env.SERVER_URL;
}
