import axios from "axios";

interface IngestHistoryArgs {
  integrationId: string;
  timestamp: Date;
  streamId: string;
  value: number;
}

export class BuenoClient {
  private axiosInstance;
  private email;
  private password;

  constructor(apiUrl: string, email: string, password: string) {
    const axiosInstance = axios.create({
      baseURL: apiUrl,
    });

    axiosInstance.interceptors.request.use((config) => {
      console.log(
        `Axios: Sending request ${config.method} ${config.url} - `,
        config.data,
      );
      return config;
    });

    axiosInstance.interceptors.response.use((config) => {
      console.log(`Axios: Received response ${config.status} - `, config.data);
      return config;
    });

    this.axiosInstance = axiosInstance;
    this.email = email;
    this.password = password;
  }

  /** returns the access token from logging in. */
  public async login(): Promise<string> {
    const res = await this.axiosInstance.post("/v2/login", {
      email: this.email,
      password: this.password,
    });

    return res.data.token;
  }

  public async ingestHistory({
    integrationId,
    timestamp,
    streamId,
    value,
  }: IngestHistoryArgs): Promise<void> {
    const accessToken = await this.login();

    this.axiosInstance.post(
      `/v2/integrations/${integrationId}/history`,
      {
        data: {
          [timestamp.toISOString().split("Z")[0]]: [
            {
              streamId,
              val: value,
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }
}
