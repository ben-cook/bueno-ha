import axios from "axios";

interface AccessToken {
  /** The token itself */
  token: string;
  /** The datetime that the token was fetched */
  ts: Date;
}

interface IngestHistoryArgs {
  integrationId: string;
  timestamp: Date;
  streamId: string;
  value: number;
}

/** Duration that the access tokens stay valid for, in milliseconds. */
const REFRESH_TIME_MS = 1000 * 5 * 60;

export class BuenoClient {
  private axiosInstance;
  private email;
  private password;
  private accessToken: AccessToken | undefined;

  constructor(apiUrl: string, email: string, password: string) {
    const axiosInstance = axios.create({
      baseURL: apiUrl,
    });

    axiosInstance.interceptors.request.use((config) => {
      console.log(
        `BuenoClient: Sending request ${config.method} ${config.url} - `,
        config.data,
      );
      return config;
    });

    axiosInstance.interceptors.response.use((config) => {
      console.log(
        `BuenoClient: Received response ${config.status} - `,
        config.data,
      );
      return config;
    });

    this.axiosInstance = axiosInstance;
    this.email = email;
    this.password = password;
  }

  /** returns the access token from logging in. */
  public async authenticate(): Promise<string> {
    if (
      this.accessToken != null &&
      new Date().getTime() - this.accessToken.ts.getTime() < REFRESH_TIME_MS
    ) {
      return this.accessToken.token;
    }

    const res = await this.axiosInstance.post("/v2/login", {
      email: this.email,
      password: this.password,
    });

    const token = res.data.token;

    this.accessToken = {
      token,
      ts: new Date(),
    };

    return token;
  }

  public async ingestHistory({
    integrationId,
    timestamp,
    streamId,
    value,
  }: IngestHistoryArgs): Promise<void> {
    const accessToken = await this.authenticate();

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
