# Hosting Your Node.js App on Google Cloud Platform (GCP)

Your application is now configured for deployment on **Google App Engine**! Here is a step-by-step guide.

## Prerequisites

1.  **Google Cloud Account**: Sign up at [cloud.google.com](https://cloud.google.com).
2.  **Google Cloud SDK**: Install the `gcloud` CLI tool ([Install Guide](https://cloud.google.com/sdk/docs/install)).
3.  **MongoDB Atlas Account**: Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) for the database.

---

## Step 1: Set Up MongoDB Atlas (Database)

1.  Log in to **MongoDB Atlas** and create a **Project** & **Cluster** (M0 Sandbox is free).
2.  **Security Setup**:
    *   **Database Access**: Create a user (e.g., `admin`) and **remember the password**.
    *   **Network Access**: Click "Add IP Address" -> "Allow Access from Anywhere" (`0.0.0.0/0`).
        *   *Note: GCP IP addresses change, so allowing all IPs is the easiest method for the free tier. For production, you'd use VPC peering (paid).*
3.  **Get Connection String**:
    *   Click **Connect** -> **Drivers**.
    *   Copy the string (looks like `mongodb+srv://admin:<password>@cluster0...`).

---

## Step 2: Prepare for GCP Deployment

1.  **Initialize**: Ensure you have the `app.yaml` file in your root directory (I have created this for you).
2.  **Login**: Open your terminal and run:
    ```bash
    gcloud auth login
    ```
3.  **Create Project**:
    ```bash
    gcloud projects create my-shopping-list-app --name="Shopping List App"
    gcloud config set project my-shopping-list-app
    ```
    *(Replace `my-shopping-list-app` with a unique ID)*

---

## Step 3: Deploy to App Engine

1.  **Create App Engine Application** (only needed once):
    ```bash
    gcloud app create
    ```
    Select a region close to you (e.g., `us-central`).

2.  **Deploy with Environment Variables**:
    Since we cannot commit secrets to `app.yaml`, we pass them during deployment. Replace the URI below with your actual string:

    ```bash
    gcloud app deploy --set-env-vars MONGO_URI="mongodb+srv://admin:PASSWORD@cluster.mongodb.net/test"
    ```

3.  **View Your App**:
    Once finished, run:
    ```bash
    gcloud app browse
    ```

---

## Troubleshooting

*   **Error: "Permissions missing"**: Make sure a billing account is linked to your project (GCP requires a credit card even for the free tier usage).
*   **Database Connection Failed**:
    *   Check your `MONGO_URI` passed in the deploy command.
    *   Ensure MongoDB Atlas "Network Access" allows `0.0.0.0/0`.
*   **Logs**: To see what's going wrong, run:
    ```bash
    gcloud app logs tail -s default
    ```
