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

**Important Note for Windows Users**:
It seems `gcloud` is not in your system PATH. You can run it by using the full path.
Your `gcloud` installation is located at:
`"C:\Users\chris\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"`

1.  **Initialize**: Ensure you have the `app.yaml` file in your root directory (I have created this for you).
2.  **Login**: Open your terminal and run:
    ```powershell
    & "C:\Users\chris\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth login
    ```
    *(This will open your browser to sign in)*

3.  **Create Project**:
    ```powershell
    & "C:\Users\chris\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" projects create my-shopping-list-app --name="Shopping List App"
    & "C:\Users\chris\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" config set project my-shopping-list-app
    ```
    *(Replace `my-shopping-list-app` with a unique ID)*

---

## Step 3: Deploy to App Engine

1.  **Create App Engine Application** (only needed once):
    ```powershell
    & "C:\Users\chris\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" app create
    ```
    Select a region close to you (e.g., `us-central`).

2.  **Configure Environment Variables**:
    *   Open `app.yaml` in your project.
    *   Find the `MONGO_URI` line.
    *   Replace `"REPLACE_WITH_YOUR_CONNECTION_STRING"` with your actual MongoDB connection string.

3.  **Deploy**:
    Run the following command:
    ```powershell
    & "C:\Users\chris\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" app deploy
    ```

4.  **View Your App**:
    Once finished, run:
    ```powershell
    & "C:\Users\chris\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" app browse
    ```

---

## Troubleshooting

*   **Error: "Failed to create cloud build"**:
    This often means the **Cloud Build API** is not enabled or permissions are missing.
    Run these commands to fix it:
    ```powershell
    & "C:\Users\chris\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" services enable cloudbuild.googleapis.com
    & "C:\Users\chris\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" projects add-iam-policy-binding gen-lang-client-0947396328 --member=serviceAccount:gen-lang-client-0947396328@appspot.gserviceaccount.com --role=roles/storage.admin
    ```
    *(Note: Replace `gen-lang-client-0947396328` with your actual project ID if it changes)*

*   **Error: "Permissions missing"**: Make sure a billing account is linked to your project.
*   **Database Connection Failed**:
    *   Check your `MONGO_URI` passed in the deploy command.
    *   Ensure MongoDB Atlas "Network Access" allows `0.0.0.0/0`.
*   **Logs**: To see what's going wrong, run:
    ```bash
    gcloud app logs tail -s default
    ```
